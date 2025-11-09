-- Add moderation fields to comments table
ALTER TABLE public.comments 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN moderated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN moderated_by UUID REFERENCES auth.users(id),
ADD COLUMN moderation_note TEXT;

-- Update RLS policy for viewing comments - only show approved or own comments
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;

CREATE POLICY "Anyone can view approved comments"
ON public.comments
FOR SELECT
USING (
  status = 'approved' 
  AND is_hidden = false
);

CREATE POLICY "Users can view own comments"
ON public.comments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all comments"
ON public.comments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update insert policy to set status to pending by default
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;

CREATE POLICY "Authenticated users can create comments"
ON public.comments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND status = 'pending'
);

-- Add admin moderation policies
CREATE POLICY "Admins can moderate comments"
ON public.comments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for moderation queries
CREATE INDEX idx_comments_status ON public.comments(status, created_at DESC);
CREATE INDEX idx_comments_moderation ON public.comments(status, is_hidden);