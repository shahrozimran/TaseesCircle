-- ============================================
-- TaseesCircle — Migration 008
-- TaseesCircle Default Admin for All Circles
-- 1. Updates masjid_members UNIQUE constraint from (user_id) to (user_id, masjid_id)
-- 2. Sets TaseesCircle Super Admin as default admin in every approved circle
-- 3. Sets masjid creator role to 'admin' (fixing Admins: 0 issue)
-- ============================================

-- 1. Update UNIQUE constraint on masjid_members
ALTER TABLE public.masjid_members DROP CONSTRAINT IF EXISTS unique_user_one_circle;
ALTER TABLE public.masjid_members ADD CONSTRAINT unique_user_masjid_pair UNIQUE (user_id, masjid_id);


-- 2. Update trigger function to insert TaseesCircle Admin & Creator as Admin
CREATE OR REPLACE FUNCTION public.handle_masjid_approved()
RETURNS TRIGGER AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  -- Only fire when status transitions to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN

    -- 1. Create the circle if it doesn't exist
    INSERT INTO public.circles (masjid_id, name, description)
    VALUES (NEW.id, NEW.name, NEW.description)
    ON CONFLICT (masjid_id) DO NOTHING;

    -- 2. Upsert creator as 'admin'
    INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
    VALUES (NEW.id, NEW.created_by, 'admin', 'creator')
    ON CONFLICT (user_id, masjid_id) DO UPDATE
      SET role = 'admin', join_method = 'creator';

    -- 3. Find TaseesCircle Super Admin profile ID
    SELECT id INTO v_admin_id
    FROM public.profiles
    WHERE email = 'admin_access@taseescircle.com'
    LIMIT 1;

    -- If TaseesCircle super admin exists, add as default admin to this circle
    IF v_admin_id IS NOT NULL THEN
      INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
      VALUES (NEW.id, v_admin_id, 'admin', 'admin_invite')
      ON CONFLICT (user_id, masjid_id) DO UPDATE
        SET role = 'admin';
    END IF;

    -- 4. Guarantee creator profile.current_masjid_id is set
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


-- 3. Heal all existing approved circles
-- Upgrade existing creators to 'admin' role
UPDATE public.masjid_members
SET role = 'admin'
WHERE join_method = 'creator' AND role = 'moderator';

-- Add TaseesCircle Super Admin to all existing approved circles
DO $$
DECLARE
  v_admin_id UUID;
  v_masjid RECORD;
BEGIN
  SELECT id INTO v_admin_id
  FROM public.profiles
  WHERE email = 'admin_access@taseescircle.com'
  LIMIT 1;

  IF v_admin_id IS NOT NULL THEN
    FOR v_masjid IN SELECT id FROM public.masjids WHERE status = 'approved' LOOP
      INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
      VALUES (v_masjid.id, v_admin_id, 'admin', 'admin_invite')
      ON CONFLICT (user_id, masjid_id) DO UPDATE
        SET role = 'admin';
    END LOOP;
  END IF;
END $$;
