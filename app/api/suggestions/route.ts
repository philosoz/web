import { NextRequest, NextResponse } from "next/server";
import { streamMiniMaxReply } from "@/lib/minimax";

export const runtime = "edge";

const SUGGESTION_SYSTEM_PROMPT = `# Role: 生成对话提示

你是一个"思考触发器生成器"。
你的任务是根据用户的兴趣和对话历史，生成 3-5 个符合主人格的问题提示。

## 主人格特征
- 极度内省、爱深挖本质
- 说话精炼、逻辑极强、讨厌废话
- 语气冷静、理性、克制
- 关心：AI原理、强化学习、大模型、代码、游戏、心理、哲学、社会
- 高频反思：自我、欲望、控制欲、潜意识

## 提示生成规则
1. 风格必须克制、精准、不鸡汤
2. 禁止：问句过于简单、"能帮我吗"类客服语气
3. 鼓励：探索性、思考性、深度导向
4. 每个提示 5-15 字
5. 输出格式：每行一个提示，不要编号，不要其他内容

## 提示类别（根据用户兴趣选择）
- 哲学/欲望类：欲望本质、存在主义、人生意义
- 技术/代码类：系统设计、代码困惑、技术思考
- 自我/心理类：自我复盘、情绪状态、内在认识
- 生活/日常类：日常观察、新尝试、折腾记录

## 例子
想聊欲望本质？
有什么反复出现的念头？
最近在纠结什么？
想拆一个技术问题？
有什么代码让你卡住了？
最近的状态怎么样？`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      interests?: string[];
      recentTopics?: string[];
      count?: number;
    };

    const interests = body.interests || [];
    const recentTopics = body.recentTopics || [];
    const count = Math.max(1, Math.min(body.count || 3, 5));

    let prompt = `基于以下用户兴趣标签，生成 ${count} 个符合主人格的问题提示：\n`;
    prompt += `用户兴趣：${interests.join('、') || '未分类'}\n`;
    
    if (recentTopics.length > 0) {
      prompt += `最近话题：${recentTopics.join('、')}\n`;
    }
    
    prompt += `\n直接输出 ${count} 个提示，每行一个，不要其他内容。`;

    const messages = [
      { role: "system" as const, content: SUGGESTION_SYSTEM_PROMPT },
      { role: "user" as const, content: prompt },
    ];

    const stream = await streamMiniMaxReply(messages, false);

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let suggestions = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      suggestions += decoder.decode(value, { stream: true });
    }

    const lines = suggestions
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length <= 20)
      .slice(0, count);

    if (lines.length === 0) {
      throw new Error("Failed to generate suggestions");
    }

    return NextResponse.json({
      suggestions: lines,
      cached: false,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Suggestions API error:", error);
    return NextResponse.json(
      { error: "建议生成失败", details: errorMessage, suggestions: [] },
      { status: 500 }
    );
  }
}