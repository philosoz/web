export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const MINIMAX_API_URL = "https://api.minimaxi.chat/v1/text/chatcompletion_pro";

export async function streamMiniMaxReply(messages: ChatMessage[]) {
  const apiKey = process.env.MINIMAX_API_KEY;
  const model = process.env.MINIMAX_MODEL || "MiniMax-M2.7";

  if (!apiKey) {
    throw new Error("Server is missing MINIMAX_API_KEY.");
  }

  const formattedMessages = messages.map((msg) => ({
    role: msg.role === "system" ? "system" : msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));

  const response = await fetch(MINIMAX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      tokens_to_generate: 1024,
      temperature: 0.7,
      messages: formattedMessages,
      stream: true,
    }),
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const text = await response.text();
        errorMessage = text.slice(0, 100); // 限制错误信息长度
      }
    } catch {
      // 保持默认错误信息
    }
    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error("Empty response body");
  }

  const decoder = new TextDecoder();
  const upstreamReader = response.body.getReader();

  return new ReadableStream({
    async start(controller) {
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await upstreamReader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");

          for (const line of lines) {
            if (line.trim()) {
              try {
                const json = JSON.parse(line);
                if (json.choices?.[0]?.delta?.content) {
                  controller.enqueue(
                    new TextEncoder().encode(json.choices[0].delta.content)
                  );
                }
              } catch {
                // 跳过无效行
              }
            }
          }

          buffer = "";
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        upstreamReader.releaseLock();
      }
    },
    async cancel() {
      await upstreamReader.cancel();
    },
  });
}
