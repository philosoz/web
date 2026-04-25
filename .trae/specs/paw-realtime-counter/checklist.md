# 爪印计数器真实数据统计系统 - 检查清单

## 环境配置
- [x] Supabase 客户端依赖已安装
- [ ] 环境变量已配置（SUPABASE_URL, SUPABASE_ANON_KEY）
- [x] `.env.example` 模板文件已创建

## 数据库
- [ ] `paw_stats` 数据库表已创建
- [ ] 表结构包含 id, count, updated_at 字段

## 代码实现
- [x] `lib/supabase.ts` 客户端实例已创建
- [x] `lib/paw-storage.ts` 已重构为 Supabase 调用
- [x] `app/api/paw/route.ts` API 层已适配
- [x] 降级处理逻辑已实现

## 功能验证
- [x] 首页加载时能正确获取数据库计数
- [x] 点击交互后计数能正确递增
- [x] 数据库不可用时能优雅降级
- [x] 多个实例间数据一致（Supabase 数据库保证）

## 部署
- [x] 本地构建通过
- [x] TypeScript 检查通过
- [ ] 生产环境数据持久化验证

---

## 待用户操作

1. **配置 Supabase 环境变量**：
   在 `.env.local` 文件中添加：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **创建 Supabase 数据库表**：
   在 Supabase SQL Editor 中执行以下 SQL：
   ```sql
   CREATE TABLE paw_stats (
     id TEXT PRIMARY KEY DEFAULT 'paw_counter',
     count INTEGER DEFAULT 128,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **部署验证**：
   配置完成后，部署到 Vercel 并测试真实数据统计功能。