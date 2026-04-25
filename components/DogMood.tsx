"use client";

import { motion } from "framer-motion";
import type { DogMood } from "@/hooks/usePawInteraction";

interface DogMoodProps {
  mood: DogMood;
}

const MOOD_EMOJIS: Record<DogMood, string> = {
  neutral: "😊",
  happy: "😄",
  excited: "🥰",
};

export default function DogMoodComponent({ mood }: DogMoodProps) {
  const emoji = MOOD_EMOJIS[mood];

  return (
    <div className="absolute bottom-4 right-4 pointer-events-none select-none">
      <motion.div
        key={mood}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: 1,
          rotate: mood === "excited" ? [0, -5, 5, -5, 5, 0] : 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          scale: { duration: 0.5, ease: "easeInOut" },
          rotate: mood === "excited" ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0 },
        }}
        className="text-4xl"
      >
        {emoji}
      </motion.div>
    </div>
  );
}
