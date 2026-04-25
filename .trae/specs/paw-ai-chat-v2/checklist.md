# Checklist

## P0：核心重构

- [x] prompt.ts 强制禁止 AI 自我暴露（禁止：AI助手、模型、可以帮助你、客服式开场）
- [x] prompt.ts 欢迎语改为自然随意风格（不含：你好、AI、帮助）
- [x] app/chat/page.tsx 删除左侧 ChatHistory 组件，改为单栏布局
- [x] app/chat/page.tsx 添加推荐问题入口（3-5个问题按钮）

## P1：UI 优化

- [x] ChatMessage 样式调整为去 IM 感（AI消息像段落输出）
- [x] 整体排版优化（宽度720px、行距1.75、消息间距16px、字体栈）
- [x] ChatInput 输入框样式优化（圆角、内阴影、hover效果）

## Verification

- [x] 验证：prompt.ts 包含强制禁止规则块（在最前面）
- [x] 验证：欢迎语规则存在（不含：你好、AI、帮助）
- [x] 验证：chat/page.tsx 无 ChatHistory 组件
- [x] 验证：有4个推荐问题按钮
- [x] 验证：ChatMessage 有去气泡样式（AI透明背景）
- [x] 验证：排版规范应用（宽度、行距、字体）
- [x] 验证：ChatInput 有圆角、内阴影、hover效果