"use client";

import { ResumeUploader } from "@/components/ResumeUploader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Resume {
  id: string;
  fileName: string;
  uploadedAt: string;
  isActive: boolean;
  url: string;
}

export default function ResumeUploadPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/resume/list");
      const data = await response.json();
      
      if (data.resumes) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error("获取简历列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const setDefault = async (id: string) => {
    try {
      setActionLoading(id);
      const response = await fetch("/api/resume/default", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        setResumes(data.resumes);
      } else {
        alert(data.error || "设置默认简历失败");
      }
    } catch (error) {
      console.error("设置默认简历失败:", error);
      alert("设置默认简历失败，请重试");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteResume = async (filename: string) => {
    if (!confirm("确定要删除这份简历吗？")) {
      return;
    }

    try {
      setActionLoading(filename);
      const response = await fetch(`/api/resume/${filename}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setResumes(data.resumes);
      } else {
        alert(data.error || "删除简历失败");
      }
    } catch (error) {
      console.error("删除简历失败:", error);
      alert("删除简历失败，请重试");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUploadSuccess = () => {
    fetchResumes();
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
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

      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-medium mb-2">上传简历</h1>
          <p className="text-gray-500 mb-6">
            上传您的简历文件，支持 PDF、Word 或图片格式
          </p>

          <ResumeUploader onSuccess={handleUploadSuccess} />

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
            <h2 className="text-lg font-medium mb-4">已上传的简历</h2>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin text-3xl mb-2">⏳</div>
                <p>加载中...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p>暂无上传的简历</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className={`p-4 rounded-lg border ${
                      resume.isActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    } transition-colors`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {resume.fileName}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          上传于 {new Date(resume.uploadedAt).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {resume.isActive && (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-medium">
                            当前简历
                          </span>
                        )}
                        {!resume.isActive && (
                          <button
                            onClick={() => setDefault(resume.id)}
                            disabled={actionLoading === resume.id}
                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === resume.id ? "设置中..." : "设为默认"}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const filename = resume.url.split("/").pop() || "";
                            deleteResume(filename);
                          }}
                          disabled={actionLoading === (resume.url.split("/").pop() || "")}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === (resume.url.split("/").pop() || "") ? "删除中..." : "删除"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
