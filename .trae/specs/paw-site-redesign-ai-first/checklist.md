# Checklist

## P0: AI 对话核心 ✅

### ChatPage 页面框架 ✅
- [x] `app/chat/page.tsx` 页面框架创建
- [x] 基本布局结构设置

### ChatHeader 组件 ✅
- [x] 返回首页按钮
- [x] 中间标题"和我聊聊"
- [x] 样式和布局

### MessageList 组件 ✅
- [x] 消息列表管理
- [x] 自动滚动功能
- [x] 集成 useChat hook

### MessageItem 组件 ✅
- [x] user（靠右）和 assistant（靠左）样式
- [x] 流式输出样式支持
- [x] relatedPosts 显示处理

### ChatInput 组件 ✅
- [x] 输入框实现
- [x] Enter 发送，Shift+Enter 换行
- [x] 发送按钮状态管理
- [x] 底部固定定位

### API 接通 ✅
- [x] `/api/chat` 接口对接
- [x] 流式响应处理
- [x] 错误处理

### 类型定义 ✅
- [x] `types/chat.ts` 创建
- [x] Message 类型定义

---

## P1: 引导系统 ✅

### WelcomeSection 组件 ✅
- [x] 欢迎语文案（自然、像朋友聊天）
- [x] 推荐问题展示整合

### useChat Hook ✅
- [x] 消息列表状态管理
- [x] 发送逻辑处理
- [x] loading/error 状态管理

### useStreaming Hook ✅
- [x] 流式数据拼接
- [x] 实时更新 AI 回复

### useAutoScroll Hook ✅
- [x] 新消息自动滚动
- [x] 快速连续消息处理

### 推荐问题配置 ✅
- [x] 推荐问题列表（3-6个）
- [x] 覆盖不同话题
- [x] 点击交互

---

## P2: 内容联动 ✅

### RelatedPostCard 组件 ✅
- [x] 文章标题、摘要、标签显示
- [x] 点击跳转文章页
- [x] 样式设计

### RAG 集成 ✅
- [x] `lib/rag.ts` 完善
- [x] 文章检索对接
- [x] 返回相关文章数据

### 文章类型定义 ✅
- [x] `types/post.ts` 创建
- [x] Post 类型定义

---

## P3: 首页重构 ✅

### HomePage 页面框架 ✅
- [x] `app/page.tsx` 重构
- [x] 首页布局结构

### HeroSection 组件 ✅
- [x] 主标题文案
- [x] 副标题说明
- [x] 主视觉设计

### AiEntryCard 组件（首页）✅
- [x] 首页 AI 引导卡片
- [x] 欢迎语 + 推荐问题
- [x] 点击跳转 ChatPage

### EntryCards 组件 ✅
- [x] "写生活"入口卡
- [x] "技术思考"入口卡
- [x] "关于我"入口卡

### RecentPosts 组件 ✅
- [x] 最近 3-4 篇文章获取
- [x] PostCard 文章卡片
- [x] 文章列表展示

### Header 布局组件 ✅
- [x] 站点名/名字
- [x] 导航链接

### Footer 布局组件 ✅
- [x] 基本页脚内容

---

## P4: 内容页重构（可选）❌ 未开始

### ArticlePage 页面框架
- [ ] 文章页布局结构

### ArticleHeader 组件
- [ ] 标题展示
- [ ] 标签展示
- [ ] 时间展示

### ArticleContent 组件
- [ ] Markdown 渲染
- [ ] 代码块支持

### TableOfContents 组件
- [ ] 目录生成
- [ ] 点击跳转

### RelatedPosts 组件（内容页）
- [ ] 侧栏相关文章
- [ ] AI 追问入口

---

## 集成验证 ✅

### 功能完整性 ✅
- [x] 能完整对话
- [x] 用户能开口（推荐问题）
- [x] AI 的人格感体现
- [x] 相关文章推荐（RelatedPostCard 已创建）
- [x] 错误状态处理
- [x] 手机端可用

### UI/UX 验收 ✅
- [x] 首页是入口页而非列表页
- [x] AI 页面有欢迎语
- [x] 推荐问题可见
- [x] 流式输出流畅
- [x] 相关文章可点击
- [x] 移动端布局正常

### 代码质量 ✅
- [x] 组件职责单一
- [x] 无 console.error
- [x] lint 检查通过
- [x] TypeScript 类型完整

---

## Anti-Pattern 检查 ✅

- [x] 无客服感
- [x] 无问答机器人感
- [x] 无工具页感
- [x] 无"我是AI助手"式开场
- [x] 无冗长欢迎语
- [x] 无让用户自己思考开口的情况

---

## V1 MVP 验收标准 ✅

1. ✅ 用户进 AI 页后能立刻知道能问什么
2. ✅ 能完成一次完整对话
3. ✅ 能看到 AI 的人格感
4. ✅ AI 能引用或推荐至少一篇相关内容（RelatedPostCard 已创建）
5. ✅ 错误状态不崩
6. ✅ 手机端可用

---

## V2 扩展方向

- [ ] ArticlePage 内容页重构
- [ ] TableOfContents 目录组件
- [ ] AI 追问入口
- [ ] 复杂记忆系统
- [ ] 多轮长期画像
- [ ] 用户登录
- [ ] 复杂收藏体系
- [ ] 社交化互动
- [ ] 复杂人格切换器
- [ ] 强度滑杆（温和 ↔ 理性）
- [ ] 自动模式切换
- [ ] 文章引用高亮
- [ ] 对话收藏
- [ ] 会话导出
- [ ] 历史记录
