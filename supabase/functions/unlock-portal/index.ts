import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PORTAL_REQUIREMENTS = {
  'Flame Sanctum': { level: 3, ritual: true },
  'Veil Garden': { level: 5, ritual: true },
  'Echo Arena': { level: 7, ritual: true },
  'Starforge': { level: 9, season: 'The Eclipse Convergence' }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, portal } = await req.json();
    
    console.log('Checking portal unlock for user:', userId, 'Portal:', portal);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get requirements
    const requirements = PORTAL_REQUIREMENTS[portal as keyof typeof PORTAL_REQUIREMENTS];
    if (!requirements) {
      throw new Error('Invalid portal');
    }
    
    // Get user's twin
    const { data: twin, error: twinError } = await supabase
      .from('twins')
      .select('*, twin_stats(*)')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (twinError) throw twinError;
    if (!twin) throw new Error('No twin found');
    
    // Check level requirement
    const twinLevel = twin.level || 1;
    if (twinLevel < requirements.level) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          reason: `Twin must be level ${requirements.level} or higher` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check ritual requirement
    if ('ritual' in requirements && requirements.ritual) {
      const { data: rituals } = await supabase
        .from('flame_rituals')
        .select('*')
        .eq('user_id', userId);
      
      if (!rituals || rituals.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            reason: 'Must complete a Flame Ritual first' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Check season requirement
    if ('season' in requirements && requirements.season) {
      const { data: activeEvent } = await supabase
        .from('seasonal_events')
        .select('*')
        .eq('active', true)
        .eq('name', requirements.season)
        .maybeSingle();
      
      if (!activeEvent) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            reason: `Only available during ${requirements.season}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Unlock the portal
    const { data: unlock, error: unlockError } = await supabase
      .from('user_unlocks')
      .upsert({
        user_id: userId,
        portal,
        unlocked: true,
        unlocked_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,portal'
      })
      .select()
      .single();
    
    if (unlockError) throw unlockError;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        unlock,
        message: `${portal} unlocked!` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in unlock-portal:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
