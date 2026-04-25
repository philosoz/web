"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ResumeActions from "./components/ResumeActions";
import { ResumeLoading } from "@/components/Loading";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface Skill {
  name: string;
  level: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  highlights: string[];
}

interface Project {
  title: string;
  description: string;
  role: string;
  outcome: string;
  tech: string[];
}

export default function ResumePage() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Record<string, Skill[]>>({});
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setSkills({
        frontend: [
          { name: "React", level: "熟练" },
          { name: "Next.js", level: "熟练" },
          { name: "TypeScript", level: "熟练" },
          { name: "Tailwind CSS", level: "熟练" },
        ],
        backend: [
          { name: "Node.js", level: "熟练" },
          { name: "Python", level: "熟悉" },
          { name: "Go", level: "熟悉" },
          { name: "PostgreSQL", level: "熟悉" },
        ],
        tools: [
          { name: "Git", level: "熟练" },
          { name: "Docker", level: "熟悉" },
          { name: "Linux", level: "熟悉" },
        ],
        other: [
          { name: "系统设计", level: "有经验" },
          { name: "API 设计", level: "有经验" },
          { name: "性能优化", level: "有经验" },
        ],
      });

      setExperience([
        {
          title: "技术专家",
          company: "某科技公司",
          period: "2020 - 至今",
          highlights: [
            "主导核心系统架构设计与重构，系统响应时间降低 40%",
            "推动团队技术升级，建立 Code Review 机制和前端工程化流程",
            "负责关键技术选型，指导 5 人团队完成微服务改造",
            "设计并实现实时数据管道，日处理数据量超过千万条",
          ],
        },
        {
          title: "高级前端工程师",
          company: "某互联网公司",
          period: "2018 - 2020",
          highlights: [
            "主导多个重要项目的前端架构设计与实现",
            "优化首屏加载性能，页面加载时间缩短 60%",
            "推动组件库建设，统一团队开发规范，提升开发效率 30%",
            "引入自动化测试，核心模块覆盖率提升至 85%",
          ],
        },
        {
          title: "前端开发工程师",
          company: "某创业公司",
          period: "2016 - 2018",
          highlights: [
            "从零参与搭建前端技术体系",
            "负责核心业务模块开发，支持产品快速迭代",
            "协助搭建 CI/CD 流程，实现自动化部署",
          ],
        },
      ]);

      setProjects([
        {
          title: "AI 个人助手平台",
          description:
            "一个结合 AI 对话和内容管理的个人效率工具。最开始只是想解决自己笔记散乱的问题，后来慢慢完善成一个完整的产品。开发过程中最大的挑战是如何让 AI 更好地理解上下文，提供更精准的建议。",
          role: "独立开发，从产品设计到技术实现全程负责",
          outcome:
            "帮助超过 1000 名用户提升了知识管理效率，收获了不少正向反馈",
          tech: ["Next.js", "TypeScript", "OpenAI API", "PostgreSQL"],
        },
        {
          title: "实时协作白板",
          description:
            "为团队打造的在线协作工具，核心难点是实时同步和冲突处理。通过 WebSocket 实现低延迟同步，使用 CRDT 算法解决多用户同时编辑的冲突问题。",
          role: "负责实时通信模块和数据同步方案设计",
          outcome: "已在内部团队稳定运行，日均活跃用户 50+",
          tech: ["React", "WebSocket", "Canvas", "Redis"],
        },
        {
          title: "开源组件库",
          description:
            "在工作中发现团队重复造轮子的问题，于是萌生了做一套统一组件库的想法。从设计规范出发，抽象通用交互模式，逐步沉淀出 30+ 可复用组件。",
          role: "发起人和主要维护者",
          outcome:
            "GitHub 收获 800+ Stars，被多个项目采用",
          tech: ["React", "TypeScript", "Storybook", "Rollup"],
        },
      ]);

      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const sections = ["about", "experience", "projects", "skills"];
      sections.forEach((section, index) => {
        setTimeout(() => {
          setVisibleSections(prev => new Set([...prev, section]));
        }, index * 100);
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen">
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
        <main className="px-8 py-6 max-w-4xl mx-auto">
          <ResumeLoading />
        </main>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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

        {/* Resume Actions */}
        <div className="px-8 max-w-4xl mx-auto">
          <ResumeActions />
        </div>

        {/* Content */}
        <main className="px-4 md:px-8 py-4 md:py-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="md:col-span-2">
              <h1 className="text-3xl mb-2">张海挺</h1>
              <p className="text-gray-600 mb-6">技术专家 · 独立创作者</p>

              <div 
                className={`mb-8 transition-all duration-300 ${
                  visibleSections.has("about") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-xl mb-4 border-b border-gray-200 pb-2">关于我</h2>
                <div className="space-y-3 text-gray-700 leading-relaxed">
                  <p>
                    第一次认真写代码是大三选修的 C 语言课，当时只觉得能控制电脑做出东西来很有意思。后来因为想做个自己的网站，误打误撞入了前端这个坑，没想到一做就是这么多年。
                  </p>
                  <p>
                    技术对我而言不仅是谋生工具，更是一种表达的媒介。我喜欢把复杂的问题拆解成清晰的模块，也享受那种「这个问题我想明白了」的快感。同时，我也保持着写东西的习惯——技术博客、读书笔记、偶尔的随想，文字让我保持思考的条理。
                  </p>
                  <p>
                    工作之外，我爱骑行和摄影，用镜头记录生活，用骑行放空大脑。技术是严肃的，但做技术的人可以是有温度的，这是我一直在努力的方向。
                  </p>
                </div>
              </div>

              <div 
                className={`mb-8 transition-all duration-300 ${
                  visibleSections.has("experience") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-xl mb-4 border-b border-gray-200 pb-2">工作经历</h2>
                <div className="space-y-6">
                  {experience.map((exp, i) => (
                    <div key={i} className="border-l-2 border-gray-200 pl-4 transition-transform will-change-transform">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">{exp.title}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                          {exp.period}
                        </span>
                      </div>
                      <ul className="space-y-1 text-gray-700">
                        {exp.highlights.map((highlight, j) => (
                          <li key={j} className="flex items-start">
                            <span className="mr-2 text-gray-400">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                className={`transition-all duration-300 ${
                  visibleSections.has("projects") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-xl mb-4 border-b border-gray-200 pb-2">项目经历</h2>
                <div className="space-y-6">
                  {projects.map((project, i) => (
                    <div 
                      key={i} 
                      className="bg-gray-50 p-5 rounded-lg transition-transform will-change-transform hover-lift"
                    >
                      <h3 className="font-medium text-lg mb-2">{project.title}</h3>
                      <div className="space-y-3 text-gray-700">
                        <p className="leading-relaxed">{project.description}</p>
                        <div className="text-sm">
                          <span className="font-medium text-gray-600">我的角色：</span>
                          <span>{project.role}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-600">成果：</span>
                          <span className="text-green-700">{project.outcome}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {project.tech.map((tech, j) => (
                            <span
                              key={j}
                              className="text-xs bg-white px-2 py-1 rounded border border-gray-200 transition-colors hover:border-gray-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className={`bg-white border border-gray-200 p-4 sm:p-6 rounded-lg sticky top-4 sm:top-6 transition-all duration-300 ${
                  visibleSections.has("skills") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                  技能
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">前端</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.frontend.map((skill) => (
                        <span
                          key={skill.name}
                          className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded transition-colors hover:bg-blue-100"
                          title={skill.level}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">后端</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.backend.map((skill) => (
                        <span
                          key={skill.name}
                          className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded transition-colors hover:bg-green-100"
                          title={skill.level}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">工具</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.tools.map((skill) => (
                        <span
                          key={skill.name}
                          className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded transition-colors hover:bg-gray-200"
                          title={skill.level}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">其他</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.other.map((skill) => (
                        <span
                          key={skill.name}
                          className="text-sm bg-purple-50 text-purple-700 px-2 py-1 rounded transition-colors hover:bg-purple-100"
                          title={skill.level}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">
                    联系方式
                  </h2>
                  <div className="space-y-3">
                    <a
                      href="https://github.com/zhanghaiting"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <span className="mr-2">📦</span>
                      <span>GitHub</span>
                    </a>
                    <a
                      href="mailto:zhanghaiting@example.com"
                      className="flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <span className="mr-2">✉️</span>
                      <span>zhanghaiting@example.com</span>
                    </a>
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="mr-2">📍</span>
                      <span>杭州</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 md:px-8 py-8 md:py-10 border-t border-gray-200 max-w-4xl mx-auto">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>张海挺 · 记录思考，也记录生活</div>
            <Link href="/chat" className="hover:text-gray-700 transition-colors">
              和我聊聊 →
            </Link>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}