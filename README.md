# 张海挺的个人博客

一个温暖、克制、有思考力的个人网站，包含 AI 对话功能。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

然后填写必要的配置：

```env
# MiniMax API (AI 对话功能)
MINIMAX_API_KEY=your_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站。

## 🎯 功能

- **首页**: 展示个人 IP 和最新文章
- **AI 对话**: 与"数字分身"聊天，了解作者的想法
- **爪印互动**: 点击留下爪印，记录互动
- **笔记/技术**: 查看文章列表和详情
- **简历**: 展示个人经历和技能
- **关于**: 个人介绍和联系方式

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动效**: Framer Motion
- **AI**: MiniMax API (兼容 Anthropic)
- **存储**: 支持多种云存储方案
- **部署**: Vercel

## 📝 简历上传配置

### 支持的存储方案

#### 1. Base64 (默认，无需配置)
适合本地开发和演示
```env
UPLOAD_PROVIDER=base64
```

#### 2. Vercel Blob (推荐用于 Vercel 部署)
```env
UPLOAD_PROVIDER=vercel-blob
BLOB_READ_WRITE_TOKEN=your_token
```

#### 3. AWS S3
```env
UPLOAD_PROVIDER=aws-s3
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=your_bucket
```

#### 4. Cloudflare R2 (S3 兼容，免费额度大)
```env
UPLOAD_PROVIDER=cloudflare-r2
R2_BUCKET_ID=your_bucket_id
R2_PUBLIC_URL=https://your-public-url.r2.dev
```

## 📝 发布文章

目前使用占位文章，后期将集成 Notion API。

## 🎨 自定义

### 修改 AI 人格

编辑 `app/api/chat/route.ts` 中的 `SYSTEM_PROMPT`。

### 修改简历

编辑 `app/resume/page.tsx` 中的内容。

### 修改文章

编辑对应的页面文件中的 posts 数组。

## 🚀 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量：
   - `MINIMAX_API_KEY`
   - `MINIMAX_MODEL`
   - `UPLOAD_PROVIDER` (根据选择的存储方案)
4. 部署！

## 📦 项目结构

```
app/
  page.tsx          # 首页
  chat/page.tsx     # AI 对话页
  notes/page.tsx     # 笔记列表
  tech/page.tsx     # 技术文章列表
  about/page.tsx     # 关于我
  resume/
    page.tsx        # 简历
    upload/page.tsx  # 简历上传

components/
  ai/
    useChat.ts
    ChatMessage.tsx
    ChatInput.tsx
    TypingIndicator.tsx

lib/
  minimax.ts       # MiniMax API 封装

app/api/
  chat/route.ts    # AI 对话 API
  resume/upload/route.ts  # 简历上传 API
```

## 📄 许可证

MIT
