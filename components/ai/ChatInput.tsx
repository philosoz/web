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
    <div className="border-t border-gray-100 p-6 bg-white">
      <div className="max-w-[720px] mx-auto flex gap-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="你在想什么？"
          disabled={loading}
          rows={1}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200 resize-none disabled:opacity-50 placeholder:text-gray-400 focus:border-gray-300 hover:border-gray-300"
          style={{
            minHeight: "48px",
            maxHeight: "160px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Inter', sans-serif",
            boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !value.trim()}
          className="bg-[#8C9A8F] text-white px-5 py-3 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Inter', sans-serif",
            minWidth: "60px",
          }}
        >
          {loading ? "..." : "发送"}
        </button>
      </div>
    </div>
  );
}
