-- ============================================
-- TaseesCircle — Migration 010
-- Support Email Tracking & Notification Enhancements
-- ============================================

-- 1. Extend notifications.type to include 'new_ticket' for Super Admin alerts
--    Original CHECK: ('approval','rejection','ticket_response','member_joined','general')
ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('approval', 'rejection', 'ticket_response', 'new_ticket', 'member_joined', 'general'));

-- 2. Add index on notifications.type for efficient super admin alert lookup
CREATE INDEX IF NOT EXISTS idx_notifications_type
  ON public.notifications(type, user_id);

-- 3. Add index on ticket_responses for fast per-ticket lookups
CREATE INDEX IF NOT EXISTS idx_ticket_responses_ticket
  ON public.ticket_responses(ticket_id, created_at);

-- 4. Ensure email_sent column exists on ticket_responses (already in schema, guard only)
ALTER TABLE public.ticket_responses
  ADD COLUMN IF NOT EXISTS email_sent BOOLEAN NOT NULL DEFAULT false;

-- 5. Extend admin_actions.action_type to ensure 'respond_ticket' is allowed
--    (already present in original schema — no change needed, but verified)
