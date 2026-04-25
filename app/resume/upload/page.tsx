"use client";

import { ResumeUploader } from "@/components/ResumeUploader";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResumeUploadPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回
          </button>
          <Link href="/" className="font-medium text-lg">
            张海挺<span className="ml-1">•</span>
          </Link>
        </div>
        <div className="text-sm text-gray-500">简历管理</div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-medium mb-2">上传简历</h1>
          <p className="text-gray-500 mb-6">
            上传您的简历文件，支持 PDF、Word 或图片格式
          </p>

          <ResumeUploader />

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-medium mb-4">使用说明</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-gray-400">1.</span>
                <span>点击选择文件或拖拽文件到上传区域</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">2.</span>
                <span>支持 PDF、Word（.doc/.docx）、图片格式</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">3.</span>
                <span>文件大小限制 10MB</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">4.</span>
                <span>上传后可以复制文件链接</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-medium mb-4">当前简历</h2>
            <p className="text-sm text-gray-500">
              简历将显示在简历页面，您可以随时上传新版本替换
            </p>
          </div>
        </div>

        {/* 快捷链接 */}
        <div className="mt-6 flex gap-4">
          <Link
            href="/resume"
            className="flex-1 bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium">查看简历</div>
            <div className="text-xs text-gray-500">预览简历页面</div>
          </Link>
          <Link
            href="/"
            className="flex-1 bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">🏠</div>
            <div className="text-sm font-medium">返回首页</div>
            <div className="text-xs text-gray-500">回到网站首页</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
