"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePawInteraction } from "@/hooks/usePawInteraction";
import DogMood from "./DogMood";

interface PawInteractionProps {
  onCountUpdate?: (count: number) => void;
}

export default function PawInteraction({ onCountUpdate }: PawInteractionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { paws, dogMood, handleMouseClick, handleTouchStart } = usePawInteraction(containerRef);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMouseClick(e, onCountUpdate);
  };

  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    handleTouchStart(e, onCountUpdate);
  };

  return (
    <div
      onClick={handleClick}
      onTouchStart={handleTouch}
      className="relative w-full h-[300px] cursor-pointer select-none bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl overflow-hidden touch-none transition-all duration-200 hover:from-amber-200 hover:to-orange-300 hover:shadow-lg active:scale-[0.98] active:from-amber-200 active:to-orange-300"
      style={{ pointerEvents: "auto" }}
    >
      <p className="absolute inset-0 flex items-center justify-center text-amber-700/60 text-lg font-medium pointer-events-none">
        点击这里，留下你的痕迹吧
      </p>
      <AnimatePresence mode="popLayout">
        {paws.map((paw) => (
          <motion.div
            key={paw.id}
            layout
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 1, 0.9, 0.9, 0],
              scale: [0.5, 1.2, 1, 1, 0.8],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 3,
              times: [0, 0.13, 0.2, 0.87, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute pointer-events-none text-3xl select-none"
            style={{
              left: paw.x - 16,
              top: paw.y - 16,
              transform: `rotate(${paw.rotation}deg) scale(${paw.scale})`,
            }}
          >
            {paw.style}
          </motion.div>
        ))}
      </AnimatePresence>

      <DogMood mood={dogMood} />
    </div>
  );
}