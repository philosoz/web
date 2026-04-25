"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/components/ai/useChat";
import { MessageBlock } from "@/components/ai/MessageBlock";

export default function ChatPage() {
  const router = useRouter();
  const {
    messages,
    sendMessage,
    loading,
    isThinking,
    createNewSession,
    clearCurrentSession,
    welcomeMessage,
  } = useChat();
  const initialized = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  const handleNewChat = () => {
    if (messages.length > 0) {
      if (confirm("确定要开始新对话吗？当前对话会被保留。")) {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  };

  return (
    <div className="h-screen w-full bg-[#0e0e10] text-[#e8e8e8] flex flex-col">
      <header className="h-[56px] flex items-center justify-between px-6 border-b border-[#1a1a1a]">
        <button
          onClick={() => router.back()}
          className="text-[#6f6f6f] hover:text-[#e8e8e8] transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        
        <div className="text-sm text-[#6f6f6f]">在场</div>
        
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={() => {
                if (confirm("确定要清空当前对话？")) {
                  clearCurrentSession();
                }
              }}
              className="text-[#6f6f6f] hover:text-[#e8e8e8] transition-colors text-sm"
            >
              清空
            </button>
          )}
          <button
            onClick={handleNewChat}
            className="text-[#6f6f6f] hover:text-[#e8e8e8] transition-colors text-sm"
          >
            新对话
          </button>
        </div>
      </header>

      <div ref={containerRef} className="flex-1 overflow-y-auto px-6 md:px-0">
        <div className="max-w-[720px] mx-auto py-20 space-y-16">
          {messages.length === 0 && (
            <div className="text-center">
              <p className="text-[#6f6f6f] text-sm mb-12">
                {welcomeMessage.greeting}
              </p>
              
              <div className="flex flex-col gap-3 max-w-xl mx-auto">
                {[
                  "你平时在想什么？",
                  "你怎么看欲望？",
                  "AI 产品经理是做什么的？",
                  "你为什么会关注心理学？"
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="px-6 py-3 border border-[#2a2a2a] rounded-full text-[#888] hover:border-[#444] hover:text-[#aaa] transition-all duration-200 text-left text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBlock key={i} message={msg} />
          ))}

          {isThinking && (
            <div className="text-[#555] text-sm animate-pulse">
              …
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[#1a1a1a]">
        <div className="max-w-[720px] mx-auto px-6 py-4">
          <textarea
            value=""
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const input = (e.target as HTMLTextAreaElement).value.trim();
                if (input) {
                  sendMessage(input);
                  (e.target as HTMLTextAreaElement).value = "";
                }
              }
            }}
            placeholder="你可以慢慢说。"
            rows={1}
            className="
              w-full
              bg-transparent
              resize-none
              outline-none
              text-[#e8e8e8]
              placeholder:text-[#555]
              text-[15px]
              leading-7
            "
          />
        </div>
      </div>
    </div>
  );
}