-- ============================================
-- TaseesCircle — Migration 015
-- Fix: infinite recursion in profiles RLS
--
-- Root cause: The WITH CHECK clause in
-- "profiles_update_own_safe" (from migration 012)
-- runs:
--   SELECT role FROM public.profiles WHERE id = auth.uid()
-- This re-triggers the same UPDATE policy on
-- profiles, causing infinite recursion (PG error
-- 42P17 / PostgREST 500).
--
-- Fix: Replace the inline subquery with a
-- SECURITY DEFINER helper function that bypasses
-- RLS, breaking the recursion cycle.
-- ============================================


-- ── Helper: get the current user's role without
--    going through RLS (SECURITY DEFINER skips it).
CREATE OR REPLACE FUNCTION public.get_own_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Grant only to authenticated users
GRANT EXECUTE ON FUNCTION public.get_own_role() TO authenticated;


-- ── Drop the recursive policy from migration 012
DROP POLICY IF EXISTS "profiles_update_own_safe" ON public.profiles;


-- ── Recreate it using the safe helper instead
--    of a direct self-referential subquery.
CREATE POLICY "profiles_update_own_safe"
  ON public.profiles FOR UPDATE
  USING  (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = public.get_own_role()
  );
