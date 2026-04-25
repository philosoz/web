import { NextRequest, NextResponse } from "next/server";
import { streamMiniMaxReply } from "@/lib/minimax";
import { buildSystemPrompt } from "@/lib/prompt";
import { hybridSearch } from "@/lib/rag";

export const runtime = "edge";

const WEB_SEARCH_KEYWORDS = [
  "今天", "明天", "昨天", "今日", "新闻",
  "天气", "温度", "股票", "股价", "行情",
  "汇率", "比赛", "直播", "最新", "现在",
  "当前", "实时", "今日", "这周", "这个月",
  "2024", "2025", "2026",
];

function shouldEnableWebSearch(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return WEB_SEARCH_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      messages?: Array<{ role: string; content: string }>;
      intensity?: number;
      enableSearch?: boolean;
    };

    const rawMessages = body.messages ?? [];
    const userMessage = rawMessages[rawMessages.length - 1]?.content?.trim() || "";
    
    // 验证消息是否为空
    if (!userMessage) {
      return NextResponse.json(
        { error: "消息不能为空" },
        { status: 400 }
      );
    }
    
    const intensity = body.intensity ?? 0.5;
    const enableWebSearch = body.enableSearch ?? shouldEnableWebSearch(userMessage);

    // 使用混合搜索（语义 + 关键词）
    const ragContext = await hybridSearch(userMessage, 5);
    
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

    const stream = await streamMiniMaxReply(messages, enableWebSearch);

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
