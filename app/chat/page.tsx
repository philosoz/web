"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, messages, isThinking]);

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim()) {
      setShowSuggestions(false);
    }
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isThinking) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: text 
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setShowSuggestions(false);
    setIsThinking(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortControllerRef.current?.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errorMessage = "服务暂时不可用";
        if (res.status === 503) {
          errorMessage = "AI 服务暂时不可用，请稍后重试";
        } else if (res.status === 429) {
          errorMessage = "请求过于频繁，请稍后再试";
        } else if (res.status === 401) {
          errorMessage = "服务认证失败，请联系管理员";
        }
        throw new Error(errorMessage);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantMessage += decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return [...prev.slice(0, -1), { ...last, content: assistantMessage }];
          }
          return prev;
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      
      let errorMessage = "嗯…出了点问题。";
      
      if (error instanceof Error) {
        if (error.message.includes("timeout") || error.message.includes("Timeout")) {
          errorMessage = "请求超时，请稍后重试。";
        } else if (error.message.includes("network") || error.message.includes("Network")) {
          errorMessage = "网络连接失败，请检查网络后重试。";
        } else if (error.message.includes("服务暂时不可用")) {
          errorMessage = error.message;
        }
      }
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: errorMessage }]);
    } finally {
      setIsThinking(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    if (messages.length > 0 && confirm("确定要清空当前对话？")) {
      setMessages([]);
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0 && confirm("确定要开始新对话吗？")) {
      setMessages([]);
      setShowSuggestions(true);
    }
  };

  const staticSuggestions = [
    "你平时在想什么？",
    "你怎么看欲望？",
    "AI 产品经理是做什么的？",
    "你为什么会关注心理学？"
  ];

  if (!isReady) {
    return (
      <div style={{ 
        height: "100vh", 
        width: "100vw", 
        background: "#0b0b0c", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: "#555",
        fontSize: "14px"
      }}>
        加载中...
      </div>
    );
  }

  return (
    <div style={{ 
      height: "100vh", 
      width: "100vw", 
      background: "#0b0b0c", 
      color: "#e6e6e6", 
      display: "flex", 
      flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Inter', sans-serif"
    }}>
      <header style={{ 
        height: "48px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid #1a1a1c"
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            color: "#555",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#888")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#555")}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        
        <span style={{ 
          fontSize: "12px", 
          color: "#555",
          letterSpacing: "0.1em"
        }}>
          在场
        </span>
        
        <div style={{ display: "flex", gap: "12px", fontSize: "14px" }}>
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              style={{
                background: "none",
                border: "none",
                color: "#555",
                cursor: "pointer"
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#888")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#555")}
            >
              清空
            </button>
          )}
          <button
            onClick={handleNewChat}
            style={{
              background: "none",
              border: "none",
              color: "#555",
              cursor: "pointer"
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#888")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#555")}
          >
            新对话
          </button>
        </div>
      </header>

      <div 
        ref={containerRef}
        style={{ 
          flex: 1, 
          overflow: "auto",
          padding: "32px 24px"
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {messages.length === 0 ? (
            <div style={{ paddingTop: "16px" }}>
              <div style={{ 
                fontSize: "15px",
                marginBottom: "32px",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap"
              }}>
                我在。
                你可以直接说你在想什么。
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {staticSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#666",
                      fontSize: "14px",
                      textAlign: "left",
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderRadius: "8px",
                      transition: "color 0.2s"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#aaa")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#666")}
                  >
                    → {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" ? (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{
                        background: "#1a1a1c",
                        color: "#ddd",
                        padding: "10px 16px",
                        borderRadius: "16px",
                        maxWidth: "75%",
                        fontSize: "14px",
                        lineHeight: 1.5
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      fontSize: "15px",
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}>
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              
              {isThinking && (
                <div style={{ 
                  color: "#888", 
                  fontSize: "14px", 
                  padding: "12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <div style={{ 
                    display: "flex", 
                    gap: "4px"
                  }}>
                    <span style={{ 
                      width: "6px", 
                      height: "6px", 
                      borderRadius: "50%", 
                      background: "#D6A77A",
                      animation: "bounce 1.4s ease-in-out infinite both"
                    }} />
                    <span style={{ 
                      width: "6px", 
                      height: "6px", 
                      borderRadius: "50%", 
                      background: "#D6A77A",
                      animation: "bounce 1.4s ease-in-out 0.16s infinite both"
                    }} />
                    <span style={{ 
                      width: "6px", 
                      height: "6px", 
                      borderRadius: "50%", 
                      background: "#D6A77A",
                      animation: "bounce 1.4s ease-in-out 0.32s infinite both"
                    }} />
                  </div>
                  <style>{`
                    @keyframes bounce {
                      0%, 80%, 100% { transform: scale(0); }
                      40% { transform: scale(1); }
                    }
                  `}</style>
                  <span style={{ color: "#666" }}>正在思考...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #1a1a1c", padding: "16px 24px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {showSuggestions && inputValue === "" && messages.length === 0 && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {staticSuggestions.slice(0, 3).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#555",
                      fontSize: "13px",
                      textAlign: "left",
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderRadius: "6px"
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#888";
                      (e.currentTarget as HTMLButtonElement).style.background = "#1a1a1c";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#555";
                      (e.currentTarget as HTMLButtonElement).style.background = "none";
                    }}
                  >
                    → {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              placeholder="你在想什么？"
              rows={1}
              disabled={isThinking}
              style={{
                flex: 1,
                background: "#111113",
                border: "1px solid #1a1a1c",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
                color: "#e6e6e6",
                outline: "none",
                resize: "none",
                minHeight: "48px",
                maxHeight: "120px",
                transition: "border-color 0.2s"
              }}
            />
            
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isThinking}
              style={{
                background: inputValue.trim() && !isThinking ? "#D6A77A" : "none",
                border: "none",
                borderRadius: "8px",
                padding: inputValue.trim() && !isThinking ? "10px 16px" : "10px 16px",
                color: inputValue.trim() && !isThinking ? "#fff" : "#444",
                fontSize: "14px",
                cursor: inputValue.trim() && !isThinking ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                fontWeight: "500"
              }}
              onMouseOver={(e) => {
                if (inputValue.trim() && !isThinking) {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                }
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.color = 
                  inputValue.trim() && !isThinking ? "#fff" : "#444";
              }}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}