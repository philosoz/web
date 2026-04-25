"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChat } from "@/components/ai/useChat";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { ChatInput } from "@/components/ai/ChatInput";
import { TypingIndicator } from "@/components/ai/TypingIndicator";

export default function ChatPage() {
  const router = useRouter();
  const { messages, sendMessage, loading } = useChat();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const params = new URLSearchParams(window.location.search);
    const message = params.get("message");
    if (message) {
      sendMessage(message);
      window.history.replaceState({}, "", "/chat");
    }
  }, [sendMessage]);

  return (
    <div className="flex flex-col h-screen">
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
        <div className="text-sm text-gray-500">和我聊聊</div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-20">
              <p className="mb-4">你好呀，我是张海挺。</p>
              <p className="text-sm">
                很高兴见到你，有什么想聊的吗？
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}

          {loading && <TypingIndicator />}
        </div>
      </div>

      <ChatInput onSend={sendMessage} loading={loading} />
    </div>
  );
}
