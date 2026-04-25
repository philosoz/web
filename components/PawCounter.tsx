"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PawCounterProps {
  initialCount?: number;
  showAddOne?: boolean;
  onCountUpdate?: (count: number) => void;
}

export default function PawCounter({ initialCount = 128, showAddOne = false, onCountUpdate }: PawCounterProps) {
  const [showPlus, setShowPlus] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const prevCountRef = useRef<number | null>(null);
  const animationKeyRef = useRef(0);

  useEffect(() => {
    setIsLoading(true);
    if (initialCount !== undefined && initialCount !== null) {
      setCount(initialCount);
      prevCountRef.current = initialCount;
      setIsLoading(false);
    }
  }, [initialCount]);

  const handleAdd = () => {
    if (count === null) return;

    setShowPlus(true);
    animationKeyRef.current += 1;
    const newCount = count + 1;
    setCount(newCount);
    prevCountRef.current = newCount;
    onCountUpdate?.(newCount);

    setTimeout(() => setShowPlus(false), 800);
  };

  return (
    <div className="relative text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <span>今天有 </span>
        <AnimatePresence mode="wait">
          {isLoading || count === null ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="inline-block w-12 h-4 bg-gray-200 rounded animate-pulse"
            />
          ) : (
            <motion.span
              key={`count-${animationKeyRef.current}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="inline-block"
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
        <span> 只小狗来过</span>
        <span className="text-lg">🐾</span>
      </div>

      <AnimatePresence>
        {showPlus && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -12, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute -top-5 right-0 text-xs text-green-500 font-bold"
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