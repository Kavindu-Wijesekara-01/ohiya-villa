"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Train,
  Mountain,
  Compass,
  Sparkles
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
    highlight: "Scenic Haven",
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
  const [scrollY, setScrollY] = useState(0);

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

  // Subtle Smooth Scroll Parallax
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentTicker = TICKER_ITEMS[tickerIndex];
  const TickerIcon = currentTicker.icon;

  return (
    <section className="relative w-full min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#17271D]">
      {/* Continuously Animated Crossfading Background Images */}
      <div className="absolute inset-0 z-0">
        {HERO_BACKGROUNDS.map((bg, idx) => (
          <div
            key={bg.url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === bgIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <Image
              src={bg.url}
              alt={bg.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${idx === bgIndex ? "scale-108" : "scale-100"
                }`}
            />
          </div>
        ))}

        {/* Sophisticated Multi-Layer Luxury Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#17271D] via-[#17271D]/65 to-[#17271D]/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#17271D]/40 to-[#17271D]/85" />
      </div>

      {/* Hero Content - Perfectly Balanced Vertical Layout with Scroll Animation */}
      <div
        style={{
          transform: `translateY(${Math.min(scrollY * 0.22, 140)}px)`,
          opacity: Math.max(0, 1 - scrollY / 650),
          willChange: "transform, opacity",
        }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-32 lg:pb-36 text-center flex flex-col items-center justify-center min-h-screen min-h-[100dvh] w-full transition-all duration-150 ease-out"
      >
        {/* Unified Content Block: Eyebrow, Headline, Subheadline & Action Buttons */}
        <div className="flex flex-col items-center text-center w-full max-w-4xl my-auto">
          {/* Circled Upper Block: Eyebrow Badge & Main Headline - Elevated slightly up */}
          <div className="flex flex-col items-center -translate-y-3 sm:-translate-y-4 lg:-translate-y-5 transition-transform duration-300">
            {/* Continuously Animated Compact Eyebrow Badge */}
            <div className="scroll-reveal mb-4 sm:mb-5 min-h-[36px] flex items-center justify-center">
              <div
                key={tickerIndex}
                className="animate-in fade-in slide-in-from-bottom-1 duration-400 inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/45 hover:bg-black/60 border border-[#C58E47]/45 backdrop-blur-xl shadow-md transition-all whitespace-nowrap"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#C58E47] text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <TickerIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase drop-shadow-2xs">
                  {currentTicker.text}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold text-[#D4A362] bg-[#C58E47]/20 px-1.5 py-0.5 rounded-full border border-[#C58E47]/30">
                  {currentTicker.highlight}
                </span>
              </div>
            </div>

            {/* Main Headline - Condensed Architectural Display with Signature Dancing Script Overlap */}
            <h1 className="scroll-reveal delay-100 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-2 mb-3.5 sm:mb-4.5">
              <span className="font-antonio font-bold text-[3.25rem] xs:text-[3.65rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] tracking-tight uppercase leading-[0.9] sm:leading-[0.88] bg-gradient-to-b from-white via-[#FFF7E8] to-[#E5DAC8] bg-clip-text text-transparent drop-shadow-[0_12px_32px_rgba(0,0,0,0.9)] select-none relative z-0">
                Wake Up Above
              </span>
              <span className="font-dancing font-bold text-[3.85rem] xs:text-[4.25rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] normal-case text-[#DFB775] drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] leading-[1.0] sm:leading-[1.0] -mt-4 xs:-mt-5 sm:-mt-6 md:-mt-8 lg:-mt-10 relative z-10 inline-block select-none">
                The Clouds
              </span>
            </h1>
          </div>

          {/* Subheadline - Stays grounded in its balanced position */}
          <p className="scroll-reveal delay-200 max-w-xl text-xs sm:text-sm md:text-base text-white/85 font-normal leading-relaxed drop-shadow-sm px-2 mb-7 sm:mb-9 md:mb-10">
            A serene highland sanctuary in Ohiya, offering misty pine panoramas and effortless access to Horton Plains.
          </p>

          {/* Balanced Action Buttons Block - Slightly more compact and refined on mobile */}
          <div className="scroll-reveal delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="https://wa.me/94714194368?text=Hello%20Susantha%2C%20I%20would%20like%20to%20reserve%20a%20stay%20at%20Dawn%20Breezy%20Bungalow%2C%20Ohiya."
              target="_blank"
              rel="noopener noreferrer"
              className="w-[78%] xs:w-[72%] sm:w-auto max-w-[270px] sm:max-w-none min-w-[210px] sm:min-w-[215px] inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-full bg-[#C58E47] hover:bg-[#A97633] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#C58E47]/25 hover:scale-103 active:scale-97 transition-all duration-200 border border-[#D4A362]/40"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Reserve Your Stay</span>
            </a>

            <a
              href="/#rooms"
              className="w-[78%] xs:w-[72%] sm:w-auto max-w-[270px] sm:max-w-none min-w-[210px] sm:min-w-[215px] inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/35 hover:border-white shadow-md hover:scale-103 active:scale-97 transition-all duration-200"
            >
              <span>Explore Rooms &amp; Rates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
