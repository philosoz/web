# 个人网站 AI 优先重构规范

## Why
当前网站定位不清晰，作为个人网站需要明确"AI 驱动的数字人格入口"这一核心定位。不是做聊天工具，而是做"人格入口 + 内容中枢 + 阅读导航"，让访客通过 AI 快速理解作者本人、内容和思考。

## What Changes
- 重构首页为"入口页"而非列表页，聚焦 AI 引导
- 新建完整 AI 对话页（ChatPage）包含欢迎语、推荐问题、流式对话、相关文章推荐
- 重构内容页结构为"正文 + 侧栏推荐"
- 定义完整的 React 组件树和文件目录结构
- 制定开发优先级：P0(AI对话) → P1(引导系统) → P2(内容联动) → P3(首页)

## Impact
- Affected specs: 全站结构重构
- Affected code:
  - `app/page.tsx` - 首页重构
  - `app/chat/page.tsx` - 新建 AI 对话页
  - `app/article/[slug]/page.tsx` - 内容页重构
  - `components/layout/` - 布局组件
  - `components/home/` - 首页组件
  - `components/chat/` - AI 页面组件
  - `components/article/` - 内容页组件
  - `hooks/` - 核心 hooks
  - `lib/api.ts` - API 封装
  - `lib/rag.ts` - RAG 检索
  - `lib/prompt.ts` - 已有，无需修改

---

## ADDED Requirements

### Requirement: 首页（入口页）
首页必须是"入口页"而非内容列表页，核心职责是引导用户进入 AI 或内容区。

#### Scenario: 首次访问
- **WHEN** 用户首次打开首页
- **THEN** 看到主标题人格文案 + AI 入口按钮 + 内容入口卡片 + 最近文章

### Requirement: 首页 HeroSection
HeroSection 负责第一印象，传达人格气质。

#### Scenario: 主视觉展示
- **WHEN** 用户看到首页第一屏
- **THEN** 看到主标题（如"我在记录一些还没完全想清楚的事情"）+ 副标题 + AI 入口按钮"和我聊聊"

### Requirement: AI 引导卡片（AiEntryCard）
AI 入口是首页最核心的转化点。

#### Scenario: AI 引导卡展示
- **WHEN** 用户看到 AI 引导卡
- **THEN** 看到欢迎语 + 3-6 个推荐问题 + 点击跳转 ChatPage

### Requirement: 内容入口卡片（EntryCards）
三张入口卡导航内容模块。

#### Scenario: 内容入口
- **WHEN** 用户看到 EntryCards
- **THEN** 看到"写生活"、"技术思考"、"关于我"三张入口卡

### Requirement: 最近文章区（RecentPosts）
给非 AI 用户提供内容发现路径。

#### Scenario: 最近文章展示
- **WHEN** 用户滚动到文章区
- **THEN** 看到 3-4 篇最近文章卡片

---

### Requirement: AI 对话页（ChatPage）
AI 页是核心对话页，采用单列沉浸式布局。

#### Scenario: 进入 AI 页面
- **WHEN** 用户进入 /chat 页面
- **THEN** 看到顶部栏 + 欢迎区 + 对话区 + 输入区

### Requirement: ChatHeader 顶部栏
ChatHeader 提供导航和页面标题。

#### Scenario: 顶部栏展示
- **WHEN** 用户在 AI 页面
- **THEN** 看到左侧返回按钮 + 中间标题"和我聊聊"

### Requirement: WelcomeSection 欢迎区
欢迎区是冷启动破冰的关键，没有它用户不会开口。

#### Scenario: 欢迎区展示
- **WHEN** 用户进入 AI 页面且无历史消息
- **THEN** 显示欢迎语 + 3-6 个推荐问题按钮

### Requirement: MessageList 对话区
MessageList 是最核心的组件，管理所有消息流。

#### Scenario: 对话进行
- **WHEN** 用户发送消息
- **THEN** 显示用户消息（靠右）+ AI 消息（靠左）+ 相关文章卡片

### Requirement: 流式输出
AI 回复必须支持流式输出，实时显示。

#### Scenario: AI 流式回复
- **WHEN** AI 生成回复中
- **THEN** 实时显示输出内容，页面不跳动

### Requirement: ChatInput 输入区
底部固定输入框，移动端必须始终可见。

#### Scenario: 输入消息
- **WHEN** 用户输入消息
- **THEN** Enter 发送，Shift+Enter 换行，发送按钮可点击

### Requirement: 相关文章推荐（RelatedPostCard）
在对话中插入文章推荐，连接 AI 和内容。

#### Scenario: 推荐文章触发
- **WHEN** AI 回复后需要推荐文章
- **THEN** 在消息下方插入 RelatedPostCard，显示 1-3 篇相关文章

### Requirement: 状态管理
需要处理多种状态：思考中、加载中、错误、无答案、空状态。

#### Scenario: 各种状态展示
- **WHEN** 对话过程出现各种状态
- **THEN** 显示 TypingIndicator / ErrorState / NoAnswerState / EmptyState

---

### Requirement: 内容页结构
内容页统一采用"标题 + 正文 + 侧栏推荐"结构。

#### Scenario: 查看文章
- **WHEN** 用户查看文章详情
- **THEN** 看到文章标题 + 标签 + 时间 + 正文 + 目录 + 侧栏推荐

### Requirement: ArticleHeader 文章头部
文章头部显示元数据。

#### Scenario: 文章头部展示
- **WHEN** 用户看到文章
- **THEN** 显示标题 + 标签 + 时间

### Requirement: TableOfContents 目录
长文提供目录导航。

#### Scenario: 目录使用
- **WHEN** 文章有多个章节
- **THEN** 显示目录，点击跳转

### Requirement: RelatedPosts 相关文章
侧栏显示相关文章推荐。

#### Scenario: 相关文章展示
- **WHEN** 用户阅读文章
- **THEN** 侧栏看到相关文章 + AI 追问入口

---

## MODIFIED Requirements

### Requirement: 现有组件整合
当前存在的组件需要按新结构重组。

#### Scenario: 组件归属
- **WHEN** 梳理现有组件
- **THEN** 按新目录结构分类到 layout/home/chat/article 目录

---

## 文件目录结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页（重构）
│   ├── chat/
│   │   └── page.tsx           # AI 对话页（新建）
│   └── article/
│       └── [slug]/page.tsx    # 内容页（重构）
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── AiEntryCard.tsx
│   │   ├── EntryCards.tsx
│   │   └── RecentPosts.tsx
│   │
│   ├── chat/
│   │   ├── ChatHeader.tsx
│   │   ├── WelcomeSection.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageItem.tsx
│   │   ├── ChatInput.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── RelatedPostCard.tsx
│   │
│   └── article/
│       ├── ArticleHeader.tsx
│       ├── ArticleContent.tsx
│       ├── TableOfContents.tsx
│       └── RelatedPosts.tsx
│
├── hooks/
│   ├── useChat.ts             # 核心对话逻辑
│   ├── useStreaming.ts        # 流式处理
│   └── useAutoScroll.ts       # 自动滚动
│
├── lib/
│   ├── api.ts                 # API 封装
│   ├── rag.ts                 # RAG 检索（已有）
│   └── prompt.ts              # 系统提示词（已有）
│
└── types/
    ├── chat.ts                # 对话类型
    └── post.ts                # 文章类型
```

---

## 开发优先级

### P0 - AI 对话核心（最先完成）
- ChatPage
- MessageList
- ChatInput
- API 接通
**目标**：能完整对话

### P1 - 引导系统
- WelcomeSection
- 推荐问题
**目标**：用户能开口

### P2 - 内容联动
- RelatedPostCard
- RAG 集成
**目标**：AI + 内容联动

### P3 - 首页
- Hero
- AI 入口卡
- EntryCards
- RecentPosts
**目标**：入口页完成

---

## 核心数据结构

```ts
type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  relatedPosts?: Post[]
}

type Post = {
  slug: string
  title: string
  excerpt?: string
  tags?: string[]
  date?: string
}
```

---

## Anti-Pattern（严格禁止）

- ❌ 客服感
- ❌ 问答机器人感
- ❌ 工具页感
- ❌ "我是 AI 助手"式开场
- ❌ 冗长欢迎语
- ❌ 无推荐问题让用户自己思考开口

---

## 成功标准

V1 MVP 验收标准：
1. 用户进 AI 页后能立刻知道能问什么
2. 能完成一次完整对话
3. 能看到 AI 的人格感
4. AI 能引用或推荐至少一篇相关内容
5. 错误状态不崩
6. 手机端可用
