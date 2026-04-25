"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const colors = {
  background: "var(--bg-primary)",
  primaryText: "var(--text-primary)",
  secondaryText: "var(--text-secondary)",
  border: "var(--border-light)",
  accent: "var(--accent-warm)",
  userBubble: "var(--bg-soft)",
};

const CACHE_KEY = 'ai-suggestions-v2';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

const defaultSuggestions = [
  "想聊欲望本质？",
  "最近在纠结什么？",
  "有什么反复出现的念头？",
  "有什么代码让你卡住了？",
];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsReady(true);
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    // 尝试从缓存加载
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { suggestions: cachedSuggestions, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION && cachedSuggestions.length > 0) {
          setSuggestions(cachedSuggestions);
          setLoadingSuggestions(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    // 调用 AI 生成推荐
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 4 }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            suggestions: data.suggestions,
            timestamp: Date.now()
          }));
        } else {
          setSuggestions(defaultSuggestions);
        }
      } else {
        setSuggestions(defaultSuggestions);
      }
    } catch {
      setSuggestions(defaultSuggestions);
    } finally {
      setLoadingSuggestions(false);
    }
  };

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
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
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
    setIsThinking(true);

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error("API error");

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
      setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), role: "assistant", content: "嗯…出了点问题。" }]);
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
    }
  };

  if (!isReady) {
    return (
      <div style={{ 
        height: "100vh", 
        width: "100vw", 
        background: colors.background, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: colors.secondaryText,
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
      background: colors.background, 
      color: colors.primaryText, 
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
        borderBottom: `1px solid ${colors.border}`
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            color: colors.secondaryText,
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = colors.primaryText)}
          onMouseOut={(e) => (e.currentTarget.style.color = colors.secondaryText)}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        
        <span style={{ 
          fontSize: "12px", 
          color: colors.accent,
          letterSpacing: "0.15em",
          fontWeight: "500"
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
                color: colors.secondaryText,
                cursor: "pointer"
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = colors.primaryText)}
              onMouseOut={(e) => (e.currentTarget.style.color = colors.secondaryText)}
            >
              清空
            </button>
          )}
          <button
            onClick={handleNewChat}
            style={{
              background: "none",
              border: "none",
              color: colors.secondaryText,
              cursor: "pointer"
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = colors.primaryText)}
            onMouseOut={(e) => (e.currentTarget.style.color = colors.secondaryText)}
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
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          {messages.length === 0 ? (
            <div style={{ paddingTop: "48px" }}>
              <h1 style={{ 
                fontSize: "24px",
                fontWeight: "400",
                marginBottom: "12px",
                color: colors.primaryText,
                letterSpacing: "-0.02em"
              }}>
                你好，我在。
              </h1>
              <p style={{ 
                fontSize: "15px",
                color: colors.secondaryText,
                marginBottom: "40px",
                lineHeight: 1.6
              }}>
                你可以直接说你在想什么。
              </p>
              
              {loadingSuggestions ? (
                <div style={{ color: colors.secondaryText, fontSize: "14px" }}>
                  加载中...
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{
                        background: "transparent",
                        border: `1px solid ${colors.border}`,
                        color: colors.secondaryText,
                        fontSize: "14px",
                        textAlign: "left",
                        padding: "14px 18px",
                        cursor: "pointer",
                        borderRadius: "10px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = colors.accent;
                        (e.currentTarget as HTMLButtonElement).style.color = colors.primaryText;
                        (e.currentTarget as HTMLButtonElement).style.background = colors.userBubble;
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border;
                        (e.currentTarget as HTMLButtonElement).style.color = colors.secondaryText;
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" ? (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{
                        background: colors.userBubble,
                        color: colors.primaryText,
                        padding: "10px 16px",
                        borderRadius: "16px",
                        border: `1px solid ${colors.border}`,
                        maxWidth: "75%",
                        fontSize: "14px",
                        lineHeight: 1.6
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      fontSize: "15px",
                      lineHeight: 1.8,
                      color: colors.primaryText,
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
                  color: colors.secondaryText, 
                  fontSize: "14px", 
                  padding: "12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <span style={{ 
                      width: "6px", 
                      height: "6px", 
                      borderRadius: "50%", 
                      background: colors.accent,
                      animation: "bounce 1.4s ease-in-out infinite both"
                    }} />
                    <span style={{ 
                      width: "6px", 
                      height: "6px", 
                      borderRadius: "50%", 
                      background: colors.accent,
                      animation: "bounce 1.4s ease-in-out 0.16s infinite both"
                    }} />
                    <span style={{ 
                      width: "6px", 
                      height: "6px", 
                      borderRadius: "50%", 
                      background: colors.accent,
                      animation: "bounce 1.4s ease-in-out 0.32s infinite both"
                    }} />
                  </div>
                  <style>{`
                    @keyframes bounce {
                      0%, 80%, 100% { transform: scale(0); }
                      40% { transform: scale(1); }
                    }
                  `}</style>
                  <span style={{ color: colors.accent }}>正在思考...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ 
        borderTop: `1px solid ${colors.border}`, 
        padding: "16px 24px",
        background: colors.background
      }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "flex-end", 
            gap: "12px",
            background: "#fff",
            border: `1px solid ${isInputFocused ? colors.accent : colors.border}`,
            borderRadius: "14px",
            padding: "4px",
            transition: "border-color 0.2s ease"
          }}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="你在想什么？"
              rows={1}
              disabled={isThinking}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                padding: "12px 16px",
                fontSize: "15px",
                color: colors.primaryText,
                outline: "none",
                resize: "none",
                minHeight: "48px",
                maxHeight: "120px",
                lineHeight: 1.5
              }}
            />
            
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isThinking}
              style={{
                background: inputValue.trim() && !isThinking ? colors.accent : "transparent",
                border: "none",
                borderRadius: "10px",
                padding: "10px 18px",
                color: inputValue.trim() && !isThinking ? "#fff" : colors.secondaryText,
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