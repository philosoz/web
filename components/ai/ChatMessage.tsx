import { memo } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

// 样式常量
const styles = {
  container: "mb-4",
  userAlign: "text-right",
  assistantAlign: "text-left",
  userBubble: "inline-block max-w-[720px] bg-[#F0EDE8] text-[#3D3D3D]",
  assistantBubble: "inline-block max-w-[720px] bg-transparent text-[#333333]",
  text: "text-[15px] leading-[1.75] whitespace-pre-wrap",
} as const;

function ChatMessageComponent({ role, content }: ChatMessageProps) {
  const isUser = role === "user";
  const fontFamily = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Inter', sans-serif";

  return (
    <div className={`${styles.container} ${isUser ? styles.userAlign : styles.assistantAlign}`} style={{ fontFamily }}>
      <div className={isUser ? styles.userBubble : styles.assistantBubble}>
        <p className={styles.text}>{content}</p>
      </div>
    </div>
  );
}

// 使用 memo 优化
export const ChatMessage = memo(ChatMessageComponent);
