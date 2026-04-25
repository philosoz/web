import { NextRequest, NextResponse } from "next/server";
import { streamMiniMaxReply } from "@/lib/minimax";
import { systemPrompt } from "@/lib/prompt";
import { buildRAGContext } from "@/lib/rag";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      messages?: Array<{ role: string; content: string }>;
    };

    const rawMessages = body.messages ?? [];
    const userMessage = rawMessages[rawMessages.length - 1]?.content || "";

    const ragContext = buildRAGContext(userMessage);
    
    const fullPrompt = ragContext 
      ? `${systemPrompt}\n\n【你可以参考的文章】\n${ragContext}\n\n请结合以上文章回答，如果文章不相关就不提。`
      : systemPrompt;

    const messages = [
      { role: "system" as const, content: fullPrompt },
      ...rawMessages.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const stream = await streamMiniMaxReply(messages);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
