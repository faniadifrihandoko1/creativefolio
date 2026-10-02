"use client";
import { useEffect, useState } from "react";

/** Progress bar baca artikel di tepi atas layar. */
export const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-green-500 z-50 transition-[width] duration-75"
      style={{ width: `${progress}%` }}
      aria-hidden
    />
  );
};
