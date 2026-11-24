"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Mountain,
  Compass,
  ArrowLeft,
  Calendar,
  Thermometer,
  Ticket,
  Car,
  CheckCircle2,
  ExternalLink,
  Phone,
  Camera,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Info
} from "lucide-react";
import { Attraction } from "@/data/attractions";
import PhotoLightbox from "@/components/PhotoLightbox";

interface AttractionDetailViewProps {
  attraction: Attraction;
  otherAttractions: Attraction[];
}

export default function AttractionDetailView({
  attraction,
  otherAttractions,
}: AttractionDetailViewProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleOpenPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleClosePhoto = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(
        (selectedPhotoIndex - 1 + attraction.images.length) % attraction.images.length
      );
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % attraction.images.length);
    }
  };

  return (
    <div className="bg-[#F8F9F7] text-[#1F2923] min-h-screen pt-16 sm:pt-20">
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-[#E2E6E3] sticky top-16 sm:top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#7B887E]">
            <Link
              href="/"
              className="hover:text-[#243D2C] font-medium transition-colors flex items-center gap-1"
            >
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link
              href="/#nearby"
              className="hover:text-[#243D2C] font-medium transition-colors"
            >
              <span>Nearby Attractions</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#243D2C] font-semibold truncate max-w-[140px] sm:max-w-none">
              {attraction.name}
            </span>
          </nav>

          <Link
            href="/#nearby"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#243D2C] hover:text-[#C58E47] transition-colors bg-[#F8F9F7] px-3 py-1.5 rounded-lg border border-[#E2E6E3]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to All Attractions</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="relative bg-[#0D1912] text-white overflow-hidden min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] flex items-center">
        {/* Background Image with High Photographic Visibility */}
        <div className="absolute inset-0 z-0">
          <Image
            src={attraction.heroImage}
            alt={attraction.name}
            fill
            sizes="100vw"
            className="object-cover object-center opacity-85 sm:opacity-90 brightness-95 scale-100 transition-transform duration-1000"
            priority
          />
          {/* Directional Contrast Scrims: Clear view on right & crisp text contrast on left */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1912] via-[#0D1912]/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1912]/95 via-[#0D1912]/75 md:via-[#0D1912]/35 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 w-full">
          <div className="max-w-3xl">
            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C58E47] text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {attraction.badge}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white border border-white/20">
                <Compass className="w-3 h-3 text-[#C58E47]" />
                {attraction.categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white border border-white/20">
                <MapPin className="w-3 h-3 text-[#C58E47]" />
                {attraction.distance} from Villa
              </span>
            </div>

            {/* Title & Sinhala Name with Contrast Shadows */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-2 leading-tight [text-shadow:0_4px_16px_rgba(0,0,0,0.9)]">
              {attraction.name}
            </h1>
            <p className="text-base sm:text-xl text-[#DFB775] font-serif mb-6 font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.85)]">
              {attraction.sinhalaName}
            </p>

            <p className="text-base sm:text-lg text-white/95 leading-relaxed mb-8 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)] max-w-2xl font-normal">
              {attraction.shortDescription}
            </p>

            {/* Fast Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={attraction.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C58E47] hover:bg-[#A97633] text-white text-sm font-semibold transition-all shadow-md group"
              >
                <MapPin className="w-4 h-4" />
                <span>Open Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black/55 hover:bg-black/70 text-white text-sm font-semibold border border-white/30 transition-all shadow-sm"
              >
                <Compass className="w-4 h-4 text-[#D4A362]" />
                <span>Ask Susantha for Transport</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Quick Metrics Bar */}
      <section className="bg-white border-b border-[#E2E6E3] py-6 sm:py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-[#F8F9F7] border border-[#E2E6E3]">
              <div className="p-2.5 rounded-lg bg-[#243D2C] text-[#C58E47] flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B887E] block">
                  Distance from Villa
                </span>
                <span className="text-sm sm:text-base font-bold text-[#243D2C]">
                  {attraction.distance}
                </span>
                <span className="text-xs text-[#7B887E] block">
                  {attraction.travelTime}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-[#F8F9F7] border border-[#E2E6E3]">
              <div className="p-2.5 rounded-lg bg-[#243D2C] text-[#C58E47] flex-shrink-0">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B887E] block">
                  Elevation / Altitude
                </span>
                <span className="text-sm sm:text-base font-bold text-[#243D2C]">
                  {attraction.elevation}
                </span>
                <span className="text-xs text-[#7B887E] block">
                  Montane Climate
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-[#F8F9F7] border border-[#E2E6E3]">
              <div className="p-2.5 rounded-lg bg-[#243D2C] text-[#C58E47] flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B887E] block">
                  Suggested Time
                </span>
                <span className="text-sm sm:text-base font-bold text-[#243D2C]">
                  {attraction.suggestedDuration}
                </span>
                <span className="text-xs text-[#7B887E] block">
                  Recommended duration
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-[#F8F9F7] border border-[#E2E6E3]">
              <div className="p-2.5 rounded-lg bg-[#243D2C] text-[#C58E47] flex-shrink-0">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B887E] block">
                  Weather &amp; Temp
                </span>
                <span className="text-sm sm:text-base font-bold text-[#243D2C]">
                  {attraction.temperature.split("(")[0]}
                </span>
                <span className="text-xs text-[#7B887E] block">
                  Crisp Alpine Air
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sticky Sidebar Split */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column (8 cols): Deep Details, Gallery, Visitor Guide */}
            <div className="lg:col-span-8 space-y-12">
              {/* Detailed Overview & Story */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E6E3] shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-2 rounded-lg bg-[#F8F9F7] text-[#C58E47] border border-[#E2E6E3]">
                    <Info className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C58E47] block">
                      Comprehensive Guide
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#243D2C]">
                      About {attraction.name}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-base text-[#4A554E] leading-relaxed pt-2">
                  {attraction.overview.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Photo Gallery: Real Google / Archive Photographs */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E6E3] shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C58E47] block">
                      Authentic Visuals
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#243D2C]">
                      Real Photo Gallery ({attraction.images.length} Photos)
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#7B887E] bg-[#F8F9F7] px-3 py-1.5 rounded-lg border border-[#E2E6E3]">
                    <Camera className="w-4 h-4 text-[#C58E47]" />
                    <span>Click photo to enlarge</span>
                  </span>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attraction.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOpenPhoto(idx)}
                      className="group relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-[#E2E6E3] focus:outline-hidden focus:ring-2 focus:ring-[#C58E47] text-left"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                      
                      {/* Photo Badge & Caption */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-medium text-white flex items-center gap-1">
                        <Camera className="w-3 h-3 text-[#C58E47]" />
                        <span>Photo {idx + 1}</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-xs sm:text-sm font-medium text-white leading-snug line-clamp-2">
                          {img.caption}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Highlights & Things to See */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E6E3] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C58E47] mb-2 block">
                  Don&apos;t Miss Out
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#243D2C] mb-6">
                  Key Highlights &amp; Landmarks
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attraction.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-[#F8F9F7] border border-[#E2E6E3]"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#243D2C] text-[#C58E47] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-[#1F2923] leading-snug">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Visitor Guide & Tips */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E6E3] shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C58E47] mb-2 block">
                    Essential Practicalities
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#243D2C]">
                    Visitor Guide &amp; Tips
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-4 rounded-2xl bg-[#F8F9F7] border border-[#E2E6E3]">
                    <div className="flex items-center gap-2 text-[#243D2C] font-bold text-sm mb-2">
                      <Clock className="w-4 h-4 text-[#C58E47]" />
                      <span>Best Time to Visit</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A554E] leading-relaxed">
                      {attraction.bestTimeToVisit}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F9F7] border border-[#E2E6E3]">
                    <div className="flex items-center gap-2 text-[#243D2C] font-bold text-sm mb-2">
                      <Ticket className="w-4 h-4 text-[#C58E47]" />
                      <span>Permits &amp; Entry Fees</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A554E] leading-relaxed">
                      {attraction.ticketInfo}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F9F7] border border-[#E2E6E3]">
                    <div className="flex items-center gap-2 text-[#243D2C] font-bold text-sm mb-2">
                      <Car className="w-4 h-4 text-[#C58E47]" />
                      <span>Transport Options</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A554E] leading-relaxed">
                      {attraction.transportOptions}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F9F7] border border-[#E2E6E3]">
                    <div className="flex items-center gap-2 text-[#243D2C] font-bold text-sm mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#C58E47]" />
                      <span>Recommended Gear</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A554E] leading-relaxed">
                      Warm fleece or jacket, sturdy walking/hiking shoes, rain poncho, refillable water bottle, and camera with extra battery.
                    </p>
                  </div>
                </div>

                {/* How to Reach From Dawn Breezy Bungalow */}
                <div className="p-5 rounded-2xl bg-[#243D2C]/5 border border-[#243D2C]/15">
                  <div className="flex items-center gap-2 text-[#243D2C] font-bold text-sm mb-2">
                    <MapPin className="w-4 h-4 text-[#C58E47]" />
                    <span>How to Reach from Dawn Breezy Bungalow, Ohiya</span>
                  </div>
                  <p className="text-sm text-[#334438] leading-relaxed">
                    {attraction.howToReachFromVilla}
                  </p>
                </div>
              </div>

              {/* Dedicated On-Site Mountain Fleet Callout for this Attraction */}
              <div className="rounded-3xl bg-[#0D1912] border border-[#233F2C] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
                {/* Ambient Glows */}
                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#C58E47]/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#243D2C]/35 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Eyebrow */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-[#C58E47]/40 mb-3.5 backdrop-blur-xs">
                    <Car className="w-3.5 h-3.5 text-[#D4A362]" />
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#F6EFE6]">
                      On-Site at Dawn Breezy Bungalow • Direct with Susantha
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                    Private Car &amp; Scooters Available for {attraction.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D4DEC9]/90 leading-relaxed mb-6 max-w-2xl">
                    Skip third-party taxi delays, early morning bargaining, and crowded public transport. Our dedicated private tour car and mountain scooters are parked right on-site at the bungalow, ready when you are.
                  </p>

                  {/* 2 Fleet Cards with 3D Cutout Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Fleet Card 1: Private Mountain Tour Car */}
                    <div className="group rounded-2xl bg-[#142319] border border-[#233F2C] p-5 flex flex-col justify-between hover:border-[#C58E47]/60 transition-all shadow-xl">
                      <div>
                        {/* Vehicle Cutout Display */}
                        <div className="relative h-40 sm:h-44 flex items-center justify-center mb-3">
                          <Image
                            src="/photos/fleet/car-cutout.png"
                            alt={`Private mountain tour car for ${attraction.name}`}
                            width={500}
                            height={400}
                            className="max-h-full w-auto object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.85)] group-hover:scale-104 transition-transform duration-300"
                          />
                        </div>

                        <div className="mb-2">
                          <span className="inline-block text-[11px] font-semibold text-[#E1AB60] bg-[#C58E47]/15 border border-[#C58E47]/30 px-2.5 py-0.5 rounded-full">
                            1 Dedicated On-Site Car
                          </span>
                        </div>

                        <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#DFB775] transition-colors mb-1.5">
                          Private Mountain Tour Car
                        </h4>
                        <p className="text-xs text-[#E0E7E2] leading-relaxed mb-4">
                          Seats 4 to 5 guests. Perfect for early morning sunrise trips to {attraction.name} ({attraction.distance}, {attraction.travelTime}).
                        </p>
                      </div>

                      <Link
                        href="/#contact"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#C58E47] hover:bg-[#D69F56] text-[#0D1912] font-semibold text-xs shadow-md transition-all active:scale-95"
                      >
                        <Car className="w-3.5 h-3.5 fill-current" />
                        <span>Reserve Car for Tour</span>
                      </Link>
                    </div>

                    {/* Fleet Card 2: 2 Highland Scooters */}
                    <div className="group rounded-2xl bg-[#142319] border border-[#233F2C] p-5 flex flex-col justify-between hover:border-[#C58E47]/60 transition-all shadow-xl">
                      <div>
                        {/* Vehicle Cutout Display */}
                        <div className="relative h-40 sm:h-44 flex items-center justify-center mb-3">
                          <Image
                            src="/photos/fleet/scooter-cutout.png"
                            alt={`Highland mountain scooters for ${attraction.name}`}
                            width={500}
                            height={400}
                            className="max-h-full w-auto object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.85)] group-hover:scale-104 transition-transform duration-300"
                          />
                        </div>

                        <div className="mb-2">
                          <span className="inline-block text-[11px] font-semibold text-[#E1AB60] bg-[#C58E47]/15 border border-[#C58E47]/30 px-2.5 py-0.5 rounded-full">
                            2 On-Site Scooters
                          </span>
                        </div>

                        <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#DFB775] transition-colors mb-1.5">
                          2 Highland Scooters
                        </h4>
                        <p className="text-xs text-[#E0E7E2] leading-relaxed mb-4">
                          Explore scenic pine roads, tea trails, and curves toward {attraction.name} at your own pace. Helmets included.
                        </p>
                      </div>

                      <Link
                        href="/#contact"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#C58E47] hover:bg-[#D69F56] text-[#0D1912] font-semibold text-xs shadow-md transition-all active:scale-95"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Rent Scooters for Tour</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Sticky Booking & Transport Assistance Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-6">
              {/* Host Assistance & Safari Booking Card */}
              <div className="bg-[#243D2C] text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#30523B]">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C58E47]/20 border border-[#C58E47]/40 text-xs font-semibold text-[#F6EFE6]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C58E47]" />
                    <span>Host Support Included</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C58E47]/25 border border-[#C58E47]/40 text-[11px] font-semibold text-[#DFB775]">
                    1 Car &amp; 2 Scooters
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold tracking-tight mb-2">
                  Excursion &amp; Transport with Susantha
                </h3>

                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-6">
                  Planning to visit <strong>{attraction.name}</strong>? Host Susantha can arrange trusted 4WD safari jeeps, dedicated vans, or local tuk-tuks, along with hot packed morning breakfasts from the bungalow kitchen.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/#contact"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C58E47] hover:bg-[#B37E3A] text-white text-sm font-bold shadow-md transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Inquire About Trip</span>
                  </Link>

                  <a
                    href="tel:+94714194368"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all"
                  >
                    <Phone className="w-4 h-4 text-[#C58E47]" />
                    <span>Call Susantha (+94 71 419 4368)</span>
                  </a>

                  <Link
                    href="/#rooms"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C58E47] hover:bg-[#A97633] text-white text-sm font-bold transition-all shadow-md"
                  >
                    <span>Check Villa Room Availability</span>
                  </Link>
                </div>

                <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#C58E47] flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-300 leading-snug">
                    Zero middleman fees. Direct local rates with trusted drivers familiar with Ohiya mountain passes.
                  </p>
                </div>
              </div>

              {/* Other Viewpoints Widget */}
              <div className="bg-white rounded-3xl p-6 border border-[#E2E6E3] shadow-xs">
                <h4 className="font-serif text-lg font-bold text-[#243D2C] mb-4">
                  More Viewpoints Near Villa
                </h4>

                <div className="space-y-3">
                  {otherAttractions.slice(0, 4).map((other) => (
                    <Link
                      key={other.slug}
                      href={`/attractions/${other.slug}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F9F7] transition-colors border border-transparent hover:border-[#E2E6E3] group"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={other.heroImage}
                          alt={other.name}
                          fill
                          sizes="56px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-[#1F2923] group-hover:text-[#C58E47] transition-colors truncate">
                          {other.name}
                        </h5>
                        <span className="text-[11px] text-[#7B887E] block">
                          {other.distance}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#C58E47] transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>

                <Link
                  href="/#nearby"
                  className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#243D2C] hover:text-[#C58E47] transition-colors bg-[#F8F9F7] rounded-xl border border-[#E2E6E3]"
                >
                  <span>View All 10 Nearby Landmarks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox for zooming photos */}
      <PhotoLightbox
        isOpen={selectedPhotoIndex !== null}
        photoUrl={
          selectedPhotoIndex !== null
            ? attraction.images[selectedPhotoIndex].url
            : null
        }
        caption={
          selectedPhotoIndex !== null
            ? `${attraction.images[selectedPhotoIndex].caption} (${selectedPhotoIndex + 1}/${attraction.images.length})`
            : ""
        }
        onClose={handleClosePhoto}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
      />
    </div>
  );
}
