# Tasks

## P0: AI 对话核心（最先完成）

### Task 1: ChatPage 页面框架
- [ ] 创建 `app/chat/page.tsx` 页面框架
- [ ] 导入 ChatHeader、WelcomeSection、MessageList、ChatInput 组件
- [ ] 设置基本布局结构

### Task 2: ChatHeader 组件
- [ ] 创建 `components/chat/ChatHeader.tsx`
- [ ] 添加左侧返回首页按钮
- [ ] 添加中间标题"和我聊聊"
- [ ] 设置样式和布局

### Task 3: MessageList 组件
- [ ] 创建 `components/chat/MessageList.tsx`
- [ ] 实现消息列表管理
- [ ] 添加自动滚动功能
- [ ] 集成 useChat hook

### Task 4: MessageItem 组件
- [ ] 创建 `components/chat/MessageItem.tsx`
- [ ] 区分 user（靠右）和 assistant（靠左）样式
- [ ] 支持流式输出样式
- [ ] 处理 relatedPosts 显示

### Task 5: ChatInput 组件
- [ ] 创建 `components/chat/ChatInput.tsx`
- [ ] 实现输入框
- [ ] Enter 发送，Shift+Enter 换行
- [ ] 发送按钮状态管理
- [ ] 底部固定定位

### Task 6: API 接通
- [ ] 完善 `lib/api.ts` 或使用现有 API
- [ ] 对接 `/api/chat` 接口
- [ ] 处理流式响应
- [ ] 错误处理

### Task 7: 类型定义
- [ ] 创建 `types/chat.ts`
- [ ] 定义 Message 类型
- [ ] 定义相关接口

---

## P1: 引导系统

### Task 8: WelcomeSection 组件
- [ ] 创建 `components/chat/WelcomeSection.tsx`
- [ ] 设计欢迎语文案（自然、像朋友聊天）
- [ ] 整合推荐问题展示

### Task 9: useChat Hook 重构
- [ ] 重构 `hooks/useChat.ts`
- [ ] 管理消息列表状态
- [ ] 处理发送逻辑
- [ ] 管理 loading/error 状态

### Task 10: useStreaming Hook
- [ ] 创建 `hooks/useStreaming.ts`
- [ ] 处理流式数据拼接
- [ ] 实时更新 AI 回复

### Task 11: useAutoScroll Hook
- [ ] 创建 `hooks/useAutoScroll.ts`
- [ ] 新消息自动滚动到底部
- [ ] 处理快速连续消息

### Task 12: 推荐问题配置
- [ ] 设计推荐问题列表（3-6个）
- [ ] 覆盖不同话题（生活、技术、思考）
- [ ] 点击跳转输入框

---

## P2: 内容联动

### Task 13: RelatedPostCard 组件
- [ ] 创建 `components/chat/RelatedPostCard.tsx`
- [ ] 显示文章标题、摘要、标签
- [ ] 点击跳转文章页
- [ ] 样式设计

### Task 14: RAG 集成
- [ ] 完善 `lib/rag.ts`
- [ ] 对接文章检索
- [ ] 返回相关文章数据

### Task 15: 文章类型定义
- [ ] 创建 `types/post.ts`
- [ ] 定义 Post 类型
- [ ] 定义相关接口

---

## P3: 首页重构

### Task 16: HomePage 页面框架
- [ ] 重构 `app/page.tsx`
- [ ] 设置首页布局结构
- [ ] 导入各组件

### Task 17: HeroSection 组件
- [ ] 创建 `components/home/HeroSection.tsx`
- [ ] 主标题文案（人格气质）
- [ ] 副标题说明
- [ ] 主视觉设计

### Task 18: AiEntryCard 组件（首页）
- [ ] 创建 `components/home/AiEntryCard.tsx`
- [ ] 首页 AI 引导卡片
- [ ] 欢迎语 + 推荐问题
- [ ] 点击跳转 ChatPage

### Task 19: EntryCards 组件
- [ ] 创建 `components/home/EntryCards.tsx`
- [ ] "写生活"入口卡
- [ ] "技术思考"入口卡
- [ ] "关于我"入口卡

### Task 20: RecentPosts 组件
- [ ] 创建 `components/home/RecentPosts.tsx`
- [ ] 获取最近 3-4 篇文章
- [ ] PostCard 文章卡片组件
- [ ] 展示文章列表

### Task 21: Header 布局组件
- [ ] 创建/重构 `components/layout/Header.tsx`
- [ ] 站点名/名字
- [ ] 导航：笔记、技术、简历、关于

### Task 22: Footer 布局组件
- [ ] 创建 `components/layout/Footer.tsx`
- [ ] 基本页脚内容

---

## P4: 内容页重构（可选，V2）

### Task 23: ArticlePage 页面框架
- [ ] 重构 `app/article/[slug]/page.tsx`
- [ ] 设置布局结构

### Task 24: ArticleHeader 组件
- [ ] 创建 `components/article/ArticleHeader.tsx`
- [ ] 标题、标签、时间展示

### Task 25: ArticleContent 组件
- [ ] 创建 `components/article/ArticleContent.tsx`
- [ ] Markdown 渲染
- [ ] 代码块支持

### Task 26: TableOfContents 组件
- [ ] 创建 `components/article/TableOfContents.tsx`
- [ ] 目录生成
- [ ] 点击跳转

### Task 27: RelatedPosts 组件（内容页）
- [ ] 创建 `components/article/RelatedPosts.tsx`
- [ ] 侧栏相关文章
- [ ] AI 追问入口

---

## Task Dependencies

### P0 依赖关系
- Task 1 → Task 2, 3, 5
- Task 7 → Task 3
- Task 6 → Task 3, 5

### P1 依赖关系
- Task 8 → Task 12
- Task 9, 10, 11 可并行
- Task 8 → Task 9（useChat 管理欢迎区显示）

### P2 依赖关系
- Task 13 → Task 14（RAG 返回数据）
- Task 15 → Task 13

### P3 依赖关系
- Task 17 → Task 22（Header）
- Task 18 → Task 8（复用 WelcomeSection）
- Task 19, 20 → Task 21（Header）
- Task 16（最后）→ Task 17, 18, 19, 20

---

## 开发顺序建议

1. **P0** 优先完成，确保能对话
2. **P1** 其次，确保用户能开口
3. **P2** 第三，确保内容联动
4. **P3** 最后，完成首页
5. **P4** V2 扩展

每个 P 阶段完成后可选择上线，逐步迭代。
