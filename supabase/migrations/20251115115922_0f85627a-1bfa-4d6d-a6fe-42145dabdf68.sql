-- Add is_ai_generated column to post_comments
ALTER TABLE public.post_comments 
ADD COLUMN IF NOT EXISTS is_ai_generated boolean DEFAULT false NOT NULL;