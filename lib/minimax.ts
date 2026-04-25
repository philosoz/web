export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const MINIMAX_API_URL = "https://api.minimaxi.chat/v1/text/chatcompletion_pro";

export async function streamMiniMaxReply(messages: ChatMessage[]) {
  const apiKey = process.env.MINIMAX_API_KEY;
  const model = process.env.MINIMAX_MODEL || "MiniMax-M2";

  if (!apiKey) {
    throw new Error("Missing MINIMAX_API_KEY");
  }

  const formattedMessages = messages.map((msg) => ({
    role: msg.role === "system" ? "system" : msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));

  try {
    const response = await fetch(MINIMAX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
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
      let errorMsg = `HTTP ${response.status}`;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("json")) {
          const data = await response.json();
          errorMsg = data.message || data.error || errorMsg;
        } else {
          const text = await response.text();
          errorMsg = text.substring(0, 200);
        }
      } catch {
        // 使用默认错误
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
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data:") || line.trim()) {
                try {
                  const json = JSON.parse(line.replace(/^data:\s*/, ""));
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
