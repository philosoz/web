"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Paw = {
  id: number;
  x: number;
  y: number;
};

export default function PawInteraction({ onAddOne }: { onAddOne: () => void }) {
  const [paws, setPaws] = useState<Paw[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const newPaw: Paw = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };

    setPaws((prev) => {
      const updated = [...prev, newPaw];
      if (updated.length > 6) {
        updated.shift();
      }
      return updated;
    });

    onAddOne();

    setTimeout(() => {
      setPaws((prev) => prev.filter((p) => p.id !== newPaw.id));
    }, 3000);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-[300px] cursor-crosshair bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-amber-800 text-sm bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg">
          点击留下爪印 🐾
        </p>
      </div>

      <AnimatePresence>
        {paws.map((paw) => (
          <motion.div
            key={paw.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.9, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute pointer-events-none text-2xl"
            style={{
              left: paw.x - 12,
              top: paw.y - 12,
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
            }}
          >
            🐾
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
