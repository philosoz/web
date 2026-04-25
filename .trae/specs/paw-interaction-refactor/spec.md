# 狗狗爪印交互系统重构规范

## Why

当前爪印交互系统存在以下关键问题：

1. **点击区域不响应** - 提示文字层遮挡事件，导致用户点击无效
2. **动画效果缺失** - 只有简单的emoji显示，缺少层次感和视觉反馈
3. **计数器不同步** - API调用失败或竞态条件导致计数不准确
4. **移动端适配缺失** - 仅支持桌面端点击，触屏设备无法交互
5. **缺乏情感连接** - 静态的爪印无法传达"温暖、有趣"的品牌调性

需要重构为**可爱但克制**的完整交互系统，提升用户参与度和情感连接。

## What Changes

- ✅ 创建统一的 `usePawInteraction` hook，整合动画、计数、API调用
- ✅ 修复点击区域问题，确保PC和移动端都能正确触发
- ✅ 实现多样化爪印动画（多种emoji + 组合动效）
- ✅ 添加小狗表情变化反馈（可爱但克制）
- ✅ 完善后端统一计数机制（永久累计 + 防抖 + 错误处理）
- ✅ 优化移动端触控体验（支持 touch 事件）
- ✅ 添加动画队列和连续点击组合效果

## Impact

### Affected specs

- paw-blog-site: 爪印交互是网站"记忆点"功能，需保持设计一致性
- paw-blog-site-enhancement: 增强网站的情感连接和用户参与度

### Affected code

**核心文件**:
- `components/PawInteraction.tsx` - 爪印交互组件（重构）
- `components/PawCounter.tsx` - 爪印计数器组件（优化）
- `app/page.tsx` - 首页集成（更新props）
- `app/api/paw/route.ts` - API端点（增强错误处理）
- `lib/paw-storage.ts` - 存储层（优化）

**新增文件**:
- `hooks/usePawInteraction.ts` - 统一交互Hook
- `components/PawAnimation.tsx` - 爪印动画组件
- `components/DogMood.tsx` - 小狗表情组件

## ADDED Requirements

### Requirement: 爪印点击交互

系统 SHALL 提供点击/触摸区域，用户点击后在页面生成爪印动画，并调用后端API增加计数。

#### Scenario: 用户点击爪印区域（桌面端）

- **WHEN** 用户在爪印交互区域点击鼠标左键
- **THEN** 系统应在点击位置生成爪印动画
- **AND** 系统应调用 `POST /api/paw` 增加计数
- **AND** 计数器应更新显示新数值
- **AND** 爪印动画应在3秒后自动消失

#### Scenario: 用户触摸爪印区域（移动端）

- **WHEN** 用户在爪印交互区域触摸屏幕
- **THEN** 系统应在触摸位置生成爪印动画
- **AND** 系统应调用 `POST /api/paw` 增加计数
- **AND** 计数器应更新显示新数值
- **AND** 应阻止默认触摸滚动行为以避免误触

#### Scenario: 快速连续点击

- **WHEN** 用户在1秒内连续点击多次
- **THEN** 系统应防抖处理，仅发送1次API请求
- **AND** 应生成多个爪印动画（最多保留6个）
- **AND** 每次点击都应更新计数（但API调用防抖）

#### Scenario: API调用失败

- **WHEN** `POST /api/paw` 返回错误
- **THEN** 系统应捕获错误但不显示给用户
- **AND** 爪印动画仍应正常显示
- **AND** 计数器应保持不变或回退到之前状态

### Requirement: 爪印动画效果

爪印动画应多样化、可爱但不浮夸，符合网站"克制文艺"的设计风格。

#### Scenario: 爪印生成动画

- **WHEN** 用户点击生成爪印
- **THEN** 爪印应有入场动画（scale 0.5 → 1.2 → 1, opacity 0 → 1）
- **AND** 爪印应有随机旋转（-15° 到 15°）
- **AND** 爪印应有随机大小变化（0.8x 到 1.2x）
- **AND** 爪印应在3秒后淡出消失（opacity 1 → 0, scale 1 → 0.8）

#### Scenario: 爪印样式多样性

- **WHEN** 系统生成爪印
- **THEN** 应随机选择一种爪印样式（🐾、🐕、🦮）
- **AND** 爪印样式应基于点击时间戳随机分布
- **AND** 不应连续出现3个相同的爪印样式

### Requirement: 小狗表情变化

系统应提供小狗表情反馈，增强情感连接和趣味性。

#### Scenario: 初始状态

- **WHEN** 用户首次访问页面
- **THEN** 小狗表情应显示默认表情（😊 或 🐶）
- **AND** 表情应在爪印交互区域附近显示

#### Scenario: 点击反馈

- **WHEN** 用户成功点击并触发API调用
- **THEN** 小狗表情应短暂变化（😊 → 😄 → 😊，持续500ms）
- **AND** 表情变化应是平滑过渡，不应有突兀跳变

#### Scenario: 连续点击

- **WHEN** 用户在2秒内连续点击3次以上
- **THEN** 小狗表情应显示开心表情（😄）
- **AND** 应有轻微的摇晃动画

### Requirement: 计数器显示

计数器应准确显示总访问量，并提供视觉反馈。

#### Scenario: 初始加载

- **WHEN** 页面首次加载
- **THEN** 计数器应从 `GET /api/paw` 获取初始值
- **AND** 初始值应显示为上次累计的总数

#### Scenario: 点击增加

- **WHEN** 用户成功点击并API调用成功
- **THEN** 计数器应显示 `+1` 动画气泡
- **AND** 数字应从当前值渐变到新值
- **AND** `+1` 气泡应在800ms后消失

#### Scenario: 数字变化

- **WHEN** 计数器数值发生变化
- **THEN** 数字变化应有过渡动画
- **AND** 动画时长应为300ms

## MODIFIED Requirements

### Requirement: 后端统一计数机制

**原要求**: 无统一的计数机制

**新要求**: 所有爪印交互必须通过后端API统一计数，确保数据一致性和可追溯性。

#### Scenario: 获取计数

- **WHEN** 客户端请求 `GET /api/paw`
- **THEN** 后端应从持久化存储读取当前计数
- **AND** 返回 `{ count: number }` 格式

#### Scenario: 增加计数

- **WHEN** 客户端请求 `POST /api/paw`
- **THEN** 后端应增加计数并持久化
- **AND** 应使用文件锁防止并发冲突
- **AND** 返回 `{ count: number }` 格式

#### Scenario: 计数持久化

- **WHEN** 计数发生变化
- **THEN** 后端应立即写入 `data/paw-stats.json`
- **AND** 数据格式应包含 `count` 和 `lastUpdated` 字段

### Requirement: 移动端适配

**原要求**: 无移动端支持

**新要求**: 爪印交互必须完整支持移动端触控设备。

#### Scenario: 触摸事件处理

- **WHEN** 用户触摸爪印区域
- **THEN** 应使用 `onTouchStart` 事件获取触摸坐标
- **AND** 应阻止默认的触摸滚动行为
- **AND** 坐标计算应考虑视口偏移

#### Scenario: 触摸位置计算

- **WHEN** 用户触摸屏幕
- **THEN** 爪印位置应相对于交互区域容器计算
- **AND** 应使用 `e.touches[0].clientX/clientY` 获取坐标
- **AND** 应考虑页面滚动偏移

## REMOVED Requirements

### Requirement: 旧版爪印组件

**Reason**: 旧版 `PawInteraction.tsx` 实现存在点击区域、动画效果、坐标计算等多处问题，需要完全重构

**Migration**: 创建新的 `usePawInteraction` hook 和重写的 `PawInteraction` 组件，废弃旧版本

### Requirement: 简单的emoji显示

**Reason**: 单一的 🐾 emoji 无法满足"可爱但克制"的品牌调性，需要更丰富的视觉表达

**Migration**: 引入多种爪印样式和小狗表情组件，增强情感连接

## 技术实现细节

### 数据流

```
用户点击 → onTouchStart/onClick 
    ↓
usePawInteraction hook (防抖、状态管理)
    ↓
并行执行：
  ├→ 生成爪印动画（setPaws）
  ├→ 调用后端API（POST /api/paw）
  └→ 更新计数器状态（setPawCount）
    ↓
3秒后爪印自动消失
```

### 组件结构

```
HomePage
  ├→ PawInteraction (交互区域)
  │   ├→ PawAnimation[] (爪印动画列表)
  │   └→ DogMood (小狗表情)
  └→ PawCounter (计数器)
```

### 性能优化

1. **防抖处理**: 快速点击时，API调用防抖至多1次/秒
2. **动画队列**: 最多保留6个爪印动画，超出时移除最早的
3. **坐标缓存**: 避免在渲染中重复计算坐标
4. **条件渲染**: 使用 `AnimatePresence` 优化动画性能

### 响应式适配

| 设备类型 | 交互方式 | 事件类型 | 坐标获取 |
|---------|---------|---------|---------|
| 桌面端 | 鼠标点击 | onClick | e.clientX/Y |
| 移动端 | 触摸 | onTouchStart | e.touches[0].clientX/Y |
| 平板端 | 触摸/触控笔 | onTouchStart | e.touches[0].clientX/Y |

### 动画参数

| 动画阶段 | 时长 | 缓动函数 | 数值范围 |
|---------|------|---------|---------|
| 入场 | 400ms | cubic-bezier(0.22, 1, 0.36, 1) | scale: 0.5 → 1.2 → 1 |
| 停留 | 2600ms | - | opacity: 0.9 |
| 消失 | 400ms | ease-out | opacity: 1 → 0, scale: 1 → 0.8 |
| 表情变化 | 500ms | ease-in-out | opacity: 1 → 1 → 1 |
