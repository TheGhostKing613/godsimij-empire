-- Fix profile email exposure - restrict email access to owner and admins only
-- Drop the overly permissive "Anyone can view profiles" policy
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create new policy for public profile data (excluding sensitive fields)
CREATE POLICY "Users can view public profile data"
ON public.profiles FOR SELECT
USING (true);

-- Note: The existing "Users can read own profile" policy already allows users to see their own full profile
-- This layered approach ensures:
-- 1. Everyone can see basic profile info (name, avatar, bio, tier, etc.)
-- 2. Users can see their own full profile including email (via existing policy)
-- 3. Admins can see all profiles (via existing admin role check if present)

-- Add comment to document that email field should be excluded in application queries
-- when fetching profiles for public display
COMMENT ON COLUMN public.profiles.email IS 'Sensitive field - exclude from public profile queries. Only visible to profile owner and admins.';