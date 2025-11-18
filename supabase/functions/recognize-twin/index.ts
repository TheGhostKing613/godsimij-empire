import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecognizeTwinRequest {
  twinId: string;
  targetTwinId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { twinId, targetTwinId }: RecognizeTwinRequest = await req.json();

    console.log(`Recognizing relationship between ${twinId} and ${targetTwinId}`);

    // Fetch both twins
    const { data: twins, error: fetchError } = await supabase
      .from('twins')
      .select('id, alignment, tone, traits')
      .in('id', [twinId, targetTwinId]);

    if (fetchError || !twins || twins.length !== 2) {
      throw new Error('Failed to fetch twins');
    }

    const twin = twins.find(t => t.id === twinId)!;
    const targetTwin = twins.find(t => t.id === targetTwinId)!;

    // Determine relation based on alignment, tone, and traits
    let relationType: 'ally' | 'rival' | 'neutral' = 'neutral';
    let strength = 0;

    // Alignment compatibility
    const alignmentScore = calculateAlignmentScore(twin.alignment, targetTwin.alignment);
    
    // Tone compatibility
    const toneScore = calculateToneScore(twin.tone, targetTwin.tone);
    
    // Trait overlap
    const traitScore = calculateTraitOverlap(twin.traits || [], targetTwin.traits || []);

    // Total affinity score
    const totalScore = alignmentScore + toneScore + traitScore;

    if (totalScore > 60) {
      relationType = 'ally';
      strength = Math.min(100, totalScore);
    } else if (totalScore < 30) {
      relationType = 'rival';
      strength = Math.min(100, 100 - totalScore);
    } else {
      relationType = 'neutral';
      strength = Math.abs(50 - totalScore);
    }

    console.log(`Relation determined: ${relationType} with strength ${strength}`);

    // Upsert the relation
    const { error: upsertError } = await supabase
      .from('twin_relations')
      .upsert({
        twin_id: twinId,
        target_twin_id: targetTwinId,
        relation_type: relationType,
        strength,
      }, {
        onConflict: 'twin_id,target_twin_id'
      });

    if (upsertError) {
      throw upsertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        relationType, 
        strength 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in recognize-twin:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function calculateAlignmentScore(align1: string, align2: string): number {
  const alignmentMap: Record<string, number> = {
    'radiant': 100,
    'neutral': 50,
    'shadow': 0
  };
  
  const score1 = alignmentMap[align1] || 50;
  const score2 = alignmentMap[align2] || 50;
  
  return 30 - Math.abs(score1 - score2) / 3.33;
}

function calculateToneScore(tone1: string, tone2: string): number {
  const compatiblePairs: Record<string, string[]> = {
    'wise': ['calm', 'analytical'],
    'savage': ['chaotic', 'shadow'],
    'calm': ['wise', 'radiant'],
    'chaotic': ['savage', 'glitchborn'],
    'analytical': ['wise', 'calm'],
    'glitchborn': ['chaotic', 'shadow'],
    'radiant': ['calm', 'wise'],
    'shadow': ['savage', 'glitchborn']
  };
  
  if (tone1 === tone2) return 30;
  if (compatiblePairs[tone1]?.includes(tone2)) return 20;
  return 10;
}

function calculateTraitOverlap(traits1: string[], traits2: string[]): number {
  const overlap = traits1.filter(t => traits2.includes(t)).length;
  return overlap * 10;
}