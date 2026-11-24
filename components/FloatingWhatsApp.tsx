"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end group">
      {/* Tooltip / Prompt bubble on desktop */}
      <div
        className={`mb-3 bg-white text-[#1F2923] text-xs font-medium py-2 px-3.5 rounded-2xl shadow-xl border border-[#E2E6E3] max-w-xs transition-all duration-300 pointer-events-none hidden sm:block ${
          showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#243D2C]">Need quick assistance?</span>
        </div>
        <p className="text-[11px] text-[#7B887E] mt-0.5">
          Chat with host Susantha on WhatsApp for direct rates &amp; availability.
        </p>
      </div>

      {/* Floating Action Button */}
      <a
        href="https://wa.me/94714194368?text=Hello%20Susantha%2C%20I%20would%20like%20to%20inquire%20about%20staying%20at%20Dawn%20Breezy%20Bungalow%2C%20Ohiya."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Chat with Dawn Breezy Bungalow"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/40"
      >
        <MessageCircle className="w-7 h-7 fill-current" />

        {/* Online Indicator Badge */}
        <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
        </span>
      </a>
    </div>
  );
}
