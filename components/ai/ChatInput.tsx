"use client";

import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
}

export function ChatInput({ onSend, loading }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || loading) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="max-w-3xl mx-auto flex gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="你最近在想什么？"
          disabled={loading}
          rows={1}
          className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-300 transition-colors resize-none disabled:opacity-50"
          style={{ minHeight: "40px", maxHeight: "120px" }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !value.trim()}
          className="bg-[#8C9A8F] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "发送"}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center max-w-3xl mx-auto">
        AI回答可能不完全准确，仅供参考。
      </p>
    </div>
  );
}
