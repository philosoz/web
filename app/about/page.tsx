import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 max-w-3xl mx-auto">
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

      {/* Content */}
      <main className="px-8 py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl mb-8">关于我</h1>

        <div className="prose prose-lg">
          <p className="mb-6 text-gray-700 leading-relaxed">
            你好呀，我是张海挺。
          </p>

          <p className="mb-6 text-gray-700 leading-relaxed">
            我是一个喜欢思考的人。在技术领域，我喜欢探索系统设计的本质，
            追求简洁而有效的解决方案。在生活中，我记录日常的感悟，
            相信文字有力量，能帮助我们更好地理解自己和世界。
          </p>

          <p className="mb-6 text-gray-700 leading-relaxed">
            这个网站是我的个人空间。我在这里记录：
          </p>

          <ul className="mb-6 text-gray-700 space-y-2 list-disc list-inside">
            <li>技术学习和实践的思考</li>
            <li>生活中的小感悟</li>
            <li>对一些问题的持续思考</li>
          </ul>

          <p className="mb-6 text-gray-700 leading-relaxed">
            如果你有什么想聊的，随时来找我。我很乐意交流想法。
          </p>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl mb-4">联系方式</h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="text-gray-400">GitHub:</span>{" "}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  github.com/yourusername
                </a>
              </p>
              <p>
                <span className="text-gray-400">邮箱:</span>{" "}
                <a
                  href="mailto:contact@deepself.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  contact@deepself.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-10 border-t border-gray-200 max-w-3xl mx-auto">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>张海挺 · 记录思考，也记录生活</div>
          <Link
            href="/chat"
            className="hover:text-gray-700 transition-colors"
          >
            和我聊聊 →
          </Link>
        </div>
      </footer>
    </div>
  );
}
