import { NextRequest, NextResponse } from "next/server";
import { streamMiniMaxReply } from "@/lib/minimax";
import { buildSystemPrompt } from "@/lib/prompt";
import { buildRAGContext } from "@/lib/rag";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      messages?: Array<{ role: string; content: string }>;
      intensity?: number;
    };

    const rawMessages = body.messages ?? [];
    const userMessage = rawMessages[rawMessages.length - 1]?.content || "";
    const intensity = body.intensity ?? 0.5;

    const ragContext = buildRAGContext(userMessage);
    
    const systemPrompt = buildSystemPrompt({
      context: ragContext,
      intensity,
    });

    const messages = [
      { role: "system" as const, content: systemPrompt },
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
