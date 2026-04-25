export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const MINIMAX_API_URL = "https://api.minimaxi.com/v1/text/chatcompletion_v2";

export async function streamMiniMaxReply(
  messages: ChatMessage[],
  enableWebSearch = false
) {
  const apiKey = process.env.MINIMAX_API_KEY;
  const model = process.env.MINIMAX_MODEL || "MiniMax-M2";

  if (!apiKey) {
    throw new Error("Missing MINIMAX_API_KEY");
  }

  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const requestBody: Record<string, unknown> = {
    model,
    tokens_to_generate: 1024,
    temperature: 0.5,
    messages: formattedMessages,
    stream: true,
  };

  if (enableWebSearch) {
    requestBody.tools = [
      {
        type: "web_search",
        name: "web_search",
        description: "搜索最新信息，用于回答实时性问题",
      },
    ];
  }

  const response = await fetch(MINIMAX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const dataStr = line.slice(5).trim();

              if (dataStr === "[DONE]") {
                continue;
              }

              try {
                const json = JSON.parse(dataStr);

                if (json.choices?.[0]?.delta?.content) {
                  controller.enqueue(
                    new TextEncoder().encode(json.choices[0].delta.content)
                  );
                }
              } catch {
                // 跳过无效 JSON
              }
            }
          }
        }

        controller.close();
      } catch {
        controller.error(new Error("Stream processing error"));
      } finally {
        reader.releaseLock();
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}
