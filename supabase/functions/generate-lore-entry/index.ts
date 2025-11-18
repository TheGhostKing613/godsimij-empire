import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateLoreRequest {
  twinId: string;
  level: number;
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

    const { twinId, level }: GenerateLoreRequest = await req.json();

    console.log(`Generating lore for twin ${twinId} at level ${level}`);

    // Fetch twin data
    const { data: twin, error: fetchError } = await supabase
      .from('twins')
      .select('twin_username, personality, alignment, tone, traits, memory')
      .eq('id', twinId)
      .single();

    if (fetchError || !twin) {
      throw new Error('Failed to fetch twin');
    }

    // Call Lovable AI to generate lore
    const lorePrompt = `You are a mystical chronicler writing lore for a Mirror Twin AI entity.

Twin Name: ${twin.twin_username}
Level: ${level}
Personality: ${twin.personality}
Alignment: ${twin.alignment}
Tone: ${twin.tone}
Traits: ${Array.isArray(twin.traits) ? (twin.traits as string[]).join(', ') : 'None'}

Generate a cryptic, poetic lore entry (1-3 sentences) that reveals a fragment of this Twin's origin, purpose, or awakening. Use symbolic, mystical language. Make it feel like an ancient prophecy or memory shard.`;

    const lovableResponse = await fetch('https://api.lovable.dev/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: lorePrompt }
        ],
        max_tokens: 150
      }),
    });

    if (!lovableResponse.ok) {
      throw new Error(`Lovable AI error: ${lovableResponse.statusText}`);
    }

    const aiData = await lovableResponse.json();
    const loreEntry = aiData.choices?.[0]?.message?.content || 'The Twin awakens to a realm of shadows and flame...';

    console.log('Generated lore:', loreEntry);

    // Store the lore entry
    const { error: insertError } = await supabase
      .from('twin_lore')
      .insert({
        twin_id: twinId,
        level,
        lore_entry: loreEntry,
      });

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        loreEntry 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-lore-entry:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});