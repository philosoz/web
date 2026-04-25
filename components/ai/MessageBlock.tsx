"use client";

import { memo } from "react";
import { Message } from "./useChat";

interface MessageBlockProps {
  message: Message;
  showSpacing?: boolean;
}

function MessageBlockComponent({ message, showSpacing = true }: MessageBlockProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div 
          className="bg-[#1a1a1c] text-[#ddd] text-sm px-4 py-2.5 rounded-2xl max-w-[75%] leading-relaxed"
          style={{ maxWidth: '75%', wordBreak: 'break-word' }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="text-[15px] leading-relaxed text-[#e6e6e6] whitespace-pre-wrap"
      style={{ wordBreak: 'break-word' }}
    >
      {message.content}
    </div>
  );
}

export const MessageBlock = memo(MessageBlockComponent);