"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { NotesLoading } from "@/components/Loading";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface Post {
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
}

export default function NotesPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visiblePosts, setVisiblePosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts([
        {
          title: "为什么我开始喜欢独处",
          excerpt: "独处不是逃避，而是为了更好地与世界相处。",
          date: "2024/05/12",
          tags: ["生活", "独处"],
        },
        {
          title: "关于写作这件事",
          excerpt: "写作是思考的工具，也是与自己对话的方式。",
          date: "2024/05/08",
          tags: ["写作", "思考"],
        },
        {
          title: "一些最近的思考",
          excerpt: "最近在思考一些关于生活和工作平衡的问题。",
          date: "2024/05/05",
          tags: ["工作", "生活"],
        },
        {
          title: "阅读给我的改变",
          excerpt: "阅读不仅是获取知识，更是重新认识自己的过程。",
          date: "2024/05/01",
          tags: ["阅读", "成长"],
        },
        {
          title: "保持初心的力量",
          excerpt: "在这个快速变化的世界里，保持初心显得尤为珍贵。",
          date: "2024/04/28",
          tags: ["生活", "初心"],
        },
      ]);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && posts.length > 0) {
      posts.forEach((_, index) => {
        setTimeout(() => {
          setVisiblePosts(prev => new Set([...prev, index]));
        }, index * 80);
      });
    }
  }, [loading, posts]);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(post => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <header className="flex justify-between items-center px-4 md:px-8 py-4 md:py-6 max-w-4xl mx-auto">
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
        <main className="px-8 py-12 max-w-4xl mx-auto">
          <NotesLoading />
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

        {/* Content */}
        <main className="px-8 py-12 max-w-4xl mx-auto">
          <h1 className="text-3xl mb-8">写生活</h1>

          {/* 标签筛选 */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedTag === null
                    ? 'bg-[#D6A77A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-[#D6A77A] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {filteredPosts.map((post, i) => (
              <article 
                key={i} 
                className={`border-b border-gray-100 pb-8 transition-all duration-300 ${
                  visiblePosts.has(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <h2 className="text-xl mb-2 hover:text-gray-600 transition-colors cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded transition-colors hover:bg-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">{post.date}</span>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-block p-4 mb-4 rounded-full bg-gray-100">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">暂无相关笔记</p>
              <p className="text-sm text-gray-400">试试其他标签，或者</p>
              <Link href="/chat" className="text-[#D6A77A] hover:underline text-sm">
                和我聊聊 →
              </Link>
            </div>
          )}

          {/* 底部CTA */}
          <div className="text-center mt-16 py-12 border-t border-gray-200">
            <p className="text-gray-500 mb-4">
              想更深入地聊聊？
            </p>
            <Link
              href="/chat"
              className="inline-block px-6 py-3 bg-[#D6A77A] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              和我对话 →
            </Link>
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
    </ErrorBoundary>
  );
}
