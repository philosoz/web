import { Message } from "./useChat";

interface MessageBlockProps {
  message: Message;
  isFirst?: boolean;
}

export function MessageBlock({ message, isFirst = false }: MessageBlockProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-[#1a1a1c] text-[#ddd] text-sm px-4 py-2.5 rounded-xl max-w-[70%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`text-sm leading-relaxed text-white whitespace-pre-wrap ${isFirst ? '' : 'mt-6'}`}>
      {message.content}
    </div>
  );
}