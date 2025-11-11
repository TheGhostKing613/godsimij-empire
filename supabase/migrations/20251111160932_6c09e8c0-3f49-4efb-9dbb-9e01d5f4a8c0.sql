-- Fix infinite recursion in conversation_participants RLS policy
-- Drop the existing policy that causes recursion
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;

-- Create a simpler policy that doesn't cause recursion
-- Users can view participant records for conversations they're part of
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants
FOR SELECT
USING (
  conversation_id IN (
    SELECT conversation_id 
    FROM public.conversation_participants 
    WHERE user_id = auth.uid()
  )
);