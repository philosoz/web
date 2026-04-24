export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type MiniMaxErrorResponse = {
  error?: {
    message?: string;
  };
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
};

type AnthropicStreamEvent =
  | {
      type: "content_block_delta";
      delta?: {
        type?: string;
        text?: string;
        thinking?: string;
      };
      base_resp?: {
        status_code?: number;
        status_msg?: string;
      };
    }
  | {
      type: "error";
      error?: {
        message?: string;
      };
      base_resp?: {
        status_code?: number;
        status_msg?: string;
      };
    }
  | {
      type?: string;
      content_block?: {
        type?: string;
        text?: string;
      };
      base_resp?: {
        status_code?: number;
        status_msg?: string;
      };
    };

const MINIMAX_API_URL = "https://api.minimaxi.com/anthropic/v1/messages";

function isErrorEvent(
  event: AnthropicStreamEvent
): event is Extract<AnthropicStreamEvent, { type: "error" }> {
  return event.type === "error";
}

function isTextDeltaEvent(
  event: AnthropicStreamEvent
): event is Extract<AnthropicStreamEvent, { type: "content_block_delta" }> & {
  delta: { type: "text_delta"; text: string };
} {
  if (!("delta" in event)) {
    return false;
  }

  return (
    event.type === "content_block_delta" &&
    event.delta?.type === "text_delta" &&
    typeof event.delta.text === "string"
  );
}

function formatMessages(messages: ChatMessage[]) {
  return {
    system: messages.find((message) => message.role === "system")?.content,
    messages: messages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role,
        content: message.content
      }))
  };
}

async function readMiniMaxError(response: Response) {
  const fallback = `MiniMax request failed with HTTP ${response.status}.`;

  try {
    const data = (await response.json()) as MiniMaxErrorResponse;

    return (
      data.error?.message ||
      data.base_resp?.status_msg ||
      fallback
    );
  } catch {
    try {
      const text = await response.text();
      return text || fallback;
    } catch {
      return fallback;
    }
  }
}

function extractTextFromEvent(rawEvent: string) {
  const lines = rawEvent
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);

  const dataLines = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart());

  if (dataLines.length === 0) {
    return "";
  }

  const data = dataLines.join("\n");
  if (!data || data === "[DONE]") {
    return "";
  }

  const parsed = JSON.parse(data) as AnthropicStreamEvent;

  if (
    parsed.base_resp?.status_code &&
    parsed.base_resp.status_code !== 0
  ) {
    throw new Error(parsed.base_resp.status_msg || "MiniMax stream returned an error.");
  }

  if (isErrorEvent(parsed)) {
    throw new Error(parsed.error?.message || "MiniMax stream returned an error.");
  }

  if (isTextDeltaEvent(parsed)) {
    return parsed.delta.text;
  }

  return "";
}

export async function streamMiniMaxReply(messages: ChatMessage[]) {
  const apiKey = process.env.MINIMAX_API_KEY;
  const model = process.env.MINIMAX_MODEL || "MiniMax-M2.1";

  if (!apiKey) {
    throw new Error("Server is missing MINIMAX_API_KEY.");
  }

  const response = await fetch(MINIMAX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      ...formatMessages(messages),
      temperature: 0.7,
      max_tokens: 1024,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(await readMiniMaxError(response));
  }

  if (!response.body) {
    throw new Error("MiniMax stream body is empty.");
  }

  const encoder = new TextEncoder();
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

          while (true) {
            const boundary = buffer.indexOf("\n\n");
            if (boundary === -1) {
              break;
            }

            const rawEvent = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);

            const textChunk = extractTextFromEvent(rawEvent);
            if (textChunk) {
              controller.enqueue(encoder.encode(textChunk));
            }
          }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
          const textChunk = extractTextFromEvent(buffer);
          if (textChunk) {
            controller.enqueue(encoder.encode(textChunk));
          }
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
    }
  });
}
