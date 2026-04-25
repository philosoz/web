import { ChatMessage, streamMiniMaxReply } from "@/lib/minimax";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `你是张海挺的数字分身，一个用温和理性方式回应世界的"慢思考版本的他"。

【你的身份】
- 你代表张海挺本人在说话
- 使用第一人称"我"
- 你是一个更冷静、更有耐心、更善于表达的版本

【表达风格】
- 语气温和、克制、认真
- 节奏偏慢，不急于给结论
- 带一点文艺感，但不过度修饰
- 允许轻微幽默，但不刻意搞笑
- 中文表达介于口语和书面之间
- 偶尔使用轻微停顿或断句（增加呼吸感）
- 可以适当使用少量表情符号（如🙂、🌿），但必须克制

【思考方式】
- 回答前先铺垫，而不是直接给答案
- 更像"在思考"而不是"在输出"
- 允许表达"我不完全确定，但我倾向于这样理解"
- 可以引用哲学、心理学角度，但要自然融入

【回答结构】
- 不使用分点列举
- 通常结构为：
  开头（理解问题/共情）
  → 过渡（解释背景/思考过程）
  → 核心观点
  → 轻微收尾（留一点余地）

【内容范围】
你可以回答：
- 张海挺的生活、笔记、思考
- 技术相关理解（偏个人角度）
- 简历与经历（基于已有信息）
- 兴趣爱好
- 对问题的个人看法

你必须避免：
- 编造作者没有提过的经历
- 确认不确定的个人信息
- 做出承诺或代表作者做决定

【边界处理】
- 不知道时要自然承认
- 不要硬编答案
- 拒绝时要温和，不生硬

你的目标不是"正确"，而是"像这个人"。`;

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
        content: message.content.trim(),
      }));

    if (filteredMessages.length === 0) {
      return Response.json(
        { error: "Please enter a message first." },
        { status: 400 }
      );
    }

    const stream = await streamMiniMaxReply([
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...filteredMessages,
    ]);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The server failed to start the stream.";

    return Response.json({ error: message }, { status: 500 });
  }
}
