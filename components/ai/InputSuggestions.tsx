"use client";

import { memo } from "react";

interface InputSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  visible: boolean;
}

function InputSuggestionsComponent({
  suggestions,
  onSelect,
  visible,
}: InputSuggestionsProps) {
  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
      <div className="flex flex-col gap-1">
        {suggestions.map((text, i) => (
          <button
            key={i}
            onClick={() => onSelect(text)}
            className="px-3 py-2 text-left text-[#666] hover:text-[#999] transition-colors duration-150 text-sm rounded-lg hover:bg-[#1a1a1c]"
          >
            → {text}
          </button>
        ))}
      </div>
    </div>
  );
}

export const InputSuggestions = memo(InputSuggestionsComponent);