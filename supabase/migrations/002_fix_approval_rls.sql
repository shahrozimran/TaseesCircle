-- ============================================
-- TaseesCircle — Migration 002 (Updated)
-- Masjid Approval RPC — simplified now that
-- the on_masjid_approved trigger (migration 005)
-- handles circle creation + member insertion.
-- Run this in your Supabase SQL Editor
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
  v_masjid    RECORD;
  v_circle_id UUID;
BEGIN
  -- 1. Validate: masjid must exist and be pending
  SELECT * INTO v_masjid
  FROM public.masjids
  WHERE id = p_masjid_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error',   'Masjid not found or already processed'
    );
  END IF;

  -- 2. Update masjid status + code + timestamp
  --    This fires the on_masjid_approved AFTER UPDATE trigger which:
  --      • Creates the circle
  --      • Upserts creator as moderator in masjid_members
  --      • Sets profiles.current_masjid_id
  --      • Recalculates member_count
  UPDATE public.masjids
  SET
    status      = 'approved',
    unique_code = p_unique_code,
    approved_at = now()
  WHERE id = p_masjid_id;

  -- 3. Get the circle id (created by trigger above)
  SELECT id INTO v_circle_id
  FROM public.circles
  WHERE masjid_id = p_masjid_id;

  -- 4. Send approval notification to creator
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

  -- 5. Log admin action
  INSERT INTO public.admin_actions (admin_id, masjid_id, action_type, notes)
  VALUES (
    p_admin_id,
    p_masjid_id,
    'approve_masjid',
    format('Approved masjid "%s" with code %s', v_masjid.name, p_unique_code)
  );

  RETURN jsonb_build_object(
    'success',   true,
    'circle_id', v_circle_id,
    'masjid_id', p_masjid_id,
    'code',      p_unique_code
  );
END;
$$;

-- Grant execute to authenticated users
-- (app layer guards this to super_admin only)
GRANT EXECUTE ON FUNCTION public.approve_masjid_and_add_creator(UUID, UUID, TEXT) TO authenticated;
