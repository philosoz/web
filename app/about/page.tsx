"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AboutLoading } from "@/components/Loading";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const sections = ["about", "why", "life", "faq", "contact"];
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
        <header className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6 max-w-3xl mx-auto">
          <Link href="/" className="font-medium text-base md:text-lg">
            张海挺<span className="ml-1">•</span>
          </Link>
          <nav className="space-x-4 md:space-x-8 text-xs md:text-sm text-gray-600">
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
        <main className="px-8 py-12 max-w-3xl mx-auto">
          <AboutLoading />
        </main>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-6 max-w-3xl mx-auto">
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
        <main className="px-8 py-12 max-w-3xl mx-auto">
          <h1 className="text-3xl mb-12 font-normal">关于我</h1>

          <div className="space-y-12">
            {/* 自我介绍 */}
            <section 
              id="about-section"
              className={`transition-all duration-300 ${
                visibleSections.has("about") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h2 className="text-lg font-medium mb-4 text-gray-900">我是谁</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  你好，我是张海挺。现在在杭州做后端开发，平时写写代码，偶尔也写点东西。
                </p>
                <p>
                  大学学的是软件工程，毕业后一直在互联网行业打滚。最早做过全栈开发，后来慢慢聚焦在后端和系统架构这块。现在主要用 Go 和 Python，偶尔也会写点 TypeScript。
                </p>
                <p>
                  技术之外，我是个比较安静的人。喜欢早起，清晨的时间总是让我觉得可以做些有意义的事。周末常常泡在咖啡馆里，看看书，写写代码，或者就坐着发呆。我觉得人需要一些不动脑子的时间，让思绪自由飘一会儿。
                </p>
                <p>
                  喜欢摄影，主要是拍些日常的东西。不追求大片，更在意能不能捕捉到某个瞬间的情绪。也在尝试把技术思维和人文思考结合起来，觉得两者并不矛盾，反而可以相互启发。
                </p>
              </div>
            </section>

            {/* 为什么做这个网站 */}
            <section 
              id="why-section"
              className={`transition-all duration-300 ${
                visibleSections.has("why") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h2 className="text-lg font-medium mb-4 text-gray-900">为什么做这个网站</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  其实没有什么特别宏大的理由。最开始就是想找一个安静的地方，可以写点东西，记录一些想法。朋友圈太喧闹，博客平台又太杂，总觉得没有完全合适的地方。
                </p>
                <p>
                  后来干脆自己搭了一个。就这样，慢慢地写着写着，这个地方就变成了现在的样子——一个可以安安静静说话的地方。
                </p>
                <p>
                  我希望这个网站是一个让人能静下来的空间。如果你在这里看到某些文字，觉得有点共鸣，那就挺好的。如果你有想聊的，随时欢迎。
                </p>
              </div>
            </section>

            {/* 日常生活和兴趣 */}
            <section 
              id="life-section"
              className={`transition-all duration-300 ${
                visibleSections.has("life") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h2 className="text-lg font-medium mb-4 text-gray-900">日常与兴趣</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  早上六点多起床，算是习惯了。冲杯咖啡，看看窗外的天色，然后开始一天的工作。不太喜欢在早上处理复杂的事情，更愿意把需要深度思考的任务放在上午。
                </p>
                <p>
                  工作之余，会读些书。技术书会看，但最近更想看些人文社科类的。历史、心理学、社会学这些都有兴趣，觉得这些领域的思考方式挺有意思的。偶尔也看小说，最近在看一些日本作家的作品。
                </p>
                <p>
                  运动方面，跑步和游泳交叉着来。不追求配速或者距离，能动起来就行。周末有时候会骑自行车出去转转，换换环境，呼吸点不一样的空气。
                </p>
                <p>
                  电影也看，但不多。喜欢那种节奏慢一些、能让人思考的片子。商业大片偶尔看看，但不会特别追。
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section 
              id="faq-section"
              className={`transition-all duration-300 ${
                visibleSections.has("faq") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h2 className="text-lg font-medium mb-4 text-gray-900">常见问题</h2>
              <div className="space-y-6">
                <div className="transition-transform will-change-transform hover-lift p-4 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-2">这个网站用什么技术做的？</h3>
                  <p className="text-gray-700 leading-relaxed">
                    用 Next.js 搭的，前端用 Tailwind CSS 做样式。部署在 Vercel 上，图片存放在 Cloudflare R2。整体结构比较简单，没有用什么复杂的东西。
                  </p>
                </div>

                <div className="transition-transform will-change-transform hover-lift p-4 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-2">你是全栈工程师吗？</h3>
                  <p className="text-gray-700 leading-relaxed">
                    勉强算是吧。最早做过前端，后来转后端，再后来也写一些运维相关的代码。什么都会一点，什么都不算特别精。觉得自己更偏向后端一些。
                  </p>
                </div>

                <div className="transition-transform will-change-transform hover-lift p-4 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-2">可以联系你吗？怎么联系？</h3>
                  <p className="text-gray-700 leading-relaxed">
                    当然可以。给我发邮件就行，地址在页面底部有。或者直接在聊天页面留言，我一般会看。也欢迎在 GitHub 上提 Issue 或者 PR。
                  </p>
                </div>

                <div className="transition-transform will-change-transform hover-lift p-4 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-2">你接受什么样的合作？</h3>
                  <p className="text-gray-700 leading-relaxed">
                    技术合作、技术分享这些都可以聊。如果你有一个有意思的项目想找人一起做，或者想找人讨论一些问题，都可以联系我。不过说实话，我平时工作比较忙，能投入的时间有限。
                  </p>
                </div>

                <div className="transition-transform will-change-transform hover-lift p-4 rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-2">你平时在哪里学习技术？</h3>
                  <p className="text-gray-700 leading-relaxed">
                    主要是官方文档和各种技术博客。GitHub 和 Hacker News 也常逛，会看看有没有什么新鲜的东西。看书的话，现在更倾向于买纸质书，虽然看得慢一些，但感觉更踏实。
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* 联系方式 */}
          <div 
            id="contact-section"
            className={`mt-16 pt-8 border-t border-gray-200 transition-all duration-300 ${
              visibleSections.has("contact") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <h2 className="text-lg font-medium mb-4 text-gray-900">联系方式</h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="text-gray-400">GitHub:</span>{" "}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  github.com/yourusername
                </a>
              </p>
              <p>
                <span className="text-gray-400">邮箱:</span>{" "}
                <a
                  href="mailto:contact@deepself.com"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  contact@deepself.com
                </a>
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-10 border-t border-gray-200 max-w-3xl mx-auto">
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
