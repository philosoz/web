"use client";

import { memo, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
}

// 样式常量
const styles = {
  container: "border-t border-gray-100 p-6 bg-white",
  innerContainer: "max-w-[720px] mx-auto flex gap-3",
  textarea: "flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200 resize-none disabled:opacity-50 placeholder:text-gray-400 focus:border-gray-300 hover:border-gray-300",
  button: "bg-[#8C9A8F] text-white px-5 py-3 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Inter', sans-serif",
} as const;

function ChatInputComponent({ onSend, loading }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="你在想什么？"
          disabled={loading}
          rows={1}
          className={styles.textarea}
          style={{
            minHeight: "48px",
            maxHeight: "160px",
            fontFamily: styles.fontFamily,
            boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !value.trim()}
          className={styles.button}
          style={{
            fontFamily: styles.fontFamily,
            minWidth: "60px",
          }}
        >
          {loading ? "..." : "发送"}
        </button>
      </div>
    </div>
  );
}

// 使用 memo 优化
export const ChatInput = memo(ChatInputComponent);
