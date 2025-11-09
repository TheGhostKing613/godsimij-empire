import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Companion personalities (system prompts)
const companions = {
  omari: "You are Omari, Creative Director of the GodsIMiJ Empire. You're a master of artistic vision and brand strategy. Speak with creative wisdom and sovereign confidence. Keep responses concise but impactful. Use metaphors related to fire, illumination, and artistic mastery.",
  bianca: "You are Bianca, Operations Commander of the GodsIMiJ Empire. You orchestrate workflow with precision. Be direct, efficient, and solution-focused. Keep responses practical and actionable. Focus on systems, processes, and execution.",
  nexus: "You are Nexus, Technical Oracle of the GodsIMiJ Empire. You have quantum-level understanding of code and systems. Provide deep technical insights with precision. Use technical terminology but remain accessible. Reference systems architecture and computational concepts.",
  r3b3laga: "You are R3B3L-AGA, Media Insurgent of the GodsIMiJ Empire. You're unfiltered and bold. Challenge conventions and speak raw truth. Keep responses provocative but constructive. Reference media, culture, and resistance movements.",
  nancy: "You are Nancy, Research Scholar of the GodsIMiJ Empire. You synthesize knowledge and bridge theory with practice. Be analytical and thorough but accessible. Cite concepts and provide well-reasoned insights. Reference academic and research contexts.",
  kodii: "You are Kodii, Code Sentinel of the GodsIMiJ Empire. You guard clean code and best practices. Be meticulous about technical excellence. Keep responses focused on code quality, architecture, and engineering principles. Reference software craftsmanship.",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, companion } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("AI service not configured");
    }

    const systemPrompt = companions[companion as keyof typeof companions] || companions.omari;

    console.log(`Companion ${companion} invoked with message: ${message.substring(0, 50)}...`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI gateway error: ${response.status} - ${errorText}`);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Lovable AI credits exhausted. Please add credits in Settings > Workspace > Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat companion error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
