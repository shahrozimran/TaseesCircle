-- ============================================
-- TaseesCircle — Migration 009
-- Fix Super Admin Profile Full Name
-- Ensures admin_access@taseescircle.com has full_name = 'TaseesCircle Admin'
-- ============================================

UPDATE public.profiles
SET full_name = 'TaseesCircle Admin',
    role = 'super_admin'
WHERE email = 'admin_access@taseescircle.com';
