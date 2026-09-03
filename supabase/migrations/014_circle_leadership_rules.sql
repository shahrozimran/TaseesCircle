-- ============================================
-- TaseesCircle — Migration 014
-- Circle Leadership Structure & Protection Rules
-- Enforces:
--  1. Max 1 Circle Admin per circle (auto-transfers admin title).
--  2. Multiple Moderators allowed.
--  3. At least 1 Leader (Admin or Moderator) mandatory per circle.
--  4. Blocks demotion or deletion of the last remaining leader.
-- ============================================

-- 1. RPC: Transactional & Guarded Role Update Function
CREATE OR REPLACE FUNCTION public.update_circle_member_role(
  p_member_id UUID,
  p_new_role  TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_caller_id   UUID;
  v_masjid_id   UUID;
  v_old_role    TEXT;
  v_leader_cnt  INT;
  v_is_super    BOOLEAN;
  v_is_admin    BOOLEAN;
  v_is_mod      BOOLEAN;
BEGIN
  v_caller_id := auth.uid();
  IF v_caller_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Validate role input
  IF p_new_role NOT IN ('admin', 'moderator', 'member') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid role parameter');
  END IF;

  -- Locate target member row
  SELECT masjid_id, role INTO v_masjid_id, v_old_role
  FROM public.masjid_members
  WHERE id = p_member_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Circle member not found');
  END IF;

  -- Check caller authorization
  v_is_super := public.is_super_admin(v_caller_id);
  v_is_admin := public.is_masjid_admin(v_caller_id, v_masjid_id);
  v_is_mod   := public.is_masjid_admin_or_mod(v_caller_id, v_masjid_id);

  IF NOT (v_is_super OR v_is_admin OR (v_is_mod AND p_new_role = 'member')) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized to change role');
  END IF;

  -- ── RULE A: SINGLE CIRCLE ADMIN ENFORCEMENT ───────────────────────────────
  IF p_new_role = 'admin' THEN
    -- Demote existing Circle Admin(s) in this circle to Moderator
    UPDATE public.masjid_members
    SET role = 'moderator'
    WHERE masjid_id = v_masjid_id
      AND role = 'admin'
      AND id != p_member_id;

    -- Assign target member as Admin
    UPDATE public.masjid_members
    SET role = 'admin'
    WHERE id = p_member_id;

    RETURN jsonb_build_object('success', true, 'role', 'admin', 'transferred', true);
  END IF;

  -- ── RULE B: AT LEAST 1 LEADER GUARANTEE (NO ORPHANED CIRCLES) ──────────────
  IF p_new_role = 'member' AND v_old_role IN ('admin', 'moderator') THEN
    SELECT COUNT(*) INTO v_leader_cnt
    FROM public.masjid_members
    WHERE masjid_id = v_masjid_id
      AND role IN ('admin', 'moderator')
      AND id != p_member_id;

    IF v_leader_cnt = 0 THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'Cannot demote the last remaining leadership member. Assign another Admin or Moderator first.'
      );
    END IF;
  END IF;

  -- Apply role update for moderator or member
  UPDATE public.masjid_members
  SET role = p_new_role
  WHERE id = p_member_id;

  RETURN jsonb_build_object('success', true, 'role', p_new_role);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_circle_member_role(UUID, TEXT) TO authenticated;


-- 2. TRIGGER FUNCTION: Guard Last Leader Against Deletion
CREATE OR REPLACE FUNCTION public.guard_last_circle_leader()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_leader_cnt INT;
BEGIN
  -- If deleted row was a leader, verify remaining leadership count
  IF OLD.role IN ('admin', 'moderator') THEN
    SELECT COUNT(*) INTO v_leader_cnt
    FROM public.masjid_members
    WHERE masjid_id = OLD.masjid_id
      AND role IN ('admin', 'moderator')
      AND id != OLD.id;

    IF v_leader_cnt = 0 THEN
      RAISE EXCEPTION 'Cannot remove the last remaining leadership member of this circle.';
    END IF;
  END IF;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_last_circle_leader ON public.masjid_members;

CREATE TRIGGER trg_guard_last_circle_leader
  BEFORE DELETE ON public.masjid_members
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_last_circle_leader();
