"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  Train,
  Mountain,
  Compass,
  Sparkles,
  ChevronDown
} from "lucide-react";

const HERO_BACKGROUNDS = [
  {
    url: "/photos/hero-1.jpg",
    alt: "Dawn Breezy Bungalow mountain garden and misty gazebo in Ohiya",
  },
  {
    url: "/photos/hero-2.jpg",
    alt: "Morning mist along Welimada Road towards Horton Plains",
  },
  {
    url: "/photos/outside-cool-view.jpeg",
    alt: "Panoramic pine valley view from our mountain veranda",
  },
  {
    url: "/photos/hero-3.jpg",
    alt: "Dawn mountain peaks of Ohiya at 1,775 meters altitude",
  },
];

const TICKER_ITEMS = [
  {
    icon: Train,
    prefix: "Station",
    text: "200m from Ohiya Station",
    highlight: "3-Min Walk",
  },
  {
    icon: Mountain,
    prefix: "Gateway",
    text: "Gateway to Horton Plains",
    highlight: "World's End",
  },
  {
    icon: Compass,
    prefix: "Altitude",
    text: "1,775m Alpine Heights",
    highlight: "Cool Mist",
  },
  {
    icon: Sparkles,
    prefix: "Views",
    text: "Panoramic Pine Valley Views",
    highlight: "Valley Views",
  },
  {
    icon: ShieldCheck,
    prefix: "Direct",
    text: "Zero Fees • Book Direct",
    highlight: "Best Rate",
  },
];

export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Background Image Crossfade Interval (every 5 seconds)
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(bgTimer);
  }, []);

  // Text Ticker Rotation Interval (every 3 seconds)
  useEffect(() => {
    const tickerTimer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 3000);
    return () => clearInterval(tickerTimer);
  }, []);

  // Zero-lag GPU Parallax via direct DOM ref (zero React re-renders on scroll)
  useEffect(() => {
    let rafId = 0;
    const updateParallax = () => {
      const el = heroContentRef.current;
      if (!el) return;
      const y = window.scrollY;
      if (y <= 700) {
        const shift = Math.round(Math.min(y * 0.16, 100));
        const opacity = Math.max(0, 1 - y / 620);
        el.style.transform = y > 0 ? `translate3d(0, ${shift}px, 0)` : "translate3d(0, 0, 0)";
        el.style.opacity = String(opacity);
      }
    };
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateParallax);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const currentTicker = TICKER_ITEMS[tickerIndex];
  const TickerIcon = currentTicker.icon;

  return (
    <section className="relative w-full min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#111E16]">
      {/* Continuously Animated Crossfading Background Images */}
      <div className="absolute inset-0 z-0">
        {HERO_BACKGROUNDS.map((bg, idx) => (
          <div
            key={bg.url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === bgIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={bg.url}
              alt={bg.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`object-cover object-center transition-transform duration-[6000ms] ease-out transform-gpu ${
                idx === bgIndex ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}

        {/* Crisp Editorial Gradient Vignettes (Zero heavy blur filters) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1912] via-[#132219]/55 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(13,25,18,0.68)_100%)]" />
      </div>

      {/* Hero Content - Perfectly Balanced Vertical Layout */}
      <div
        ref={heroContentRef}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-32 lg:pb-36 text-center flex flex-col items-center justify-center min-h-screen min-h-[100dvh] w-full will-change-transform"
      >
        {/* Unified Content Block: Eyebrow, Headline, Subheadline & Action Buttons */}
        <div className="flex flex-col items-center text-center w-full max-w-4xl my-auto">
          {/* Circled Upper Block: Eyebrow Badge & Main Headline - Elevated slightly up */}
          <div className="flex flex-col items-center -translate-y-3 sm:-translate-y-4 lg:-translate-y-5 transition-transform duration-300">
            {/* Continuously Animated Compact Eyebrow Badge */}
            <div className="animate-in fade-in duration-600 slide-in-from-bottom-2 mb-4 sm:mb-5 min-h-[36px] flex items-center justify-center">
              <div
                key={tickerIndex}
                className="animate-in fade-in slide-in-from-bottom-1 duration-400 inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/55 hover:bg-black/70 border border-[#C58E47]/50 shadow-lg transition-colors whitespace-nowrap"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#C58E47] text-white flex items-center justify-center flex-shrink-0">
                  <TickerIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase">
                  {currentTicker.text}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold text-[#DFB775] bg-[#C58E47]/20 px-2 py-0.5 rounded-full border border-[#C58E47]/35">
                  {currentTicker.highlight}
                </span>
              </div>
            </div>

            {/* Main Headline - Condensed Architectural Display with Signature Dancing Script Overlap */}
            <h1 className="animate-in fade-in duration-700 slide-in-from-bottom-3 delay-100 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-2 mb-3.5 sm:mb-4.5">
              <span className="font-antonio font-bold text-[3.25rem] xs:text-[3.65rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] tracking-tight uppercase leading-[0.9] sm:leading-[0.88] bg-gradient-to-b from-white via-[#FFF7E8] to-[#E5DAC8] bg-clip-text text-transparent [text-shadow:0_4px_24px_rgba(0,0,0,0.75)] select-none relative z-0">
                Wake Up Above
              </span>
              <span className="font-dancing font-bold text-[3.85rem] xs:text-[4.25rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] normal-case text-[#DFB775] [text-shadow:0_4px_18px_rgba(0,0,0,0.85),0_1px_3px_rgba(0,0,0,0.9)] leading-[1.0] sm:leading-[1.0] -mt-4 xs:-mt-5 sm:-mt-6 md:-mt-8 lg:-mt-10 relative z-10 inline-block select-none">
                The Clouds
              </span>
            </h1>
          </div>

          {/* Subheadline - Stays grounded in its balanced position */}
          <p className="animate-in fade-in duration-700 slide-in-from-bottom-3 delay-200 max-w-xl text-xs sm:text-sm md:text-base text-white/90 font-normal leading-relaxed drop-shadow-sm px-2 mb-7 sm:mb-9 md:mb-10">
            A quiet family-run bungalow in Ohiya, offering panoramic pine valley views and easy morning trips to Horton Plains.
          </p>

          {/* Balanced Action Buttons Block */}
          <div className="animate-in fade-in duration-700 slide-in-from-bottom-3 delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/booking"
              className="w-[78%] xs:w-[72%] sm:w-auto max-w-[270px] sm:max-w-none min-w-[210px] sm:min-w-[220px] inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C58E47] to-[#B37C35] hover:from-[#D4A362] hover:to-[#C58E47] text-white font-semibold text-xs sm:text-sm shadow-xl shadow-black/30 hover:scale-103 active:scale-97 transition-all duration-200 border border-[#DFB775]/50"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve Your Stay</span>
            </Link>

            <Link
              href="/#rooms"
              className="w-[78%] xs:w-[72%] sm:w-auto max-w-[270px] sm:max-w-none min-w-[210px] sm:min-w-[220px] inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-black/35 hover:bg-black/55 text-white font-semibold text-xs sm:text-sm border border-white/40 hover:border-[#DFB775] shadow-lg hover:scale-103 active:scale-97 transition-all duration-200"
            >
              <span>Explore Rooms &amp; Rates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Minimal Editorial Scroll Cue */}
        <Link
          href="/#rooms"
          aria-label="Scroll down to rooms"
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-white/65 hover:text-[#DFB775] transition-colors"
        >
          <span className="hidden sm:inline">Explore</span>
          <ChevronDown className="w-4 h-4 animate-float-gentle" />
        </Link>
      </div>
    </section>
  );
}
