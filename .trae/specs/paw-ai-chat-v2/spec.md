# AI 对话界面 V2 重构 Spec

## Why

当前 AI 对话界面存在**产品定位根本性偏差**：设计得像"客服工具"，但实际要承载的是"个人人格入口"。这种错位导致：

1. 开头直接露馅："我是AI助手"让用户一秒出戏
2. 左侧栏强化工具感，像 ChatGPT 克隆
3. UI 没有个人温度，像冷冰冰的后台系统
4. 没有引导，用户不知道从何开口

## What Changes

- 修改系统 prompt：强制禁止所有 AI 自我暴露表达
- 重新设计欢迎语：自然随意，像人说话不像客服
- 删除左侧会话栏：彻底去工具感，改成沉浸式单栏布局
- 调整对话气泡样式：去 IM 感，更像段落输出
- 加推荐问题入口：降低用户开口成本
- 优化整体排版：宽度限制、行距、留白、字体
- 优化输入框：圆角、内阴影、hover 效果

## Impact

- Affected specs: AI 对话体验、个人空间感
- Affected code:
  - `lib/prompt.ts` - 强制禁止规则和欢迎语
  - `app/chat/page.tsx` - 移除左侧栏，简化布局
  - `components/ai/ChatMessage.tsx` - 气泡样式重构
  - `components/ai/ChatInput.tsx` - 输入框样式优化
  - `components/chat/ChatHistory.tsx` - 移除或折叠

## ADDED Requirements

### Requirement: AI 禁止自我暴露

系统 SHALL 在所有输出中严格禁止以下表达：
- "我是AI助手"
- "我是模型"
- "我可以帮助你"
- "有什么可以帮助你的"
- 任何客服式开场

#### Scenario: 模型输出包含禁止表达
- **WHEN** 系统构建 prompt 时
- **THEN** 自动注入禁止规则，模型输出违反规则视为失败

### Requirement: 推荐问题入口

系统 SHALL 在欢迎区域显示 3-5 个推荐问题，降低用户开口成本。

#### Scenario: 新用户进入
- **WHEN** 用户首次进入或无消息时
- **THEN** 显示人格句 + 欢迎语 + 推荐问题按钮
- **THEN** 推荐问题格式：带边框的胶囊按钮，像"段落"展开的入口

### Requirement: 推荐问题内容

推荐问题 SHALL 体现主人格特征，问题示例：
- "你平时在想什么？"
- "你怎么看欲望？"
- "AI 产品经理是做什么的？"
- "你为什么会关注心理学？"

---

## MODIFIED Requirements

### Requirement: 欢迎语风格

欢迎语 SHALL 采用自然随意风格，像朋友找你聊天。

#### Scenario: 首次访问
- **WHEN** 用户进入聊天页
- **THEN** 显示："你可以随便问我点东西。不用太正式，技术、想法、或者一些比较个人的问题都可以。"
- **THEN** 不包含："你好"、"AI"、"帮助"

#### Scenario: 回访用户
- **WHEN** 用户返回聊天页
- **THEN** 显示简短欢迎："你回来了。上次聊到哪了？"
- **THEN** 暗示对话连续性，不生硬

### Requirement: UI 布局 - 删除左侧栏

系统 SHALL 删除左侧会话历史栏，改成沉浸式单栏布局。

#### Scenario: 聊天页面
- **WHEN** 用户进入聊天页
- **THEN** 顶部：人格句 + 返回入口
- **THEN** 中间：欢迎区（人格句 + 欢迎语 + 推荐问题）
- **THEN** 中间：对话流
- **THEN** 底部：输入框（固定）

### Requirement: 对话气泡样式

对话消息 SHALL 采用更像"段落输出"的样式，而非传统 IM 气泡。

#### Scenario: 用户消息
- **WHEN** 显示用户消息
- **THEN** 右对齐，浅色背景，柔和圆角

#### Scenario: AI 消息
- **WHEN** 显示 AI 消息
- **THEN** 左对齐，无边框或极弱背景，像自然段落输出
- **THEN** 不是传统气泡感，是"人在写东西"的质感

### Requirement: 排版规范

系统 SHALL 使用以下排版规范：

- **宽度限制**：`max-width: 720px`，居中
- **行距**：`line-height: 1.75`
- **消息间距**：每条 AI 回复 `margin-bottom: 16px`
- **字体栈**：
  ```
  -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC", "Inter", sans-serif
  ```

### Requirement: 输入框样式

输入框 SHALL 使用以下样式：

- 圆角边框
- 内阴影效果
- 微弱边框
- hover 高亮
- 底部固定

---

## REMOVED Requirements

### Requirement: 左侧会话栏

左侧会话历史栏 SHALL 被移除。
**Reason**: 破坏沉浸感，强化工具感，与"个人人格入口"定位冲突
**Migration**: 删除组件，保留会话切换功能（通过其他方式）

### Requirement: AI 助手暗示

任何暗示"这是 AI 回复"的表达 SHALL 被移除。
**Reason**: 与"AI 就是我本人"的核心原则冲突
**Migration**: 彻底移除，包括 prompt 中的"你不是 AI"改为"你就是本人"

---

## 优先级

### P0（必须先做）
1. 修改 prompt.ts：强制禁止 AI 自我暴露 + 改欢迎语
2. 删除左侧栏：简化页面结构
3. 加推荐问题入口

### P1
1. 调整对话 UI：去 IM 气泡感
2. 加宽度限制 + 优化排版
3. 优化输入框样式

### P2（暂不处理）
- RAG 接入（文章推荐）
- 对话 → 内容连接