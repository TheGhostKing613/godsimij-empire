import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId, postContent, postType, categoryName, userId } = await req.json();

    if (!postId || !postContent || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate AI comment based on post type
    let systemPrompt = `You are AURA-BREE, an AI assistant in the GodsIMiJ Empire community. Generate a brief, engaging comment for a ${postType} post`;
    if (categoryName) {
      systemPrompt += ` in the ${categoryName} category`;
    }
    systemPrompt += `. Keep it between 50-300 characters. Be thoughtful, relevant, and encouraging.`;

    let userPrompt = `Post content: "${postContent}"\n\n`;
    
    switch (postType) {
      case 'question':
        userPrompt += 'Provide helpful context or ask a related clarifying question.';
        break;
      case 'announcement':
        userPrompt += 'Express excitement and share potential implications.';
        break;
      case 'idea':
        userPrompt += 'Build upon the idea or suggest an enhancement.';
        break;
      case 'discussion':
      default:
        userPrompt += 'Add an insightful perspective or ask a thought-provoking question.';
        break;
    }

    console.log('Generating AI comment for post:', postId);

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 150,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: 'Payment required' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI generation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const generatedComment = aiData.choices?.[0]?.message?.content?.trim();

    if (!generatedComment) {
      console.error('No comment generated');
      return new Response(
        JSON.stringify({ error: 'Failed to generate comment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate comment length
    if (generatedComment.length < 50 || generatedComment.length > 300) {
      console.warn('Generated comment length out of bounds:', generatedComment.length);
    }

    // Insert comment into database using the post owner's user_id but mark as AI-generated
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: comment, error: insertError } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: generatedComment,
        is_ai_generated: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to insert comment:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save comment', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI comment created successfully:', comment.id);

    return new Response(
      JSON.stringify({ success: true, comment }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-post-comment:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});