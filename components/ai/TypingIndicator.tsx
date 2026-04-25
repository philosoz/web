import { memo } from "react";

// 样式常量
const styles = {
  container: "text-sm text-gray-400 mb-4 flex items-center gap-2",
  dotBase: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
} as const;

const dotDelays = ["0ms", "150ms", "300ms"] as const;

function TypingIndicatorComponent() {
  return (
    <div className={styles.container}>
      <span>张海挺</span>
      <span className="flex gap-1">
        {dotDelays.map((delay, index) => (
          <span
            key={index}
            className={styles.dotBase}
            style={{ animationDelay: delay }}
          />
        ))}
      </span>
    </div>
  );
}

// 使用 memo 优化
export const TypingIndicator = memo(TypingIndicatorComponent);
