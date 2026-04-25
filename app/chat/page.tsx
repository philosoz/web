"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChat } from "@/components/ai/useChat";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { ChatInput } from "@/components/ai/ChatInput";
import { TypingIndicator } from "@/components/ai/TypingIndicator";
import { ChatHistory } from "@/components/chat/ChatHistory";

export default function ChatPage() {
  const router = useRouter();
  const {
    messages,
    sendMessage,
    loading,
    sessions,
    currentSessionId,
    switchSession,
    createNewSession,
    deleteCurrentSession,
    clearCurrentSession,
    toggleFavorite,
    welcomeMessage,
  } = useChat();
  const initialized = useRef(false);
  const [showHistory, setShowHistory] = useState(false);

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

  const handleContinueSession = (sessionId: string) => {
    switchSession(sessionId);
  };

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
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
            title="会话历史"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {messages.length > 0 && (
            <button
              onClick={() => {
                if (confirm('确定要清空当前会话的所有消息吗？')) {
                  clearCurrentSession();
                }
              }}
              className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
              title="清空会话"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清空
            </button>
          )}
          <div className="text-sm text-gray-500">和我聊聊</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className={`${showHistory ? 'block' : 'hidden'} md:block w-full md:w-80 border-r border-gray-200`}>
          <ChatHistory
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSwitchSession={switchSession}
            onDeleteSession={deleteCurrentSession}
            onToggleFavorite={toggleFavorite}
            onNewSession={createNewSession}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <h2 className="text-2xl mb-4 text-gray-800">
                    {welcomeMessage.greeting}
                  </h2>
                  
                  {welcomeMessage.continuation && (
                    <button 
                      onClick={() => welcomeMessage.continuation && handleContinueSession(welcomeMessage.continuation.sessionId)}
                      className="mb-6 px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center gap-2"
                    >
                      {welcomeMessage.continuation.text}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-6">
                    {welcomeMessage.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(suggestion)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
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
      </div>
    </div>
  );
}
