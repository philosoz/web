# 爪印计数器真实数据统计系统 Spec

## Why
当前爪印计数器使用本地 JSON 文件存储数据，数值始终为初始值 128，无法反映真实访问和交互数据。需要实现全网真实数据统计系统。

## What Changes
- 将数据存储从本地 JSON 文件迁移到持久化数据库
- 支持多用户/多实例的并发访问计数
- 确保数据持久化和一致性

## Impact
- Affected specs: 爪印交互系统
- Affected code:
  - `lib/paw-storage.ts` - 数据存储层重构
  - `app/api/paw/route.ts` - API 层适配

## ADDED Requirements
### Requirement: 数据库持久化存储
系统 SHALL 使用 Supabase PostgreSQL 数据库存储爪印统计数据

#### Scenario: 数据获取
- **WHEN** 用户访问网站首页
- **THEN** 从 Supabase 数据库获取当前计数并显示

#### Scenario: 数据递增
- **WHEN** 用户点击爪印交互区域
- **THEN** 调用 API 递增数据库中的计数值，并返回最新计数

### Requirement: 并发安全
系统 SHALL 支持多用户并发访问时的计数一致性

#### Scenario: 并发写入
- **WHEN** 多个用户同时点击（<100ms间隔）
- **THEN** 数据库使用原子操作确保计数准确递增

### Requirement: 降级处理
系统 SHALL 在数据库不可用时提供优雅降级

#### Scenario: 数据库连接失败
- **WHEN** Supabase 服务不可用或网络错误
- **THEN** 返回缓存的计数值，不阻塞用户交互

## MODIFIED Requirements
### Requirement: PawCounter 组件
完整迁移到新的数据源，UI 不变

## REMOVED Requirements
### Requirement: 本地 JSON 存储
**Reason**: 本地文件无法实现跨实例共享，不支持真实数据统计
**Migration**: 完全迁移到 Supabase 数据库

---

## 实现状态：✅ 已完成

### 已完成文件
| 文件 | 状态 |
|------|------|
| lib/supabase.ts | ✅ 已创建 |
| lib/paw-storage.ts | ✅ 已重构 |
| app/api/paw/route.ts | ✅ 已适配 |
| .env.example | ✅ 已创建 |

### 待用户配置
1. 配置 Supabase 环境变量
2. 创建 Supabase 数据库表
3. 生产环境部署验证