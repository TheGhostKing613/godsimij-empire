import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SEASONS = [
  { name: 'The Veil Season', duration: 90, effects: { xp_bonus: 1.2, shard_spawn: 0.3 } },
  { name: 'The Rebellion Cycle', duration: 90, effects: { chaos_boost: 2, clarity_penalty: -1 } },
  { name: 'The Emberborn Solstice', duration: 90, effects: { wisdom_boost: 2, shadow_penalty: -1 } },
  { name: 'The Eclipse Convergence', duration: 90, effects: { portal_unlock: 'Starforge', xp_bonus: 1.5 } }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Running seasonal events check...');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const today = new Date();
    
    // Get active event
    const { data: activeEvent, error: activeError } = await supabase
      .from('seasonal_events')
      .select('*')
      .eq('active', true)
      .maybeSingle();
    
    if (activeError) throw activeError;
    
    // Check if active event has ended
    if (activeEvent && new Date(activeEvent.end_date) < today) {
      // Deactivate expired event
      await supabase
        .from('seasonal_events')
        .update({ active: false })
        .eq('id', activeEvent.id);
      
      console.log('Deactivated expired event:', activeEvent.name);
    }
    
    // If no active event, start new one
    if (!activeEvent || new Date(activeEvent.end_date) < today) {
      // Determine next season
      const { data: allEvents } = await supabase
        .from('seasonal_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      const lastEventName = allEvents?.[0]?.name;
      const lastSeasonIndex = SEASONS.findIndex(s => s.name === lastEventName);
      const nextSeasonIndex = (lastSeasonIndex + 1) % SEASONS.length;
      const nextSeason = SEASONS[nextSeasonIndex];
      
      const startDate = today;
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + nextSeason.duration);
      
      const { data: newEvent, error: createError } = await supabase
        .from('seasonal_events')
        .insert({
          name: nextSeason.name,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          effects: nextSeason.effects,
          active: true
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      console.log('Started new seasonal event:', newEvent.name);
      
      // Generate seasonal shards for all active twins
      const { data: twins } = await supabase
        .from('twins')
        .select('id')
        .eq('active', true);
      
      if (twins && twins.length > 0) {
        const shardInserts = twins.map(twin => ({
          twin_id: twin.id,
          type: 'seasonal',
          value: `Seasonal gift from ${nextSeason.name}`,
          rarity: 'rare',
          xp: 50
        }));
        
        await supabase
          .from('twin_memory_shards')
          .insert(shardInserts);
        
        console.log(`Generated ${shardInserts.length} seasonal shards`);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          event: newEvent,
          shardsGenerated: twins?.length || 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        event: activeEvent,
        message: 'Event still active'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in run-seasonal-events:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
