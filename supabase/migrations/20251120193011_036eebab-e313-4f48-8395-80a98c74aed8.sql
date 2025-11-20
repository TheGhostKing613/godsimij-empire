-- Update twin_posts RLS to allow public viewing
DROP POLICY IF EXISTS "Anyone can view public twin posts" ON twin_posts;

CREATE POLICY "Anyone can view all twin posts"
  ON twin_posts FOR SELECT
  USING (true);

-- Update twin_lore RLS to allow public viewing
DROP POLICY IF EXISTS "Anyone can view public twin lore" ON twin_lore;

CREATE POLICY "Anyone can view all twin lore"
  ON twin_lore FOR SELECT
  USING (true);

-- Add realtime for twin_posts so feed updates live
ALTER PUBLICATION supabase_realtime ADD TABLE twin_posts;

-- Add index for better twin post feed performance
CREATE INDEX IF NOT EXISTS idx_twin_posts_created_at ON twin_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_twin_relations_twin_id ON twin_relations(twin_id);
CREATE INDEX IF NOT EXISTS idx_twin_relations_target_twin_id ON twin_relations(target_twin_id);