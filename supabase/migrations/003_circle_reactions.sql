-- ============================================
-- TaseesCircle — Migration 003
-- Circle Post Reactions Table
-- Run this in your Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS public.circle_post_reactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES public.circle_posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction   TEXT NOT NULL CHECK (reaction IN ('alhamdulillah', 'mashallah', 'love')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One reaction type per user per post
  CONSTRAINT unique_user_post_reaction UNIQUE (post_id, user_id, reaction)
);

CREATE INDEX IF NOT EXISTS idx_reactions_post ON public.circle_post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON public.circle_post_reactions(user_id);

-- Enable RLS
ALTER TABLE public.circle_post_reactions ENABLE ROW LEVEL SECURITY;

-- Circle members can read reactions
CREATE POLICY "Circle members can read reactions" ON public.circle_post_reactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.circle_posts cp
      JOIN public.circles c ON c.id = cp.circle_id
      WHERE cp.id = post_id
        AND public.is_masjid_member(auth.uid(), c.masjid_id)
    )
  );

-- Circle members can add their own reactions
CREATE POLICY "Circle members can add reactions" ON public.circle_post_reactions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.circle_posts cp
      JOIN public.circles c ON c.id = cp.circle_id
      WHERE cp.id = post_id
        AND public.is_masjid_member(auth.uid(), c.masjid_id)
    )
  );

-- Users can remove their own reactions
CREATE POLICY "Users can remove own reactions" ON public.circle_post_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_post_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_posts;
