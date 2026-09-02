-- ============================================
-- TaseesCircle — Migration 002
-- Fix: Masjid Approval RLS bypass via SECURITY DEFINER RPC
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- ATOMIC APPROVAL FUNCTION
-- Runs as SECURITY DEFINER so it bypasses RLS
-- and can insert masjid_members on behalf of
-- the creator (whose uid != admin uid).
-- Only callable by authenticated users; the app
-- layer ensures only super_admins reach this.
-- ============================================
CREATE OR REPLACE FUNCTION public.approve_masjid_and_add_creator(
  p_masjid_id    UUID,
  p_admin_id     UUID,
  p_unique_code  TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_masjid        RECORD;
  v_circle_id     UUID;
  v_member_exists BOOLEAN;
BEGIN
  -- 1. Fetch masjid (validates it exists + is pending)
  SELECT * INTO v_masjid
  FROM public.masjids
  WHERE id = p_masjid_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Masjid not found or already processed');
  END IF;

  -- 2. Update masjid status
  UPDATE public.masjids
  SET
    status      = 'approved',
    unique_code = p_unique_code,
    approved_at = now()
  WHERE id = p_masjid_id;

  -- 3. Create circle (idempotent: skip if already exists)
  INSERT INTO public.circles (masjid_id, name, description)
  VALUES (p_masjid_id, v_masjid.name, v_masjid.description)
  ON CONFLICT (masjid_id) DO NOTHING
  RETURNING id INTO v_circle_id;

  -- Fetch circle id if it already existed
  IF v_circle_id IS NULL THEN
    SELECT id INTO v_circle_id FROM public.circles WHERE masjid_id = p_masjid_id;
  END IF;

  -- 4. Add creator as admin member (idempotent)
  SELECT EXISTS(
    SELECT 1 FROM public.masjid_members
    WHERE user_id = v_masjid.created_by
  ) INTO v_member_exists;

  IF NOT v_member_exists THEN
    INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
    VALUES (p_masjid_id, v_masjid.created_by, 'moderator', 'creator');
    -- Note: the on_member_joined trigger fires here and sets profiles.current_masjid_id
  END IF;

  -- 5. Send approval notification to creator
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (
    v_masjid.created_by,
    'Masjid Approved! 🎉',
    format(
      'Your Masjid "%s" has been approved! Your circle code is: %s. Share this with your community to start inviting members.',
      v_masjid.name,
      p_unique_code
    ),
    'approval',
    '/dashboard/my-circle'
  );

  -- 6. Log admin action
  INSERT INTO public.admin_actions (admin_id, masjid_id, action_type, notes)
  VALUES (
    p_admin_id,
    p_masjid_id,
    'approve_masjid',
    format('Approved masjid "%s" with code %s', v_masjid.name, p_unique_code)
  );

  RETURN jsonb_build_object(
    'success',    true,
    'circle_id',  v_circle_id,
    'masjid_id',  p_masjid_id,
    'code',       p_unique_code
  );
END;
$$;

-- Grant execute to authenticated users
-- (app layer guards this to super_admin only)
GRANT EXECUTE ON FUNCTION public.approve_masjid_and_add_creator(UUID, UUID, TEXT) TO authenticated;


-- ============================================
-- MANUAL HEAL QUERY
-- Run this ONCE to fix any already-approved
-- masjids where the creator was never added
-- as a member (due to the old RLS bug).
-- ============================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT m.id AS masjid_id, m.created_by, c.id AS circle_id
    FROM public.masjids m
    LEFT JOIN public.circles c ON c.masjid_id = m.id
    WHERE m.status = 'approved'
      AND NOT EXISTS (
        SELECT 1 FROM public.masjid_members mm
        WHERE mm.masjid_id = m.id AND mm.user_id = m.created_by
      )
  LOOP
    -- Add creator as moderator member
    INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
    VALUES (r.masjid_id, r.created_by, 'moderator', 'creator')
    ON CONFLICT DO NOTHING;
    -- The trigger will update profiles.current_masjid_id

    -- Ensure circle exists
    IF r.circle_id IS NULL THEN
      INSERT INTO public.circles (masjid_id, name)
      SELECT id, name FROM public.masjids WHERE id = r.masjid_id
      ON CONFLICT (masjid_id) DO NOTHING;
    END IF;

    RAISE NOTICE 'Healed masjid: %', r.masjid_id;
  END LOOP;
END;
$$;
