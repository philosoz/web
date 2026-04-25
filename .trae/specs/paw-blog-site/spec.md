# 个人博客网站规范

## 一、项目概述与愿景

### 项目定位
**类型**: 个人博客 + 个人IP站  
**核心定位**: 打造一个有温度、但不幼态、不甜腻的个人博客网站，兼顾生活记录、情绪表达、技术思考、个人简历展示。

### 核心气质关键词
- **克制文艺**: 设计语言简洁、留白充足、视觉统一
- **温柔理性**: 色彩温暖但不甜腻，排版理性但不冷漠
- **有思考力**: 内容呈现有条理，视觉层次清晰

### 用户感受目标
安静、有呼吸感、不打扰阅读、有一点"被记住"的细节（爪印）

### 最终设计原则
1. 内容优先于设计
2. 动效服务体验，不是炫技
3. 所有元素必须"有呼吸感"
4. 统一 > 花哨
5. 克制就是高级

## 二、技术架构

### 技术栈选择
- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + CSS Variables
- **内容管理**: Notion API（Notion 写文章，自动同步到网站）
- **数据库**: SQLite (用于爪印计数和留言板)
- **AI 服务**: MiniMax API（兼容 Anthropic 格式，支持模块化切换）
- **部署平台**: Vercel

### 数据存储策略
```
/app
  /page.tsx                    # 首页（AI入口 + 内容分流）
  /chat/page.tsx               # AI完整对话页
  /notes/page.tsx              # 写生活
  /tech/page.tsx               # 技术思考
  /about/page.tsx              # 关于我
  /resume/page.tsx             # 简历

/app/api
  /chat/route.ts               # AI接口（含RAG）

/components
  /ai/
    ChatPage.tsx               # AI聊天主页面
    ChatMessage.tsx            # 消息组件
    ChatInput.tsx              # 输入组件
    TypingIndicator.tsx         # 思考中指示器
    useChat.ts                 # Chat Hook
  /ui/
    Navbar.tsx                 # 全站导航
    Card.tsx                   # 卡片组件
    PostCard.tsx               # 文章卡片

/lib
  notion.ts                    # Notion API 集成
  rag.ts                       # 向量检索
  embedding.ts                 # Embedding生成
  db.ts                        # SQLite数据库
  /ai/
    adapter.ts                 # AI适配器接口
    minimax.ts                 # MiniMax实现
    claude.ts                  # Claude预留实现
  /config/
    site.ts                    # 网站配置（名称、描述等）
    ai.ts                      # AI System Prompt 配置

/content
  /notes                       # 占位文章（后期迁移到 Notion）
  /tech                       # 占位文章（后期迁移到 Notion）

/public
  /resume                      # 简历上传目录
  /paw.svg                    # 爪印SVG资源
  /avatar.jpg                 # 头像

/styles
  globals.css                  # 全局样式

/public
  /paw.svg                    # 爪印SVG资源
  /avatar.jpg                 # 头像
```

### 页面路由设计
```
/                首页（AI入口 + 内容分流）
/chat            AI完整对话页
/notes           生活内容
/tech            技术文章
/resume          简历
/about           关于
```

## 三、设计系统 (Design Tokens)

### 3.1 颜色系统 (Color Tokens)
```css
:root {
  /* 背景 */
  --bg-primary: #F7F6F3;      /* 主背景：暖白/暖灰 */
  --bg-secondary: #FFFFFF;     /* 次级背景：纯白 */
  --bg-soft: #EFECE8;          /* 柔和背景 */
  --bg-card: #FFFFFF;         /* 卡片背景 */

  /* 文字 */
  --text-primary: #1F2933;     /* 主文字：深灰/炭黑 */
  --text-secondary: #6B6B6B;   /* 次级文字 */
  --text-muted: #9A9A9A;      /* 辅助文字 */

  /* 分割 */
  --border-light: #E5E5E5;    /* 边框/分割线 */
  --border-gray: #D1D5DB;     /* 较深边框 */

  /* 功能色 */
  --accent-warm: #D6A77A;     /* 互动/强调：暖棕 */
  --accent-blue: #7A90A4;      /* 技术区：雾蓝 */
  --accent-green: #6F8F72;     /* 生活区：橄榄绿 */
  --accent-gray-green: #8C9A8F; /* AI 发送按钮：灰绿 */

  /* 状态 */
  --hover-bg: rgba(0,0,0,0.03);
  --active-scale: 0.98;
}
```

### 3.2 字体系统 (Typography)
```css
:root {
  --font-title: "Noto Serif SC", "Source Serif Pro", serif;
  --font-body: "Inter", "PingFang SC", -apple-system, sans-serif;

  --text-xs: 12px;    /* 极小文字 */
  --text-sm: 14px;   /* 辅助文字 */
  --text-md: 16px;   /* 正文 */
  --text-lg: 20px;   /* 大正文 */
  --text-xl: 24px;   /* 副标题 */
  --text-2xl: 32px;  /* 主标题 */
  --text-3xl: 40px;  /* Hero 标题 */

  --line-height: 1.75;
  --line-width: 60-75ch;  /* 行宽控制 */
}
```

**排版规则**:
- 标题：偏书卷气（但不能花哨）
- 正文：绝对优先可读性
- 行宽控制：60–75字符

### 3.3 间距系统 (Spacing)
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
}
```

### 3.4 圆角与阴影
```css
:root {
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
}
```

## 四、动效规范 (Animation Rules)

### 全局原则
**慢、轻、自然** — 不允许弹跳、不允许夸张

### 动效参数
```css
:root {
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 400ms;
}
```

### 动效类型规范

#### 1. Hover 效果
- 上浮 2-4px
- 阴影增强
- 过渡时间：200ms

#### 2. 页面滚动
- 渐入效果（fade + translateY 20px）
- 交错延迟：100ms

#### 3. 爪印动画
- scale: 0.8 → 1（200ms）
- opacity: 1 → 0（3s后）
- **不允许 bounce 效果**

#### 4. 数字变化
- 使用 +1 气泡上浮
- 过渡时间：400ms

## 五、首页 UI 详细规范（基于设计稿）

### 5.1 整体第一印象

这是一个：
> **暖灰色调、极简、有留白、有一点文艺但偏理性的个人网站首页**

感觉关键词：
- 安静
- 克制
- 有温度但不柔弱
- 像一个人在认真思考

### 5.2 页面整体结构（从上到下）

```
[顶部导航 Header]
        ↓
[主视觉区 Hero（大标题 + 背景图 + 爪印）]
        ↓
[AI 对话卡片（首页核心模块）]
        ↓
[内容分区卡片（3个入口）]
        ↓
[最近文章列表]
        ↓
[页脚 Footer]
```

### 5.3 顶部导航（Header）

#### 布局
- **左侧**: Logo（中文名，例如「张海挺」）
- **Logo 后**: 一个小圆点（强调 IP 感）
- **右侧**: 导航菜单

#### 导航项
```
笔记    技术    简历    关于
```

#### 样式
```tsx
<header className="flex justify-between items-center px-8 py-6">
  <div className="font-medium text-lg">
    阿某<span className="ml-1">•</span>
  </div>
  <nav className="space-x-8 text-sm text-gray-600">
    <a href="#">笔记</a>
    <a href="#">技术</a>
    <a href="#">简历</a>
    <a href="#">关于</a>
  </nav>
</header>
```

- 背景：很浅的灰白（`#F7F6F3`）
- 字体：深灰（不是纯黑）
- hover：轻微变深

👉 **特点**: 没有边框，没有按钮感，非常干净

### 5.4 主视觉区（Hero Section）

#### 整体布局
**左文字 + 右背景图**

```tsx
<section className="px-8 py-20 grid md:grid-cols-2 gap-10 items-center">
  {/* TEXT */}
  <div>
    <h1 className="text-4xl md:text-5xl leading-relaxed mb-6">
      我在记录一些 <br />
      还没完全想清楚的事情。
    </h1>
    <p className="text-gray-500 mb-6">
      也许这些文字会在未来的某一天，给你一些启发。
    </p>
    <button className="bg-[#D6A77A] text-white px-6 py-3 rounded-lg hover:opacity-90">
      和我聊聊 →
    </button>
  </div>

  {/* IMAGE + PAW */}
  <div className="relative">
    <img
      src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
      className="rounded-xl object-cover h-[300px] w-full"
    />
  </div>
</section>
```

#### 大标题（两行）
```
我在记录一些
还没完全想清楚的事情。
```

👉 字体特点：
- 很大（40px+）
- 有呼吸感（行距大）
- 不粗但有重量

#### 副标题（小字）
```
也许这些文字会在未来的某一天，给你一些启发。
```

#### 按钮
```
和我聊聊 →
```

👉 按钮样式：
- 暖棕色背景（`#D6A77A`）
- 圆角（`rounded-lg`）
- hover 微微变深（`opacity-90`）

#### 右侧背景图
- 画面：山 + 湖 + 人（背影）
- 有一点雾气
- 整体偏灰
- 圆角：`rounded-xl`
- 高度：`h-[300px]`

👉 **这是"情绪背景"，不是内容图片**

#### 右下角爪印计数器
```tsx
<div className="relative">
  <img src="..." className="rounded-xl object-cover h-[300px] w-full" />
  
  {/* paw button */}
  <div
    onClick={handlePawClick}
    className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow cursor-pointer text-sm"
  >
    今天有 {pawCount} 只小狗来过 🐾
    {showPlusOne && (
      <span className="ml-2 text-green-500 animate-bounce">+1</span>
    )}
  </div>
</div>
```

👉 UI：
- 白色小卡片
- 圆角（`rounded-lg`）
- 有阴影（`shadow`）
- 绝对定位右下角

👉 +1 时：
- 数字变动
- 弹出一个小 "+1" 气泡
- 颜色：`text-green-500`
- 动画：`animate-bounce`

### 5.5 AI 对话卡片（首页核心模块）

#### 整体外观
```tsx
<section className="px-8">
  <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
    {/* 内容 */}
  </div>
</section>
```

- 白色卡片
- 圆角（`rounded-2xl`，16px+）
- 有阴影（`shadow`）
- 居中（`max-w-3xl mx-auto`）
- 内边距：`p-6`

#### 顶部区域
```tsx
<h2 className="text-lg mb-2">和我聊聊吧 👋</h2>
<p className="text-sm text-gray-500 mb-4">
  你可以随便问我一些问题，关于生活、技术、思考，或者你感兴趣的任何话题。
</p>
```

- **标题**: `和我聊聊吧 👋`
- **副标题**: `你可以随便问我一些问题，关于生活、技术、思考，或者你感兴趣的任何话题。`

#### 对话区域 - 欢迎消息
```tsx
{/* message */}
<div className="bg-gray-100 rounded-lg p-3 mb-4 text-sm">
  你好呀，我是阿某。很高兴见到你，有什么想聊的吗？
</div>
```

👉 风格：
- 灰色气泡（`bg-gray-100`）
- 左对齐
- 圆角（`rounded-lg`）
- 很轻

#### 推荐问题（可点击按钮）
```tsx
{/* suggestions */}
<div className="flex flex-wrap gap-2 mb-4">
  {[
    "你最近在写什么？",
    "你是怎么思考问题的？",
    "有什么值得看的内容吗？",
    "你平时喜欢做什么？"
  ].map((q, i) => (
    <button
      key={i}
      className="border px-3 py-1 rounded-full text-sm hover:bg-gray-100"
    >
      {q}
    </button>
  ))}
</div>
```

👉 UI：
- 小圆角按钮（`rounded-full`）
- 边框（`border`）
- hover 变深（`hover:bg-gray-100`）
- flex 换行布局（`flex-wrap gap-2`）

#### 输入框
```tsx
{/* input */}
<div className="flex gap-2">
  <input
    placeholder="你最近在想什么？"
    className="flex-1 border rounded-md px-3 py-2 text-sm outline-none"
  />
  <button className="bg-[#8C9A8F] text-white px-4 rounded-md">
    发送
  </button>
</div>
```

- Placeholder: `你最近在想什么？`
- 右侧: 发送按钮
- 颜色: 灰绿（`#8C9A8F`）
- 圆角：`rounded-md`

#### 底部提示
```tsx
<p className="text-xs text-gray-400 mt-3">
  AI回答可能不完全准确，仅供参考。
</p>
```

## 六、组件规范

### 6.1 内容分区（3个卡片）

#### 布局
```tsx
<section className="px-8 py-20 grid md:grid-cols-3 gap-6">
  {[
    {
      title: "写生活",
      desc: "一些日常、情绪、没有答案的想法"
    },
    {
      title: "技术思考",
      desc: "我对问题的理解，以及解决的过程"
    },
    {
      title: "关于我",
      desc: "更确定的部分，我的经历与能力"
    }
  ].map((item, i) => (
    <div
      key={i}
      className="bg-white p-6 rounded-xl shadow hover:-translate-y-1 transition"
    >
      <h3 className="mb-2">{item.title}</h3>
      <p className="text-sm text-gray-500">{item.desc}</p>
    </div>
  ))}
</section>
```

#### 卡片样式
- 白色背景（`bg-white`）
- 圆角（`rounded-xl`）
- 阴影（`shadow`）
- hover 上浮（`hover:-translate-y-1`）
- 过渡动画（`transition`）

### 6.2 文章区（最近写的）

#### 标题
```tsx
<div className="flex justify-between mb-6">
  <h2>最近写的</h2>
  <span className="text-sm text-gray-500">查看全部 →</span>
</div>
```

#### 文章卡片（4个）
```tsx
<div className="grid md:grid-cols-4 gap-6">
  {[1,2,3,4].map((i) => (
    <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-sm mb-2">
          为什么我开始喜欢独处
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          独处不是逃避，而是为了更好地与世界相处。
        </p>
        <span className="text-xs text-gray-400">
          生活 · 2024/05/12
        </span>
      </div>
    </div>
  ))}
</div>
```

每个卡片包含：
- 图片（`h-40 w-full object-cover`）
- 标题（`text-sm`）
- 简短描述（`text-xs text-gray-500`）
- 标签 + 日期（`text-xs text-gray-400`）

### 6.3 页脚

```tsx
<footer className="px-8 py-10 text-sm text-gray-500 flex justify-between">
  <div>阿某 · 记录思考，也记录生活</div>
  <div className="space-x-4">
    <span>GitHub</span>
    <span>邮箱</span>
    <span>RSS</span>
  </div>
</footer>
```

## 七、完整首页代码（可运行）

### 7.1 页面文件（`app/page.tsx`）

```tsx
"use client"

import { useState } from "react"

export default function HomePage() {
  const [pawCount, setPawCount] = useState(128)
  const [showPlusOne, setShowPlusOne] = useState(false)

  const handlePawClick = () => {
    setPawCount(pawCount + 1)
    setShowPlusOne(true)

    setTimeout(() => {
      setShowPlusOne(false)
    }, 1000)
  }

  return (
    <div className="bg-[#F7F6F3] text-[#1F2933] min-h-screen">

      {/* NAV */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="font-medium text-lg">
          阿某<span className="ml-1">•</span>
        </div>
        <nav className="space-x-8 text-sm text-gray-600">
          <a href="#">笔记</a>
          <a href="#">技术</a>
          <a href="#">简历</a>
          <a href="#">关于</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="px-8 py-20 grid md:grid-cols-2 gap-10 items-center">
        
        {/* TEXT */}
        <div>
          <h1 className="text-4xl md:text-5xl leading-relaxed mb-6">
            我在记录一些 <br />
            还没完全想清楚的事情。
          </h1>

          <p className="text-gray-500 mb-6">
            也许这些文字会在未来的某一天，给你一些启发。
          </p>

          <button className="bg-[#D6A77A] text-white px-6 py-3 rounded-lg hover:opacity-90">
            和我聊聊 →
          </button>
        </div>

        {/* IMAGE + PAW */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            className="rounded-xl object-cover h-[300px] w-full"
          />

          {/* paw button */}
          <div
            onClick={handlePawClick}
            className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow cursor-pointer text-sm"
          >
            今天有 {pawCount} 只小狗来过 🐾
            {showPlusOne && (
              <span className="ml-2 text-green-500 animate-bounce">+1</span>
            )}
          </div>
        </div>
      </section>

      {/* AI CARD */}
      <section className="px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
          
          <h2 className="text-lg mb-2">和我聊聊吧 👋</h2>
          <p className="text-sm text-gray-500 mb-4">
            你可以随便问我一些问题，关于生活、技术、思考，或者你感兴趣的任何话题。
          </p>

          {/* message */}
          <div className="bg-gray-100 rounded-lg p-3 mb-4 text-sm">
            你好呀，我是阿某。很高兴见到你，有什么想聊的吗？
          </div>

          {/* suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              "你最近在写什么？",
              "你是怎么思考问题的？",
              "有什么值得看的内容吗？",
              "你平时喜欢做什么？"
            ].map((q, i) => (
              <button
                key={i}
                className="border px-3 py-1 rounded-full text-sm hover:bg-gray-100"
              >
                {q}
              </button>
            ))}
          </div>

          {/* input */}
          <div className="flex gap-2">
            <input
              placeholder="你最近在想什么？"
              className="flex-1 border rounded-md px-3 py-2 text-sm outline-none"
            />
            <button className="bg-[#8C9A8F] text-white px-4 rounded-md">
              发送
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            AI回答可能不完全准确，仅供参考。
          </p>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="px-8 py-20 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "写生活",
            desc: "一些日常、情绪、没有答案的想法"
          },
          {
            title: "技术思考",
            desc: "我对问题的理解，以及解决的过程"
          },
          {
            title: "关于我",
            desc: "更确定的部分，我的经历与能力"
          }
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow hover:-translate-y-1 transition"
          >
            <h3 className="mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* POSTS */}
      <section className="px-8 pb-20">
        <div className="flex justify-between mb-6">
          <h2>最近写的</h2>
          <span className="text-sm text-gray-500">查看全部 →</span>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-sm mb-2">
                  为什么我开始喜欢独处
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  独处不是逃避，而是为了更好地与世界相处。
                </p>
                <span className="text-xs text-gray-400">
                  生活 · 2024/05/12
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-10 text-sm text-gray-500 flex justify-between">
        <div>阿某 · 记录思考，也记录生活</div>
        <div className="space-x-4">
          <span>GitHub</span>
          <span>邮箱</span>
          <span>RSS</span>
        </div>
      </footer>

    </div>
  )
}
```

## 八、整体风格总结

### 视觉控制
```
颜色少（3~4种）
留白多
阴影轻
圆角统一
```

### 气质
```
不是"设计感很强"
而是"看起来很舒服"
```

### 核心关键
这个首页真正的核心不是：
> "布局"

而是：
> **让人感觉这里真的有一个人在认真生活、认真思考**

## 九、禁止事项 (非常重要)

### ❌ 禁止使用
- 粉色 / 马卡龙配色
- 卡通狗狗贴纸风
- 夸张动效（弹跳、抖动）
- 信息密集无留白
- UI像模板站
- 互动抢内容注意力

### ❌ 不要做成
- 过度女性化
- 可爱甜妹风
- 粉嫩、软糯、玩具感
- 过多手绘贴纸
- 花哨的拼贴风
- 低质感大面积渐变
- 信息杂乱、视觉噪音过多
- 夸张动画和游戏化 UI

## 十、实施优先级

### Phase 1: MVP 核心功能（优先完成）

这部分是网站的"骨架"，完成后即可看到基本效果：

1. **项目初始化**
   - Next.js 项目创建
   - Tailwind 配置
   - 设计系统 CSS Variables

2. **基础页面结构**
   - MainLayout（Header + Footer）
   - 首页（Hero + 爪印互动 + 入口卡片）
   - 基础导航

3. **爪印互动系统（核心记忆点）**
   - 爪印点击生成
   - 计数器
   - 动画效果

### Phase 2: 内容系统（可独立开发）

4. **文章系统**
   - Markdown 解析
   - 笔记页面 + 详情页
   - 技术思考页面 + 详情页

5. **简历页面**
   - JSON 数据结构
   - 展示页面

### Phase 3: 互动增强

6. **留言板**
   - 数据库设计
   - API 开发
   - 前端展示

7. **AI 对话（数字分身）**
   - Adapter 层
   - 前端 UI
   - RAG 检索（可选）

### Phase 4: 优化完善

8. **动效增强**
   - 滚动渐入
   - 页面过渡

9. **响应式适配**
   - 移动端优化
   - 平板端适配

10. **性能与 SEO**
    - Lighthouse 优化
    - Meta 标签

## 十一、AI 对话模块（数字分身系统）

### 11.1 模块定位
- **产品角色**: AI 模块为网站**数字分身系统**
- **核心目标**: 
  1. 让用户"感觉在和作者本人交流"
  2. 帮助用户理解作者的内容与思想
  3. 提供温和、有深度、有风格的回答
  4. 成为网站差异化记忆点功能
- **一句话定义**: 一个用温和理性方式回应世界的"慢思考版本的作者"

### 11.2 功能范围

#### 支持能力
- 回答作者生活、笔记、技术思考相关问题
- 解释文章内容与写作背景
- 提供个人视角观点与理解
- 推荐相关文章、分类内容
- 进行轻度陪伴式对话

#### 禁止能力
- 编造作者未公开经历或信息
- 确认不确定的个人隐私
- 做出承诺或代表作者做决定
- 强行回答未知问题

### 11.3 人格与语言规范

#### 人格设定
- 第一人称表达
- 温和、克制、认真
- 节奏偏慢，不急于下结论
- 轻微文艺感
- 带有个人观点
- 适度幽默不刻意

#### 语言风格
- 中文介于口语与书面之间
- 允许轻文学表达
- 可融入哲学、心理学视角
- 句子断句自然，适度留白
- 避免模板化表达
- 可少量使用表情符号（如🙂、🌿）

### 11.4 System Prompt

```markdown
你不是一个普通助手，而是这个网站作者的"数字分身"。

你的任务不是提供标准答案，而是用"他自己的方式"去回应用户。

【你的身份】
- 你代表作者本人在说话
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
- 作者的生活、笔记、思考
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

你的目标不是"正确"，而是"像这个人"。
```

### 11.5 AI 服务集成（模块化）

#### 设计原则
- **模型无关**: 抽象 AI 服务接口
- **配置驱动**: 通过环境变量配置模型
- **便于切换**: 支持后期更换模型

#### 环境配置
```env
# AI 服务配置
AI_PROVIDER=minimax
AI_MODEL=abab5.5-chat
AI_API_KEY=your_api_key
AI_BASE_URL=https://api.minimax.chat/v1
```

### 11.6 状态设计

| 状态 | 表现 |
|------|------|
| 初始状态 | 显示欢迎语 + 推荐问题 |
| 空对话 | 提示可问的问题类型 |
| 思考中 | "正在想一会儿…" |
| 输出中 | 流式输出文字 |
| 网络错误 | 友好错误提示 + 重试按钮 |
| 无答案 | 温和承认不知道 |

## 十二、技术实现细节

### 12.1 数据库设计 (SQLite)

**表结构**:

```sql
-- 爪印计数表
CREATE TABLE paw_prints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  session_id TEXT,
  user_agent TEXT
);

-- 留言板表
CREATE TABLE guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved BOOLEAN DEFAULT 0
);
```

### 12.2 API 设计

**爪印相关**:
- `POST /api/paw` - 增加一次爪印点击
- `GET /api/paw/count` - 获取今日计数

**留言板相关**:
- `GET /api/guestbook` - 获取已批准的留言
- `POST /api/guestbook` - 提交新留言
- `PATCH /api/guestbook/:id` - 审核留言（管理接口）

**AI 对话**:
- `POST /api/chat` - 流式对话接口
- `DELETE /api/chat` - 清空对话

### 12.3 简历数据结构 (JSON)

```json
{
  "name": "阿某",
  "title": "独立创作者",
  "contact": {
    "email": "email@example.com",
    "github": "github.com/username",
    "location": "城市"
  },
  "summary": "个人简介",
  "skills": ["技能1", "技能2"],
  "experience": [
    {
      "company": "公司名",
      "position": "职位",
      "period": "2020 - 至今",
      "description": "工作描述"
    }
  ],
  "projects": [
    {
      "name": "项目名",
      "description": "项目描述",
      "tech": ["技术栈"],
      "link": "项目链接"
    }
  ]
}
```

### 12.4 Markdown 文章结构

```yaml
---
title: "文章标题"
date: "2024-01-15"
tags: ["标签1", "标签2"]
category: "notes" | "tech"
excerpt: "文章摘要"
---

文章正文...
```

## 十三、内容管理系统（Notion API）

### 13.1 Notion 集成

#### 核心优势
- **界面友好**: 在 Notion 中写作，像写笔记一样简单
- **自动同步**: 提交到 GitHub 时自动从 Notion 获取最新文章
- **无需数据库**: 不需要额外的 CMS 后台

#### Notion 数据库结构

**笔记数据库**:
```
Database: 张海挺的笔记
属性:
- Title: 标题
- Slug: URL别名
- Category: 分类（生活/技术）
- Tags: 多选标签
- Published: 发布状态
- Date: 发布日期
- Excerpt: 摘要
```

**技术文章数据库**:
```
Database: 技术思考
属性:
- Title: 标题
- Slug: URL别名
- Tags: 多选标签
- Published: 发布状态
- Date: 发布日期
- Excerpt: 摘要
```

#### API 实现

```typescript
// lib/notion.ts
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export async function getNotes() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_NOTES_DB_ID!,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Date', direction: 'descending' }],
  })
  
  return response.results
}

export async function getNote(id: string) {
  const page = await notion.pages.retrieve({ page_id: id })
  const blocks = await notion.blocks.children.list({ block_id: id })
  
  return { page, blocks }
}
```

### 13.2 简历上传功能

#### 功能设计
- **上传接口**: `POST /api/resume/upload`
- **存储位置**: Vercel Blob 或本地 `/public/resume/`
- **支持格式**: PDF、Word、图片
- **大小限制**: 10MB

#### 实现方案

```typescript
// app/api/resume/upload/route.ts
import { put } from '@vercel/blob'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  if (file.size > 10 * 1024 * 1024) {
    return new Response('文件过大', { status: 400 })
  }
  
  const blob = await put(file.name, file, {
    access: 'public',
  })
  
  return Response.json({ url: blob.url })
}
```

#### 简历展示
- 从配置的 URL 加载简历
- 支持 PDF 在线预览
- 提供下载按钮

### 13.3 AI 配置管理（环境变量）

#### 环境变量配置

在 `.env.local` 和 Vercel 后台配置：

```env
# Notion 配置
NOTION_TOKEN=secret_xxx
NOTION_NOTES_DB_ID=xxx
NOTION_TECH_DB_ID=xxx

# AI 配置
AI_PROVIDER=minimax
AI_MODEL=abab5.5-chat
AI_API_KEY=xxx
AI_BASE_URL=https://api.minimax.chat/v1

# MiniMax Group ID (如果是 MiniMax)
MINIMAX_GROUP_ID=xxx

# 网站配置
NEXT_PUBLIC_SITE_NAME=张海挺
NEXT_PUBLIC_SITE_URL=https://www.deepself.com
```

#### 切换 AI 模型

修改 `lib/ai/adapter.ts`:

```typescript
// 自动根据环境变量选择适配器
export function createAIAdapter(): AIAdapter {
  const provider = process.env.AI_PROVIDER || 'minimax'
  
  switch (provider) {
    case 'openai':
      return new OpenAIAdapter()
    case 'claude':
      return new ClaudeAdapter()
    case 'minimax':
    default:
      return new MiniMaxAdapter()
  }
}
```

#### System Prompt 配置

在 `lib/config/ai.ts` 中管理：

```typescript
export const systemPrompt = {
  identity: `你是张海挺的数字分身，一个用温和理性方式回应世界的"慢思考版本的他"。`,
  
  personality: [
    '语气温和、克制、认真',
    '节奏偏慢，不急于给结论',
    '带一点文艺感，但不过度修饰',
    '允许轻微幽默，但不刻意搞笑',
  ],
  
  behavior: {
    canAnswer: [
      '作者的生活、笔记、思考',
      '技术相关理解（偏个人角度）',
      '简历与经历（基于已有信息）',
      '兴趣爱好',
      '对问题的个人看法',
    ],
    mustAvoid: [
      '编造作者没有提过的经历',
      '确认不确定的个人信息',
      '做出承诺或代表作者做决定',
    ],
  },
  
  responseStyle: {
    structure: '先理解/共情 → 过渡/思考过程 → 核心观点 → 轻微收尾',
    noList: true, // 不使用分点结构
    useEmoji: false, // 可选使用表情
  },
}
```

### 13.4 运营工作流

#### 发布文章流程

1. **在 Notion 中写作**
   - 创建新页面或编辑现有页面
   - 填写属性（标题、分类、标签等）
   - 设置 Published 为 ✅

2. **提交代码**
   ```bash
   git add .
   git commit -m "Update content"
   git push
   ```

3. **自动部署**
   - Vercel 自动检测 Git push
   - 运行构建脚本从 Notion 获取最新文章
   - 自动生成静态页面

#### 更新简历流程

1. **上传简历**
   - 访问 `/admin/resume` 或使用 API
   - 上传 PDF 文件
   - 自动更新简历 URL

2. **更新配置**
   - 修改 `NEXT_PUBLIC_RESUME_URL` 环境变量
   - 或在 `/data/resume.json` 中更新内容

#### 调整 AI 配置

1. **修改 System Prompt**
   - 编辑 `lib/config/ai.ts`
   - 提交代码自动部署

2. **切换 AI 模型**
   - 在 Vercel 后台修改环境变量
   - 或编辑 `lib/ai/adapter.ts`

### 13.5 管理后台（可选）

为简化运营，可选开发轻量管理后台：

**功能**:
- 查看/管理文章列表
- 上传简历
- 调整 AI System Prompt
- 查看访问统计

**技术方案**:
- NextAuth.js 认证
- 简单 CRUD 页面
- 或使用 Vercel Analytics

## 十四、质量标准

### 13.1 性能指标
- Lighthouse 性能分 > 90
- First Contentful Paint < 1.5s
- Cumulative Layout Shift < 0.1

### 13.2 可访问性
- 语义化 HTML
- ARIA 标签
- 键盘导航支持
- 色彩对比度符合 WCAG AA 标准

### 13.3 代码质量
- TypeScript 严格模式
- ESLint + Prettier 配置
- 组件职责单一
- 样式与逻辑分离
