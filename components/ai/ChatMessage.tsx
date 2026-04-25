interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`mb-4 ${role === "user" ? "text-right" : "text-left"}`}>
      <div
        className={`inline-block max-w-[80%] px-4 py-3 rounded-xl text-left ${
          role === "user"
            ? "bg-[#D6A77A] text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
