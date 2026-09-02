-- ============================================
-- TaseesCircle — Direct Fix
-- Run this in Supabase SQL Editor to manually
-- add the masjid creator as moderator member
-- and update their profile.
-- ============================================

-- Step 1: Check current state (for debugging)
SELECT
  m.id         AS masjid_id,
  m.name       AS masjid_name,
  m.created_by AS creator_user_id,
  m.status,
  p.full_name,
  p.current_masjid_id,
  mm.id        AS member_row_id,
  mm.role
FROM public.masjids m
JOIN public.profiles p ON p.id = m.created_by
LEFT JOIN public.masjid_members mm
  ON mm.masjid_id = m.id AND mm.user_id = m.created_by
WHERE m.status = 'approved';

-- ─────────────────────────────────────────────────────────────
-- Step 2: Insert creator as moderator (bypasses RLS — run as
--         Supabase SQL Editor which uses service role)
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
SELECT
  m.id,
  m.created_by,
  'moderator',
  'creator'
FROM public.masjids m
WHERE m.status = 'approved'
  AND NOT EXISTS (
    SELECT 1 FROM public.masjid_members mm
    WHERE mm.masjid_id = m.id AND mm.user_id = m.created_by
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- Step 3: Manually update profile.current_masjid_id
--         (in case the trigger didn't fire)
-- ─────────────────────────────────────────────────────────────
UPDATE public.profiles p
SET
  current_masjid_id = mm.masjid_id,
  updated_at = now()
FROM public.masjid_members mm
WHERE mm.user_id = p.id
  AND p.current_masjid_id IS NULL;

-- Step 4: Also fix member_count on masjids
UPDATE public.masjids m
SET member_count = (
  SELECT COUNT(*) FROM public.masjid_members mm WHERE mm.masjid_id = m.id
)
WHERE m.status = 'approved';

-- Verify: should now show your row with role = moderator
SELECT
  m.name,
  p.full_name,
  p.current_masjid_id,
  mm.role,
  mm.join_method,
  mm.joined_at
FROM public.masjid_members mm
JOIN public.profiles p ON p.id = mm.user_id
JOIN public.masjids m ON m.id = mm.masjid_id;
