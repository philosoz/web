export function TypingIndicator() {
  return (
    <div className="text-sm text-gray-400 mb-4 flex items-center gap-2">
      <span>张海挺</span>
      <span className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </span>
    </div>
  );
}
