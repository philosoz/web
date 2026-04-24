import { ChatMessage, streamMiniMaxReply } from "@/lib/minimax";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT =
  "You are a helpful Chinese AI product and coding assistant. Keep responses clear, practical, and deployment-friendly.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: IncomingMessage[];
    };

    const rawMessages = body.messages ?? [];
    const filteredMessages: ChatMessage[] = rawMessages
      .filter((message) => message.content?.trim())
      .slice(-20)
      .map((message) => ({
        role: message.role,
        content: message.content.trim()
      }));

    if (filteredMessages.length === 0) {
      return Response.json({ error: "Please enter a message first." }, { status: 400 });
    }

    const stream = await streamMiniMaxReply([
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      ...filteredMessages
    ]);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive"
      }
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The server failed to start the stream.";

    return Response.json(
      {
        error: message
      },
      {
        status: 500
      }
    );
  }
}
