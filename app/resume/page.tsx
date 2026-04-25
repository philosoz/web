import Link from "next/link";

export default function ResumePage() {
  const skills = ["React", "Next.js", "TypeScript", "Node.js", "Python", "系统设计"];

  const experience = [
    {
      title: "技术专家",
      company: "某科技公司",
      period: "2020 - 至今",
      description: "负责核心系统架构设计与开发，推动技术团队的技术升级。",
    },
    {
      title: "高级工程师",
      company: "某互联网公司",
      period: "2018 - 2020",
      description: "主导多个重要项目的技术实现，显著提升系统性能。",
    },
  ];

  const projects = [
    {
      title: "个人博客系统",
      description: "一个简洁的个人博客，包含 AI 对话功能。",
      tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "开源项目",
      description: "贡献了多个开源项目，积累了丰富的社区经验。",
      tech: ["Python", "JavaScript", "Go"],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 max-w-4xl mx-auto">
        <Link href="/" className="font-medium text-lg">
          张海挺<span className="ml-1">•</span>
        </Link>
        <nav className="space-x-8 text-sm text-gray-600">
          <Link href="/notes" className="hover:text-gray-900 transition-colors">
            笔记
          </Link>
          <Link href="/tech" className="hover:text-gray-900 transition-colors">
            技术
          </Link>
          <Link href="/resume" className="hover:text-gray-900 transition-colors">
            简历
          </Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">
            关于
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="px-8 py-12 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2">
            <h1 className="text-3xl mb-2">张海挺</h1>
            <p className="text-gray-600 mb-6">技术专家 · 独立创作者</p>

            <div className="mb-8">
              <h2 className="text-xl mb-4 border-b border-gray-200 pb-2">个人简介</h2>
              <p className="text-gray-700 leading-relaxed">
                我是一个热爱技术的工程师，也是一个喜欢思考的写作者。
                致力于用技术解决实际问题，用文字记录思考过程。
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl mb-4 border-b border-gray-200 pb-2">工作经历</h2>
              <div className="space-y-6">
                {experience.map((exp, i) => (
                  <div key={i}>
                    <h3 className="font-medium mb-1">{exp.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {exp.company} · {exp.period}
                    </p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl mb-4 border-b border-gray-200 pb-2">项目经历</h2>
              <div className="space-y-6">
                {projects.map((project, i) => (
                  <div key={i}>
                    <h3 className="font-medium mb-1">{project.title}</h3>
                    <p className="text-gray-700 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, j) => (
                        <span
                          key={j}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg mb-4">技能</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="text-sm bg-white px-3 py-1 rounded shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h2 className="text-lg mb-4">联系方式</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>GitHub</p>
                  <p>邮箱</p>
                  <p>地点</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full bg-[#D6A77A] text-white py-3 rounded-lg hover:opacity-90 transition-opacity">
                下载简历
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-10 border-t border-gray-200 max-w-4xl mx-auto">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>张海挺 · 记录思考，也记录生活</div>
          <Link href="/chat" className="hover:text-gray-700 transition-colors">
            和我聊聊 →
          </Link>
        </div>
      </footer>
    </div>
  );
}
