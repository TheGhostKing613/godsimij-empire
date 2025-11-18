import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LEVEL_THRESHOLDS = [50, 100, 200, 350, 550, 800, 1100, 1500, 2000, 2600];
const TRAIT_UNLOCKS = {
  1: 'Echo-Born',
  2: 'Flame-Touched',
  3: 'Glitch-Sighted',
  4: 'Memory-Woven',
  5: 'Soul-Forged',
  6: 'Reality-Weaver',
  7: 'Void-Walker',
  8: 'Time-Keeper',
  9: 'Nexus-Born',
  10: 'God-Ascended'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { twinId, xpGain, source } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get current twin
    const { data: twin, error: twinError } = await supabase
      .from('twins')
      .select('*')
      .eq('id', twinId)
      .single();
    
    if (twinError || !twin) throw new Error('Twin not found');

    const newXp = (twin.xp || 0) + xpGain;
    let newLevel = twin.level || 1;
    let leveledUp = false;
    
    // Check for level up
    while (newLevel <= 10 && newXp >= LEVEL_THRESHOLDS[newLevel - 1]) {
      newLevel++;
      leveledUp = true;
    }

    // Add new trait on level up
    let newTraits = twin.traits || [];
    if (leveledUp && TRAIT_UNLOCKS[newLevel as keyof typeof TRAIT_UNLOCKS]) {
      newTraits = [...newTraits, TRAIT_UNLOCKS[newLevel as keyof typeof TRAIT_UNLOCKS]];
    }

    // Update twin
    const updateData: any = {
      xp: newXp,
      level: newLevel,
      traits: newTraits
    };

    // If leveled up, refine personality
    if (leveledUp) {
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (LOVABLE_API_KEY) {
        try {
          const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'system',
                  content: `Evolve this Twin's personality for level ${newLevel}. Current: ${twin.personality}. Tone: ${twin.tone || 'wise'}. Alignment: ${twin.alignment || 'neutral'}. New traits: ${newTraits.join(', ')}. Make it more powerful, vivid, and evolved. Return 60-150 words.`
                },
                {
                  role: 'user',
                  content: 'Evolve the personality.'
                }
              ],
              max_tokens: 250,
            }),
          });

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            updateData.personality = aiData.choices[0].message.content.trim();
          }
        } catch (e) {
          console.error('AI personality evolution failed:', e);
        }
      }
    }

    const { data: updatedTwin, error: updateError } = await supabase
      .from('twins')
      .update(updateData)
      .eq('id', twinId)
      .select()
      .single();

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        twin: updatedTwin, 
        leveledUp,
        xpGained: xpGain,
        source 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in evolve-twin:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
