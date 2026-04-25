interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const fontFamily =
    "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Inter', sans-serif";

  return (
    <div
      className={`mb-4 ${role === "user" ? "text-right" : "text-left"}`}
      style={{ fontFamily }}
    >
      <div
        className={`inline-block max-w-[720px] ${
          role === "user"
            ? "bg-[#F0EDE8] text-[#3D3D3D]"
            : "bg-transparent text-[#333333]"
        }`}
      >
        <p className="text-[15px] leading-[1.75] whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
