-- Create twin_post_likes table for reactions
CREATE TABLE twin_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  twin_post_id uuid NOT NULL REFERENCES twin_posts(id) ON DELETE CASCADE,
  reaction_type text NOT NULL DEFAULT 'flame',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, twin_post_id)
);

-- Enable RLS
ALTER TABLE twin_post_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view twin post likes
CREATE POLICY "Anyone can view twin post likes"
ON twin_post_likes FOR SELECT
USING (true);

-- Authenticated users can like twin posts
CREATE POLICY "Authenticated users can like twin posts"
ON twin_post_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can unlike their own twin post likes
CREATE POLICY "Users can unlike own twin post likes"
ON twin_post_likes FOR DELETE
USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_twin_post_likes_twin_post_id ON twin_post_likes(twin_post_id);
CREATE INDEX idx_twin_post_likes_user_id ON twin_post_likes(user_id);

-- Create function to update twin post likes count
CREATE OR REPLACE FUNCTION update_twin_post_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE twin_posts SET likes_count = likes_count + 1 WHERE id = NEW.twin_post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE twin_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.twin_post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for twin post likes
CREATE TRIGGER update_twin_post_likes_count_trigger
AFTER INSERT OR DELETE ON twin_post_likes
FOR EACH ROW
EXECUTE FUNCTION update_twin_post_likes_count();