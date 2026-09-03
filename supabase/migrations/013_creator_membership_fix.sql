-- ============================================
-- TaseesCircle — Migration 013
-- Creator & Moderator Membership Fix
-- Ensures circle creators/moderators are full members
-- of their circles, enables peer profile reads for circle
-- members, and removes artificial super_admin member inserts.
-- ============================================

-- 1. RLS Policy: Allow members of the same circle to read each other's profiles
DROP POLICY IF EXISTS "Circle members can read peer profiles" ON public.profiles;

CREATE POLICY "Circle members can read peer profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.masjid_members mm1
      JOIN public.masjid_members mm2 ON mm1.masjid_id = mm2.masjid_id
      WHERE mm1.user_id = auth.uid() AND mm2.user_id = public.profiles.id
    )
  );


-- 2. Update handle_masjid_approved() trigger function
-- Keeps creator in masjid_members as role='admin', join_method='creator'
-- Removes artificial insertion of admin_access@taseescircle.com
CREATE OR REPLACE FUNCTION public.handle_masjid_approved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN

    -- Create circle if not existing
    INSERT INTO public.circles (masjid_id, name, description)
    VALUES (NEW.id, NEW.name, NEW.description)
    ON CONFLICT (masjid_id) DO NOTHING;

    -- Ensure creator is in masjid_members as admin
    INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
    VALUES (NEW.id, NEW.created_by, 'admin', 'creator')
    ON CONFLICT (user_id) DO UPDATE
      SET role = 'admin', join_method = 'creator';

    -- Update current_masjid_id on creator's profile
    UPDATE public.profiles
    SET current_masjid_id = NEW.id, updated_at = now()
    WHERE id = NEW.created_by;

    -- Sync accurate member count
    UPDATE public.masjids
    SET member_count = (
      SELECT COUNT(*) FROM public.masjid_members mm WHERE mm.masjid_id = NEW.id
    )
    WHERE id = NEW.id;

  END IF;
  RETURN NEW;
END;
$$;


-- 3. Data Cleanup & Synchronization
-- Remove artificial admin_access@taseescircle.com entries where not the creator
DELETE FROM public.masjid_members
WHERE user_id IN (
  SELECT id FROM public.profiles WHERE email = 'admin_access@taseescircle.com'
)
AND join_method = 'admin_invite';

-- Ensure creators of all approved masjids are in masjid_members
INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
SELECT id, created_by, 'admin', 'creator'
FROM public.masjids
WHERE status = 'approved'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Recalculate member_count for all masjids
UPDATE public.masjids m
SET member_count = (
  SELECT COUNT(*) FROM public.masjid_members mm WHERE mm.masjid_id = m.id
);
