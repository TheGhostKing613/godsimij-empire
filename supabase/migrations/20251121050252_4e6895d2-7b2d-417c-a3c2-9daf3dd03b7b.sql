-- Create twin_post_comments table
CREATE TABLE twin_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  twin_post_id uuid NOT NULL REFERENCES twin_posts(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_ai_generated boolean NOT NULL DEFAULT false,
  is_edited boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE twin_post_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view twin post comments
CREATE POLICY "Anyone can view twin post comments"
ON twin_post_comments FOR SELECT
USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create twin post comments"
ON twin_post_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update own comments
CREATE POLICY "Users can update own twin post comments"
ON twin_post_comments FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete own comments
CREATE POLICY "Users can delete own twin post comments"
ON twin_post_comments FOR DELETE
USING (auth.uid() = user_id);

-- Admins can delete any comment
CREATE POLICY "Admins can delete any twin post comment"
ON twin_post_comments FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_twin_post_comments_twin_post_id ON twin_post_comments(twin_post_id);
CREATE INDEX idx_twin_post_comments_user_id ON twin_post_comments(user_id);
CREATE INDEX idx_twin_post_comments_created_at ON twin_post_comments(created_at DESC);

-- Create function to update twin post comments count
CREATE OR REPLACE FUNCTION update_twin_post_comments_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE twin_posts SET comments_count = comments_count + 1 WHERE id = NEW.twin_post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE twin_posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.twin_post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for twin post comments count
CREATE TRIGGER update_twin_post_comments_count_trigger
AFTER INSERT OR DELETE ON twin_post_comments
FOR EACH ROW
EXECUTE FUNCTION update_twin_post_comments_count();