"use client";

import { Train, Car, Flame, Wifi, ShieldCheck, Sparkles } from "lucide-react";

export default function PropertyHighlights() {
  const highlights = [
    {
      icon: Train,
      badge: "3 Min Walk",
      title: "200m to Ohiya Station",
      description: "A simple 3-minute walk from the railway platform with free luggage assistance.",
    },
    {
      icon: Car,
      badge: "On-Site Fleet",
      title: "1 Car & 2 Scooters",
      description: "Private car for 5:30 AM Horton Plains tours plus 2 mountain scooters for scenic trails.",
    },
    {
      icon: Flame,
      badge: "Highland Heat",
      title: "Highland Hot Water",
      description: "3 private en-suite bathrooms equipped with reliable, soothing hot showers at 1,775m.",
    },
    {
      icon: Wifi,
      badge: "High Speed",
      title: "Free High-Speed WiFi",
      description: "Fast mountain wireless throughout all bedrooms, living lounge, and tea veranda.",
    },
    {
      icon: ShieldCheck,
      badge: "Local Care",
      title: "24-Hour Hospitality",
      description: "Susantha's warm, attentive host care, home-cooked Ceylon meals, and trekking advice.",
    },
  ];

  return (
    <section className="bg-[#FAF8F4] border-y border-[#E6E0D5] py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Zero-lag radial ambient glow behind cards */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(223,183,117,0.11)_0%,transparent_75%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="scroll-reveal text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFB775]/15 border border-[#DFB775]/35 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#243D2C] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C58E47]" />
            <span>Essential Highland Comforts</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[2.25rem] font-normal text-[#17271D] tracking-tight">
            Designed for an <span className="italic font-normal text-[#A97633]">Unhurried</span> Mountain Stay
          </h2>
        </div>

        {/* 5-Card Responsive Luxury Deck: 2 Columns on Mobile, 3 on Tablet, 5 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            const isLastOnMobile = idx === 4;
            return (
              <div
                key={item.title}
                className={`editorial-card group relative bg-white rounded-[22px] p-4 sm:p-5 border border-[#E6E0D5] hover:border-[#DFB775] flex flex-col justify-between ${
                  isLastOnMobile ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                {/* Ambient hover glow inside card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAF6EE] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[22px] pointer-events-none" />

                <div className="relative z-10">
                  {/* Top Bar: Icon Badge + Micro Tag */}
                  <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#FAF5EE] to-[#ECE5D8] border border-[#DFB775]/40 flex items-center justify-center text-[#9E6D30] group-hover:bg-[#243D2C] group-hover:text-[#DFB775] group-hover:border-[#243D2C] group-hover:scale-105 transition-all duration-300 shadow-2xs">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#243D2C]/5 text-[#243D2C] border border-[#243D2C]/10 group-hover:bg-[#DFB775]/20 group-hover:text-[#9E6D30] group-hover:border-[#DFB775]/40 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-serif text-sm sm:text-base font-semibold text-[#17271D] group-hover:text-[#243D2C] tracking-tight mb-1 sm:mb-1.5 leading-snug">
                    {item.title}
                  </h3>

                  {/* Description - Clear, Legible Modern Luxury Style */}
                  <p className="text-xs sm:text-[13px] text-[#2C3E32] font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Gold Accent Bar */}
                <div className="relative z-10 mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#F0ECE4]">
                  <div className="w-5 sm:w-6 group-hover:w-10 sm:group-hover:w-12 h-0.5 bg-[#DFB775]/50 group-hover:bg-[#C58E47] rounded-full transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
