import { useState, useEffect } from "react";

export function usePawCount() {
  const [count, setCount] = useState(128);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/paw")
      .then((res) => res.json())
      .then((data) => {
        if (data.count) {
          setCount(data.count);
        }
      })
      .catch(() => {
        // 使用默认值
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const increment = async () => {
    try {
      const res = await fetch("/api/paw", { method: "POST" });
      const data = await res.json();
      if (data.count) {
        setCount(data.count);
      }
    } catch {
      // 静默失败
    }
  };

  return { count, loading, increment };
}
