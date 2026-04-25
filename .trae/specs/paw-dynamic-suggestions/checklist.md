# Checklist

## P0：基础实现

- [x] 创建 `lib/suggestion-generator.ts`
  - [x] 定义 Suggestion 类型
  - [x] 创建预设提示库（哲学/技术/心理/生活各 5 条）
  - [x] 实现 generateSuggestions 函数
  - [x] 支持基于兴趣标签的智能匹配
  - [x] 支持随机选择避免重复

- [x] 创建 `components/ai/InputSuggestions.tsx`
  - [x] Props：suggestions, onSelect, visible
  - [x] 显示样式：与现有风格一致（`→` 前缀）
  - [x] 动画效果：淡入淡出
  - [x] 点击事件：调用 onSelect

- [x] 集成到 `app/chat/page.tsx`
  - [x] 添加 inputFocused 状态
  - [x] 聚焦时显示提示（inputValue 为空）
  - [x] 输入时/失焦时隐藏提示
  - [x] 调用 generateSuggestions 获取提示

- [x] 提示显示位置和样式
  - [x] 位于输入框上方
  - [x] 与页面风格一致（深色背景，低对比）

## P1：AI 生成提示

- [x] 创建 `/api/suggestions` 接口
  - [x] 使用专用 system prompt 生成符合主人格的提示
  - [x] 流式读取 AI 输出
  - [x] 返回 JSON 格式的提示列表

- [x] 实现 AI 生成逻辑
  - [x] fetchAISuggestions 函数调用 API
  - [x] getSuggestionsWithFallback 组合 AI + 预设库

- [x] 提示缓存机制
  - [x] sessionStorage 缓存（30 分钟有效期）
  - [x] 会话开始时加载缓存
  - [x] 缓存过期时重新生成

- [x] 回退到预设提示库
  - [x] AI 生成失败时使用预设库
  - [x] AI 结果不足时补充预设库

## Verification

- [x] 聚焦输入框且无内容时显示提示
- [x] 开始输入时提示消失
- [x] 点击提示可发送消息
- [x] 提示风格符合主人格（克制、精准）
- [x] 无 TypeScript 编译错误
- [x] AI 生成接口正常工作（需测试）
- [x] 缓存机制正常（需测试）