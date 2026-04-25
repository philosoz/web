"use client";

import { useEffect, useRef, useState } from "react";
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
  const [inputValue, setInputValue] = useState("");

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

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isThinking) return;
    sendMessage(trimmed);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      if (confirm("确定要开始新对话吗？")) {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  };

  return (
    <div className="h-screen w-full bg-[#0b0b0c] text-[#e6e6e6] flex flex-col">
      <header className="h-12 flex items-center justify-center text-xs text-[#555] border-b border-[#1a1a1c] tracking-widest">
        在场
      </header>

      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-[720px] mx-auto px-6 py-8">
          <div className="space-y-8">
            {messages.length === 0 && (
              <div className="pt-8 pb-4">
                <div className="text-[15px] text-[#e6e6e6] mb-6 whitespace-pre-wrap">
                  {welcomeMessage.greeting}
                </div>
                
                <div className="flex flex-col gap-2">
                  {[
                    "你平时在想什么？",
                    "你怎么看欲望？",
                    "AI 产品经理是做什么的？",
                    "你为什么会关注心理学？"
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(question)}
                      className="px-4 py-3 text-left text-[#666] hover:text-[#aaa] transition-colors duration-200 text-sm"
                    >
                      → {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <MessageBlock 
                key={i} 
                message={msg} 
                isFirst={i === 0 || (i > 0 && messages[i-1].role !== msg.role)}
              />
            ))}

            {isThinking && (
              <div className="text-[#555] text-sm italic py-2">
                …
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#1a1a1c] px-4 py-4">
        <div className="max-w-[720px] mx-auto flex items-end gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="你现在在想什么？"
            rows={1}
            disabled={isThinking}
            className="flex-1 bg-[#111113] border border-[#1a1a1c] rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#2a2a2c] text-[#e6e6e6] placeholder:text-[#555] disabled:opacity-50 transition-colors duration-200"
          />
          
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking}
            className="text-[#666] hover:text-[#aaa] transition-colors duration-200 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}