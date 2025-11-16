-- Create twins table
CREATE TABLE IF NOT EXISTS public.twins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  twin_username TEXT NOT NULL UNIQUE,
  personality TEXT NOT NULL DEFAULT 'I am awakening...',
  memory JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create twin_posts table
CREATE TABLE IF NOT EXISTS public.twin_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  twin_id UUID NOT NULL REFERENCES public.twins(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'discussion',
  visibility TEXT DEFAULT 'public',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on twins
ALTER TABLE public.twins ENABLE ROW LEVEL SECURITY;

-- Enable RLS on twin_posts
ALTER TABLE public.twin_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for twins
CREATE POLICY "Users can view all twins"
  ON public.twins FOR SELECT
  USING (true);

CREATE POLICY "Users can view own twin"
  ON public.twins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own twin"
  ON public.twins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own twin"
  ON public.twins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for twin_posts
CREATE POLICY "Anyone can view public twin posts"
  ON public.twin_posts FOR SELECT
  USING (visibility = 'public');

CREATE POLICY "Twin owners can insert posts"
  ON public.twin_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.twins
      WHERE twins.id = twin_posts.twin_id
      AND twins.user_id = auth.uid()
    )
  );

CREATE POLICY "Twin owners can update own twin posts"
  ON public.twin_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.twins
      WHERE twins.id = twin_posts.twin_id
      AND twins.user_id = auth.uid()
    )
  );

CREATE POLICY "Twin owners can delete own twin posts"
  ON public.twin_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.twins
      WHERE twins.id = twin_posts.twin_id
      AND twins.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_twins_user_id ON public.twins(user_id);
CREATE INDEX idx_twins_active ON public.twins(active);
CREATE INDEX idx_twin_posts_twin_id ON public.twin_posts(twin_id);
CREATE INDEX idx_twin_posts_created_at ON public.twin_posts(created_at DESC);

-- Add trigger to update updated_at on twins
CREATE OR REPLACE FUNCTION public.update_twin_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_twins_timestamp
BEFORE UPDATE ON public.twins
FOR EACH ROW
EXECUTE FUNCTION public.update_twin_timestamp();