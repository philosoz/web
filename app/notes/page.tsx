import Link from "next/link";

export default function NotesPage() {
  const posts = [
    {
      title: "为什么我开始喜欢独处",
      excerpt: "独处不是逃避，而是为了更好地与世界相处。",
      date: "2024/05/12",
    },
    {
      title: "关于写作这件事",
      excerpt: "写作是思考的工具，也是与自己对话的方式。",
      date: "2024/05/08",
    },
    {
      title: "一些最近的思考",
      excerpt: "最近在思考一些关于生活和工作平衡的问题。",
      date: "2024/05/05",
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
        <h1 className="text-3xl mb-8">写生活</h1>

        <div className="space-y-8">
          {posts.map((post, i) => (
            <article key={i} className="border-b border-gray-100 pb-8">
              <h2 className="text-xl mb-2 hover:text-gray-600 transition-colors cursor-pointer">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-2">{post.excerpt}</p>
              <span className="text-sm text-gray-400">{post.date}</span>
            </article>
          ))}
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
