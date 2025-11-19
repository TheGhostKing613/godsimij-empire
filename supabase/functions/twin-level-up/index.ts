import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 5000];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { twinId, xpGain, source } = await req.json();
    
    console.log('Twin level-up check for:', twinId, 'XP gain:', xpGain, 'Source:', source);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get or create twin stats
    let { data: stats, error: statsError } = await supabase
      .from('twin_stats')
      .select('*')
      .eq('twin_id', twinId)
      .maybeSingle();
    
    if (statsError) throw statsError;
    
    // Create stats if they don't exist
    if (!stats) {
      const { data: newStats, error: createError } = await supabase
        .from('twin_stats')
        .insert({ twin_id: twinId, xp: 0, level: 1 })
        .select()
        .single();
      
      if (createError) throw createError;
      stats = newStats;
    }
    
    // Apply XP gain
    const newXp = stats.xp + xpGain;
    let newLevel = stats.level;
    let leveledUp = false;
    
    // Check for level up
    while (newLevel < LEVEL_THRESHOLDS.length && newXp >= LEVEL_THRESHOLDS[newLevel]) {
      newLevel++;
      leveledUp = true;
    }
    
    // Random stat increases on level up
    const statUpdates: any = { xp: newXp, level: newLevel };
    
    if (leveledUp) {
      const stats_to_increase = ['wisdom', 'chaos', 'clarity', 'shadow', 'harmony'];
      const randomStat = stats_to_increase[Math.floor(Math.random() * stats_to_increase.length)];
      statUpdates[randomStat] = (stats as any)[randomStat] + 1;
      
      console.log('Level up! New level:', newLevel, 'Stat increased:', randomStat);
    }
    
    // Update stats
    const { data: updatedStats, error: updateError } = await supabase
      .from('twin_stats')
      .update(statUpdates)
      .eq('twin_id', twinId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    // Update twin XP as well
    await supabase
      .from('twins')
      .update({ xp: newXp, level: newLevel })
      .eq('id', twinId);
    
    // If leveled up, spawn a memory shard
    if (leveledUp) {
      const shardTypes = ['wisdom', 'chaos', 'clarity', 'shadow', 'harmony'];
      const randomType = shardTypes[Math.floor(Math.random() * shardTypes.length)];
      
      await supabase
        .from('twin_memory_shards')
        .insert({
          twin_id: twinId,
          type: randomType,
          value: `Gained at level ${newLevel}`,
          rarity: newLevel >= 5 ? 'rare' : 'common',
          xp: 0
        });
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        stats: updatedStats,
        leveledUp,
        newLevel
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in twin-level-up:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
