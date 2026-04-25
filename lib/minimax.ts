export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const MINIMAX_API_URL = "https://api.minimaxi.com/anthropic/v1/messages";

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

  try {
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
      throw new Error("Empty response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream({
      async start(controller) {
        try {
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("event:")) {
                continue;
              }

              if (line.startsWith("data:")) {
                const data = line.slice(5).trim();
                if (!data || data === "[DONE]") continue;

                try {
                  const json = JSON.parse(data);

                  if (json.type === "content_block_delta") {
                    if (json.delta?.type === "text_delta") {
                      controller.enqueue(
                        new TextEncoder().encode(json.delta.text)
                      );
                    }
                  }

                  if (json.type === "message_delta") {
                    if (json.delta?.content) {
                      const content = json.delta.content;
                      if (content[0]?.type === "text_delta") {
                        controller.enqueue(
                          new TextEncoder().encode(content[0].text)
                        );
                      }
                    }
                  }
                } catch {
                  // 跳过无效行
                }
              }
            }
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
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("API request failed");
  }
}
