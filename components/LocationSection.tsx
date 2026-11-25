"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Train,
  Mountain,
  Compass,
  ArrowRight,
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ATTRACTIONS } from "@/data/attractions";
import ScrollReveal from "@/components/ScrollReveal";

const INITIAL_VISIBLE_COUNT = 6;

export default function LocationSection() {
  const [filter, setFilter] = useState<"all" | "railway" | "attractions">("all");
  const [showAll, setShowAll] = useState(false);

  const filteredAttractions = ATTRACTIONS.filter((item) => {
    if (filter === "railway") return item.category === "railway";
    if (filter === "attractions") return item.category === "attractions";
    return true;
  });

  const hasMore = filteredAttractions.length > INITIAL_VISIBLE_COUNT;
  const visibleAttractions = showAll
    ? filteredAttractions
    : filteredAttractions.slice(0, INITIAL_VISIBLE_COUNT);
  const remainingCount = filteredAttractions.length - INITIAL_VISIBLE_COUNT;

  const handleFilterChange = (nextFilter: "all" | "railway" | "attractions") => {
    setFilter(nextFilter);
    setShowAll(false);
  };

  return (
    <section id="nearby" className="py-10 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Beautiful Title & Header Section */}
        <div className="scroll-reveal text-center max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C58E47]/15 border border-[#C58E47]/35 mb-3 shadow-2xs">
            <Compass className="w-4 h-4 text-[#C58E47]" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#243D2C]">
              Highland Crossroads &amp; Viewpoints
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243D2C] tracking-tight mb-2 leading-tight">
            Prime Location &amp; Nearby Attractions
          </h2>


        </div>

        {/* Filter Pills: Horizontally Scrollable on Mobile */}
        <div className="scroll-reveal delay-100 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 justify-start sm:justify-center p-1.5 bg-[#FAF9F5] rounded-2xl border border-[#EAE5DC] max-w-full sm:w-fit mx-auto shadow-2xs mb-6 sm:mb-8">
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className={`whitespace-nowrap flex-shrink-0 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${filter === "all"
              ? "bg-[#243D2C] text-white shadow-xs"
              : "text-[#4F6154] hover:text-[#1F2923]"
              }`}
          >
            All Highlights ({ATTRACTIONS.length})
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("railway")}
            className={`whitespace-nowrap flex-shrink-0 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${filter === "railway"
              ? "bg-[#243D2C] text-white shadow-xs"
              : "text-[#4F6154] hover:text-[#1F2923]"
              }`}
          >
            Railway &amp; Stations (3)
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("attractions")}
            className={`whitespace-nowrap flex-shrink-0 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${filter === "attractions"
              ? "bg-[#243D2C] text-white shadow-xs"
              : "text-[#4F6154] hover:text-[#1F2923]"
              }`}
          >
            Nature &amp; Sights (7)
          </button>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visibleAttractions.map((item, idx) => {
            const Icon = item.category === "railway" ? Train : Mountain;
            return (
              <ScrollReveal key={item.slug} variant="card" delayMs={(idx % 3) * 110} className="flex">
              <div
                className="editorial-card group flex flex-col w-full bg-[#FAF8F4] hover:bg-white rounded-[26px] border border-[#E6DFD3] hover:border-[#DFB775] overflow-hidden"
              >
                {/* Real Photo Thumbnail */}
                <Link
                  href={`/attractions/${item.slug}`}
                  className="relative h-52 sm:h-56 w-full overflow-hidden block bg-stone-200"
                >
                  <Image
                    src={item.heroImage}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="eager"
                    className="object-cover group-hover:scale-106 transition-transform duration-500 transform-gpu"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0D1912]/80 text-[#F6EFE6] border border-white/15 shadow-xs">
                      <Icon className="w-3 h-3 text-[#C58E47]" />
                      <span>{item.categoryLabel}</span>
                    </span>

                    {item.featured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C58E47] text-white shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>Key Highlight</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom overlay info inside photo */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs font-semibold bg-black/60 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-[#C58E47]" />
                      <span>{item.distance}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] bg-black/60 px-2 py-1 rounded-lg">
                      <Clock className="w-3 h-3 text-gray-300" />
                      <span>{item.travelTime}</span>
                    </div>
                  </div>
                </Link>

                {/* Card Content Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <Link
                        href={`/attractions/${item.slug}`}
                        className="font-serif text-lg sm:text-xl font-bold text-[#1F2923] group-hover:text-[#243D2C] transition-colors"
                      >
                        {item.name}
                      </Link>
                    </div>

                    <span className="text-xs text-[#C58E47] font-medium block mb-2 font-serif">
                      {item.sinhalaName}
                    </span>

                    <p className="text-xs sm:text-[13.5px] text-[#2C3E32] line-clamp-2 leading-relaxed mb-4">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-4 border-t border-[#EAE5DC] flex items-center justify-between">
                    <span className="text-xs text-[#4F6154] font-medium">
                      {item.images.length} Real Photos
                    </span>
                    <Link
                      href={`/attractions/${item.slug}`}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#243D2C]/5 hover:bg-[#243D2C] text-xs font-bold text-[#243D2C] hover:text-white transition-all shadow-2xs"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
              </ScrollReveal>
            );
          })}
        </div>

        {hasMore && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#243D2C] hover:bg-[#192B1F] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border border-[#DFB775]/40"
            >
              {showAll ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="w-4 h-4 text-[#DFB775]" />
                </>
              ) : (
                <>
                  <span>View More ({remainingCount} More)</span>
                  <ChevronDown className="w-4 h-4 text-[#DFB775]" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
