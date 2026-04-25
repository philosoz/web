export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const MINIMAX_API_URL = "https://api.minimaxi.chat/v1/text/chatcompletion_pro";

export async function streamMiniMaxReply(messages: ChatMessage[]) {
  const apiKey = process.env.MINIMAX_API_KEY;
  const model = process.env.MINMAX_MODEL || "abab5.5-chat";

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
    const errorText = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${errorText}`);
  }

  if (!response.body) {
    throw new Error("MiniMax stream body is empty.");
  }

  const decoder = new TextDecoder();
  const upstreamReader = response.body.getReader();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await upstreamReader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");

          for (const line of lines) {
            if (line.trim()) {
              try {
                const json = JSON.parse(line);
                if (json.choices && json.choices[0]?.delta?.content) {
                  controller.enqueue(
                    new TextEncoder().encode(json.choices[0].delta.content)
                  );
                }
              } catch (e) {
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
