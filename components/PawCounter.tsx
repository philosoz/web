"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PawCounterProps {
  initialCount?: number;
  showAddOne?: boolean;
  onCountUpdate?: (count: number) => void;
}

export default function PawCounter({ initialCount = 128, showAddOne = false, onCountUpdate }: PawCounterProps) {
  const [showPlus, setShowPlus] = useState(false);

  const handleAdd = () => {
    setShowPlus(true);
    onCountUpdate?.(initialCount + 1);

    setTimeout(() => setShowPlus(false), 800);
  };

  return (
    <div className="relative text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <span>今天有 {initialCount} 只小狗来过</span>
        <span className="text-lg">🐾</span>
      </div>

      <AnimatePresence>
        {showPlus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute -top-6 right-0 text-xs text-green-500 font-bold"
          >
            +1
          </motion.div>
        )}
      </AnimatePresence>

      {showAddOne && (
        <button
          onClick={handleAdd}
          className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          aria-label="Add paw"
        />
      )}
    </div>
  );
}

export function usePawCounter() {
  const [showPlus, setShowPlus] = useState(false);

  const addOne = () => {
    setShowPlus(true);
    setTimeout(() => setShowPlus(false), 800);
  };

  return { showPlus, addOne };
}
