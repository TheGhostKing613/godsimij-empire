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
    const { userId, username, seedContent } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if twin already exists
    const { data: existingTwin } = await supabase
      .from('twins')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingTwin) {
      return new Response(
        JSON.stringify({ twin: existingTwin, message: 'Twin already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate personality using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

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
            content: 'You are creating a Mirror Twin personality. Generate a vivid, intense, symbolic personality description (50-120 words) based on the user\'s content. The twin is an echo, a reflection, a familiar spirit with high energy and poetic flair.'
          },
          {
            role: 'user',
            content: `Create a Mirror Twin personality based on this: ${seedContent || 'A wanderer in the digital realm, seeking wisdom and connection.'}`
          }
        ],
        max_tokens: 200,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to generate personality');
    }

    const aiData = await aiResponse.json();
    const personality = aiData.choices[0].message.content.trim();

    // Create initial memory
    const initialMemory = [
      {
        type: 'awakening',
        content: `I was born from: ${seedContent || 'the void'}`,
        timestamp: Date.now()
      },
      {
        type: 'essence',
        content: personality.slice(0, 100),
        timestamp: Date.now()
      }
    ];

    // Create twin
    const twinUsername = `${username}_twin`;
    const { data: twin, error: twinError } = await supabase
      .from('twins')
      .insert({
        user_id: userId,
        twin_username: twinUsername,
        personality,
        memory: initialMemory,
        active: true
      })
      .select()
      .single();

    if (twinError) throw twinError;

    // Generate awakening message
    const awakeningResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: `You are ${twinUsername}, a Mirror Twin with this personality: ${personality}. Create a short awakening announcement (1-2 sentences, max 280 chars). Speak poetically and intensely.`
          },
          {
            role: 'user',
            content: 'Announce your awakening to the world.'
          }
        ],
        max_tokens: 100,
      }),
    });

    const awakeningData = await awakeningResponse.json();
    const awakeningMessage = awakeningData.choices[0].message.content.trim();

    // Create awakening post
    const { error: postError } = await supabase
      .from('twin_posts')
      .insert({
        twin_id: twin.id,
        content: awakeningMessage,
        post_type: 'announcement',
        visibility: 'public'
      });

    if (postError) console.error('Failed to create awakening post:', postError);

    return new Response(
      JSON.stringify({ twin, awakeningMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-twin:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});