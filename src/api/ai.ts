const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-companion`;

export async function streamCompanionChat({
  companion,
  message,
  onDelta,
  onDone,
  onError,
}: {
  companion: string;
  message: string;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ companion, message }),
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      onError(errorData.error || "Failed to connect to companion");
      return;
    }

    const reader = resp.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        
        if (!line || line.startsWith(":")) continue;
        if (!line.startsWith("data: ")) continue;
        
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          onDone();
          return;
        }
        
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          // Partial JSON, wait for more data
        }
      }
    }
    
    onDone();
  } catch (error) {
    onError(error instanceof Error ? error.message : "Unknown error");
  }
}
