'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PawAnimationProps {
  x: number;
  y: number;
  style: string;
  rotation: number;
  scale: number;
}

export default function PawAnimation({ x, y, style, rotation, scale }: PawAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const disappearDelay = 2600;

    const disappearTimer = setTimeout(() => {
      setIsVisible(false);
    }, disappearDelay);

    return () => {
      clearTimeout(disappearTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            scale: 0.5,
            opacity: 0
          }}
          animate={{
            scale: [0.5, 1.2, 1],
            opacity: [0, 0.9, 0.9]
          }}
          transition={{
            times: [0, 0.5, 1],
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }}
          exit={{
            opacity: 0,
            scale: 0.8,
            transition: {
              duration: 0.4,
              ease: 'easeOut'
            }
          }}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          <motion.div
            initial={{ rotate: rotation }}
            style={{
              fontSize: '2rem',
              userSelect: 'none',
              display: 'inline-block',
              scale: scale,
              rotate: rotation
            }}
          >
            {style}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
