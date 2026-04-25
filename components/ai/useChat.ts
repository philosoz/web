"use client";

import { useState, useCallback } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === "assistant") {
            return [...prev.slice(0, -1), { ...lastMessage, content: assistantMessage }];
          } else {
            return [...prev, { role: "assistant", content: assistantMessage }];
          }
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "抱歉，出现了一些问题。请稍后再试。" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  return { messages, sendMessage, loading };
}
