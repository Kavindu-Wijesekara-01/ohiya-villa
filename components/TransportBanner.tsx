"use client";

import Image from "next/image";
import {
  Compass,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  Car,
} from "lucide-react";

export default function TransportBanner() {
  return (
    <section
      id="transport"
      className="py-14 sm:py-20 lg:py-24 bg-[#0D1912] text-white relative overflow-hidden"
    >
      {/* Zero-lag Atmospheric Highlands Radial Spotlights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_10%_30%,rgba(197,142,71,0.10)_0%,transparent_70%),radial-gradient(ellipse_55%_45%_at_90%_75%,rgba(36,61,44,0.35)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#C58E47_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="scroll-reveal text-center max-w-2xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#C58E47]/35 mb-4 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-[#D4A362]" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#F6EFE6]">
              Direct Transport • Horton Plains &amp; Scenic Trails
            </span>
          </div>

          {/* Section Headline */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white mb-3.5 leading-[1.18]">
            Beyond the bungalow
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-[#D4DEC9]/85 font-normal leading-relaxed">
            Skip third-party taxi delays and early morning bargaining. Our own car and scooters
            are parked on site and ready when you are.
          </p>
        </div>

        {/* 2 Fleet Cards with 3D Pop-out Vehicle Overlap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 md:gap-x-7 lg:gap-x-9 items-stretch pt-4 sm:pt-6 mb-12 sm:mb-14">
          
          {/* Card 1: Private Mountain Tour Car */}
          <div className="group relative rounded-[28px] bg-gradient-to-b from-[#13251A] to-[#0F1E15] border border-[#25402E] px-6 sm:px-8 pb-7 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-[#C58E47]/60 hover:-translate-y-1">
            
            {/* Pop-out Vehicle Stage */}
            <div className="relative -mt-14 sm:-mt-20 md:-mt-24 h-52 sm:h-60 lg:h-64 flex flex-col items-center justify-end mb-4 pointer-events-none">
              {/* Zero-lag Radial Backlight Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 bg-[radial-gradient(ellipse_at_center,rgba(197,142,71,0.18)_0%,transparent_70%)] -z-10" />
              
              <div className="relative w-full h-full flex items-end justify-center">
                <Image
                  src="/photos/fleet/car-cutout.png"
                  alt="Private mountain tour car for Horton Plains sunrise excursions"
                  width={644}
                  height={534}
                  priority
                  className="max-h-[92%] w-auto object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.85)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-104 z-10"
                />
              </div>

              {/* Realistic Grounding Contact Shadow */}
              <div className="w-48 sm:w-56 h-3 bg-black/80 rounded-full blur-md -mt-2" />
            </div>

            {/* Card Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Badge */}
                <div className="mb-3">
                  <span className="inline-block text-[11px] sm:text-xs font-semibold text-[#E1AB60] bg-[#C58E47]/15 border border-[#C58E47]/30 px-3 py-1 rounded-full">
                    1 dedicated on-site car
                  </span>
                </div>

                {/* Title & Meta Row */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2.5">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white tracking-normal group-hover:text-[#DFB775] transition-colors">
                    Private mountain tour car
                  </h3>
                  <span className="text-xs font-medium text-[#D4A362] shrink-0">
                    Seats 4 to 5 guests
                  </span>
                </div>

                {/* Description - Crystal Clear Contrast & Calm Luxury Flow */}
                <p className="text-sm sm:text-[15px] text-[#E0E7E2] leading-[1.75] mb-6 font-normal">
                  Made for early-morning family and group trips, so you reach World&apos;s End and
                  Baker&apos;s Falls before the clouds roll in.
                </p>

                {/* Spec Lines */}
                <div className="space-y-1.5 text-xs sm:text-sm text-stone-200 font-medium mb-7">
                  <p>5:30 AM sunrise departure</p>
                  <p>11 km to the park gate (about 25 min)</p>
                </div>
              </div>

              {/* Action Button Row */}
              <div className="flex justify-end pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#C58E47] hover:bg-[#D69F56] text-[#0D1912] font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 duration-200"
                >
                  <Car className="w-3.5 h-3.5 opacity-80" />
                  <span>Inquire About Car</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: 2 Highland Scooters */}
          <div className="group relative rounded-[28px] bg-gradient-to-b from-[#13251A] to-[#0F1E15] border border-[#25402E] px-6 sm:px-8 pb-7 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-[#C58E47]/60 hover:-translate-y-1">
            
            {/* Pop-out Vehicle Stage */}
            <div className="relative -mt-14 sm:-mt-20 md:-mt-24 h-52 sm:h-60 lg:h-64 flex flex-col items-center justify-end mb-4 pointer-events-none">
              {/* Zero-lag Radial Backlight Glow behind Scooters */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 bg-[radial-gradient(ellipse_at_center,rgba(197,142,71,0.18)_0%,transparent_70%)] -z-10" />
              
              <div className="relative w-full h-full flex items-end justify-center">
                <Image
                  src="/photos/fleet/scooter-cutout.png"
                  alt="2 highland mountain scooters for misty pine trail exploration"
                  width={848}
                  height={708}
                  priority
                  className="max-h-[95%] w-auto object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.85)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:scale-104 z-10"
                />
              </div>

              {/* Realistic Grounding Contact Shadow */}
              <div className="w-60 sm:w-72 h-3.5 bg-black/80 rounded-full blur-md -mt-2" />
            </div>

            {/* Card Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Badge */}
                <div className="mb-3">
                  <span className="inline-block text-[11px] sm:text-xs font-semibold text-[#E1AB60] bg-[#C58E47]/15 border border-[#C58E47]/30 px-3 py-1 rounded-full">
                    2 on-site mountain scooters
                  </span>
                </div>

                {/* Title & Meta Row */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2.5">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white tracking-normal group-hover:text-[#DFB775] transition-colors">
                    2 highland scooters
                  </h3>
                  <span className="text-xs font-medium text-[#D4A362] shrink-0">
                    2 bikes ready
                  </span>
                </div>

                {/* Description - Crystal Clear Contrast & Calm Luxury Flow */}
                <p className="text-sm sm:text-[15px] text-[#E0E7E2] leading-[1.75] mb-6 font-normal">
                  Perfect for couples, photographers and solo travellers who want to stop at
                  misty pine curves, tea trails and viewpoints.
                </p>

                {/* Spec Lines */}
                <div className="space-y-1.5 text-xs sm:text-sm text-stone-200 font-medium mb-7">
                  <p>Ride at your own pace</p>
                  <p>Helmets included, fuel support on request</p>
                </div>
              </div>

              {/* Action Button Row */}
              <div className="flex justify-end pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#C58E47] hover:bg-[#D69F56] text-[#0D1912] font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 duration-200"
                >
                  <Compass className="w-3.5 h-3.5 opacity-80" />
                  <span>Inquire About Scooters</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Route & Mountain Timing Context Bar */}
        <div className="scroll-reveal delay-250 bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#A5B0A8]">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-center md:text-left">
            <span className="flex items-center gap-1.5 font-semibold text-white bg-[#C58E47]/20 border border-[#C58E47]/30 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-[#D4A362]" />
              Ohiya Railway Station (200m)
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4A362] hidden sm:inline" />
            <span className="font-medium text-white/95 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              Dawn Breezy Bungalow
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4A362] hidden sm:inline" />
            <span className="font-semibold text-white bg-[#C58E47] px-3 py-1 rounded-full shadow-sm text-[#0D1912]">
              Horton Plains Gate (11km)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-white bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#D4A362]" />
              <span>~25 Min Scenic Drive</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-stone-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A362]" />
              <span>Direct with Susantha • Zero Markup</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
