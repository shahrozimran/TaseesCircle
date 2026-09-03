-- ============================================
-- TaseesCircle — Migration 012
-- Security Remediation (Audit 3 Sep 2026)
-- Fixes: C-02, C-03, C-04, H-03, H-04,
--        H-05, H-06, M-01, M-04, M-06
-- Run in Supabase SQL Editor.
-- ============================================


-- ============================================
-- STEP 1: Helper — is_masjid_admin() (H-03)
-- Returns true only for role = 'admin',
-- NOT moderator. Used to split role policies.
-- ============================================
CREATE OR REPLACE FUNCTION public.is_masjid_admin(p_user_id UUID, p_masjid_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.masjid_members
    WHERE user_id = p_user_id
      AND masjid_id = p_masjid_id
      AND role = 'admin'
  );
$$;


-- ============================================
-- STEP 2: Harden existing helper functions
-- Add SET search_path = '' to all SECURITY
-- DEFINER functions. (M-06)
-- ============================================

CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_masjid_member(user_id UUID, target_masjid_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.masjid_members
    WHERE masjid_members.user_id = is_masjid_member.user_id
      AND masjid_id = target_masjid_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_masjid_admin_or_mod(user_id UUID, target_masjid_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.masjid_members
    WHERE masjid_members.user_id = is_masjid_admin_or_mod.user_id
      AND masjid_id = target_masjid_id
      AND role IN ('admin', 'moderator')
  );
$$;

-- Fix handle_new_user trigger function (M-06)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name  = COALESCE(EXCLUDED.full_name,  public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    email      = COALESCE(EXCLUDED.email,      public.profiles.email),
    updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix handle_member_joined (M-06)
CREATE OR REPLACE FUNCTION public.handle_member_joined()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.masjids
    SET member_count = member_count + 1
    WHERE id = NEW.masjid_id;
  UPDATE public.profiles
    SET current_masjid_id = NEW.masjid_id, updated_at = now()
    WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Fix handle_member_left (M-06)
CREATE OR REPLACE FUNCTION public.handle_member_left()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.masjids
    SET member_count = GREATEST(member_count - 1, 0)
    WHERE id = OLD.masjid_id;
  UPDATE public.profiles
    SET current_masjid_id = NULL, updated_at = now()
    WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$;

-- Fix handle_masjid_approved (008 — M-06)
CREATE OR REPLACE FUNCTION public.handle_masjid_approved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_admin_id UUID;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN

    INSERT INTO public.circles (masjid_id, name, description)
    VALUES (NEW.id, NEW.name, NEW.description)
    ON CONFLICT (masjid_id) DO NOTHING;

    INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
    VALUES (NEW.id, NEW.created_by, 'admin', 'creator')
    ON CONFLICT (user_id) DO UPDATE
      SET role = 'admin', join_method = 'creator';

    SELECT id INTO v_admin_id
    FROM public.profiles
    WHERE email = 'admin_access@taseescircle.com'
    LIMIT 1;

    IF v_admin_id IS NOT NULL THEN
      INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
      VALUES (NEW.id, v_admin_id, 'admin', 'admin_invite')
      ON CONFLICT (user_id) DO UPDATE
        SET role = 'admin';
    END IF;

    UPDATE public.profiles
    SET current_masjid_id = NEW.id, updated_at = now()
    WHERE id = NEW.created_by;

    UPDATE public.masjids
    SET member_count = (
      SELECT COUNT(*) FROM public.masjid_members mm WHERE mm.masjid_id = NEW.id
    )
    WHERE id = NEW.id;

  END IF;
  RETURN NEW;
END;
$$;


-- ============================================
-- STEP 3: Fix approve_masjid_and_add_creator
-- Add super-admin guard + fixed search_path.
-- (C-03, M-06)
-- ============================================

-- First revoke from authenticated users
REVOKE EXECUTE ON FUNCTION public.approve_masjid_and_add_creator(UUID, UUID, TEXT)
  FROM authenticated;

CREATE OR REPLACE FUNCTION public.approve_masjid_and_add_creator(
  p_masjid_id   UUID,
  p_admin_id    UUID,
  p_unique_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_masjid  RECORD;
  v_circle_id UUID;
BEGIN
  -- 1. Caller must be super_admin
  IF NOT public.is_super_admin(auth.uid()) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- 2. Validate masjid
  SELECT * INTO v_masjid
  FROM public.masjids
  WHERE id = p_masjid_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Masjid not found or already processed');
  END IF;

  -- 3. Approve (fires on_masjid_approved trigger)
  UPDATE public.masjids
  SET status = 'approved', unique_code = p_unique_code, approved_at = now()
  WHERE id = p_masjid_id;

  -- 4. Get circle
  SELECT id INTO v_circle_id
  FROM public.circles
  WHERE masjid_id = p_masjid_id;

  -- 5. Approval notification
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (
    v_masjid.created_by,
    'Masjid Approved! 🎉',
    format(
      'Your Masjid "%s" has been approved! Your circle code is: %s.',
      v_masjid.name,
      p_unique_code
    ),
    'approval',
    '/dashboard/my-circle'
  );

  -- 6. Audit log
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

-- Grant only to super_admin role (service role bypasses RLS and can call directly)
-- Regular authenticated users are no longer granted EXECUTE
GRANT EXECUTE ON FUNCTION public.approve_masjid_and_add_creator(UUID, UUID, TEXT)
  TO service_role;


-- ============================================
-- STEP 4: Fix profile role escalation (C-02)
-- Block client writes to the `role` column.
-- ============================================

DROP POLICY IF EXISTS "profiles_update_own"       ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Users may update their own profile row but
-- the resulting role must equal the current role
-- (i.e. users cannot change their own role).
CREATE POLICY "profiles_update_own_safe"
  ON public.profiles FOR UPDATE
  USING  (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );


-- ============================================
-- STEP 5: Restrict Masjid creator updates (C-03)
-- Creator can only update info columns while
-- pending, NOT status / unique_code / approved_at.
-- ============================================

DROP POLICY IF EXISTS "masjids_update_creator"      ON public.masjids;
DROP POLICY IF EXISTS "Masjid admin can update own masjid" ON public.masjids;

CREATE POLICY "masjids_update_creator_safe"
  ON public.masjids FOR UPDATE
  USING  (auth.uid() = created_by AND status = 'pending')
  WITH CHECK (
    auth.uid() = created_by
    AND status = 'pending'
  );


-- ============================================
-- STEP 6: Remove open membership INSERT (C-04)
-- All joins must go through the RPCs below.
-- ============================================

DROP POLICY IF EXISTS "members_insert_self"     ON public.masjid_members;
DROP POLICY IF EXISTS "Users can join a masjid" ON public.masjid_members;
-- No INSERT policy created — client cannot insert directly.


-- ============================================
-- STEP 7: Split role-update policies (H-03)
-- Admins can set any role.
-- Moderators can only set 'member'.
-- ============================================

DROP POLICY IF EXISTS "members_update_role_by_admin" ON public.masjid_members;
DROP POLICY IF EXISTS "Masjid admin can update member roles" ON public.masjid_members;

-- Admins can promote/demote to any role
CREATE POLICY "members_update_by_admin_only"
  ON public.masjid_members FOR UPDATE
  USING  (public.is_masjid_admin(auth.uid(), masjid_id))
  WITH CHECK (public.is_masjid_admin(auth.uid(), masjid_id));

-- Moderators can only demote to 'member' (cannot create admins or mods)
CREATE POLICY "members_update_by_mod_demote_only"
  ON public.masjid_members FOR UPDATE
  USING  (
    public.is_masjid_admin_or_mod(auth.uid(), masjid_id)
    AND auth.uid() != user_id
  )
  WITH CHECK (
    role = 'member'
    AND public.is_masjid_admin_or_mod(auth.uid(), masjid_id)
  );


-- ============================================
-- STEP 8: Restore single-circle constraint (H-04)
-- ============================================

ALTER TABLE public.masjid_members
  DROP CONSTRAINT IF EXISTS unique_user_masjid_pair;

ALTER TABLE public.masjid_members
  ADD CONSTRAINT unique_user_one_circle UNIQUE (user_id);


-- ============================================
-- STEP 9: Transactional join-by-code RPC (C-04)
-- Hard-codes role = 'member'. (C-04)
-- ============================================

CREATE OR REPLACE FUNCTION public.join_masjid_by_code(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_masjid RECORD;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Check caller is not already in a circle
  IF EXISTS (
    SELECT 1 FROM public.masjid_members WHERE user_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are already part of a circle');
  END IF;

  -- Look up the approved masjid by code
  SELECT * INTO v_masjid
  FROM public.masjids
  WHERE unique_code = UPPER(TRIM(p_code))
    AND status = 'approved';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired code');
  END IF;

  -- Insert with role = 'member' (hard-coded, never caller-supplied)
  INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method)
  VALUES (v_masjid.id, auth.uid(), 'member', 'code');

  RETURN jsonb_build_object('success', true, 'masjid_id', v_masjid.id);
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are already a member of this circle');
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_masjid_by_code(TEXT) TO authenticated;


-- ============================================
-- STEP 10: Transactional join-by-referral RPC
-- Atomically consumes referral + inserts member.
-- (H-05, H-06)
-- ============================================

CREATE OR REPLACE FUNCTION public.join_masjid_by_referral(p_referral_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_referral RECORD;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Check caller is not already in a circle
  IF EXISTS (
    SELECT 1 FROM public.masjid_members WHERE user_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are already part of a circle');
  END IF;

  -- Lock and validate the referral row atomically
  SELECT * INTO v_referral
  FROM public.referrals
  WHERE referral_code = TRIM(p_referral_code)
    AND status = 'pending'
    AND (expires_at IS NULL OR expires_at > now())
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Referral invalid, already used, or expired');
  END IF;

  -- Mark referral consumed
  UPDATE public.referrals
  SET status = 'accepted', referred_user_id = auth.uid()
  WHERE id = v_referral.id;

  -- Insert membership with role = 'member'
  INSERT INTO public.masjid_members (masjid_id, user_id, role, join_method, referred_by)
  VALUES (v_referral.masjid_id, auth.uid(), 'member', 'referral', v_referral.referrer_id);

  RETURN jsonb_build_object('success', true, 'masjid_id', v_referral.masjid_id);
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are already a member of this circle');
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_masjid_by_referral(TEXT) TO authenticated;


-- ============================================
-- STEP 11: Restrict broad UPDATE policies (M-04)
-- Ticket owners can only close their ticket.
-- Notification recipients can only mark as read.
-- ============================================

-- Support tickets — restrict to status close only
DROP POLICY IF EXISTS "tickets_update_own"         ON public.support_tickets;
DROP POLICY IF EXISTS "Users can update own tickets" ON public.support_tickets;

CREATE POLICY "tickets_close_own"
  ON public.support_tickets FOR UPDATE
  USING  (auth.uid() = user_id AND status = 'open')
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'closed'
  );

-- Notifications — restrict to is_read = true only
DROP POLICY IF EXISTS "notifications_update_own"         ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "notifications_mark_read_only"
  ON public.notifications FOR UPDATE
  USING  (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND is_read = true
  );


-- ============================================
-- STEP 12: Contact/newsletter persistence tables
-- (H-02) — persisted before 200 is returned.
-- ============================================

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  country    TEXT,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
-- No client SELECT/INSERT/UPDATE/DELETE policies.
-- Service role only (server-side route writes via service_role key).

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
-- No client policies.


-- ============================================
-- STEP 13: Prevent duplicate pending Masjid
-- registrations per creator. (M-01)
-- ============================================

CREATE UNIQUE INDEX IF NOT EXISTS one_active_masjid_per_creator
  ON public.masjids (created_by)
  WHERE status IN ('pending', 'approved');


-- ============================================
-- VERIFY — run after applying
-- ============================================
SELECT
  tablename,
  rowsecurity AS rls_enabled,
  CASE WHEN rowsecurity THEN '✅ Enabled' ELSE '❌ DISABLED' END AS status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
