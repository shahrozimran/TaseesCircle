-- ============================================
-- TaseesCircle — Initial Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- Extends auth.users with app-specific fields
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  city TEXT,
  country TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'super_admin')),
  current_masjid_id UUID,  -- enforces 1-user-1-circle (FK added after masjids table)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 2. MASJIDS TABLE
-- Mosque registration with approval workflow
-- ============================================
CREATE TABLE IF NOT EXISTS public.masjids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  unique_code TEXT UNIQUE,  -- generated on approval
  description TEXT,
  member_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  -- Prevent duplicate masjids by location
  CONSTRAINT unique_masjid_location UNIQUE (zip_code, area, city, country)
);

-- Add FK from profiles to masjids (circular reference)
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_current_masjid
  FOREIGN KEY (current_masjid_id) REFERENCES public.masjids(id) ON DELETE SET NULL;

-- ============================================
-- 3. MASJID MEMBERS TABLE
-- Junction table — UNIQUE(user_id) enforces 1-user-1-circle
-- ============================================
CREATE TABLE IF NOT EXISTS public.masjid_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  masjid_id UUID NOT NULL REFERENCES public.masjids(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  join_method TEXT NOT NULL DEFAULT 'code' CHECK (join_method IN ('code', 'referral', 'admin_invite', 'creator')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- 1 user can only be in 1 circle
  CONSTRAINT unique_user_one_circle UNIQUE (user_id)
);

-- ============================================
-- 4. CIRCLES TABLE
-- Auto-created when a masjid is approved
-- ============================================
CREATE TABLE IF NOT EXISTS public.circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  masjid_id UUID NOT NULL UNIQUE REFERENCES public.masjids(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 5. CIRCLE POSTS TABLE
-- Only admins/moderators can create posts
-- ============================================
CREATE TABLE IF NOT EXISTS public.circle_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  posted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('ibadat', 'business', 'general', 'announcement')),
  view_count INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 6. CIRCLE CONTENT TABLE
-- Mandatory + optional learning materials
-- ============================================
CREATE TABLE IF NOT EXISTS public.circle_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  posted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'article' CHECK (content_type IN ('article', 'video', 'hadith', 'quran_ref', 'announcement')),
  body TEXT,
  media_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 7. SUPPORT TICKETS TABLE
-- Member queries to moderator or TaseesCircle
-- ============================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  masjid_id UUID REFERENCES public.masjids(id) ON DELETE SET NULL,
  recipient TEXT NOT NULL CHECK (recipient IN ('tasees_admin', 'moderator')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'responded', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 8. TICKET RESPONSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ticket_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  responded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  response_message TEXT NOT NULL,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 9. NOTIFICATIONS TABLE
-- In-app notification bell items
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('approval', 'rejection', 'ticket_response', 'member_joined', 'general')),
  link TEXT,  -- where to navigate on click
  is_read BOOLEAN NOT NULL DEFAULT false,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 10. REFERRALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  masjid_id UUID NOT NULL REFERENCES public.masjids(id) ON DELETE CASCADE,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  referred_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days')
);

-- ============================================
-- 11. DAILY REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  ibadat_data JSONB DEFAULT '{}',
  business_data JSONB DEFAULT '{}',
  reflection TEXT,
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One report per user per day
  CONSTRAINT unique_daily_report UNIQUE (user_id, report_date)
);

-- ============================================
-- 12. ADMIN ACTIONS TABLE (Audit Log)
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  masjid_id UUID REFERENCES public.masjids(id) ON DELETE SET NULL,
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('approve_masjid', 'reject_masjid', 'respond_ticket', 'assign_moderator', 'remove_member', 'update_role')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_masjid_members_user ON public.masjid_members(user_id);
CREATE INDEX IF NOT EXISTS idx_masjid_members_masjid ON public.masjid_members(masjid_id);
CREATE INDEX IF NOT EXISTS idx_masjids_code ON public.masjids(unique_code);
CREATE INDEX IF NOT EXISTS idx_masjids_location ON public.masjids(zip_code, area, city, country);
CREATE INDEX IF NOT EXISTS idx_masjids_status ON public.masjids(status);
CREATE INDEX IF NOT EXISTS idx_masjids_created_by ON public.masjids(created_by);
CREATE INDEX IF NOT EXISTS idx_daily_reports_user_date ON public.daily_reports(user_id, report_date);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status, recipient);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_circle ON public.circle_posts(circle_id);
CREATE INDEX IF NOT EXISTS idx_circles_masjid ON public.circles(masjid_id);


-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- 1. Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    email = COALESCE(EXCLUDED.email, profiles.email),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Generate unique 6-char alphanumeric code
CREATE OR REPLACE FUNCTION public.generate_unique_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 6-character alphanumeric code
    new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    -- Check if it already exists
    SELECT EXISTS(SELECT 1 FROM public.masjids WHERE unique_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- 3. Auto-increment member_count on join
CREATE OR REPLACE FUNCTION public.handle_member_joined()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment member count
  UPDATE public.masjids
    SET member_count = member_count + 1
    WHERE id = NEW.masjid_id;
  -- Update user's current_masjid_id
  UPDATE public.profiles
    SET current_masjid_id = NEW.masjid_id, updated_at = now()
    WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_member_joined ON public.masjid_members;
CREATE TRIGGER on_member_joined
  AFTER INSERT ON public.masjid_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_member_joined();

-- 4. Auto-decrement member_count on leave
CREATE OR REPLACE FUNCTION public.handle_member_left()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrement member count
  UPDATE public.masjids
    SET member_count = GREATEST(member_count - 1, 0)
    WHERE id = OLD.masjid_id;
  -- Clear user's current_masjid_id
  UPDATE public.profiles
    SET current_masjid_id = NULL, updated_at = now()
    WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_member_left ON public.masjid_members;
CREATE TRIGGER on_member_left
  AFTER DELETE ON public.masjid_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_member_left();

-- 5. Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_support_tickets ON public.support_tickets;
CREATE TRIGGER set_updated_at_support_tickets
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_circle_posts ON public.circle_posts;
CREATE TRIGGER set_updated_at_circle_posts
  BEFORE UPDATE ON public.circle_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masjids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masjid_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE id = user_id AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if user is member of a masjid
CREATE OR REPLACE FUNCTION public.is_masjid_member(user_id UUID, target_masjid_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.masjid_members WHERE masjid_members.user_id = is_masjid_member.user_id AND masjid_id = target_masjid_id
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if user is admin/moderator of a masjid
CREATE OR REPLACE FUNCTION public.is_masjid_admin_or_mod(user_id UUID, target_masjid_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.masjid_members
    WHERE masjid_members.user_id = is_masjid_admin_or_mod.user_id
      AND masjid_id = target_masjid_id
      AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- PROFILES ----
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super admins can read all profiles" ON public.profiles
  FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_super_admin(auth.uid()));

-- ---- MASJIDS ----
CREATE POLICY "Anyone authenticated can create a masjid" ON public.masjids
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Masjid creator can read own masjid" ON public.masjids
  FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Members can read their masjid" ON public.masjids
  FOR SELECT USING (public.is_masjid_member(auth.uid(), id));
CREATE POLICY "Masjid admin can update own masjid" ON public.masjids
  FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Super admins can read all masjids" ON public.masjids
  FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update all masjids" ON public.masjids
  FOR UPDATE USING (public.is_super_admin(auth.uid()));
-- Allow anyone to check for duplicates (read by location match)
CREATE POLICY "Anyone can check masjid by code" ON public.masjids
  FOR SELECT USING (status = 'approved' AND unique_code IS NOT NULL);

-- ---- MASJID MEMBERS ----
CREATE POLICY "Members can read their circle members" ON public.masjid_members
  FOR SELECT USING (public.is_masjid_member(auth.uid(), masjid_id));
CREATE POLICY "Users can join a masjid" ON public.masjid_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Masjid admin can manage members" ON public.masjid_members
  FOR DELETE USING (public.is_masjid_admin_or_mod(auth.uid(), masjid_id));
CREATE POLICY "Masjid admin can update member roles" ON public.masjid_members
  FOR UPDATE USING (public.is_masjid_admin_or_mod(auth.uid(), masjid_id));
CREATE POLICY "Users can leave a masjid" ON public.masjid_members
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Super admins can read all members" ON public.masjid_members
  FOR SELECT USING (public.is_super_admin(auth.uid()));

-- ---- CIRCLES ----
CREATE POLICY "Members can read their circle" ON public.circles
  FOR SELECT USING (
    public.is_masjid_member(auth.uid(), masjid_id)
  );
CREATE POLICY "Super admins can read all circles" ON public.circles
  FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can insert circles" ON public.circles
  FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));

-- ---- CIRCLE POSTS ----
CREATE POLICY "Circle members can read posts" ON public.circle_posts
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
      AND public.is_masjid_member(auth.uid(), c.masjid_id)
    )
  );
CREATE POLICY "Admins/mods can create posts" ON public.circle_posts
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
      AND public.is_masjid_admin_or_mod(auth.uid(), c.masjid_id)
    )
  );
CREATE POLICY "Admins/mods can update posts" ON public.circle_posts
  FOR UPDATE USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
      AND public.is_masjid_admin_or_mod(auth.uid(), c.masjid_id)
    )
  );
CREATE POLICY "Super admins can read all posts" ON public.circle_posts
  FOR SELECT USING (public.is_super_admin(auth.uid()));

-- ---- CIRCLE CONTENT ----
CREATE POLICY "Circle members can read content" ON public.circle_content
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
      AND public.is_masjid_member(auth.uid(), c.masjid_id)
    )
  );
CREATE POLICY "Admins/mods can manage content" ON public.circle_content
  FOR ALL USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
      AND public.is_masjid_admin_or_mod(auth.uid(), c.masjid_id)
    )
  );
CREATE POLICY "Super admins can manage all content" ON public.circle_content
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- ---- SUPPORT TICKETS ----
CREATE POLICY "Users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON public.support_tickets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Super admins can read all tickets" ON public.support_tickets
  FOR SELECT USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can update all tickets" ON public.support_tickets
  FOR UPDATE USING (public.is_super_admin(auth.uid()));
-- Moderators can read tickets targeted to them
CREATE POLICY "Moderators can read circle tickets" ON public.support_tickets
  FOR SELECT USING (
    recipient = 'moderator'
    AND masjid_id IS NOT NULL
    AND public.is_masjid_admin_or_mod(auth.uid(), masjid_id)
  );

-- ---- TICKET RESPONSES ----
CREATE POLICY "Ticket owner can read responses" ON public.ticket_responses
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id AND t.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins/mods can create responses" ON public.ticket_responses
  FOR INSERT WITH CHECK (
    public.is_super_admin(auth.uid())
    OR EXISTS(
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id
        AND t.recipient = 'moderator'
        AND t.masjid_id IS NOT NULL
        AND public.is_masjid_admin_or_mod(auth.uid(), t.masjid_id)
    )
  );
CREATE POLICY "Super admins can read all responses" ON public.ticket_responses
  FOR SELECT USING (public.is_super_admin(auth.uid()));

-- ---- NOTIFICATIONS ----
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
-- Insert handled by service role / triggers only

-- ---- REFERRALS ----
CREATE POLICY "Referrer can read own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Admins/mods can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (
    public.is_masjid_admin_or_mod(auth.uid(), masjid_id)
  );
CREATE POLICY "Anyone can validate a referral code" ON public.referrals
  FOR SELECT USING (status = 'pending');
CREATE POLICY "Super admins can read all referrals" ON public.referrals
  FOR SELECT USING (public.is_super_admin(auth.uid()));

-- ---- DAILY REPORTS ----
CREATE POLICY "Users can create own reports" ON public.daily_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own reports" ON public.daily_reports
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Circle admins can read circle reports" ON public.daily_reports
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.circles c
      WHERE c.id = circle_id
      AND public.is_masjid_admin_or_mod(auth.uid(), c.masjid_id)
    )
  );
CREATE POLICY "Super admins can read all reports" ON public.daily_reports
  FOR SELECT USING (public.is_super_admin(auth.uid()));

-- ---- ADMIN ACTIONS ----
CREATE POLICY "Super admins can create actions" ON public.admin_actions
  FOR INSERT WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins can read all actions" ON public.admin_actions
  FOR SELECT USING (public.is_super_admin(auth.uid()));


-- ============================================
-- ENABLE REALTIME for notifications
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
