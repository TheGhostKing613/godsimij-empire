-- Sprint 3: Broadcast Era Database Schema Updates

-- 1. Add anonymous posting columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add check constraint for anonymous posts
ALTER TABLE posts 
DROP CONSTRAINT IF EXISTS check_anonymous_display_name;

ALTER TABLE posts 
ADD CONSTRAINT check_anonymous_display_name 
CHECK (
  (is_anonymous = false) OR 
  (is_anonymous = true AND display_name IS NOT NULL)
);

-- Create index for anonymous posts
CREATE INDEX IF NOT EXISTS idx_posts_anonymous ON posts(is_anonymous, created_at DESC);

-- 2. Create user tier enum and add to profiles
DO $$ BEGIN
  CREATE TYPE user_tier AS ENUM ('wanderer', 'witness', 'scribe', 'flamekeeper', 'crown');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add tier columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS tier user_tier DEFAULT 'witness',
ADD COLUMN IF NOT EXISTS tier_awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for tier queries
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);

-- 3. Create anonymous post rate limiting table
CREATE TABLE IF NOT EXISTS anonymous_post_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Index for rate limit checks
CREATE INDEX IF NOT EXISTS idx_anon_limits_user_24h ON anonymous_post_limits(user_id, created_at DESC);

-- RLS: Users can only see their own rate limits
ALTER TABLE anonymous_post_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own rate limits" ON anonymous_post_limits;
CREATE POLICY "Users can view own rate limits"
ON anonymous_post_limits FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own rate limits" ON anonymous_post_limits;
CREATE POLICY "Users can insert own rate limits"
ON anonymous_post_limits FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Create tier promotion function
CREATE OR REPLACE FUNCTION check_tier_promotion(p_user_id UUID)
RETURNS user_tier
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_count INTEGER;
  v_reactions_received INTEGER;
  v_current_tier user_tier;
  v_new_tier user_tier;
BEGIN
  -- Get current tier and post count
  SELECT tier, post_count INTO v_current_tier, v_post_count 
  FROM profiles 
  WHERE id = p_user_id;
  
  -- Count reactions received on user's posts
  SELECT COUNT(*) INTO v_reactions_received
  FROM post_likes pl
  JOIN posts p ON pl.post_id = p.id
  WHERE p.user_id = p_user_id;
  
  -- Determine new tier (only auto-promote to scribe)
  v_new_tier := v_current_tier;
  
  IF v_current_tier = 'witness' AND v_post_count >= 10 AND v_reactions_received >= 50 THEN
    v_new_tier := 'scribe';
  END IF;
  
  -- Update if promoted
  IF v_new_tier != v_current_tier THEN
    UPDATE profiles 
    SET tier = v_new_tier, tier_awarded_at = now() 
    WHERE id = p_user_id;
  END IF;
  
  RETURN v_new_tier;
END;
$$;

-- Trigger to check tier promotion after post creation
CREATE OR REPLACE FUNCTION trigger_check_tier_promotion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM check_tier_promotion(NEW.user_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS after_post_create_check_tier ON posts;
CREATE TRIGGER after_post_create_check_tier
AFTER INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION trigger_check_tier_promotion();