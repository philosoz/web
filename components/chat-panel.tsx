"use client";

import { FormEvent, memo, useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterMessages: Message[] = [
  {
    role: "assistant",
    content:
      "你好，我已经接入 MiniMax 的 Anthropic 流式聊天能力。你可以直接问我产品方案、代码实现，或者让我们一起整理部署步骤。"
  }
];

function ChatPanelComponent() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = feedRef.current;
    if (!element) {
      return;
    }

    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = input.trim();
    if (!value || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: value }];
    const placeholderMessage = { role: "assistant" as const, content: "" };

    setMessages([...nextMessages, placeholderMessage]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: nextMessages
        })
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "MiniMax did not return a valid response.");
      }

      if (!response.body) {
        throw new Error("The response stream is empty.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value: chunk } = await reader.read();

        if (done) {
          break;
        }

        assistantText += decoder.decode(chunk, { stream: true });

        setMessages((current) => {
          const updated = [...current];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantText
          };
          return updated;
        });
      }

      assistantText += decoder.decode();

      if (!assistantText.trim()) {
        throw new Error("MiniMax returned an empty streamed message.");
      }
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Request failed. Please try again.";

      setMessages(nextMessages);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="chat-panel" aria-label="MiniMax chat panel">
      <header className="chat-panel__header">
        <h2>Live Streaming Chat</h2>
        <p>
          消息会由服务端安全转发到 MiniMax Anthropic 兼容接口，浏览器只接收流式返回内容，不暴露
          API Key。
        </p>
      </header>

      <div className="chat-feed" ref={feedRef}>
        {messages.map((message, index) => (
          <article
            className={`message message--${message.role}`}
            key={`${message.role}-${index}`}
          >
            <span className="message__role">
              {message.role === "assistant" ? "MiniMax" : "You"}
            </span>
            {message.content || (isLoading && index === messages.length - 1 ? "正在流式生成中..." : "")}
          </article>
        ))}
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <div className="composer__box">
          <textarea
            aria-label="输入你的问题"
            placeholder="输入你的消息，比如：帮我设计一个可部署的聊天网站首页"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />

          <div className="composer__actions">
            <span className={error ? "composer__error" : "composer__hint"}>
              {error || "现在是流式输出版本，回复会边生成边显示。"}
            </span>
            <button disabled={isLoading || !input.trim()} type="submit">
              {isLoading ? "Streaming..." : "Send"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export const ChatPanel = memo(ChatPanelComponent);
