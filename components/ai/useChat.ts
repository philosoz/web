"use client";

import { useState, useCallback, useEffect } from "react";
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

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessage>(getDefaultWelcomeMessage());

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
    if (!input.trim()) return;

    const messageTags = autoTagMessage(input);
    const newMessages = [...messages, { role: "user" as const, content: input, tags: messageTags }];
    setMessages(newMessages);
    updateSessionTags(messageTags);
    saveCurrentSession(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let assistantMessage = "";
      let finalAssistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;
        finalAssistantMessage = assistantMessage;

        setMessages((prev: Message[]) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === "assistant") {
            return [...prev.slice(0, -1), { ...lastMessage, content: assistantMessage }];
          } else {
            return [...prev, { role: "assistant" as const, content: assistantMessage }];
          }
        });
      }

      const assistantTags = autoTagMessage(finalAssistantMessage);
      const finalMessages = [...newMessages, { role: "assistant" as const, content: finalAssistantMessage, tags: assistantTags }];
      setMessages(finalMessages);
      updateSessionTags(assistantTags);
      saveCurrentSession(finalMessages);
      
      const allSessions = loadAllSessions();
      const interests = analyzeUserInterests(allSessions);
      updateUserProfile({ interests });
      setProfile(getUserProfile());
    } catch {
      setMessages((prev: Message[]) => {
        const errorMessages: Message[] = [
          ...prev,
          { role: "assistant" as const, content: "抱歉，出现了一些问题。请稍后再试。" },
        ];
        saveCurrentSession(errorMessages);
        return errorMessages;
      });
    } finally {
      setLoading(false);
    }
  }, [messages, saveCurrentSession, updateSessionTags]);

  const switchSession = useCallback((sessionId: string) => {
    const targetSession = sessions.find(s => s.id === sessionId);
    if (targetSession) {
      saveCurrentSession(messages);
      setCurrentSession(sessionId);
      setMessages(targetSession.messages);
      setCurrentSessionId(sessionId);
    }
  }, [sessions, messages, saveCurrentSession]);

  const createNewSession = useCallback(() => {
    saveCurrentSession(messages);
    const newSession = createSession();
    setMessages(newSession.messages);
    setCurrentSessionId(newSession.id);
    const updatedSessions = loadAllSessions();
    setSessions(updatedSessions);
  }, [messages, saveCurrentSession]);

  const deleteCurrentSession = useCallback(() => {
    if (!currentSessionId) return;
    
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

  return {
    messages,
    sendMessage,
    loading,
    sessions,
    currentSessionId,
    switchSession,
    createNewSession,
    deleteCurrentSession,
    toggleFavorite,
    profile,
    welcomeMessage,
  };
}
