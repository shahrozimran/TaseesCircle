-- ============================================
-- TaseesCircle — Migration 011
-- Fix: Add missing super admin RLS policies
-- for masjid_members UPDATE and DELETE.
-- Without these, role changes by super admin
-- silently fail even though SELECT works.
-- Safe to re-run.
-- Run in Supabase SQL Editor.
-- ============================================

-- Fix: super admin can UPDATE member roles in any circle
DROP POLICY IF EXISTS "members_update_admin" ON public.masjid_members;

CREATE POLICY "members_update_admin"
  ON public.masjid_members FOR UPDATE
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Fix: super admin can DELETE (remove) members from any circle
DROP POLICY IF EXISTS "members_delete_admin" ON public.masjid_members;

CREATE POLICY "members_delete_admin"
  ON public.masjid_members FOR DELETE
  USING (public.is_super_admin(auth.uid()));

-- ============================================
-- VERIFY — run after the above
-- Should return rows for both new policies
-- ============================================
SELECT
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'masjid_members'
ORDER BY policyname;
