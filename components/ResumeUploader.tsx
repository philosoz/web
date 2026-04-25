"use client";

import { useState } from "react";

export function ResumeUploader() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    url?: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "上传成功！",
          url: data.url,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "上传失败",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "网络错误，请重试",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragOver 
            ? "border-amber-500 bg-amber-50" 
            : "border-gray-300 hover:border-gray-400"
          }
        `}
      >
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="text-gray-600">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p>上传中...</p>
          </div>
        ) : (
          <>
            <label htmlFor="resume-upload" className="cursor-pointer">
              <div className="text-5xl mb-4">📄</div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                点击上传或拖拽文件
              </p>
              <p className="text-sm text-gray-500">
                支持 PDF、Word、图片格式，最大 10MB
              </p>
            </label>
          </>
        )}
      </div>

      {result && (
        <div
          className={`
            p-4 rounded-lg ${
              result.success
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }
          `}
        >
          <p className="font-medium">{result.message}</p>
          {result.success && result.url && (
            <div className="mt-2">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                查看上传的文件 →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
