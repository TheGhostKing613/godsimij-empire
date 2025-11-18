-- Twin Visibility and Evolution Upgrades
ALTER TABLE twins 
ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
ADD COLUMN IF NOT EXISTS level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS xp integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS traits jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS alignment text DEFAULT 'neutral',
ADD COLUMN IF NOT EXISTS tone text DEFAULT 'wise',
ADD COLUMN IF NOT EXISTS auto_reply_enabled boolean DEFAULT false;

-- Twin Memory Imprints Table
CREATE TABLE IF NOT EXISTS twin_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  twin_id uuid REFERENCES twins(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE twin_memories ENABLE ROW LEVEL SECURITY;

-- Twin owners can view their twin's memories
CREATE POLICY "Users can view own twin memories"
ON twin_memories FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM twins
    WHERE twins.id = twin_memories.twin_id
    AND twins.user_id = auth.uid()
  )
);

-- Twin owners can insert memories
CREATE POLICY "Users can insert own twin memories"
ON twin_memories FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM twins
    WHERE twins.id = twin_memories.twin_id
    AND twins.user_id = auth.uid()
  )
);