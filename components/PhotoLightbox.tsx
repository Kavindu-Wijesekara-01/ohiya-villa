"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string | null;
  caption: string;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function PhotoLightbox({
  isOpen,
  onClose,
  photoUrl,
  caption,
  onPrev,
  onNext,
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !photoUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption || "Highland Photo View"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between pb-3 text-white">
          <div className="flex flex-col">
            <h4 className="text-sm sm:text-base font-bold font-serif text-white">
              {caption}
            </h4>
            <span className="text-[11px] text-[#A5B0A8]">
              Dawn Breezy Bungalow • Ohiya, Sri Lanka
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo view"
            className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Photo Container with Next / Prev overlay */}
        <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden bg-black/60 border border-white/15 shadow-2xl flex items-center justify-center">
          <Image
            src={photoUrl}
            alt={caption || "Dawn Breezy Bungalow photo"}
            fill
            sizes="95vw"
            unoptimized={photoUrl.startsWith("data:") || photoUrl.startsWith("/uploads/")}
            className="object-contain"
            priority
          />

          {/* Navigation Arrows */}
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
