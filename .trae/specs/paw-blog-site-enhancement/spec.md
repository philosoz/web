# 个人博客网站增强规范

## 一、项目增强愿景

### 背景

当前个人博客网站已完成基础框架，但需要增强AI聊天个性化、完善简历上传功能、丰富导航栏内容模块。

### 增强目标

1. **AI聊天个性化** - 从"通用分身"升级为"记住用户的分身"
2. **简历上传完善** - 实现持久化存储并与展示页面联动
3. **内容模块丰富** - 笔记、技术、简历、关于四个页面提供有价值的内容

### 设计原则

* 保持原有克制文艺的设计风格

* 动效轻柔自然，不喧宾夺主

* 内容优先，有深度但不冗余

* 功能实用，用户体验流畅

***

## 二、AI聊天个性化增强

### 2.1 当前状态分析

**已实现功能**：

* ✅ AI聊天界面（ChatPage）

* ✅ 流式响应（MiniMax API）

* ✅ RAG上下文检索（基于文章内容）

* ✅ System Prompt 数字分身配置

* ✅ 表达风格强度调节（intensity参数）

* ✅ 问题类型识别（情绪/技术/随意）

**待增强功能**：

* ❌ 用户会话记忆/持久化

* ❌ 基于交互历史的个性化

* ❌ 用户偏好学习

### 2.2 个性化增强方案

#### 功能设计

**短期增强（Phase 1）**：

1. **会话持久化**

   * 将用户对话历史存储到localStorage

   * 支持跨会话恢复对话上下文

   * 最大保留最近20条对话记录

2. **对话标签系统**

   * 自动为对话打标签（生活/技术/情绪/随意）

   * 用户可手动标记对话重要性

   * 基于标签推荐相关问题

3. **用户画像基础**

   * 记录用户常问的问题类型

   * 识别用户的兴趣领域

   * AI据此调整回答风格

**长期增强（Phase 2）**：

1. **智能上下文管理**

   * 自动总结长对话要点

   * 跨会话传递关键信息

   * 生成用户专属的"对话记忆"

2. **主动推荐系统**

   * 基于用户兴趣推荐文章

   * 在适当时机推荐深度对话

   * 个性化推荐问题

### 2.3 技术实现

#### 数据结构

```typescript
// 用户对话会话
interface ChatSession {
  id: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  tags: string[];
  summary?: string;
  isFavorite: boolean;
}

// 用户画像（轻量级）
interface UserProfile {
  visitCount: number;
  firstVisit: number;
  lastVisit: number;
  interests: string[];  // ['技术', '生活']
  interactionStyle: 'gentle' | 'direct' | 'curious';
  totalMessages: number;
}

// RAG上下文（已有内容）
interface RAGContext {
  posts: Post[];
  resume: ResumeData;
  userPreferences?: UserPreferences;
}
```

#### 存储策略

```typescript
// localStorage keys
const STORAGE_KEYS = {
  SESSIONS: 'chat_sessions',      // 对话会话列表
  CURRENT_SESSION: 'current_session',  // 当前会话ID
  USER_PROFILE: 'user_profile',   // 用户画像
  USER_PREFERENCES: 'user_preferences', // 用户偏好设置
};
```

#### API扩展

```typescript
// 新增API端点
POST /api/chat/context    // 获取增强上下文
GET  /api/chat/sessions   // 获取会话列表
POST /api/chat/sessions   // 创建新会话
GET  /api/chat/sessions/:id  // 获取会话详情
DELETE /api/chat/sessions/:id // 删除会话
```

### 2.4 用户体验流程

#### 首次访问

1. 显示欢迎语 + 推荐问题
2. 记录为第一次访问
3. 初始化用户画像

#### 再次访问

1. 检测到老用户，显示欢迎语
2. 基于历史推荐："继续上次的话题？"或"想聊聊新的？"
3. 可选择继续历史对话或开始新对话

#### 对话过程

1. 流式输出回答
2. 底部显示对话标签
3. 可收藏/标记重要对话
4. 实时保存到localStorage

### 2.5 System Prompt 增强

在现有prompt基础上增加：

```markdown
【用户记忆】
{user_memory}

【对话历史摘要】
{conversation_summary}

【用户偏好】
- 倾向温和/直接: {style_preference}
- 关注领域: {interest_areas}
```

***

## 三、简历上传功能完善

### 3.1 当前状态分析

**已实现**：

* ✅ `/resume/upload` 上传页面

* ✅ `ResumeUploader` 拖拽上传组件

* ✅ `/api/resume/upload` API（支持PDF/Word/图片）

* ✅ Base64编码存储

**问题**：

1. 上传的简历只是返回Base64，没有持久化存储
2. 简历页面没有与上传功能联动
3. 无法预览PDF格式简历
4. 没有简历版本管理

### 3.2 完善方案

#### 功能设计

**核心功能**：

1. **持久化存储**

   * 使用本地文件系统存储（适合Vercel的/serverless环境）

   * 生成唯一文件名避免冲突

   * 支持简历版本管理

2. **简历预览**

   * PDF使用iframe/pdf.js预览

   * Word文档转换为PDF或图片预览

   * 图片直接展示

3. **简历展示联动**

   * 简历页面自动加载最新上传

   * 支持下载按钮

   * 可切换查看多个版本

**增强功能**：

1. **简历解析**（可选）

   * 提取关键信息（姓名、技能、工作经历）

   * 自动填充简历页面的JSON数据

2. **简历分享**

   * 生成临时访问链接

   * 可设置过期时间

### 3.3 技术实现

#### 存储方案

由于Vercel Serverless环境限制本地存储，推荐方案：

**方案A：Vercel Blob（推荐）**

```typescript
import { put, del, list } from '@vercel/blob';

export async function uploadResume(file: File) {
  const blob = await put(`resume/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });
  return blob;
}
```

**方案B：本地文件系统（适合Node环境）**

```typescript
import fs from 'fs/promises';
import path from 'path';

export async function saveResume(file: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'resume');
  await fs.mkdir(uploadDir, { recursive: true });
  
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  
  return `/resume/${fileName}`;
}
```

#### API设计

```typescript
// 上传简历
POST /api/resume/upload
Request: FormData { file: File }
Response: {
  success: boolean;
  url: string;
  fileName: string;
  uploadedAt: string;
}

// 获取简历列表
GET /api/resume/list
Response: {
  resumes: Array<{
    id: string;
    url: string;
    fileName: string;
    uploadedAt: string;
    isActive: boolean;
  }>;
}

// 设置默认简历
PATCH /api/resume/default
Request: { id: string }

// 删除简历
DELETE /api/resume/:id
```

#### 简历页面改造

```typescript
// app/resume/page.tsx
export default function ResumePage() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // 从API获取当前简历
    fetch('/api/resume/current')
      .then(res => res.json())
      .then(data => setResumeUrl(data.url));
  }, []);
  
  return (
    <div>
      {/* 简历展示 */}
      {resumeUrl && (
        <div className="mb-6">
          <button>下载简历</button>
          <button>预览简历</button>
        </div>
      )}
      
      {/* 简历内容（JSON结构） */}
      <ResumeContent />
    </div>
  );
}
```

### 3.4 用户体验流程

#### 上传流程

1. 用户进入 `/resume/upload`
2. 拖拽或选择文件
3. 显示上传进度
4. 成功提示 + 预览链接
5. 一键跳转到简历页面查看

#### 查看流程

1. 用户进入 `/resume`
2. 自动加载最新简历
3. 可预览或下载
4. 可切换历史版本

***

## 四、内容模块丰富

### 4.1 当前状态分析

**已实现**：

* ✅ 笔记页面 - 3篇占位文章

* ✅ 技术页面 - 3篇占位文章

* ✅ 简历页面 - 基础结构

* ✅ 关于页面 - 基础介绍

**问题**：

* 内容单薄，缺乏实际价值

* 没有文章详情页

* 缺少真实的个人故事

### 4.2 笔记模块丰富

#### 目标

打造一个"生活思考"空间，记录真实的生活感悟。

#### 内容策略

1. **真实生活记录**

   * 独处时刻的思考

   * 阅读感想

   * 对话片段

   * 日常观察

2. **深度思考**

   * 对某个观点的思考

   * 对生活意义的探索

   * 对人际关系的态度

3. **内容示例**

```markdown
# 标题：为什么我开始喜欢独处

独处不是逃避，而是重新整理自己。

在安静的时间里，我更容易听到内心的声音。
不再需要向任何人解释自己在想什么。
这种感觉很舒服，像给大脑放了个假。

当然，独处不是封闭。
而是选择性地减少噪音，让重要的声音浮现出来。

---

# 标题：关于「慢」这件事

越来越觉得，「慢」是一种能力。

不是动作慢，是心态慢。
在所有人都急着给答案的时候，
能够停下来想一会儿，
本身就是一种稀缺的能力。

有时候，答案不是想出来的，
是等出来的。
```

#### 页面改造

```typescript
// app/notes/page.tsx
export default function NotesPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  return (
    <div>
      {/* 页面标题 */}
      <header>
        <h1>写生活</h1>
        <p>记录那些还没完全想清楚的事情</p>
      </header>
      
      {/* 标签筛选 */}
      <Tags tags={['独处', '思考', '阅读', '日常']} 
            selected={selectedTag} 
            onChange={setSelectedTag} />
      
      {/* 文章列表 */}
      <article-list posts={filteredPosts} />
      
      {/* 底部CTA */}
      <div className="text-center mt-12">
        <p className="text-gray-500 mb-4">
          想更深入地聊聊？
        </p>
        <Link href="/chat">和我对话 →</Link>
      </div>
    </div>
  );
}
```

### 4.3 技术模块丰富

#### 目标

展示技术思考，而非单纯的技术堆砌。

#### 内容策略

1. **技术思考**

   * 对某个技术方案的理解

   * 解决问题的思路

   * 代码可读性的重要性

   * 系统设计的原则

2. **经验总结**

   * 踩坑记录

   * 最佳实践

   * 工具推荐

3. **内容示例**

```markdown
# 标题：技术成长不是工具积累

最近面试了不少人，发现一个有趣的现象：

能用React的人很多，
但能说清楚React设计理念的人很少。

技术成长不是学会了多少框架，
而是理解了多少设计思想。

当你真正理解了React的声明式编程，
学Vue、Svelte只是语法问题。

当你理解了函数式编程的精髓，
很多"高级特性"就不攻自破。

---

# 标题：我如何理解系统设计

系统设计的核心是理解问题的本质。

很多人在设计系统时，
一开始就想着用什么技术、什么架构。
但真正重要的是：
这个系统要解决什么问题？
谁会用它？
它会如何变化？

好的设计是大道至简。
能用一个服务解决的，不要用两个。
能用简单方案的，不要过度设计。

架构是为了应对变化而存在的。
如果变化还没发生，就不要预设太多。
```

#### 页面改造

```typescript
// app/tech/page.tsx
export default function TechPage() {
  return (
    <div>
      {/* 页面标题 */}
      <header>
        <h1>技术思考</h1>
        <p>理解问题的本质，而非追求复杂的架构</p>
      </header>
      
      {/* 技术标签 */}
      <div className="flex gap-2 mb-8">
        <Tag>架构</Tag>
        <Tag>前端</Tag>
        <Tag>工程化</Tag>
        <Tag>方法论</Tag>
      </div>
      
      {/* 文章列表 */}
      <article-list posts={techPosts} />
      
      {/* 底部CTA */}
      <div className="mt-12">
        <Link href="/chat?topic=技术">问我技术问题 →</Link>
      </div>
    </div>
  );
}
```

### 4.4 简历模块丰富

#### 目标

展示一个有温度的简历，而非冰冷的技能列表。

#### 内容策略

1. **个人故事**

   * 为什么做技术

   * 技术之外的我

   * 找工作的期待

2. **项目展示**

   * 项目背景与挑战

   * 我的角色与贡献

   * 学到了什么

3. **技能展示**

   * 不仅仅是列表

   * 可以有熟练度

   * 可以有使用场景

#### 页面改造

```typescript
// app/resume/page.tsx
export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero区域 */}
      <div className="text-center mb-12">
        <h1>张海挺</h1>
        <p className="text-xl text-gray-600">技术专家 · 独立创作者</p>
        <p className="text-gray-500 mt-2">杭州 · 5年经验</p>
      </div>
      
      {/* 联系方式卡片 */}
      <ContactCard email="..." github="..." />
      
      {/* 关于我（简短故事） */}
      <AboutStory />
      
      {/* 工作经历 */}
      <ExperienceSection experiences={experiences} />
      
      {/* 项目经历 */}
      <ProjectsSection projects={projects} />
      
      {/* 技能 */}
      <SkillsSection skills={skills} />
      
      {/* 简历下载/预览 */}
      <ResumeActions />
      
      {/* 底部CTA */}
      <div className="mt-12 text-center">
        <Link href="/chat?topic=合作">聊聊合作 →</Link>
      </div>
    </div>
  );
}
```

### 4.5 关于模块丰富

#### 目标

让访客感受到这是一个真实的人，而非机器。

#### 内容策略

1. **个人故事**

   * 为什么做这个网站

   * 我的生活态度

   * 我的兴趣

2. **联系方式**

   * GitHub

   * 邮箱

   * 可能的社交媒体

3. **FAQ**

   * 常见问题解答

   * 这个网站怎么做的

   * 如何联系我

#### 页面改造

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <header className="mb-12">
        <h1>关于我</h1>
        <p className="text-gray-600 mt-4">
          一个喜欢用技术解决问题的创作者
        </p>
      </header>
      
      {/* 照片 */}
      <AvatarSection />
      
      {/* 自我介绍 */}
      <SelfIntroduction />
      
      {/* 为什么做这个网站 */}
      <WhyThisSite />
      
      {/* 我的日常 */}
      <DailyLife />
      
      {/* 联系我 */}
      <ContactSection />
      
      {/* FAQ */}
      <FAQSection />
    </div>
  );
}
```

***

## 五、实施计划

### Phase 1：基础完善（1-2周）

1. **简历上传功能完善**

   * [ ] 实现文件持久化存储

   * [ ] 简历页面联动

   * [ ] PDF预览功能

2. **内容模块丰富**

   * [ ] 笔记页面 - 添加8-10篇真实文章

   * [ ] 技术页面 - 添加5-8篇技术思考

   * [ ] 简历页面 - 完善内容结构

   * [ ] 关于页面 - 添加真实自我介绍

### Phase 2：AI个性化（2-3周）

1. **会话管理**

   * [ ] localStorage会话持久化

   * [ ] 会话列表与恢复

   * [ ] 对话标签系统

2. **用户画像**

   * [ ] 用户访问统计

   * [ ] 兴趣识别

   * [ ] 偏好存储

3. **体验优化**

   * [ ] 老用户欢迎语

   * [ ] 智能推荐问题

   * [ ] 对话摘要

### Phase 3：体验优化（持续）

1. **交互优化**

   * [ ] 动效增强

   * [ ] 响应式优化

   * [ ] 性能优化

2. **内容迭代**

   * [ ] 持续更新文章

   * [ ] 用户反馈收集

   * [ ] 功能迭代

***

## 六、技术细节

### 6.1 性能考虑

1. **图片优化**

   * 使用Next.js Image组件

   * 添加placeholder

   * 懒加载

2. **代码分割**

   * 动态导入非首屏组件

   * 路由级别的代码分割

3. **缓存策略**

   * 静态资源长期缓存

   * API响应缓存

### 6.2 可访问性

1. **语义化HTML**

   * 正确的标题层级

   * 有意义的链接文本

   * 表单标签关联

2. **键盘导航**

   * 所有交互可键盘触发

   * 焦点样式明显

   * Tab顺序合理

3. **屏幕阅读器**

   * 图片Alt文本

   * ARIA标签

   * 动态内容通知

### 6.3 SEO优化

1. **Meta标签**

   * 每页独立title和description

   * Open Graph标签

   * Twitter Card标签

2. **结构化数据**

   * Article Schema

   * Person Schema

3. **性能指标**

   * Lighthouse > 90

   * FCP < 1.5s

   * CLS < 0.1

***

## 七、质量标准

### 7.1 内容质量

* 真实、有价值、不敷衍

* 保持一致的语气和风格

* 定期更新，保持活跃

### 7.2 功能质量

* 所有功能经过测试

* 错误处理完善

* 用户反馈及时响应

### 7.3 视觉质量

* 保持设计系统一致性

* 动效轻柔自然

* 响应式适配完整

