"use client";

import { useEffect, useRef } from "react";

export default function ScrollObserver() {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hardware-accelerated Scroll Progress Indicator at the top of the viewport
    let animationFrameId: number;

    const updateScrollProgress = () => {
      if (!progressBarRef.current) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
      progressBarRef.current.style.transform = `scaleX(${progress})`;
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={progressBarRef}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#DFB775] via-[#C58E47] to-[#DFB775] z-50 origin-left pointer-events-none transition-transform duration-75 ease-out shadow-xs shadow-[#C58E47]/40"
      style={{ transform: "scaleX(0)" }}
      aria-hidden="true"
    />
  );
}
