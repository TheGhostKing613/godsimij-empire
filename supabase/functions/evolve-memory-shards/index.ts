import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { twinId, context } = await req.json();
    
    console.log('Evolving memory shards for twin:', twinId, 'with context:', context);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get all shards for this twin
    const { data: shards, error: shardsError } = await supabase
      .from('twin_memory_shards')
      .select('*')
      .eq('twin_id', twinId);
    
    if (shardsError) throw shardsError;
    
    // Calculate XP gain based on context
    let xpGain = 10; // base XP
    
    if (context.includes('post')) xpGain += 5;
    if (context.includes('reaction')) xpGain += 3;
    if (context.includes('training')) xpGain += 7;
    if (context.includes('ritual')) xpGain += 15;
    
    // Update shards
    const updatedShards = [];
    
    for (const shard of shards || []) {
      let newXp = shard.xp + xpGain;
      let newRarity = shard.rarity;
      
      // Evolution logic
      if (newXp >= 1000 && shard.rarity !== 'mythic') {
        newRarity = 'mythic';
      } else if (newXp >= 300 && shard.rarity === 'rare') {
        newRarity = 'epic';
      } else if (newXp >= 100 && shard.rarity === 'common') {
        newRarity = 'rare';
      }
      
      const { data: updated, error: updateError } = await supabase
        .from('twin_memory_shards')
        .update({ xp: newXp, rarity: newRarity })
        .eq('id', shard.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating shard:', updateError);
      } else {
        updatedShards.push(updated);
      }
    }
    
    // Chance to spawn new shard based on XP gain
    if (Math.random() < 0.15) {
      const shardTypes = ['wisdom', 'chaos', 'clarity', 'shadow', 'harmony'];
      const randomType = shardTypes[Math.floor(Math.random() * shardTypes.length)];
      
      const { data: newShard } = await supabase
        .from('twin_memory_shards')
        .insert({
          twin_id: twinId,
          type: randomType,
          value: `Generated from ${context}`,
          rarity: 'common',
          xp: 0
        })
        .select()
        .single();
      
      if (newShard) updatedShards.push(newShard);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        shards: updatedShards,
        xpGained: xpGain 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in evolve-memory-shards:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
