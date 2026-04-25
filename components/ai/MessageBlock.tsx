import { Message } from "./useChat";

interface MessageBlockProps {
  message: Message;
}

export function MessageBlock({ message }: MessageBlockProps) {
  const isUser = message.role === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[85%] md:max-w-[70%]
          text-[15px]
          leading-7
          whitespace-pre-wrap
          ${
            isUser
              ? "text-[#888]"
              : "text-[#e8e8e8]"
          }
        `}
      >
        {message.content}
      </div>
    </div>
  );
}