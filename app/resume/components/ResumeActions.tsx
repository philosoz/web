"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Resume {
  id: string;
  url: string;
  fileName: string;
  uploadedAt: string;
  isActive: boolean;
}

export default function ResumeActions() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentResume();
  }, []);

  const fetchCurrentResume = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/resume/current");
      const data = await response.json();

      if (data.success && data.resume) {
        setResume(data.resume);
      } else {
        setResume(null);
      }
    } catch (err) {
      console.error("获取简历失败:", err);
      setError("获取简历失败");
    } finally {
      setLoading(false);
    }
  };

  const isPDF = (url: string) => {
    return url.toLowerCase().includes(".pdf");
  };

  const isImage = (url: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  const handlePreview = () => {
    if (resume) {
      window.open(resume.url, "_blank");
    }
  };

  const handleDownload = () => {
    if (resume) {
      const link = document.createElement("a");
      link.href = resume.url;
      link.download = resume.fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center py-4">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-4 bg-blue-400 rounded-full"></div>
            <div className="h-4 w-32 bg-blue-400 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无简历</h3>
          <p className="mt-1 text-sm text-gray-500">请上传简历文件</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">简历文件</h3>
            <p className="text-sm text-gray-500 mt-1">
              {resume.fileName}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              上传时间: {new Date(resume.uploadedAt).toLocaleDateString("zh-CN")}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              预览简历
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors shadow-sm flex items-center gap-2"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              下载简历
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-700">文件预览</h4>
              <button
                onClick={() => setShowPreview(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                关闭预览
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden" style={{ height: "600px" }}>
              {isPDF(resume.url) && (
                <iframe
                  src={resume.url}
                  className="w-full h-full"
                  title="PDF 预览"
                />
              )}
              {isImage(resume.url) && (
                <div className="flex items-center justify-center h-full p-4">
                  <Image
                    src={resume.url}
                    alt={resume.fileName}
                    width={400}
                    height={300}
                    className="max-w-full max-h-full object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {!showPreview && (
          <button
            onClick={() => setShowPreview(true)}
            className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            展开内联预览
          </button>
        )}
      </div>
    </div>
  );
}
