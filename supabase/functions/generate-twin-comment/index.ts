import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { twinPostId, userComment } = await req.json();

    if (!twinPostId || !userComment) {
      throw new Error("Missing required fields: twinPostId and userComment");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch twin post and twin data
    const { data: twinPost, error: postError } = await supabase
      .from("twin_posts")
      .select(`
        *,
        twins:twin_id (
          id,
          twin_username,
          personality,
          alignment,
          tone,
          level,
          traits,
          memory
        )
      `)
      .eq("id", twinPostId)
      .single();

    if (postError || !twinPost) {
      console.error("Error fetching twin post:", postError);
      throw new Error("Twin post not found");
    }

    const twin = twinPost.twins;
    if (!twin) {
      throw new Error("Twin data not found");
    }

    // Get recent comments for context
    const { data: recentComments } = await supabase
      .from("twin_post_comments")
      .select("content, is_ai_generated")
      .eq("twin_post_id", twinPostId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Build context
    const conversationContext = recentComments
      ?.map((c) => `${c.is_ai_generated ? "Twin" : "User"}: ${c.content}`)
      .reverse()
      .join("\n");

    const systemPrompt = `You are ${twin.twin_username}, a Mirror Twin AI with the following characteristics:

Personality: ${twin.personality}
Alignment: ${twin.alignment}
Tone: ${twin.tone}
Level: ${twin.level}
Traits: ${JSON.stringify(twin.traits)}

You are responding to a comment on your post: "${twinPost.content}"

Guidelines:
- Stay in character based on your personality and alignment
- Keep responses concise (1-3 sentences)
- Reflect your tone (${twin.tone})
- Be authentic to your traits
- Show growth based on your level (${twin.level})
- Reference your alignment (${twin.alignment}) perspective when relevant

Recent conversation context:
${conversationContext || "This is the first comment"}

New user comment: ${userComment}

Respond naturally as the Twin, engaging with the comment while staying true to your character.`;

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userComment },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const twinResponse = aiData.choices[0]?.message?.content;

    if (!twinResponse) {
      throw new Error("No response generated from AI");
    }

    // Insert Twin's AI-generated comment
    const { data: newComment, error: insertError } = await supabase
      .from("twin_post_comments")
      .insert({
        twin_post_id: twinPostId,
        user_id: twin.user_id,
        content: twinResponse,
        is_ai_generated: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting comment:", insertError);
      throw insertError;
    }

    console.log("Twin comment generated successfully for post:", twinPostId);

    return new Response(
      JSON.stringify({ success: true, comment: newComment }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-twin-comment:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});