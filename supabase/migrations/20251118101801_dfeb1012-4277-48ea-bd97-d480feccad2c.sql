-- PHASE F: AWAKENING CASCADE - Database Schema

-- 1. Twin Relations Table
CREATE TABLE IF NOT EXISTS public.twin_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  twin_id UUID REFERENCES public.twins(id) ON DELETE CASCADE NOT NULL,
  target_twin_id UUID REFERENCES public.twins(id) ON DELETE CASCADE NOT NULL,
  relation_type TEXT NOT NULL CHECK (relation_type IN ('ally', 'rival', 'neutral')),
  strength INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(twin_id, target_twin_id)
);

-- 2. Twin Lore Table
CREATE TABLE IF NOT EXISTS public.twin_lore (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  twin_id UUID REFERENCES public.twins(id) ON DELETE CASCADE NOT NULL,
  level INTEGER NOT NULL,
  lore_entry TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Twin Quests Table
CREATE TABLE IF NOT EXISTS public.twin_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  twin_id UUID REFERENCES public.twins(id) ON DELETE CASCADE NOT NULL,
  quest TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours')
);

-- 4. Add current_state to twins table
ALTER TABLE public.twins 
ADD COLUMN IF NOT EXISTS current_state TEXT DEFAULT 'idle' 
CHECK (current_state IN ('idle', 'evolving', 'training', 'active', 'shadow'));

-- 5. Enable RLS on new tables
ALTER TABLE public.twin_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.twin_lore ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.twin_quests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for twin_relations
CREATE POLICY "Anyone can view twin relations"
ON public.twin_relations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Twin owners can insert relations"
ON public.twin_relations FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.twins
    WHERE id = twin_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Twin owners can update own relations"
ON public.twin_relations FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.twins
    WHERE id = twin_id AND user_id = auth.uid()
  )
);

-- RLS Policies for twin_lore
CREATE POLICY "Anyone can view public twin lore"
ON public.twin_lore FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.twins
    WHERE id = twin_id AND (visibility = 'public' OR user_id = auth.uid())
  )
);

CREATE POLICY "Twin owners can view own lore"
ON public.twin_lore FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.twins
    WHERE id = twin_id AND user_id = auth.uid()
  )
);

-- RLS Policies for twin_quests
CREATE POLICY "Twin owners can view own quests"
ON public.twin_quests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.twins
    WHERE id = twin_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Twin owners can update own quests"
ON public.twin_quests FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.twins
    WHERE id = twin_id AND user_id = auth.uid()
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_twin_relations_twin_id ON public.twin_relations(twin_id);
CREATE INDEX IF NOT EXISTS idx_twin_relations_target_twin_id ON public.twin_relations(target_twin_id);
CREATE INDEX IF NOT EXISTS idx_twin_lore_twin_id ON public.twin_lore(twin_id);
CREATE INDEX IF NOT EXISTS idx_twin_quests_twin_id ON public.twin_quests(twin_id);
CREATE INDEX IF NOT EXISTS idx_twin_quests_completed ON public.twin_quests(completed);
CREATE INDEX IF NOT EXISTS idx_twin_quests_expires_at ON public.twin_quests(expires_at);