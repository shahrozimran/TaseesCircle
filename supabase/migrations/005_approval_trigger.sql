-- ============================================
-- TaseesCircle — Migration 005
-- Part A: Diagnostic
-- Part B: DB-level trigger on masjid approval
-- Part C: Heal existing approved masjids
-- Run the ENTIRE file in Supabase SQL Editor
-- ============================================


-- ============================================
-- PART A: DIAGNOSTIC
-- Run this to see exact state before the fix.
-- ============================================
SELECT
  p.full_name,
  p.current_masjid_id,
  m.name        AS masjid_name,
  m.status,
  mm.id         AS member_row_id,
  mm.role,
  mm.masjid_id  AS member_masjid_id,
  CASE
    WHEN mm.id IS NULL                        THEN '❌ NO MEMBER ROW — bug confirmed'
    WHEN mm.masjid_id != p.current_masjid_id  THEN '⚠️  WRONG MASJID on member row'
    ELSE '✅ OK'
  END AS diagnosis
FROM public.profiles p
LEFT JOIN public.masjid_members mm ON mm.user_id = p.id
LEFT JOIN public.masjids m ON m.id = COALESCE(p.current_masjid_id, mm.masjid_id)
WHERE p.current_masjid_id IS NOT NULL
   OR mm.id IS NOT NULL;


-- ============================================
-- PART B: DATABASE TRIGGER
-- Fires whenever masjids.status → 'approved'.
-- Runs as SECURITY DEFINER so it bypasses RLS.
-- Handles: circle creation, member insertion,
-- profile update — all atomically.
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_masjid_approved()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fire when status transitions to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN

    -- 1. Create the circle if it doesn't exist
    INSERT INTO public.circles (masjid_id, name, description)
    VALUES (NEW.id, NEW.name, NEW.description)
    ON CONFLICT (masjid_id) DO NOTHING;

    -- 2. Remove any stale member row the creator may have
    --    for a DIFFERENT masjid (conflict on UNIQUE user_id)
    DELETE FROM public.masjid_members
    WHERE user_id = NEW.created_by
      AND masjid_id IS DISTINCT FROM NEW.id;

    -- 3. Upsert creator as moderator
    --    ON CONFLICT UPDATE ensures a stale/wrong row is corrected.
    INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
    VALUES (NEW.id, NEW.created_by, 'moderator', 'creator')
    ON CONFLICT (user_id) DO UPDATE
      SET masjid_id   = EXCLUDED.masjid_id,
          role        = 'moderator',
          join_method = 'creator';

    -- 4. Guarantee profile.current_masjid_id is set
    --    (in case the on_member_joined trigger already ran this is a no-op)
    UPDATE public.profiles
    SET current_masjid_id = NEW.id,
        updated_at        = now()
    WHERE id = NEW.created_by;

    -- 5. Recalculate member_count
    UPDATE public.masjids
    SET member_count = (
      SELECT COUNT(*) FROM public.masjid_members mm WHERE mm.masjid_id = NEW.id
    )
    WHERE id = NEW.id;

  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to masjids table (fires on every status update)
DROP TRIGGER IF EXISTS on_masjid_approved ON public.masjids;
CREATE TRIGGER on_masjid_approved
  AFTER UPDATE ON public.masjids
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_masjid_approved();


-- ============================================
-- PART C: HEAL EXISTING DATA
-- Re-triggers the new trigger for every already-
-- approved masjid by doing a no-op UPDATE.
-- This fixes ALL existing creators in one shot.
-- ============================================

-- Temporarily set status to 'pending' then back to 'approved'
-- so OLD.status != NEW.status and the trigger fires.
UPDATE public.masjids
SET status = 'pending'
WHERE status = 'approved';

UPDATE public.masjids
SET status = 'approved'
WHERE status = 'pending'
  AND approved_at IS NOT NULL;   -- only re-approve ones that were actually approved


-- ============================================
-- VERIFICATION — run after the above
-- Should show ✅ OK for every creator
-- ============================================
SELECT
  p.full_name,
  m.name          AS masjid_name,
  p.current_masjid_id,
  mm.role,
  mm.masjid_id    AS member_masjid_id,
  m.member_count,
  CASE
    WHEN mm.id IS NULL                        THEN '❌ STILL MISSING'
    WHEN mm.masjid_id != p.current_masjid_id  THEN '⚠️  MISMATCH'
    ELSE '✅ OK'
  END AS status
FROM public.profiles p
LEFT JOIN public.masjid_members mm ON mm.user_id = p.id
LEFT JOIN public.masjids m ON m.id = COALESCE(p.current_masjid_id, mm.masjid_id)
WHERE p.current_masjid_id IS NOT NULL
   OR mm.id IS NOT NULL
ORDER BY p.full_name;
