export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const MINIMAX_API_URL = "https://api.minimaxi.chat/v1/messages";

export async function streamMiniMaxReply(messages: ChatMessage[]) {
  const apiKey = process.env.MINIMAX_API_KEY;
  const model = process.env.MINIMAX_MODEL || "MiniMax-M2.7";

  if (!apiKey) {
    throw new Error("Missing MINIMAX_API_KEY");
  }

  const systemMessage = messages.find((m) => m.role === "system");
  const chatMessages = messages.filter((m) => m.role !== "system");

  const requestBody: Record<string, unknown> = {
    model,
    max_tokens: 1024,
    messages: chatMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  };

  if (systemMessage) {
    requestBody.system = systemMessage.content;
  }

  const response = await fetch(MINIMAX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      errorMsg = data.error?.message || data.message || errorMsg;
    } catch {
      const text = await response.text();
      errorMsg = text.substring(0, 200);
    }
    throw new Error(errorMsg);
  }

  if (!response.body) {
    throw new Error("Empty response");
  }

  const decoder = new TextDecoder();
  const reader = response.body.getReader();

  return new ReadableStream({
    async start(controller) {
      try {
        const fullResponse = await response.json();
        
        if (fullResponse.content && fullResponse.content[0]?.type === "text") {
          const text = fullResponse.content[0].text;
          controller.enqueue(new TextEncoder().encode(text));
        }
        
        controller.close();
      } catch (err) {
        controller.error(err);
      } finally {
        reader.releaseLock();
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}
