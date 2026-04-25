# 个人博客网站 - 任务清单

## 阶段一：项目初始化与设计系统

- [ ] **Task 1.1**: 初始化 Next.js 项目
  - 使用 `npx create-next-app@latest` 创建项目
  - 选择 TypeScript、App Router、ESLint、Prettier
  - 配置 `tsconfig.json` 严格模式
  - 配置 `next.config.js` 基础设置
  
- [ ] **Task 1.2**: 建立项目文件夹结构（基于您的架构建议）
  - `/app` - 页面路由
    - `app/page.tsx` - 首页
    - `app/notes/page.tsx` - 我的笔记
    - `app/thinking/page.tsx` - 技术思考
    - `app/resume/page.tsx` - 简历
    - `app/about/page.tsx` - 关于我
    - `app/message/page.tsx` - 留言板
  - `/components` - 通用组件
  - `/features` - 业务模块
    - `/features/home` - 首页模块（HeroSection, PawInteraction, EntryCards）
    - `/features/content` - 文章系统（ArticleCard, ArticleList, ArticleDetail, TOC）
    - `/features/resume` - 简历模块（ResumeSection, SkillList, Experience）
  - `/layouts` - 页面布局（MainLayout）
  - `/hooks` - 自定义 Hooks（usePaw, useCounter, useScrollAnimation）
  - `/lib` - 工具函数和数据库
  - `/styles` - 全局样式
  - `/public` - 静态资源（paw.svg）
  - `/content` - 博客文章 (notes, tech)
  - `/data` - 结构化数据（resume.json）
  
- [ ] **Task 1.3**: 创建全局 CSS 设计系统
  - 在 `globals.css` 中定义所有 CSS Variables
  - 颜色系统
  - 字体系统
  - 间距系统
  - 圆角与阴影
  - 动效参数
  - 重置样式和基础排版
  
- [ ] **Task 1.4**: 安装必要依赖
  - `gray-matter` - 解析 Markdown 头部信息
  - `remark` + `remark-html` - Markdown 转换为 HTML
  - `better-sqlite3` - SQLite 数据库
  - `@types/better-sqlite3` - TypeScript 类型定义
  - `react-intersection-observer` - 滚动动画检测
  - `framer-motion` - 动效库（爪印、过渡动画）
  - `tailwindcss` - CSS 框架
  - `autoprefixer` + `postcss` - Tailwind 依赖
  
- [ ] **Task 1.5**: 配置 Tailwind CSS
  - 初始化 Tailwind：`npx tailwindcss init -p`
  - 配置 `tailwind.config.js`：
    - 扩展 colors 使用 CSS Variables
    - 扩展 boxShadow 使用 CSS Variables
    - 扩展 transitionTimingFunction
    - 配置 content 路径
  
- [ ] **Task 1.6**: 创建 CSS 文件结构
  - `styles/tokens.css` - 设计变量（颜色/间距/字体/动效）
  - `styles/base.css` - 基础重置样式
  - `styles/components.css` - 组件封装类（避免 class 爆炸）
  - `styles/animations.css` - 动效定义
  - `styles/globals.css` - 全局样式，导入所有 CSS 文件

## 阶段二：核心组件开发

- [ ] **Task 2.1**: MainLayout 布局组件
  - 包含 Header 和 Footer
  - 页面容器和响应式布局
  - 统一边距和最大宽度
  
- [ ] **Task 2.2**: Header 组件
  - Logo/名字展示
  - 导航菜单（桌面端）
  - 汉堡菜单（移动端）
  - 导航 hover 效果（文字变深 + 细线）
  - 滚动时背景模糊效果（backdrop-filter）
  - 响应式适配
  
- [ ] **Task 2.3**: HeroSection 组件
  - 主标题和副标题展示
  - 大留白布局（至少 40% 空白）
  - 文本层次设计
  - 响应式字体大小
  
- [ ] **Task 2.4**: EntryCards 入口卡片组件（使用 Framer Motion）
  - 三个卡片结构（笔记、技术、简历）
  - 图标/线描插图区域
  - 标题和描述
  - 进入按钮 →
  - 使用 `motion.div` 包装
  - `whileHover`: `{ y: -6, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }`
  - `whileTap`: `{ scale: 0.98 }`
  - `transition`: `{ type: "spring", stiffness: 200, damping: 20 }`
  - `className="bg-white rounded-xl p-6"`
  - 各卡片色彩区分（暖色/雾蓝/灰白）
  
- [ ] **Task 2.5**: Footer 组件
  - 版权信息
  - 简洁设计

## 阶段三：爪印互动系统（核心模块）

- [ ] **Task 3.1**: 创建爪印 SVG 资源
  - 设计低饱和、线稿风格的爪印
  - 保存为 `/public/paw.svg`
  
- [ ] **Task 3.2**: usePaw Hook 开发（核心逻辑）
  - `addPaw(x, y)` - 添加爪印
  - `removeOldest()` - 删除最早的爪印
  - `limit = 6` - 最大数量控制
  - 爪印数据结构：`{ id, x, y }`
  - 自动清理：超过 6 个时删除最早的
  - 生命周期：创建 → 显示 → 3秒 → fade → 删除
  
- [ ] **Task 3.3**: PawItem 单个爪印组件（使用 Framer Motion）
  - SVG 爪印渲染或使用 🐾 emoji
  - `motion.div` 包装
  - `initial`: `{ opacity: 0, scale: 0.8 }`
  - `animate`: `{ opacity: 0.9, scale: 1 }`
  - `exit`: `{ opacity: 0 }`
  - `transition`: `{ duration: 0.4, ease: [0.22,1,0.36,1] }`
  - 定位控制（x, y 坐标，绝对定位）
  - `className="absolute pointer-events-none"`
  
- [ ] **Task 3.4**: PawInteraction 主组件（使用 Framer Motion）
  - 监听页面点击事件
  - 调用 usePaw hook
  - 使用 `AnimatePresence` 包裹 PawItem 列表
  - 渲染多个 PawItem
  - 防止爪印叠加在文字或可交互元素上
  - `className="relative w-full h-[300px] cursor-crosshair"`
  - 响应式适配
  
- [ ] **Task 3.5**: FadeInSection 滚动渐入组件（使用 Framer Motion）
   - 使用 `whileInView` 触发渐入
   - `initial`: `{ opacity: 0, y: 20 }`
   - `whileInView`: `{ opacity: 1, y: 0 }`
   - `transition`: `{ duration: 0.6 }`
   - `viewport={{ once: true }}` - 只触发一次
   
 - [ ] **Task 3.6**: useCounter Hook 开发
   - 计数状态管理（useState）
   - API 调用获取/更新计数
   - "+1" 气泡动画触发（showPlus 状态）
  
 - [ ] **Task 3.7**: PawCounter 计数组件（使用 Framer Motion）
   - 右下角固定位置（fixed bottom-6 right-6）
   - 展示："今天有 N 只小狗来过 🐾"
   - "+1" 气泡使用 `AnimatePresence` + `motion.div`
   - `initial`: `{ opacity: 0, y: 10 }`
   - `animate`: `{ opacity: 1, y: -10 }`
   - `exit`: `{ opacity: 0 }`
   - `transition`: `{ duration: 0.6 }`
   - 数字滚动动画
   - 响应式位置调整

## 阶段四：数据库与 API

- [ ] **Task 4.1**: SQLite 数据库初始化
  - 创建数据库连接模块
  - 定义数据库表结构
  - 创建初始化脚本
  
- [ ] **Task 4.2**: 爪印 API 开发
  - `POST /api/paw` - 记录爪印点击
  - `GET /api/paw/count` - 获取今日计数
  - 数据验证
  - 错误处理
  
- [ ] **Task 4.3**: 留言板 API 开发
  - `GET /api/guestbook` - 获取已批准留言
  - `POST /api/guestbook` - 提交留言
  - `PATCH /api/guestbook/:id` - 审核留言
  - 输入验证
  - SQL 注入防护

## 阶段五：内容系统

- [ ] **Task 5.1**: Markdown 解析工具
  - 创建 `lib/markdown.ts` 工具
  - 解析文章头部信息（gray-matter）
  - 转换 Markdown 为 HTML
  - 支持代码块语法高亮
  
- [ ] **Task 5.2**: 创建示例文章
  - 在 `/content/notes` 创建 2-3 篇示例生活笔记
  - 在 `/content/tech` 创建 2-3 篇示例技术文章
  - 包含完整的 frontmatter（title, date, tags, category, excerpt）
  
- [ ] **Task 5.3**: 创建简历数据结构
  - 在 `/data/resume.json` 定义完整简历结构
  - 包含个人信息、技能、经历、项目、联系方式
  
- [ ] **Task 5.4**: useScrollAnimation Hook 开发
  - 使用 `react-intersection-observer`
  - `fadeIn` + `translateY(20px)` 效果
  - 交错延迟配置
  - 性能优化（will-change）

## 阶段六：页面开发

- [ ] **Task 6.1**: 首页开发
  - 组装 Header
  - 组装 HeroSection
  - 组装 InteractionZone
  - 组装 EntryCards
  - 组装 Footer
  - 响应式适配
  
- [ ] **Task 6.2**: 我的笔记页面 (`/notes`)
  - 笔记列表展示
  - 时间倒序排列
  - 标签筛选功能
  - 卡片样式
  - 加载动画
  
- [ ] **Task 6.3**: 技术思考页面 (`/tech`)
  - 技术文章列表
  - 更规整的布局
  - 右侧 sticky 目录导航
  - 代码块支持
  
- [ ] **Task 6.4**: 文章详情页 (`/notes/[slug]`, `/tech/[slug]`)
  - 文章内容展示
  - 标题、时间、标签
  - Markdown 渲染
  - 代码高亮
  - 阅读体验优化
  
- [ ] **Task 6.5**: 简历页面 (`/resume`)
  - 从 JSON 加载数据
  - 左右结构布局（桌面端）
  - 单列布局（移动端）
  - 各模块展示（个人信息、技能、经历、项目）
  
- [ ] **Task 6.6**: 关于我页面 (`/about`)
  - 个人介绍
  - 理念阐述
  - 联系方式
  
- [ ] **Task 6.7**: 留言板页面 (`/guestbook`)
  - 留言表单
  - 留言列表展示
  - 提交功能
  - 审核提示

## 阶段六点五：AI 对话模块（数字分身系统）

- [ ] **Task 6.8**: 创建 AI Adapter 抽象层
  - 定义 `AIAdapter` 接口
  - 创建 `MiniMaxAdapter` 实现类
  - 创建 `ClaudeAdapter` 预留实现
  - 创建 `OpenAIAdapter` 预留实现
  - 配置环境变量支持多模型切换
  
- [ ] **Task 6.9**: 创建 useChat Hook
  - 参考您提供的 `useChat.ts` 实现
  - 消息状态管理：`messages` state
  - 加载状态：`loading` state
  - 发送消息：`sendMessage` async 函数
  - 流式读取：使用 `response.body?.getReader()`
  - 逐步更新消息内容（流式输出）
  - 返回 `{ messages, sendMessage, loading }`
  
- [ ] **Task 6.10**: 创建 System Prompt 配置
  - 创建 `prompts/system-prompt.ts`
  - 定义完整的人设 Prompt
  - 定义边界处理 Prompt
  - 定义特殊情况处理 Prompt
  - 支持动态注入网站内容
  
- [ ] **Task 6.11**: 开发对话 API (`/api/chat`)
  - POST `/api/chat` - 流式对话接口
    - 接收 `messages` 数组
    - 获取用户最新输入
    - 调用 `searchRelevant` 检索相关文章（基于 RAG）
    - 构建 prompt（system prompt + context + messages）
    - 调用 AI 模型（MiniMax/Claude/OpenAI）
    - 流式返回响应（SSE）
    - 错误处理和重试机制
    - 请求限流
  - DELETE `/api/chat` - 清空对话
  - GET `/api/chat/recommendations` - 推荐问题
  
- [ ] **Task 6.11.1**: 开发 RAG 检索系统
  - 创建 `lib/embedding.ts` - Embedding 生成工具
    - 使用 OpenAI embeddings API（或 MiniMax embeddings）
    - `generateEmbedding(text)` 函数
    - 文本切片函数 `splitText(text, size=500)`
  - 创建 `lib/vector-store.ts` - 向量存储管理
    - 向量数据库结构
    - `searchRelevant(query, vectors, topK=3)` 检索函数
    - 余弦相似度计算
    - 排序和截取最相关结果
  - 创建 `scripts/generate-embeddings.ts` - 一次性生成脚本
    - 读取所有文章
    - 切片并生成 embedding
    - 存储到向量数据库
  
- [ ] **Task 6.11.2**: 开发 Prompt 拼接逻辑
  - 创建 `lib/prompt.ts` - Prompt 构建工具
  - System prompt 拼接
  - Context 拼接（检索到的文章）
  - 最终 prompt 结构：
    ```typescript
    [
      { role: "system", content: systemPrompt + "\n\n以下是你过去写过的内容：\n" + context },
      ...messages
    ]
    ```
  - Context 格式：
    ```
    【文章标题】
    文章内容片段
    ```
  
- [ ] **Task 6.12**: 开发 ChatMessage 组件
  - 参考您提供的 `ChatMessage.tsx` 实现
  - 用户消息：右对齐，背景 `bg-[var(--bg-soft)]`
  - AI 消息：左对齐，背景透明（极简无边框）
  - 文字颜色：`text-[var(--text-primary)]`
  - `max-w-[80%]` 限制宽度
  - 圆角：`rounded-xl`
  - 内边距：`px-4 py-3`
  - 文字换行：`whitespace-pre-wrap`
  - 行高：`leading-relaxed`
  - 底部间距：`mb-4`
  - 可选：添加复制按钮
  
- [ ] **Task 6.13**: 开发 ChatInput 组件
  - 参考您提供的 `ChatInput.tsx` 实现
  - 顶部边框：`border-t border-[var(--border-light)]`
  - 容器内边距：`p-4`
  - Flex 布局：`flex gap-2`
  - 输入框：
    - `flex-1` 占据剩余空间
    - `px-4 py-2` 内边距
    - 背景：`bg-[var(--bg-soft)]`
    - 圆角：`rounded-md`
    - 无边框：`outline-none`
    - Placeholder 文案："你可以随便问我一些问题…"
  - 发送按钮：
    - `px-4 py-2` 内边距
    - 字号：`text-sm`
    - 圆角：`rounded-md`
    - 背景：`bg-[var(--accent-warm)]`
    - 文字：白色
  - Enter 快捷键支持
  - 发送后清空输入框
  
- [ ] **Task 6.14**: 开发 ChatHeader 组件
  - AI 身份标题
  - 返回按钮（从文章页进入时）
  - 清空对话按钮
  - AI 在线状态指示
  
- [ ] **Task 6.15**: 开发 WelcomeMessage 组件
  - 欢迎语展示
  - 推荐问题列表
  - 点击推荐问题发送
  - 动画效果
  
- [ ] **Task 6.16**: 开发 TypingIndicator 组件
  - 参考您提供的 `TypingIndicator.tsx` 实现
  - 文案："正在想一会儿…"
  - 字号：`text-sm`
  - 颜色：`text-[var(--text-muted)]`
  - 底部间距：`mb-4`
  - 可选：三点加载动画（CSS animation）
  
- [ ] **Task 6.17**: 开发 ChatPage 主页面 (`/chat`)
  - 参考您提供的 `ChatPage.tsx` 实现
  - 使用 `"use client"` 指令
  - 全屏容器：`flex flex-col h-screen bg-[var(--bg-primary)]`
  - Header：
    - `p-4 border-b border-[var(--border-light)]`
    - 文案："和我聊聊"
    - 字号：`text-sm`
    - 颜色：`text-[var(--text-muted)]`
  - 对话区域：
    - `flex-1 overflow-y-auto p-6`
    - `max-w-[800px] mx-auto w-full`
  - 欢迎语（空状态）：
    - 颜色：`text-[var(--text-muted)]`
    - 底部间距：`mb-6`
  - 消息列表：使用 `messages.map` 渲染
  - 加载状态：显示 `TypingIndicator`
  - 底部引用：`ref={bottomRef}`
  - 自动滚动：`useEffect` 监听 `messages` 变化
  - 固定输入框：`ChatInput onSend={sendMessage}`
  - 状态管理：`useChat` Hook
  
- [ ] **Task 6.18**: 开发首页 AI 入口卡片
  - 卡片设计（与其他入口卡片风格一致）
  - 点击进入对话页面
  - 提示文案（如："和我聊聊"）
  - Hover 效果
  
- [ ] **Task 6.19**: 开发内容推荐功能
  - 文章标题和标签检索
  - 基于问题匹配合适文章
  - 在回答中自然引用
  - 可点击跳转到文章

## 阶段七：高级交互与动效

- [ ] **Task 7.1**: 滚动渐入动画
  - 使用 Intersection Observer
  - fade + translateY 效果
  - 交错延迟
  - 性能优化
  
- [ ] **Task 7.2**: 页面过渡动效
  - 路由切换动画
  - 内容渐变
  - 性能考虑

## 阶段八：响应式适配

- [ ] **Task 8.1**: 移动端适配
  - 汉堡菜单实现
  - 单列布局
  - 触摸交互优化
  - 字体大小调整
  
- [ ] **Task 8.2**: 平板端适配
  - 两列布局调整
  - 间距调整
  
- [ ] **Task 8.3**: 桌面端优化
  - 最大宽度限制
  - 三列卡片布局
  - 侧边目录导航

## 阶段九：测试与优化

- [ ] **Task 9.1**: 功能测试
  - 爪印互动功能测试
  - 留言板功能测试
  - 页面导航测试
  - 响应式测试
  
- [ ] **Task 9.2**: 性能优化
  - 图片优化
  - 代码分割
  - 静态资源优化
  - Lighthouse 审计
  
- [ ] **Task 9.3**: 部署准备
  - 环境变量配置
  - Vercel 部署配置
  - 数据库初始化脚本
  - 错误监控配置

## 阶段十：文档与交付

- [ ] **Task 10.1**: 项目文档
  - README 编写
  - 使用说明
  - 开发指南
  
- [ ] **Task 10.2**: 交付检查
  - 所有功能验证
  - 设计规范符合度检查
  - 性能指标验证

---

## 任务依赖关系

### 阶段内依赖
- **Task 1.3** 依赖 **Task 1.1** 和 **Task 1.2**
- **Task 1.4** 依赖 **Task 1.1**
- **Task 2.1-2.4** 依赖 **Task 1.3**
- **Task 3.2-3.3** 依赖 **Task 3.1**
- **Task 4.2** 依赖 **Task 4.1**
- **Task 4.3** 依赖 **Task 4.1**
- **Task 5.1** 依赖 **Task 1.4**

### 跨阶段依赖
- **Task 6.1-6.7** 依赖 **Task 2.1-2.4** 和 **Task 3.2-3.3**
- **Task 7.1-7.2** 依赖 **Task 6.1**
- **Task 8.1-8.3** 依赖 **Task 6.1-6.7**
- **Task 9.1-9.3** 依赖所有开发任务
- **Task 10.1-10.2** 依赖 **Task 9.1-9.3**

### 可并行执行的任务
- **Task 2.1**, **Task 2.2**, **Task 2.3**, **Task 2.4** 可并行
- **Task 3.2** 和 **Task 3.3** 可并行
- **Task 4.2** 和 **Task 4.3** 可并行
- **Task 6.2**, **Task 6.3**, **Task 6.5**, **Task 6.6**, **Task 6.7** 可并行
- **Task 8.1**, **Task 8.2**, **Task 8.3** 可并行
