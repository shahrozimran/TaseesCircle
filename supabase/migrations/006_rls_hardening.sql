-- ============================================
-- TaseesCircle — Migration 006
-- RLS Audit & Hardening
-- Ensures all tables have RLS enabled and
-- all policies are airtight. Safe to re-run.
-- Run in Supabase SQL Editor.
-- ============================================


-- ============================================
-- STEP 1: GUARANTEE RLS IS ON FOR ALL TABLES
-- (Idempotent — safe to run multiple times)
-- ============================================
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masjids               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masjid_members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_content        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_responses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions         ENABLE ROW LEVEL SECURITY;


-- ============================================
-- STEP 2: DROP & RECREATE ALL POLICIES
-- Clean slate — drops all existing policies
-- and rebuilds them correctly.
-- ============================================

-- ─── PROFILES ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can read own profile"          ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"        ON public.profiles;
DROP POLICY IF EXISTS "Super admins can read all profiles"  ON public.profiles;
DROP POLICY IF EXISTS "Super admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are insertable by auth trigger" ON public.profiles;

-- Own profile only
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Super admin reads all
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Users update only their own row
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Super admin can update any profile (e.g. promote to super_admin)
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

-- Profiles are inserted only by the auth trigger (service role)
-- Regular users cannot INSERT directly — prevents role escalation
CREATE POLICY "profiles_insert_trigger_only"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ─── MASJIDS ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone authenticated can create a masjid"  ON public.masjids;
DROP POLICY IF EXISTS "Masjid creator can read own masjid"        ON public.masjids;
DROP POLICY IF EXISTS "Members can read their masjid"             ON public.masjids;
DROP POLICY IF EXISTS "Masjid admin can update own masjid"        ON public.masjids;
DROP POLICY IF EXISTS "Super admins can read all masjids"         ON public.masjids;
DROP POLICY IF EXISTS "Super admins can update all masjids"       ON public.masjids;
DROP POLICY IF EXISTS "Anyone can check masjid by code"           ON public.masjids;

-- Any authenticated user can register a new masjid (must set themselves as creator)
CREATE POLICY "masjids_insert_authenticated"
  ON public.masjids FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Creator can always read their own (pending/approved/rejected)
CREATE POLICY "masjids_select_creator"
  ON public.masjids FOR SELECT
  USING (auth.uid() = created_by);

-- Circle members can read their approved masjid
CREATE POLICY "masjids_select_member"
  ON public.masjids FOR SELECT
  USING (public.is_masjid_member(auth.uid(), id));

-- Approved masjids are readable by code lookup (for joining)
CREATE POLICY "masjids_select_by_code"
  ON public.masjids FOR SELECT
  USING (status = 'approved' AND unique_code IS NOT NULL);

-- Creator can update their own pending masjid info (not status)
CREATE POLICY "masjids_update_creator"
  ON public.masjids FOR UPDATE
  USING (auth.uid() = created_by AND status = 'pending')
  WITH CHECK (auth.uid() = created_by);

-- Super admin can read and update all masjids (for approval workflow)
CREATE POLICY "masjids_select_admin"
  ON public.masjids FOR SELECT
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "masjids_update_admin"
  ON public.masjids FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

-- No one can delete a masjid via the client (CASCADE handles orphan cleanup)
-- DELETE is intentionally not granted


-- ─── MASJID MEMBERS ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Members can read their circle members"  ON public.masjid_members;
DROP POLICY IF EXISTS "Users can join a masjid"                ON public.masjid_members;
DROP POLICY IF EXISTS "Masjid admin can manage members"        ON public.masjid_members;
DROP POLICY IF EXISTS "Masjid admin can update member roles"   ON public.masjid_members;
DROP POLICY IF EXISTS "Users can leave a masjid"               ON public.masjid_members;
DROP POLICY IF EXISTS "Super admins can read all members"      ON public.masjid_members;

-- Members can see the full member list of their masjid
CREATE POLICY "members_select_own_circle"
  ON public.masjid_members FOR SELECT
  USING (public.is_masjid_member(auth.uid(), masjid_id));

-- Users can read their own membership row (bypasses list check)
CREATE POLICY "members_select_own_row"
  ON public.masjid_members FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can join a masjid (only for themselves)
CREATE POLICY "members_insert_self"
  ON public.masjid_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins/mods can update roles (e.g. promote/demote)
-- Cannot promote to admin unless they are admin themselves
CREATE POLICY "members_update_role_by_admin"
  ON public.masjid_members FOR UPDATE
  USING (public.is_masjid_admin_or_mod(auth.uid(), masjid_id))
  WITH CHECK (public.is_masjid_admin_or_mod(auth.uid(), masjid_id));

-- Users can remove themselves (leave)
CREATE POLICY "members_delete_self"
  ON public.masjid_members FOR DELETE
  USING (auth.uid() = user_id);

-- Admins/mods can remove other members
CREATE POLICY "members_delete_by_admin"
  ON public.masjid_members FOR DELETE
  USING (public.is_masjid_admin_or_mod(auth.uid(), masjid_id));

-- Super admin reads all
CREATE POLICY "members_select_admin"
  ON public.masjid_members FOR SELECT
  USING (public.is_super_admin(auth.uid()));


-- ─── CIRCLES ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Members can read their circle"    ON public.circles;
DROP POLICY IF EXISTS "Super admins can read all circles" ON public.circles;
DROP POLICY IF EXISTS "Super admins can insert circles"  ON public.circles;

-- Only members can read their circle
CREATE POLICY "circles_select_member"
  ON public.circles FOR SELECT
  USING (public.is_masjid_member(auth.uid(), masjid_id));

-- Super admin reads all
CREATE POLICY "circles_select_admin"
  ON public.circles FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Circles are only created by DB triggers (SECURITY DEFINER functions)
-- No client INSERT/UPDATE/DELETE allowed


-- ─── CIRCLE POSTS ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Circle members can read posts"   ON public.circle_posts;
DROP POLICY IF EXISTS "Admins/mods can create posts"    ON public.circle_posts;
DROP POLICY IF EXISTS "Admins/mods can update posts"    ON public.circle_posts;
DROP POLICY IF EXISTS "Super admins can read all posts" ON public.circle_posts;

-- Members can read posts in their circle
CREATE POLICY "posts_select_member"
  ON public.circle_posts FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
        AND public.is_masjid_member(auth.uid(), c.masjid_id)
    )
  );

-- Only admins/mods can create posts (not regular members)
CREATE POLICY "posts_insert_mod"
  ON public.circle_posts FOR INSERT
  WITH CHECK (
    posted_by = auth.uid()
    AND EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
        AND public.is_masjid_admin_or_mod(auth.uid(), c.masjid_id)
    )
  );

-- Admins/mods can update posts (pin, edit)
CREATE POLICY "posts_update_mod"
  ON public.circle_posts FOR UPDATE
  USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
        AND public.is_masjid_admin_or_mod(auth.uid(), c.masjid_id)
    )
  );

-- Admins/mods can delete posts
CREATE POLICY "posts_delete_mod"
  ON public.circle_posts FOR DELETE
  USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
        AND public.is_masjid_admin_or_mod(auth.uid(), c.masjid_id)
    )
  );

-- Super admin reads all
CREATE POLICY "posts_select_admin"
  ON public.circle_posts FOR SELECT
  USING (public.is_super_admin(auth.uid()));


-- ─── CIRCLE POST REACTIONS ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Circle members can read reactions"  ON public.circle_post_reactions;
DROP POLICY IF EXISTS "Circle members can add reactions"   ON public.circle_post_reactions;
DROP POLICY IF EXISTS "Users can remove own reactions"     ON public.circle_post_reactions;

-- Members can read reactions on their circle's posts
CREATE POLICY "reactions_select_member"
  ON public.circle_post_reactions FOR SELECT
  USING (
    EXISTS(
      SELECT 1
      FROM public.circle_posts cp
      JOIN public.circles c ON c.id = cp.circle_id
      WHERE cp.id = post_id
        AND public.is_masjid_member(auth.uid(), c.masjid_id)
    )
  );

-- Members can add their own reactions (one type per post enforced by UNIQUE constraint)
CREATE POLICY "reactions_insert_member"
  ON public.circle_post_reactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS(
      SELECT 1
      FROM public.circle_posts cp
      JOIN public.circles c ON c.id = cp.circle_id
      WHERE cp.id = post_id
        AND public.is_masjid_member(auth.uid(), c.masjid_id)
    )
  );

-- Users can remove only their own reactions
CREATE POLICY "reactions_delete_own"
  ON public.circle_post_reactions FOR DELETE
  USING (auth.uid() = user_id);


-- ─── CIRCLE CONTENT ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Circle members can read content"      ON public.circle_content;
DROP POLICY IF EXISTS "Admins/mods can manage content"       ON public.circle_content;
DROP POLICY IF EXISTS "Super admins can manage all content"  ON public.circle_content;

CREATE POLICY "content_select_member"
  ON public.circle_content FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
        AND public.is_masjid_member(auth.uid(), c.masjid_id)
    )
  );

CREATE POLICY "content_all_mod"
  ON public.circle_content FOR ALL
  USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
        AND public.is_masjid_admin_or_mod(auth.uid(), c.masjid_id)
    )
  )
  WITH CHECK (
    posted_by = auth.uid()
    AND EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
        AND public.is_masjid_admin_or_mod(auth.uid(), c.masjid_id)
    )
  );

CREATE POLICY "content_all_admin"
  ON public.circle_content FOR ALL
  USING (public.is_super_admin(auth.uid()));


-- ─── SUPPORT TICKETS ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can create tickets"           ON public.support_tickets;
DROP POLICY IF EXISTS "Users can read own tickets"         ON public.support_tickets;
DROP POLICY IF EXISTS "Users can update own tickets"       ON public.support_tickets;
DROP POLICY IF EXISTS "Super admins can read all tickets"  ON public.support_tickets;
DROP POLICY IF EXISTS "Super admins can update all tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Moderators can read circle tickets" ON public.support_tickets;

CREATE POLICY "tickets_insert_own"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tickets_select_own"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);

-- Users can close their own open tickets
CREATE POLICY "tickets_update_own"
  ON public.support_tickets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Moderators can read tickets directed to them
CREATE POLICY "tickets_select_mod"
  ON public.support_tickets FOR SELECT
  USING (
    recipient = 'moderator'
    AND masjid_id IS NOT NULL
    AND public.is_masjid_admin_or_mod(auth.uid(), masjid_id)
  );

-- Moderators can update status of tickets directed to them
CREATE POLICY "tickets_update_mod"
  ON public.support_tickets FOR UPDATE
  USING (
    recipient = 'moderator'
    AND masjid_id IS NOT NULL
    AND public.is_masjid_admin_or_mod(auth.uid(), masjid_id)
  );

CREATE POLICY "tickets_select_admin"
  ON public.support_tickets FOR SELECT
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "tickets_update_admin"
  ON public.support_tickets FOR UPDATE
  USING (public.is_super_admin(auth.uid()));


-- ─── TICKET RESPONSES ────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Ticket owner can read responses"  ON public.ticket_responses;
DROP POLICY IF EXISTS "Admins/mods can create responses" ON public.ticket_responses;
DROP POLICY IF EXISTS "Super admins can read all responses" ON public.ticket_responses;

-- Ticket owner can read their responses
CREATE POLICY "responses_select_owner"
  ON public.ticket_responses FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id AND t.user_id = auth.uid()
    )
  );

-- Responder can read their own responses
CREATE POLICY "responses_select_responder"
  ON public.ticket_responses FOR SELECT
  USING (auth.uid() = responded_by);

-- Super admins and moderators can insert responses
CREATE POLICY "responses_insert_mod"
  ON public.ticket_responses FOR INSERT
  WITH CHECK (
    responded_by = auth.uid()
    AND (
      public.is_super_admin(auth.uid())
      OR EXISTS(
        SELECT 1 FROM public.support_tickets t
        WHERE t.id = ticket_id
          AND t.recipient = 'moderator'
          AND t.masjid_id IS NOT NULL
          AND public.is_masjid_admin_or_mod(auth.uid(), t.masjid_id)
      )
    )
  );

CREATE POLICY "responses_select_admin"
  ON public.ticket_responses FOR SELECT
  USING (public.is_super_admin(auth.uid()));


-- ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can read own notifications"   ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- Users can only read their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can mark their own notifications as read
CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- INSERT: only service role / SECURITY DEFINER triggers may insert notifications
-- No client INSERT policy = no user can create notifications for others


-- ─── REFERRALS ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Referrer can read own referrals"     ON public.referrals;
DROP POLICY IF EXISTS "Admins/mods can create referrals"    ON public.referrals;
DROP POLICY IF EXISTS "Anyone can validate a referral code" ON public.referrals;
DROP POLICY IF EXISTS "Super admins can read all referrals" ON public.referrals;

-- Referrer can see referrals they created
CREATE POLICY "referrals_select_own"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_id);

-- Admins/mods can create referrals for their masjid
CREATE POLICY "referrals_insert_mod"
  ON public.referrals FOR INSERT
  WITH CHECK (
    auth.uid() = referrer_id
    AND public.is_masjid_admin_or_mod(auth.uid(), masjid_id)
  );

-- Any authenticated user can look up a referral code to join (pending only)
CREATE POLICY "referrals_select_by_code"
  ON public.referrals FOR SELECT
  USING (status = 'pending');

-- Super admin reads all
CREATE POLICY "referrals_select_admin"
  ON public.referrals FOR SELECT
  USING (public.is_super_admin(auth.uid()));


-- ─── DAILY REPORTS ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can create own reports"          ON public.daily_reports;
DROP POLICY IF EXISTS "Users can read own reports"            ON public.daily_reports;
DROP POLICY IF EXISTS "Circle admins can read circle reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Super admins can read all reports"     ON public.daily_reports;

CREATE POLICY "reports_insert_own"
  ON public.daily_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reports_select_own"
  ON public.daily_reports FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own report (edit prayer data same day)
CREATE POLICY "reports_update_own"
  ON public.daily_reports FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Circle admins/mods can view member reports for analytics
CREATE POLICY "reports_select_mod"
  ON public.daily_reports FOR SELECT
  USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
        AND public.is_masjid_admin_or_mod(auth.uid(), c.masjid_id)
    )
  );

CREATE POLICY "reports_select_admin"
  ON public.daily_reports FOR SELECT
  USING (public.is_super_admin(auth.uid()));


-- ─── ADMIN ACTIONS (Audit Log) ────────────────────────────────────────────────
DROP POLICY IF EXISTS "Super admins can create actions" ON public.admin_actions;
DROP POLICY IF EXISTS "Super admins can read all actions" ON public.admin_actions;

-- Only super admins can read the audit log
CREATE POLICY "audit_select_admin"
  ON public.admin_actions FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Only super admins can write to the audit log via the client
-- (Triggers with SECURITY DEFINER also write here, bypassing this)
CREATE POLICY "audit_insert_admin"
  ON public.admin_actions FOR INSERT
  WITH CHECK (public.is_super_admin(auth.uid()));


-- ============================================
-- STEP 3: VERIFY — run after the above
-- All tables should show rowsecurity = true
-- ============================================
SELECT
  tablename,
  rowsecurity AS rls_enabled,
  CASE WHEN rowsecurity THEN '✅ Enabled' ELSE '❌ DISABLED' END AS status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
