-- Create conversation rate limiting table
CREATE TABLE IF NOT EXISTS public.conversation_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, created_at)
);

-- Enable RLS
ALTER TABLE public.conversation_rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can view their own rate limits
CREATE POLICY "Users can view own rate limits"
ON public.conversation_rate_limits
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own rate limits
CREATE POLICY "Users can insert own rate limits"
ON public.conversation_rate_limits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for efficient lookups
CREATE INDEX idx_conversation_rate_limits_user_created 
ON public.conversation_rate_limits(user_id, created_at DESC);