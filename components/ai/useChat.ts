"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ChatSession,
  loadAllSessions,
  getCurrentSession,
  setCurrentSession,
  deleteSession,
  createSession,
  updateSession,
  getUserProfile,
  updateUserProfile,
  analyzeUserInterests,
  generateWelcomeMessage,
  getDefaultWelcomeMessage,
  WelcomeMessage,
  UserProfile,
} from "@/lib/chat-storage";

export type Message = {
  role: "user" | "assistant";
  content: string;
  tags?: string[];
};

export function autoTagMessage(message: string): string[] {
  const tags: string[] = [];
  
  if (message.includes('感觉') || message.includes('心情') || 
      message.includes('情绪') || message.includes('最近') ||
      message.includes('压力') || message.includes('焦虑') ||
      message.includes('开心') || message.includes('难过')) {
    tags.push('情绪');
  }
  
  if (message.includes('代码') || message.includes('技术') || 
      message.includes('编程') || message.includes('系统') ||
      message.includes('开发') || message.includes('程序') ||
      message.includes('软件') || message.includes('算法') ||
      message.includes('数据库')) {
    tags.push('技术');
  }
  
  if (message.includes('工作') || message.includes('项目') || 
      message.includes('团队') || message.includes('同事') ||
      message.includes('公司') || message.includes('职场') ||
      message.includes('任务') || message.includes('汇报')) {
    tags.push('工作');
  }
  
  if (message.includes('学习') || message.includes('读书') || 
      message.includes('课程') || message.includes('培训') ||
      message.includes('研究') || message.includes('考试')) {
    tags.push('学习');
  }
  
  if (message.includes('生活') || message.includes('日常') || 
      message.includes('休息') || message.includes('娱乐') ||
      message.includes('爱好') || message.includes('运动')) {
    tags.push('生活');
  }
  
  if (tags.length === 0) {
    tags.push('随意');
  }
  
  return tags;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function splitIntoChunks(text: string): string[] {
  const chunks = text
    .split(/(?<=[。！？])/)
    .map(s => s.trim())
    .filter(Boolean);

  if (chunks.length === 1 && text.length > 20) {
    const mid = Math.floor(text.length / 2);
    let splitAt = mid;
    for (let i = mid; i < text.length; i++) {
      if (['，', '。', '、', '？', '！', ' ', '\n'].includes(text[i])) {
        splitAt = i;
        break;
      }
    }
    return [
      text.slice(0, splitAt),
      text.slice(splitAt)
    ];
  }

  return chunks;
}

function injectHumanNoise(text: string): string {
  if (Math.random() < 0.15 && text.length > 30) {
    const noises = [
      "\n\n…不过这个我可能说得不太准。",
      "\n\n…等等，我再想想。",
      "\n\n…算了，换个角度说。"
    ];
    return text + noises[Math.floor(Math.random() * noises.length)];
  }
  return text;
}

async function streamText(
  fullText: string,
  onUpdate: (content: string) => void
): Promise<void> {
  let current = "";

  for (let i = 0; i < fullText.length; i++) {
    current += fullText[i];
    onUpdate(current);

    let baseDelay = 25 + Math.random() * 50;

    if ("，。！？".includes(fullText[i])) {
      baseDelay += 120;
    }

    if (Math.random() < 0.08) {
      baseDelay += 200 + Math.random() * 200;
    }

    await delay(baseDelay);
  }
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessage>(getDefaultWelcomeMessage());
  const [isThinking, setIsThinking] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
    
    const loadedSessions = loadAllSessions();
    setSessions(loadedSessions);
    
    const welcome = generateWelcomeMessage(userProfile, loadedSessions);
    setWelcomeMessage(welcome);

    const currentSession = getCurrentSession();
    if (currentSession) {
      setMessages(currentSession.messages);
      setCurrentSessionId(currentSession.id);
    } else {
      const newSession = createSession();
      setMessages(newSession.messages);
      setCurrentSessionId(newSession.id);
      setSessions(loadAllSessions());
    }
  }, []);

  const saveCurrentSession = useCallback((msgs: Message[]) => {
    if (currentSessionId) {
      updateSession(currentSessionId, { messages: msgs });
      const updatedSessions = loadAllSessions();
      setSessions(updatedSessions);
    }
  }, [currentSessionId]);

  const updateSessionTags = useCallback((messageTags: string[]) => {
    if (currentSessionId) {
      const currentSession = sessions.find(s => s.id === currentSessionId);
      if (currentSession) {
        const existingTags = new Set(currentSession.tags);
        messageTags.forEach(tag => existingTags.add(tag));
        updateSession(currentSessionId, { tags: Array.from(existingTags) });
        const updatedSessions = loadAllSessions();
        setSessions(updatedSessions);
      }
    }
  }, [currentSessionId, sessions]);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isThinking) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const messageTags = autoTagMessage(input);
    const newMessages = [...messages, { role: "user" as const, content: input, tags: messageTags }];
    setMessages(newMessages);
    updateSessionTags(messageTags);
    saveCurrentSession(newMessages);
    setLoading(true);
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let fullResponse = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const dataStr = line.slice(5).trim();
            if (dataStr === "[DONE]") continue;

            try {
              const json = JSON.parse(dataStr);
              if (json.choices?.[0]?.delta?.content) {
                fullResponse += json.choices[0].delta.content;
              }
            } catch {
              // skip
            }
          }
        }
      }

      setIsThinking(false);
      setLoading(true);

      const processedResponse = injectHumanNoise(fullResponse);
      const chunks = splitIntoChunks(processedResponse);

      for (let i = 0; i < chunks.length; i++) {
        setMessages((prev: Message[]) => [
          ...prev,
          { role: "assistant" as const, content: "" }
        ]);

        await streamText(chunks[i], (content) => {
          setMessages((prev: Message[]) => {
            const latest = prev[prev.length - 1];
            if (latest?.role === "assistant") {
              return [...prev.slice(0, -1), { ...latest, content }];
            }
            return prev;
          });
        });

        if (i < chunks.length - 1) {
          await delay(300 + Math.random() * 600);
        }
      }

      const finalMessages = [...newMessages, ...chunks.map(c => ({ role: "assistant" as const, content: c, tags: [] as string[] }))];
      setMessages(finalMessages);
      const assistantTags = autoTagMessage(processedResponse);
      updateSessionTags(assistantTags);
      saveCurrentSession(finalMessages);
      
      const allSessions = loadAllSessions();
      const interests = analyzeUserInterests(allSessions);
      updateUserProfile({ interests });
      setProfile(getUserProfile());
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      setIsThinking(false);
      setMessages((prev: Message[]) => {
        const errorMessages: Message[] = [
          ...prev,
          { role: "assistant" as const, content: "嗯…出了点问题。" }
        ];
        saveCurrentSession(errorMessages);
        return errorMessages;
      });
    } finally {
      setLoading(false);
      setIsThinking(false);
    }
  }, [messages, saveCurrentSession, updateSessionTags, isThinking]);

  const switchSession = useCallback((sessionId: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const targetSession = sessions.find(s => s.id === sessionId);
    if (targetSession) {
      saveCurrentSession(messages);
      setCurrentSession(sessionId);
      setMessages(targetSession.messages);
      setCurrentSessionId(sessionId);
    }
  }, [sessions, messages, saveCurrentSession]);

  const createNewSession = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    saveCurrentSession(messages);
    const newSession = createSession();
    setMessages(newSession.messages);
    setCurrentSessionId(newSession.id);
    const updatedSessions = loadAllSessions();
    setSessions(updatedSessions);
  }, [messages, saveCurrentSession]);

  const deleteCurrentSession = useCallback(() => {
    if (!currentSessionId) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    deleteSession(currentSessionId);
    const updatedSessions = loadAllSessions();
    setSessions(updatedSessions);
    
    if (updatedSessions.length > 0) {
      const nextSession = updatedSessions[0];
      setMessages(nextSession.messages);
      setCurrentSessionId(nextSession.id);
      setCurrentSession(nextSession.id);
    } else {
      const newSession = createSession();
      setMessages(newSession.messages);
      setCurrentSessionId(newSession.id);
      setSessions(loadAllSessions());
    }
  }, [currentSessionId]);

  const toggleFavorite = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      updateSession(sessionId, { isFavorite: !session.isFavorite });
      const updatedSessions = loadAllSessions();
      setSessions(updatedSessions);
    }
  }, [sessions]);

  const clearCurrentSession = useCallback(() => {
    if (!currentSessionId) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setMessages([]);
    updateSession(currentSessionId, { messages: [] });
    const updatedSessions = loadAllSessions();
    setSessions(updatedSessions);
  }, [currentSessionId]);

  return {
    messages,
    sendMessage,
    loading,
    isThinking,
    sessions,
    currentSessionId,
    switchSession,
    createNewSession,
    deleteCurrentSession,
    clearCurrentSession,
    toggleFavorite,
    profile,
    welcomeMessage,
  };
}