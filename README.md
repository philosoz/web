# MiniMax Chat Studio

一个可部署的 MiniMax 聊天网站，基于 `Next.js 15 + TypeScript + App Router` 构建，后端通过服务端路由安全调用 MiniMax Anthropic 兼容接口，并把上游流式响应转成前端实时可渲染的文本流。

## 功能概览

- 可直接部署到 Vercel
- 支持多轮聊天
- 支持 Anthropic 兼容流式输出
- API Key 仅保存在服务端环境变量中
- 首页已升级为更适合上线展示的产品落地页

## 本地启动

1. 安装依赖
2. 创建 `.env.local`
3. 配置环境变量
4. 启动开发环境

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 环境变量

```bash
MINIMAX_API_KEY=your_new_minimax_api_key
MINIMAX_MODEL=MiniMax-M2.1
```

建议重新生成一枚新的 API Key 再用于部署，因为旧 Key 已经在对话里暴露过。

## 项目结构

```text
app/
  api/chat/route.ts   # 服务端聊天流接口
  globals.css         # 全局样式
  layout.tsx          # 页面布局
  page.tsx            # 首页落地页
components/
  chat-panel.tsx      # 聊天界面
lib/
  minimax.ts          # MiniMax Anthropic 流式请求封装
```

## MiniMax 接入说明

- Endpoint: `https://api.minimaxi.com/anthropic/v1/messages`
- Auth: `Authorization: Bearer <token>`
- 站点通过服务端读取 `MINIMAX_API_KEY`，浏览器不会暴露密钥
- 当前默认模型为 `MiniMax-M2.1`，你也可以替换为 `MiniMax-M2.5` 或 `MiniMax-M2.7`

## Vercel 部署清单

1. 把项目推到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel Dashboard 点击 `New Project` 并导入仓库。
3. 确认 Framework Preset 识别为 `Next.js`。
4. Root Directory 保持项目根目录。
5. 在 Project Settings 里添加环境变量：
   `MINIMAX_API_KEY`
   `MINIMAX_MODEL`
6. 至少为 `Production` 和 `Preview` 两个环境都配置变量。
7. 点击 `Deploy` 完成首次部署。
8. 首次部署成功后，到 `Settings -> Domains` 绑定正式域名。
9. 如果使用根域名，补好 apex 记录；如果使用子域名，补好 CNAME 记录。
10. 如需本地和 Vercel 保持一致，可用 `vercel env pull` 拉取开发环境变量。

## 上线前检查项

1. 立即轮换已经暴露的 MiniMax API Key。
2. 确认 `.env.local` 没有被提交到仓库。
3. 运行 `npm run build` 与 `npm run lint`，确保本地为绿色。
4. 在 Preview Deployment 里测试至少一轮真实聊天。
5. 检查流式输出时消息是否持续更新，而不是等到结束后一次性出现。
6. 检查移动端输入框、滚动区域、长消息换行是否正常。
7. 检查当 MiniMax 返回错误时，页面是否能显示错误提示。
8. 绑定正式域名后确认根域名、`www` 和目标主域名的跳转关系。
9. 上线后再做一次生产环境实测，确认 `Production` 环境变量已生效。

## 官方文档

- MiniMax 文档索引: [llms.txt](https://platform.minimaxi.com/docs/llms.txt)
- MiniMax Anthropic API 兼容: [text-anthropic-api](https://platform.minimaxi.com/docs/api-reference/text-anthropic-api)
- MiniMax 接口概览: [api-overview](https://platform.minimaxi.com/docs/api-reference/api-overview)
- Vercel Git 部署: [Deploying Git Repositories](https://vercel.com/docs/deployments/git)
- Vercel 环境变量: [Environment variables](https://vercel.com/docs/environment-variables)
- Vercel 项目设置: [Project settings](https://vercel.com/docs/project-configuration/project-settings)
- Vercel 自定义域名: [Add a domain](https://vercel.com/docs/getting-started-with-vercel/domains)
