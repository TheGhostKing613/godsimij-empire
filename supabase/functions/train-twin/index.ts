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
    const { twinId, trainingContent, memoryType = 'lesson' } = await req.json();
    
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

    // Generate updated personality
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
            content: `You are updating a Mirror Twin's personality. Current personality: ${twin.personality}. Integrate this new training: ${trainingContent}. Return an updated personality description (50-120 words) that evolves from the original but incorporates the new lesson.`
          },
          {
            role: 'user',
            content: 'Generate the updated personality.'
          }
        ],
        max_tokens: 200,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to generate updated personality');
    }

    const aiData = await aiResponse.json();
    const updatedPersonality = aiData.choices[0].message.content.trim();

    // Add new memory shard
    const currentMemory = twin.memory || [];
    const newMemoryShard = {
      type: memoryType,
      content: trainingContent,
      timestamp: Date.now()
    };
    const updatedMemory = [...currentMemory, newMemoryShard];

    // Update twin
    const { data: updatedTwin, error: updateError } = await supabase
      .from('twins')
      .update({
        personality: updatedPersonality,
        memory: updatedMemory
      })
      .eq('id', twinId)
      .select()
      .single();

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ twin: updatedTwin, memoryShard: newMemoryShard }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in train-twin:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});