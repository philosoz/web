import { ChatPanel } from "@/components/chat-panel";

const readinessItems = [
  {
    label: "Streaming UX",
    title: "边生成边显示",
    description: "前端逐块渲染回复，真实聊天体验更像线上产品，而不是一次性刷出整段文本。"
  },
  {
    label: "Secure Proxy",
    title: "服务端代发请求",
    description: "MiniMax Key 只保留在服务端环境变量中，浏览器永远拿不到密钥。"
  },
  {
    label: "Deploy Flow",
    title: "Vercel 直接可上",
    description: "项目已经按 Next.js 部署路径收敛好结构，导入仓库后只需补环境变量。"
  }
];

const launchChecklist = [
  "替换已暴露的 MiniMax API Key，并仅写入 Vercel 环境变量",
  "Production / Preview 都配置 MINIMAX_API_KEY 和 MINIMAX_MODEL",
  "确认主分支构建通过，首页和聊天请求都能正常返回",
  "在 Preview 环境验证移动端输入框、滚动和流式输出体验",
  "上线后绑定正式域名，并检查根域名和 www 的跳转策略"
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <div className="hero-topline">
            <span className="eyebrow">MiniMax Anthropic Streaming</span>
            <span className="status-pill">Deployment Ready</span>
          </div>

          <div className="hero-main">
            <h1>更像正式产品的 AI 聊天页</h1>
            <p className="hero-lead">
              这不是一个只够演示的壳子。页面已经把聊天体验、服务端安全代理和 Vercel
              部署路径一起整理好了，适合直接往正式站点继续扩展。
            </p>

            <div className="hero-metrics">
              <div className="metric-card">
                <span className="metric-value">Anthropic</span>
                <span className="metric-label">MiniMax compatibility</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">Streaming</span>
                <span className="metric-label">Incremental response rendering</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">Vercel</span>
                <span className="metric-label">Production deployment path</span>
              </div>
            </div>

            <div className="readiness-grid">
              {readinessItems.map((item) => (
                <article className="readiness-card" key={item.title}>
                  <span className="readiness-label">{item.label}</span>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="launch-card">
            <div className="launch-card__head">
              <span className="launch-card__eyebrow">Launch Checklist</span>
              <strong>上线前五项确认</strong>
            </div>
            <ul className="launch-list">
              {launchChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <ChatPanel />
      </section>
    </main>
  );
}
