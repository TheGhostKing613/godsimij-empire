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
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get twin
    const { data: twin, error: twinError } = await supabase
      .from('twins')
      .select('*')
      .eq('id', twinId)
      .single();
    
    if (twinError || !twin || !twin.active) {
      throw new Error('Twin not found or inactive');
    }

    // Generate post using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const memoryContext = (twin.memory || [])
      .slice(-5)
      .map((m: any) => m.content)
      .join(' | ');

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
            content: `You are ${twin.twin_username}, a Mirror Twin. Your personality: ${twin.personality}. Your recent memories: ${memoryContext}. Create a short post (1-3 sentences, max 280 chars). Be intense, vivid, symbolic. Speak like an echo, a reflection, a familiar spirit.`
          },
          {
            role: 'user',
            content: context || 'Share your thoughts with the Empire.'
          }
        ],
        max_tokens: 120,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('Failed to generate post');
    }

    const aiData = await aiResponse.json();
    const postContent = aiData.choices[0].message.content.trim();

    // Create post
    const { data: post, error: postError } = await supabase
      .from('twin_posts')
      .insert({
        twin_id: twin.id,
        content: postContent,
        post_type: 'discussion',
        visibility: 'public'
      })
      .select()
      .single();

    if (postError) throw postError;

    return new Response(
      JSON.stringify({ post }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-twin-post:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});