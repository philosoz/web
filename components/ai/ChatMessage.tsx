interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`mb-5 ${role === "user" ? "text-right" : "text-left"}`}>
      <div
        className={`inline-block max-w-[85%] px-5 py-4 rounded-2xl text-left ${
          role === "user"
            ? "bg-[#FFF8F0] text-[#5C4033] shadow-sm"
            : "bg-[#FAF6F1] text-[#6B5B4F]"
        }`}
      >
        <p className="text-[15px] leading-7 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
