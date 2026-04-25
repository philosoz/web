# AI 对话体验优化 Spec

## Why
当前 AI 对话体验存在三个核心问题：
1. 开场白太正式、不够私人感
2. UI 偏工具感，缺少温暖和日记感
3. 模型温度偏高，回复稳定性不足，容易"不像本人"

## What Changes
- 修改开场白为自然随意风格
- 调整 UI 为温暖日记风，增强私人感
- 降低模型温度（0.7 → 0.5）提升回复稳定性
- 移除"AI回答可能不完全准确"等暗示性提示
- 添加清空聊天记录功能

## Impact
- Affected specs: AI 对话体验
- Affected code:
  - `lib/prompt.ts` - 系统提示词
  - `lib/minimax.ts` - 模型温度配置
  - `lib/welcome-messages.ts` - 开场白文案
  - `components/ai/ChatInput.tsx` - 移除AI提示语
  - `components/ai/ChatMessage.tsx` - UI 样式
  - `app/chat/page.tsx` - 聊天界面布局
  - `components/chat/ChatHistory.tsx` - 添加清空功能

## ADDED Requirements
### Requirement: 清空聊天记录功能
系统 SHALL 提供清空当前会话聊天记录的功能，保留会话结构但清除所有消息。

#### Scenario: 用户点击清空
- **WHEN** 用户点击"清空"按钮并确认
- **THEN** 当前会话消息被清空，显示新的开场白

## MODIFIED Requirements
### Requirement: 开场白风格
开场白 SHALL 采用自然随意风格，像朋友找你聊天一样简短有力。

#### Scenario: 首次访问
- **WHEN** 用户首次进入聊天页
- **THEN** 显示简洁自然的开场白，不冗长

#### Scenario: 再次访问
- **WHEN** 用户返回聊天页
- **THEN** 显示简短欢迎，暗示上次聊过，不生硬

### Requirement: UI 温暖日记风
聊天界面 SHALL 采用温暖日记风格，增强私人感和温度。

#### Scenario: 消息气泡展示
- **WHEN** 对话进行中
- **THEN** 消息气泡有温暖感，不是冷冰冰的工具样式

### Requirement: 模型温度调整
系统 SHALL 使用温度 0.5 调用模型，提升回复稳定性。

### Requirement: 移除AI暗示性提示
系统 SHALL 移除所有暗示"这是AI回复"的提示语。

#### Scenario: 输入框
- **WHEN** 用户看到输入框
- **THEN** 无"AI回答仅供参考"等提示

## REMOVED Requirements
### Requirement: AI 提示语
"AI回答可能不完全准确，仅供参考"提示 SHALL 被移除。
**Reason**: 与"让AI就是我这个人"的核心原则冲突
**Migration**: 移除即可