"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  className = "",
  variant = "section",
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "section" | "card";
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Always initialize as "ssr" on server and during every hydration pass so markup matches 100%.
  const [status, setStatus] = useState<"ssr" | "pending" | "visible">("ssr");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setStatus("visible");
      return;
    }

    const revealNowIfInOrAboveView = () => {
      const rect = el.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.96;
      if ((rect.top < triggerY && rect.bottom > 0) || rect.bottom <= 0) {
        setStatus("visible");
        return true;
      }
      return false;
    };

    if (revealNowIfInOrAboveView()) {
      return;
    }

    setStatus("pending");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStatus("visible");
            observer.disconnect();
            break;
          }
        }
      },
      {
        threshold: 0.02,
        rootMargin: "0px 0px -24px 0px",
      }
    );

    observer.observe(el);

    const handleCheck = () => {
      if (revealNowIfInOrAboveView()) {
        observer.disconnect();
      }
    };

    window.addEventListener("hashchange", handleCheck);
    window.addEventListener("scroll", handleCheck, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", handleCheck);
      window.removeEventListener("scroll", handleCheck);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-sr={status}
      data-sr-kind={variant}
      style={delayMs > 0 ? ({ "--sr-d": `${delayMs}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
