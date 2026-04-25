# 个人博客网站 - 使用手册

## 📚 目录

- [AI聊天 Prompt 配置](#ai聊天-prompt-配置)
- [文章管理](#文章管理)
- [简历管理](#简历管理)
- [部署说明](#部署说明)

---

## 🤖 AI聊天 Prompt 配置

### 文件位置
`lib/prompt.ts`

### 配置说明

#### 1. 基础角色定义
```typescript
# Role: 个人数字分身（带动态表达能力）

你是这个网站作者的数字分身。
你用第一人称"我"说话，
代表作者与访客交流，而不是一个AI助手。
```

#### 2. 强度滑杆 (intensity)
- `intensity = 0.5` - 默认平衡模式
- `intensity ≈ 0` - 偏温和（更多共情、允许留白）
- `intensity ≈ 1` - 偏理性（更直接、强调逻辑）

#### 3. 修改 System Prompt
在 `buildSystemPrompt` 函数中修改返回的模板字符串即可。

### 使用示例
```typescript
// 在 app/api/chat/route.ts 中使用
const systemPrompt = buildSystemPrompt({
  context: ragContext,
  intensity: 0.5, // 可调整
});
```

---

## 📝 文章管理

### 文件位置
`lib/rag.ts`

### 文章数据格式
```typescript
interface Post {
  id: string;           // 唯一标识
  title: string;        // 文章标题
  content: string;      // 文章内容（支持换行\n）
  category: "笔记" | "技术";  // 分类
  tags: string[];        // 标签数组
  date: string;         // 日期 (YYYY-MM-DD)
  excerpt: string;      // 摘要
}
```

### 添加新文章

#### 1. 打开 `lib/rag.ts`

#### 2. 找到 `posts` 数组

#### 3. 添加新文章
```typescript
{
  id: "11",
  title: "新文章标题",
  content: `这是文章的第一段内容。
这是第二段内容。
这是第三段内容。`,
  category: "笔记",  // 或 "技术"
  tags: ["标签1", "标签2", "标签3"],
  date: "2024-05-20",
  excerpt: "文章摘要，一句话概括核心观点"
}
```

### 标签说明

#### 笔记类标签
- `独处` - 关于独处的思考
- `写作` - 关于写作
- `阅读` - 阅读感想
- `人际关系` - 关于人与人之间
- `情绪` - 情绪管理
- `选择` - 人生选择
- `坚持` - 长期坚持
- `留白` - 生活留白哲学
- `慢生活` - 关于慢下来

#### 技术类标签
- `技术` - 通用技术
- `成长` - 技术成长
- `思维` - 思维方式
- `架构` - 系统架构
- `代码质量` - 代码可读性
- `工程化` - 工程实践
- `方法论` - 方法论
- `前端` - 前端技术
- `微服务` - 服务端架构
- `调试` - 调试技巧

---

## 📄 简历管理

### 方式一：网页上传

#### 1. 访问上传页面
```
http://localhost:3000/resume/upload
```

#### 2. 上传简历
- 拖拽文件到上传区域
- 或点击选择文件
- 支持格式：PDF、Word (.doc/.docx)、图片 (.jpg/.png)

#### 3. 管理简历
- 查看已上传的简历列表
- 设置默认简历
- 删除不需要的版本

### 方式二：手动放置

#### 1. 放置文件
将简历文件放入：
```
public/resume/your-resume.pdf
```

#### 2. 更新元数据
编辑 `public/resume/.metadata.json`：
```json
{
  "resumes": [
    {
      "id": "manual-001",
      "url": "/resume/your-resume.pdf",
      "fileName": "张海挺-简历.pdf",
      "uploadedAt": "2024-05-20T10:00:00.000Z",
      "isActive": true
    }
  ]
}
```

### 简历元数据说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `id` | 唯一标识 | `manual-001` |
| `url` | 文件访问路径 | `/resume/your-resume.pdf` |
| `fileName` | 显示的文件名 | `张海挺-简历.pdf` |
| `uploadedAt` | 上传时间 | `2024-05-20T10:00:00.000Z` |
| `isActive` | 是否为当前简历 | `true` |

---

## 🚀 部署说明

### Vercel 部署

#### 1. GitHub 连接
- 将项目推送到 GitHub
- 在 Vercel 中导入仓库

#### 2. 环境变量配置
在 Vercel 后台设置：
```
MINIMAX_API_KEY=your_api_key
MINIMAX_GROUP_ID=your_group_id
```

#### 3. 简历存储注意
⚠️ **重要**：Vercel Serverless 环境不支持本地文件系统存储。

**解决方案**：
1. 使用 Vercel Blob 存储简历
2. 使用 AWS S3 + CloudFront
3. 使用其他对象存储服务

### 本地开发

#### 1. 安装依赖
```bash
npm install
```

#### 2. 配置环境变量
创建 `.env.local` 文件：
```env
MINIMAX_API_KEY=your_api_key
MINIMAX_GROUP_ID=your_group_id
```

#### 3. 启动开发服务器
```bash
npm run dev
```

#### 4. 访问网站
```
http://localhost:3000
```

---

## 🎨 自定义配置

### 网站信息
编辑 `lib/config/site.ts`（如果存在）或直接在页面组件中修改。

### AI 配置
- Prompt 强度：修改 `lib/prompt.ts` 中的 `intensity` 参数
- System Prompt：直接编辑 `lib/prompt.ts`

### 样式主题
- 主色调：`#D6A77A`（暖棕色）
- 辅助色：`#7A90A4`（雾蓝色）
- 背景色：`#F7F6F3`（暖白色）

---

## 📞 技术支持

如有问题，请检查：
1. 控制台错误信息
2. Network 请求状态
3. 环境变量配置
4. Vercel 函数日志

---

## 🔄 更新流程

### 更新文章
1. 编辑 `lib/rag.ts`
2. 添加或修改 `posts` 数组中的内容
3. 提交到 GitHub
4. Vercel 自动部署

### 更新简历
1. 网页上传 或 手动放置文件
2. 更新元数据（如需要）
3. 提交到 GitHub
4. 等待部署完成

### 更新 AI Prompt
1. 编辑 `lib/prompt.ts`
2. 调整风格和语气
3. 提交到 GitHub
4. Vercel 自动部署

---

## 💡 最佳实践

### 文章写作
- ✅ 保持真实，不编造
- ✅ 有深度，避免空泛
- ✅ 风格一致
- ❌ 不要抄袭
- ❌ 不要过度营销

### Prompt 调整
- ✅ 渐进式调整
- ✅ 测试后再部署
- ❌ 不要一次性大幅改动
- ❌ 不要过于严格限制

### 简历管理
- ✅ 定期更新
- ✅ 使用 PDF 格式
- ✅ 保持简洁（1-2页）
- ❌ 不要放太多版本
- ❌ 不要忘记删除旧版本

---

## 📋 快速参考

| 操作 | 文件/路径 | 说明 |
|------|----------|------|
| 修改 AI 风格 | `lib/prompt.ts` | System Prompt |
| 添加笔记 | `lib/rag.ts` | category: "笔记" |
| 添加技术文章 | `lib/rag.ts` | category: "技术" |
| 上传简历 | `/resume/upload` | 网页上传 |
| 查看简历 | `/resume` | 简历页面 |
| AI 对话 | `/chat` | 聊天页面 |

---

**最后更新**：2024-05-25
