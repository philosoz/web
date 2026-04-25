"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PawInteraction from "@/components/PawInteraction";
import PawCounter from "@/components/PawCounter";
import FadeInSection from "@/components/FadeInSection";

export default function HomePage() {
  const [pawCount, setPawCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/paw")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.count !== undefined) {
          setPawCount(data.count);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch paw count:', error);
      });
  }, []);

  const handleCountUpdate = (count: number) => {
    setPawCount(count);
  };

  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
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

      <section className="px-4 md:px-8 py-12 md:py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        <FadeInSection>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-4 md:mb-6">
              我在记录一些<br />还没完全想清楚的事情。
            </h1>
            <p className="text-gray-500 mb-6">
              也许这些文字会在未来的某一天，给你一些启发。
            </p>
            <Link
              href="/chat"
              className="inline-block bg-[#D6A77A] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              和我聊聊 →
            </Link>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="relative">
            <PawInteraction onCountUpdate={handleCountUpdate} />
            <div className="absolute bottom-4 right-4">
              <PawCounter initialCount={pawCount} />
            </div>
          </div>
        </FadeInSection>
      </section>

      <FadeInSection>
        <section className="px-8 pb-20 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg mb-2">和我聊聊吧 👋</h2>
            <p className="text-sm text-gray-500 mb-4">
              你可以随便问我一些问题，关于生活、技术、思考，或者你感兴趣的任何话题。
            </p>
            <div className="bg-gray-100 rounded-lg p-3 mb-4 text-sm">
              你好呀，我是张海挺。很高兴见到你，有什么想聊的吗？
            </div>
            <Link
              href="/chat"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 01-9-9c0-4.418 4.03-8 9-8a9 9 0 018 9z"
                />
              </svg>
              进入完整对话 →
            </Link>
          </div>
        </section>
      </FadeInSection>

      <section className="px-4 md:px-8 pb-12 md:pb-20 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <FadeInSection delay={0}>
          <Link
            href="/notes"
            className="block bg-white p-6 rounded-xl shadow-md hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <h3 className="mb-2 font-medium">写生活</h3>
            <p className="text-sm text-gray-500">
              一些日常、情绪，没有答案的想法
            </p>
          </Link>
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <Link
            href="/tech"
            className="block bg-white p-6 rounded-xl shadow-md hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <h3 className="mb-2 font-medium">技术思考</h3>
            <p className="text-sm text-gray-500">
              我对问题的理解，以及解决的过程
            </p>
          </Link>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <Link
            href="/about"
            className="block bg-white p-6 rounded-xl shadow-md hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            <h3 className="mb-2 font-medium">关于我</h3>
            <p className="text-sm text-gray-500">
              更确定的部分，我的经历与能力
            </p>
          </Link>
        </FadeInSection>
      </section>

      <section className="px-8 pb-20 max-w-7xl mx-auto">
        <FadeInSection>
          <h2 className="text-xl mb-6">最近写的</h2>
        </FadeInSection>
        <div className="grid md:grid-cols-4 gap-6">
          <FadeInSection delay={0}>
            <article className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-200" />
              <div className="p-4">
                <h3 className="text-sm mb-2 font-medium">
                  为什么我开始喜欢独处
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  独处不是逃避，而是重新整理自己。
                </p>
                <span className="text-xs text-gray-400">生活 · 2024/05/12</span>
              </div>
            </article>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <article className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200" />
              <div className="p-4">
                <h3 className="text-sm mb-2 font-medium">
                  技术成长不是工具积累
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  理解问题的本质比学会用某个框架更重要。
                </p>
                <span className="text-xs text-gray-400">技术 · 2024/05/10</span>
              </div>
            </article>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <article className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="h-40 bg-gradient-to-br from-green-100 to-green-200" />
              <div className="p-4">
                <h3 className="text-sm mb-2 font-medium">关于写作这件事</h3>
                <p className="text-xs text-gray-500 mb-2">
                  写作是思考的工具，也是与自己对话的方式。
                </p>
                <span className="text-xs text-gray-400">生活 · 2024/05/08</span>
              </div>
            </article>
          </FadeInSection>

          <FadeInSection delay={0.3}>
            <article className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="h-40 bg-gradient-to-br from-purple-100 to-purple-200" />
              <div className="p-4">
                <h3 className="text-sm mb-2 font-medium">我如何理解系统设计</h3>
                <p className="text-xs text-gray-500 mb-2">
                  系统设计的核心是理解问题的本质。
                </p>
                <span className="text-xs text-gray-400">技术 · 2024/05/05</span>
              </div>
            </article>
          </FadeInSection>
        </div>
      </section>

      <footer className="px-4 md:px-8 py-8 md:py-10 border-t border-gray-200 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>张海挺 · 记录思考，也记录生活</div>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors"
            >
              GitHub
            </a>
            <a
              href="mailto:contact@deepself.com"
              className="hover:text-gray-700 transition-colors"
            >
              邮箱
            </a>
            <Link href="/rss" className="hover:text-gray-700 transition-colors">
              RSS
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
