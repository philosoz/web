'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { TechLoading } from '@/components/Loading';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface Post {
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
}

export default function TechPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visiblePosts, setVisiblePosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts([
        {
          title: "技术成长不是工具积累",
          excerpt: "技术成长不是工具积累，而是思维方式改变。代码能力的提升来自于对问题的深刻理解，而不是掌握多少框架。",
          date: "2024/05/10",
          tags: ["架构", "思维方式", "成长"]
        },
        {
          title: "我如何理解系统设计",
          excerpt: "系统设计的核心是理解问题的本质，而不是追求复杂的架构。从实际需求出发，找到最合适的解决方案。",
          date: "2024/05/05",
          tags: ["架构", "系统设计"]
        },
        {
          title: "关于代码可读性",
          excerpt: "代码的可读性比聪明更重要。好的代码应该像文章一样流畅，让人一眼就能理解其意图。",
          date: "2024/04/28",
          tags: ["最佳实践", "代码质量"]
        },
        {
          title: "TypeScript 泛型深入理解",
          excerpt: "泛型是 TypeScript 中最强大的特性之一，它让我们能够编写可重用且类型安全的代码。",
          date: "2024/04/20",
          tags: ["TypeScript", "编程语言"]
        },
        {
          title: "微服务架构实践经验",
          excerpt: "在项目中实践微服务架构的经验总结，包括服务拆分、通信机制、数据一致性等关键问题。",
          date: "2024/04/15",
          tags: ["架构", "微服务", "后端"]
        },
        {
          title: "React Hooks 最佳实践",
          excerpt: "深入理解 React Hooks 的使用场景和最佳实践，避免常见的陷阱，提升代码质量。",
          date: "2024/04/10",
          tags: ["React", "前端", "编程语言"]
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

  const allTags = useMemo(() => {
    return Array.from(new Set(posts.flatMap(post => post.tags))).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(post => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

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
        <main className="px-8 py-12 max-w-4xl mx-auto">
          <TechLoading />
        </main>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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

        <main className="px-8 py-12 max-w-4xl mx-auto">
          <h1 className="text-3xl mb-8">技术思考</h1>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">技术领域</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedTag === null
                    ? 'bg-[#7A90A4] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedTag === tag
                      ? 'bg-[#7A90A4] text-white'
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
                <div className="flex items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[#7A90A4]/10 text-[#7A90A4] text-xs rounded transition-colors hover:bg-[#7A90A4]/20"
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
            <div className="text-center py-12">
              <p className="text-gray-500">暂无相关技术文章</p>
            </div>
          )}

          <div className="text-center mt-16 py-12 border-t border-gray-200">
            <p className="text-gray-500 mb-4">
              有技术问题想聊聊？
            </p>
            <Link
              href="/chat?topic=技术"
              className="inline-block px-6 py-3 bg-[#7A90A4] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              问我技术问题 →
            </Link>
          </div>
        </main>

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
