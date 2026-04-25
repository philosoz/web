# Tasks

- [x] Task 1: 调整开场白为自然随意风格
  - 修改 `lib/welcome-messages.ts` 的开场白文案为更私人、自然的风格
  - 新访客开场白简短有力
  - 回访用户简短欢迎，不生硬

- [x] Task 2: 降低模型温度至 0.5
  - 修改 `lib/minimax.ts` 中 `temperature: 0.7` 为 `temperature: 0.5`

- [x] Task 3: 移除 AI 暗示性提示语
  - 修改 `components/ai/ChatInput.tsx` 移除底部的"AI回答可能不完全准确，仅供参考"

- [x] Task 4: UI 调整为温暖日记风
  - 修改 `components/ai/ChatMessage.tsx` 消息气泡样式，增加温暖感
  - 可考虑调整颜色、圆角、间距，让界面更柔和、私人

- [x] Task 5: 添加清空聊天记录功能
  - 在 `components/chat/ChatHistory.tsx` 或聊天界面添加"清空"按钮
  - 提供确认机制防止误操作
  - 清空后显示新的开场白

- [x] Task 6: 验证修改效果
  - 测试开场白显示是否正常
  - 测试模型回复稳定性
  - 测试清空功能是否正常
  - 检查 UI 整体效果