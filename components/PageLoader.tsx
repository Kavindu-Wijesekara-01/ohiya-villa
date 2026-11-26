"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [phase, setPhase] = useState<"visible" | "fading" | "done">("visible");

  useEffect(() => {
    if (isAdmin) {
      setPhase("done");
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setPhase("done");
      return;
    }

    let fadeTimer = 0;
    let doneTimer = 0;

    const startDismiss = () => {
      fadeTimer = window.setTimeout(() => {
        setPhase("fading");
        doneTimer = window.setTimeout(() => {
          setPhase("done");
        }, 520);
      }, 450);
    };

    if (document.readyState === "complete") {
      startDismiss();
    } else {
      window.addEventListener("load", startDismiss, { once: true });
      // Fallback safety so loader never lingers if slow external resource delays load
      fadeTimer = window.setTimeout(() => {
        setPhase("fading");
        doneTimer = window.setTimeout(() => setPhase("done"), 520);
      }, 1100);
    }

    return () => {
      window.removeEventListener("load", startDismiss);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [isAdmin]);

  if (isAdmin || phase === "done") return null;

  return (
    <div
      id="initial-page-loader"
      role="status"
      aria-label="Loading Dawn Breezy Bungalow"
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-500 ease-out ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div
          className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-[#C58E47]/35 animate-ping"
          style={{ animationDuration: "2.2s" }}
        />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#C58E47]/70 bg-white shadow-lg">
          <Image
            src="/logo.jpeg"
            alt="Dawn Breezy Bungalow Logo"
            fill
            priority
            quality={95}
            sizes="128px"
            className="object-cover scale-[1.24]"
          />
        </div>
      </div>
    </div>
  );
}
