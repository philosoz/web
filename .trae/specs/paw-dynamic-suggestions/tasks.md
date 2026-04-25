# Tasks

## P0：基础实现

- [x] Task 1: 创建提示生成逻辑模块
  - 新建 `lib/suggestion-generator.ts`
  - 定义 Suggestion 数据结构和类型
  - 创建预设提示库（分类：哲学、技术、心理、生活）
  - 实现基于用户兴趣的提示匹配逻辑
  - 实现提示随机选择（避免重复）

- [x] Task 2: 创建 InputSuggestions 组件
  - 新建 `components/ai/InputSuggestions.tsx`
  - Props：suggestions, onSelect, visible
  - 样式：与现有推荐问题风格一致（`→` 前缀）
  - 动画：淡入淡出效果

- [x] Task 3: 集成到 ChatPage
  - 修改 `app/chat/page.tsx`
  - 添加输入框聚焦状态管理
  - 聚焦时调用提示生成逻辑
  - 输入时/失焦时隐藏提示

- [x] Task 4: 优化提示显示位置
  - 提示区域：输入框上方
  - 浮动效果：轻微阴影或背景区分
  - 保持克制风格（不喧宾夺主）

## P1：AI 生成提示（进阶）

- [x] Task 5: 实现 AI 提示生成
  - 创建 `/api/suggestions` 接口
  - 使用简短 prompt 调用 MiniMax
  - 生成符合主人格的 3-5 个提示
  - 结果缓存到 sessionStorage

- [x] Task 6: 提示刷新机制
  - 会话开始时尝试 AI 生成
  - 失败时回退到预设提示库

## Task Dependencies

- Task 2 依赖 Task 1
- Task 3 依赖 Task 1, 2
- Task 4 依赖 Task 3
- Task 5, 6 独立，可与 Task 1-4 并行

---

## 实现细节

### 提示生成算法（Task 1）

```typescript
function generateSuggestions(profile: UserProfile, count = 3): string[] {
  // 1. 获取用户兴趣标签
  const interests = profile.interests || [];
  
  // 2. 从兴趣对应的类别中抽取
  const categoryMap: Record<string, string[]> = {
    '技术': 'tech',
    '工作': 'tech',
    '情绪': 'psychology',
    '生活': 'life',
    '学习': 'life',
    '随意': 'philosophy',
  };
  
  // 3. 选择最相关的 2 个类别
  // 4. 每个类别取 1-2 个提示
  // 5. 随机打乱顺序
  // 6. 返回 count 数量的提示
}
```

### InputSuggestions 组件（Task 2）

```tsx
interface InputSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  visible: boolean;
}

// 显示效果：
// → 想聊欲望本质？
// → 有什么代码让你卡住了？
// → 最近的状态怎么样？
```

### 聚焦状态管理（Task 3）

```typescript
const [inputFocused, setInputFocused] = useState(false);
const [suggestions, setSuggestions] = useState<string[]>([]);

// 聚焦时生成提示
const handleFocus = () => {
  setInputFocused(true);
  setSuggestions(generateSuggestions(profile));
};

// 失焦或输入时隐藏
const handleBlur = () => setInputFocused(false);
const handleInput = (e) => {
  if (e.target.value) setInputFocused(false);
};
```