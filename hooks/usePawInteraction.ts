import { useState, useRef, useCallback, useMemo } from "react";

export interface Paw {
  id: string;
  x: number;
  y: number;
  style: string;
  rotation: number;
  scale: number;
}

export type DogMood = 'neutral' | 'happy' | 'excited';

export interface UsePawInteractionReturn {
  paws: Paw[];
  dogMood: DogMood;
  handleMouseClick: (e: React.MouseEvent, onSuccess?: (count: number) => void) => void;
  handleTouchStart: (e: React.TouchEvent, onSuccess?: (count: number) => void) => void;
  cleanup: () => void;
}

const PAW_STYLES = ['🐾', '🐕', '🦮'] as const;
const MAX_PAWS = 6;
const DEBOUNCE_MS = 1000;
const AUTO_REMOVE_MS = 3000;

function getRandomRotation(): number {
  return Math.random() * 30 - 15;
}

function getRandomScale(): number {
  return 0.8 + Math.random() * 0.4;
}

function getCoordinates(
  e: MouseEvent | TouchEvent,
  containerRef: React.RefObject<HTMLElement | null>
): { x: number; y: number } {
  if ('offsetX' in e) {
    return {
      x: (e as MouseEvent).offsetX,
      y: (e as MouseEvent).offsetY,
    };
  }
  
  if ('touches' in e && e.touches.length > 0 && containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }
  
  return { x: 0, y: 0 };
}

function getRandomPawStyle(lastStyles: string[]): string {
  const availableStyles = PAW_STYLES.filter(
    (style) => !lastStyles.slice(-2).includes(style)
  );
  
  if (availableStyles.length > 0) {
    return availableStyles[Math.floor(Math.random() * availableStyles.length)];
  }
  
  return PAW_STYLES[Math.floor(Math.random() * PAW_STYLES.length)];
}

export function usePawInteraction(
  containerRef: React.RefObject<HTMLElement | null>
): UsePawInteractionReturn {
  const [paws, setPaws] = useState<Paw[]>([]);
  const [dogMood, setDogMood] = useState<DogMood>('neutral');
  const lastApiCallTime = useRef<number>(0);
  const moodTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pawIdCounter = useRef<number>(0);

  const recentStyles = useMemo(() => {
    return paws.map((p) => p.style);
  }, [paws]);

  const callApi = useCallback(async (onSuccess?: (count: number) => void): Promise<void> => {
    const now = Date.now();
    if (now - lastApiCallTime.current < DEBOUNCE_MS) {
      return;
    }
    
    lastApiCallTime.current = now;
    
    try {
      const res = await fetch("/api/paw", { method: "POST" });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data.count !== undefined && onSuccess) {
        onSuccess(data.count);
      }
    } catch (error) {
      lastApiCallTime.current = 0;
      console.error('爪印API调用失败:', error);
    }
  }, []);

  const updateMood = useCallback((newMood: DogMood, duration: number = 500): void => {
    setDogMood(newMood);
    
    if (moodTimeoutRef.current) {
      clearTimeout(moodTimeoutRef.current);
    }
    
    moodTimeoutRef.current = setTimeout(() => {
      setDogMood('neutral');
    }, duration);
  }, []);

  const addPaw = useCallback((x: number, y: number): void => {
    const newPaw: Paw = {
      id: `paw-${pawIdCounter.current++}`,
      x,
      y,
      style: getRandomPawStyle(recentStyles),
      rotation: getRandomRotation(),
      scale: getRandomScale(),
    };

    setPaws((prev) => {
      const updated = [...prev, newPaw];
      if (updated.length > MAX_PAWS) {
        return updated.slice(-MAX_PAWS);
      }
      return updated;
    });

    setTimeout(() => {
      setPaws((prev) => prev.filter((p) => p.id !== newPaw.id));
    }, AUTO_REMOVE_MS);
  }, [recentStyles]);

  const handleInteraction = useCallback(
    (e: MouseEvent | TouchEvent, onSuccess?: (count: number) => void): void => {
      e.preventDefault();
      
      const { x, y } = getCoordinates(e, containerRef);
      addPaw(x, y);
      callApi(onSuccess);

      const clickCount = paws.length + 1;
      if (clickCount >= 3) {
        updateMood('excited', 2000);
      } else {
        updateMood('happy', 500);
      }
    },
    [addPaw, callApi, paws.length, updateMood, containerRef]
  );

  const handleMouseClick = useCallback(
    (e: React.MouseEvent, onSuccess?: (count: number) => void): void => {
      handleInteraction(e.nativeEvent, onSuccess);
    },
    [handleInteraction]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, onSuccess?: (count: number) => void): void => {
      handleInteraction(e.nativeEvent, onSuccess);
    },
    [handleInteraction]
  );

  const cleanup = useCallback((): void => {
    if (moodTimeoutRef.current) {
      clearTimeout(moodTimeoutRef.current);
    }
  }, []);

  return {
    paws,
    dogMood,
    handleMouseClick,
    handleTouchStart,
    cleanup,
  };
}