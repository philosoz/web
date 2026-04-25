"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const [pawCount, setPawCount] = useState(128);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [paws, setPaws] = useState<Array<{ id: number; x: number; y: number; removing?: boolean }>>([]);
  const [inputValue, setInputValue] = useState("");

  const handlePawClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".paw-counter")) return;

    setPawCount(pawCount + 1);
    setShowPlusOne(true);

    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPaw = { id: Date.now(), x, y };
    const updatedPaws = [...paws, newPaw].slice(-6);
    setPaws(updatedPaws);

    setTimeout(() => {
      setShowPlusOne(false);
    }, 1000);

    setTimeout(() => {
      setPaws((prev) =>
        prev.map((p) => (p.id === newPaw.id ? { ...p, removing: true } : p))
      );
      setTimeout(() => {
        setPaws((prev) => prev.filter((p) => p.id !== newPaw.id));
      }, 1000);
    }, 3000);
  };

  const handleSendMessage = (message: string) => {
    setInputValue(message);
    window.location.href = "/chat?message=" + encodeURIComponent(message);
  };

  const sections = [
    {
      title: "写生活",
      desc: "一些日常、情绪、没有答案的想法",
    },
    {
      title: "技术思考",
      desc: "我对问题的理解，以及解决的过程",
    },
    {
      title: "关于我",
      desc: "更确定的部分，我的经历与能力",
    },
  ];

  const posts = [
    {
      title: "为什么我开始喜欢独处",
      excerpt: "独处不是逃避，而是为了更好地与世界相处。",
      category: "生活",
      date: "2024/05/12",
    },
    {
      title: "技术成长不是工具积累",
      excerpt: "技术成长不是工具积累，而是思维方式改变。",
      category: "技术",
      date: "2024/05/10",
    },
    {
      title: "关于写作这件事",
      excerpt: "写作是思考的工具，也是与自己对话的方式。",
      category: "生活",
      date: "2024/05/08",
    },
    {
      title: "我如何理解系统设计",
      excerpt: "系统设计的核心是理解问题的本质，而不是追求复杂的架构。",
      category: "技术",
      date: "2024/05/05",
    },
  ];

  const suggestions = [
    "你最近在写什么？",
    "你是怎么思考问题的？",
    "有什么值得看的内容吗？",
    "你平时喜欢做什么？",
  ];

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="font-medium text-lg">
          张海挺<span className="ml-1">•</span>
        </Link>
        <nav className="space-x-8 text-sm text-gray-600">
          <Link
            href="/notes"
            className="hover:text-gray-900 transition-colors"
          >
            笔记
          </Link>
          <Link
            href="/tech"
            className="hover:text-gray-900 transition-colors"
          >
            技术
          </Link>
          <Link
            href="/resume"
            className="hover:text-gray-900 transition-colors"
          >
            简历
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-900 transition-colors"
          >
            关于
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="px-8 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* TEXT */}
        <div>
          <h1 className="text-4xl md:text-5xl leading-relaxed mb-6 text-balance">
            我在记录一些
            <br />
            还没完全想清楚的事情。
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

        {/* IMAGE + PAW */}
        <div
          onClick={handlePawClick}
          className="relative cursor-crosshair overflow-hidden rounded-xl"
          style={{ height: "300px" }}
        >
          {/* Paw pattern background */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, #FEF3E2 0%, #FDE8D7 50%, #F5D5C8 100%),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D6A77A' fill-opacity='0.15'%3E%3Cpath d='M30 10c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm0 12c-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5-2.5-5.5-5.5-5.5zm0 10c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm-12-22c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5zm0 10c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5zm24 0c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z'/%3E%3C/g%3E%3C/svg%3E")
              `,
              backgroundSize: "60px 60px, 60px 60px",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-center text-amber-800 text-sm px-4 bg-white/50 backdrop-blur-sm py-2 rounded-lg">
              点击留下你的爪印 🐾
            </p>
          </div>

          {/* Render paws */}
          {paws.map((paw) => (
            <motion.div
              key={paw.id}
              initial={{ opacity: 0.8, scale: 0.8 }}
              animate={{
                opacity: paw.removing ? 0 : 0.8,
                scale: paw.removing ? 1.2 : 1,
              }}
              transition={{ duration: 1 }}
              className="absolute text-4xl select-none pointer-events-none"
              style={{
                left: `${paw.x}px`,
                top: `${paw.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              🐾
            </motion.div>
          ))}

          {/* paw counter */}
          <div className="paw-counter absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm flex items-center gap-2 z-10">
            <span>今天有 {pawCount} 只小狗来过 🐾</span>
            <AnimatePresence>
              {showPlusOne && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -10 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-green-500 font-medium"
                >
                  +1
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* AI CARD */}
      <section className="px-8 pb-20 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg mb-2">和我聊聊吧 👋</h2>
          <p className="text-sm text-gray-500 mb-4">
            你可以随便问我一些问题，关于生活、技术、思考，或者你感兴趣的任何话题。
          </p>

          {/* message */}
          <div className="bg-gray-100 rounded-lg p-3 mb-4 text-sm">
            你好呀，我是张海挺。很高兴见到你，有什么想聊的吗？
          </div>

          {/* suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="border border-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="你最近在想什么？"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  handleSendMessage(inputValue);
                }
              }}
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-300 transition-colors"
            />
            <button
              onClick={() => inputValue.trim() && handleSendMessage(inputValue)}
              className="bg-[#8C9A8F] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              发送
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            AI回答可能不完全准确，仅供参考。
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100">
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
        </div>
      </section>

      {/* SECTIONS */}
      <section className="px-8 pb-20 max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {sections.map((item, i) => (
          <Link
            href={
              item.title === "写生活"
                ? "/notes"
                : item.title === "技术思考"
                ? "/tech"
                : "/about"
            }
            key={i}
            className="bg-white p-6 rounded-xl shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            <h3 className="mb-2 font-medium">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </section>

      {/* POSTS */}
      <section className="px-8 pb-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl">最近写的</h2>
          <Link
            href="/notes"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {posts.map((post, i) => (
            <article
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <img
                src={`https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80`}
                alt={post.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-sm mb-2 font-medium leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="text-xs text-gray-400">
                  {post.category} · {post.date}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-10 border-t border-gray-200 max-w-7xl mx-auto">
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
            <Link
              href="/rss"
              className="hover:text-gray-700 transition-colors"
            >
              RSS
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
