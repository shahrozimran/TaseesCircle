-- ============================================
-- TaseesCircle — Migration 007
-- Super Admin Full Circle Access & Management
-- Grants super admins INSERT, UPDATE, DELETE permissions
-- on circle posts and member role management.
-- ============================================

-- ─── CIRCLE POSTS ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "posts_insert_admin" ON public.circle_posts;
CREATE POLICY "posts_insert_admin"
  ON public.circle_posts FOR INSERT
  WITH CHECK (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "posts_update_admin" ON public.circle_posts;
CREATE POLICY "posts_update_admin"
  ON public.circle_posts FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "posts_delete_admin" ON public.circle_posts;
CREATE POLICY "posts_delete_admin"
  ON public.circle_posts FOR DELETE
  USING (public.is_super_admin(auth.uid()));


-- ─── MASJID MEMBERS ──────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "members_update_admin" ON public.masjid_members;
CREATE POLICY "members_update_admin"
  ON public.masjid_members FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "members_delete_admin" ON public.masjid_members;
CREATE POLICY "members_delete_admin"
  ON public.masjid_members FOR DELETE
  USING (public.is_super_admin(auth.uid()));


-- ─── DAILY REPORTS ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "reports_select_admin" ON public.daily_reports;
CREATE POLICY "reports_select_admin"
  ON public.daily_reports FOR SELECT
  USING (public.is_super_admin(auth.uid()));
