# Checklist

## P0: AI 对话核心

### ChatPage 页面框架
- [ ] `app/chat/page.tsx` 页面框架创建
- [ ] 基本布局结构设置

### ChatHeader 组件
- [ ] 返回首页按钮
- [ ] 中间标题"和我聊聊"
- [ ] 样式和布局

### MessageList 组件
- [ ] 消息列表管理
- [ ] 自动滚动功能
- [ ] 集成 useChat hook

### MessageItem 组件
- [ ] user（靠右）和 assistant（靠左）样式
- [ ] 流式输出样式支持
- [ ] relatedPosts 显示处理

### ChatInput 组件
- [ ] 输入框实现
- [ ] Enter 发送，Shift+Enter 换行
- [ ] 发送按钮状态管理
- [ ] 底部固定定位

### API 接通
- [ ] `/api/chat` 接口对接
- [ ] 流式响应处理
- [ ] 错误处理

### 类型定义
- [ ] `types/chat.ts` 创建
- [ ] Message 类型定义

---

## P1: 引导系统

### WelcomeSection 组件
- [ ] 欢迎语文案（自然、像朋友聊天）
- [ ] 推荐问题展示整合

### useChat Hook
- [ ] 消息列表状态管理
- [ ] 发送逻辑处理
- [ ] loading/error 状态管理

### useStreaming Hook
- [ ] 流式数据拼接
- [ ] 实时更新 AI 回复

### useAutoScroll Hook
- [ ] 新消息自动滚动
- [ ] 快速连续消息处理

### 推荐问题配置
- [ ] 推荐问题列表（3-6个）
- [ ] 覆盖不同话题
- [ ] 点击交互

---

## P2: 内容联动

### RelatedPostCard 组件
- [ ] 文章标题、摘要、标签显示
- [ ] 点击跳转文章页
- [ ] 样式设计

### RAG 集成
- [ ] `lib/rag.ts` 完善
- [ ] 文章检索对接
- [ ] 返回相关文章数据

### 文章类型定义
- [ ] `types/post.ts` 创建
- [ ] Post 类型定义

---

## P3: 首页重构

### HomePage 页面框架
- [ ] `app/page.tsx` 重构
- [ ] 首页布局结构

### HeroSection 组件
- [ ] 主标题文案
- [ ] 副标题说明
- [ ] 主视觉设计

### AiEntryCard 组件（首页）
- [ ] 首页 AI 引导卡片
- [ ] 欢迎语 + 推荐问题
- [ ] 点击跳转 ChatPage

### EntryCards 组件
- [ ] "写生活"入口卡
- [ ] "技术思考"入口卡
- [ ] "关于我"入口卡

### RecentPosts 组件
- [ ] 最近 3-4 篇文章获取
- [ ] PostCard 文章卡片
- [ ] 文章列表展示

### Header 布局组件
- [ ] 站点名/名字
- [ ] 导航链接

### Footer 布局组件
- [ ] 基本页脚内容

---

## P4: 内容页重构（可选）

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

## 集成验证

### 功能完整性
- [ ] 能完整对话
- [ ] 用户能开口（推荐问题）
- [ ] AI 的人格感体现
- [ ] 相关文章推荐
- [ ] 错误状态不崩
- [ ] 手机端可用

### UI/UX 验收
- [ ] 首页是入口页而非列表页
- [ ] AI 页面有欢迎语
- [ ] 推荐问题可见
- [ ] 流式输出流畅
- [ ] 相关文章可点击
- [ ] 移动端布局正常

### 代码质量
- [ ] 组件职责单一
- [ ] 无 console.error
- [ ] lint 检查通过
- [ ] TypeScript 类型完整

---

## Anti-Pattern 检查

- [ ] 无客服感
- [ ] 无问答机器人感
- [ ] 无工具页感
- [ ] 无"我是AI助手"式开场
- [ ] 无冗长欢迎语
- [ ] 无让用户自己思考开口的情况
