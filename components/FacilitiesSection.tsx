"use client";

import Image from "next/image";
import {
  Bath,
  UtensilsCrossed,
  Trees,
  ShieldCheck,
  Wifi,
  Car,
  Coffee,
  HeartHandshake,
  Sparkles,
  Check,
  Clock,
  MessageCircle
} from "lucide-react";

export default function FacilitiesSection() {
  const quickBadges = [
    { icon: UtensilsCrossed, label: "Fresh Breakfast & Lunch" },
    { icon: Wifi, label: "Free High-Speed WiFi" },
    { icon: Bath, label: "Highland Hot Water" },
    { icon: Car, label: "Free On-Site Parking" },
    { icon: Coffee, label: "Complimentary Ceylon Tea" },
    { icon: HeartHandshake, label: "Station Porterage & Support" },
  ];

  return (
    <section id="facilities" className="py-10 sm:py-16 lg:py-20 bg-[#F8F9F7] border-t border-[#E2E6E3]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="scroll-reveal text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C58E47]/15 border border-[#C58E47]/30 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#243D2C] mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C58E47]" />
            <span>Designed for Serene Mountain Living</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#243D2C] tracking-tight mb-2.5 leading-tight">
            Facilities &amp; Amenities
          </h2>

          <p className="text-sm sm:text-base text-[#3E5244] leading-relaxed font-normal">
            Thoughtfully curated alpine essentials blending modern comfort with authentic hill country warmth.
          </p>
        </div>

        {/* 1. TOP FEATURED CARD: Fresh Home-Cooked Ceylon Breakfast & Lunch (Placed at the very top as requested) */}
        <div className="scroll-reveal mb-8 sm:mb-10 group bg-white rounded-3xl border border-[#E2E6E3] hover:border-[#C58E47] overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Visual Food Showcase Image (7 cols on Desktop) */}
            <div className="scroll-reveal-img lg:col-span-7 relative h-72 sm:h-80 lg:h-[420px] w-full overflow-hidden bg-gray-100">
              <Image
                src="/photos/sri-lankan-food.jpg"
                alt="Delicious Sri Lankan Breakfast and Lunch Feast overlooking Misty Ohiya Tea Hills"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#243D2C]/90 text-white backdrop-blur-md border border-white/20 shadow-md">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#D4A362]" />
                  <span>Culinary Highland Experience</span>
                </span>
                <span className="hidden sm:inline-block px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#C58E47] text-white shadow-xs">
                  Breakfast &amp; Lunch Provided
                </span>
              </div>

              {/* Title & Accent on Image */}
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-widest text-[#D4A362] font-semibold block mb-0.5">
                  Authentic Mountain Dining
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                  Fresh Home-Cooked Ceylon Breakfast &amp; Lunch
                </h3>
              </div>
            </div>

            {/* Content Details (5 cols on Desktop) */}
            <div className="lg:col-span-5 p-5 sm:p-7 lg:p-9 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A97633] bg-[#C58E47]/15 px-3 py-1 rounded-full border border-[#C58E47]/30">
                    Host Prepared • Fresh Daily
                  </span>
                </div>

                <p className="font-serif italic text-xl sm:text-2xl text-[#A97633] font-normal mb-3">
                  Authentic Sri Lankan flavors above the clouds
                </p>

                <p className="text-sm sm:text-[15px] text-[#243529] font-normal leading-[1.75] mb-6">
                  Wake up to the aroma of freshly cooked egg hoppers, coconut sambol, and steaming Ceylon tea served on the misty garden veranda. Delicious, hearty home-cooked rice &amp; curries are prepared fresh for lunch and dinner on request.
                </p>

                {/* Culinary Highlights Checklist */}
                <div className="space-y-3.5 mb-6">
                  <div className="flex items-start gap-3 text-[13.5px] sm:text-[14.5px] text-[#1F2923] leading-relaxed">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>
                      <strong className="text-[#243D2C] font-semibold">Traditional Breakfast:</strong> Hot crispy hoppers, egg hoppers, spicy pol sambol &amp; golden dhal.
                    </span>
                  </div>

                  <div className="flex items-start gap-3 text-[13.5px] sm:text-[14.5px] text-[#1F2923] leading-relaxed">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>
                      <strong className="text-[#243D2C] font-semibold">Village Lunch &amp; Dinner:</strong> Wholesome highland rice &amp; curry with garden vegetables.
                    </span>
                  </div>

                  <div className="flex items-start gap-3 text-[13.5px] sm:text-[14.5px] text-[#1F2923] leading-relaxed">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>
                      <strong className="text-[#243D2C] font-semibold">Fresh Tropical Fruits:</strong> Local papaya, bananas, and unlimited Ceylon tea throughout your stay.
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Inquire / Order Pill */}
              <div className="pt-4 sm:pt-5 border-t border-[#EAE5DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="text-[#3E5244] font-medium flex items-center gap-2 text-center sm:text-left justify-center sm:justify-start">
                  <Clock className="w-4 h-4 text-[#C58E47] flex-shrink-0" />
                  Customized to your hiking schedule
                </span>
                <a
                  href="#contact"
                  className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#243D2C] hover:bg-[#17271D] text-white font-bold text-xs sm:text-sm transition-all shadow-xs hover:scale-102 active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 text-[#C58E47] fill-current" />
                  <span>Ask Susantha for Meals</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Asymmetric Modern Bento Grid (Panoramic Veranda, Hot Water, Kitchen, Grounds) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Card 1: Large Featured Bento (7 Columns) - Mountain Veranda */}
          <div className="scroll-reveal delay-100 lg:col-span-7 group flex flex-col bg-[#FAF9F5] rounded-3xl border border-[#EAE5DC] hover:border-[#DFB775]/70 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="scroll-reveal-img relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden bg-gray-200">
              <Image
                src="/photos/outside-cool-view.jpeg"
                alt="Dawn Breezy Bungalow Panoramic Mountain Veranda"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#243D2C]/90 text-white backdrop-blur-md border border-white/15 shadow-xs">
                  <Trees className="w-3.5 h-3.5 text-[#C58E47]" />
                  <span>1,775m Alpine Panorama</span>
                </span>
              </div>

              {/* Title on Image */}
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-widest text-[#D4A362] font-semibold block mb-0.5">
                  Panoramic Veranda &amp; Outdoors
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  Misty Mountain Veranda &amp; Pine Valley Views
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-8 flex flex-col flex-1 justify-between">
              <div>
                <p className="text-sm sm:text-[15px] text-[#243529] font-normal leading-[1.75] mb-6">
                  Sip steaming hot Ceylon tea on the private outdoor terrace overlooking rolling mist, native pine forests, and cool mountain breezes with zero city noise.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Unobstructed mountain &amp; valley views</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Outdoor wooden terrace seating</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Highland garden for morning walks</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Crisp, clean pine-scented air</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE5DC] flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#4F6154] font-medium">Included in Stay</span>
                <span className="font-semibold text-[#243D2C] bg-[#F8F9F7] px-3 py-1 rounded-full border border-[#EAE5DC]">
                  Complimentary
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Compact Bento (5 Columns) - Modern Hot Water En-Suite */}
          <div className="scroll-reveal delay-200 lg:col-span-5 group flex flex-col bg-[#FAF9F5] rounded-3xl border border-[#EAE5DC] hover:border-[#DFB775]/70 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="scroll-reveal-img relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden bg-gray-200">
              <Image
                src="/photos/highland-hot-water.jpg"
                alt="Dawn Breezy Bungalow En-Suite Hot Water Shower with Steaming Rainhead"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#243D2C]/90 text-white backdrop-blur-md border border-white/15 shadow-xs">
                  <Bath className="w-3.5 h-3.5 text-[#C58E47]" />
                  <span>Private En-Suite</span>
                </span>
              </div>

              {/* Title on Image */}
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-widest text-[#D4A362] font-semibold block mb-0.5">
                  Alpine Warmth
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  Hot Water &amp; En-Suite Comfort
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-8 flex flex-col flex-1 justify-between">
              <div>
                <p className="text-sm sm:text-[15px] text-[#243529] font-normal leading-[1.75] mb-6">
                  Steaming hot showers after misty highland hikes, complete with private attached bathrooms, plush bath towels, and essential toiletries.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Reliable highland hot water shower</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Attached bathroom in all 3 bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Fresh plush towels &amp; toiletries</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Bidet &amp; modern sanitaryware</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE5DC] flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#4F6154] font-medium">Included in Stay</span>
                <span className="font-semibold text-[#243D2C] bg-[#F8F9F7] px-3 py-1 rounded-full border border-[#EAE5DC]">
                  Complimentary
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Compact Bento (5 Columns) - Kitchen & Home Dining */}
          <div className="scroll-reveal delay-150 lg:col-span-5 group flex flex-col bg-[#FAF9F5] rounded-3xl border border-[#EAE5DC] hover:border-[#DFB775]/70 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="scroll-reveal-img relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden bg-gray-200">
              <Image
                src="/photos/inside-view.jpeg"
                alt="Dawn Breezy Bungalow Dining Area and Kitchen"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#243D2C]/90 text-white backdrop-blur-md border border-white/15 shadow-xs">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#C58E47]" />
                  <span>Self-Catering &amp; Dining</span>
                </span>
              </div>

              {/* Title on Image */}
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-widest text-[#D4A362] font-semibold block mb-0.5">
                  Culinary Freedom
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  Kitchen &amp; Home Dining
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-8 flex flex-col flex-1 justify-between">
              <div>
                <p className="text-sm sm:text-[15px] text-[#243529] font-normal leading-[1.75] mb-6">
                  Cook your favorite meals in our fully equipped kitchen, gather around the family dining table, or order warm authentic Sri Lankan curries.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Fully equipped kitchen &amp; cookware</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Dining table &amp; cozy living space</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Electric kettle &amp; complimentary Ceylon tea</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Warm home-cooked meals on request</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE5DC] flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#4F6154] font-medium">Included in Stay</span>
                <span className="font-semibold text-[#243D2C] bg-[#F8F9F7] px-3 py-1 rounded-full border border-[#EAE5DC]">
                  Complimentary
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Large Featured Bento (7 Columns) - Hospitality & Grounds */}
          <div className="scroll-reveal delay-250 lg:col-span-7 group flex flex-col bg-[#FAF9F5] rounded-3xl border border-[#EAE5DC] hover:border-[#DFB775]/70 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="scroll-reveal-img relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden bg-gray-200">
              <Image
                src="/photos/outside-view-3.jpeg"
                alt="Dawn Breezy Bungalow Private Grounds and Secure Parking"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#243D2C]/90 text-white backdrop-blur-md border border-white/15 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C58E47]" />
                  <span>Hassle-Free Hospitality</span>
                </span>
              </div>

              {/* Title on Image */}
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-xs uppercase tracking-widest text-[#D4A362] font-semibold block mb-0.5">
                  Guest Convenience &amp; Safety
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  Secure Parking &amp; Station Support
                </h3>
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-8 flex flex-col flex-1 justify-between">
              <div>
                <p className="text-sm sm:text-[15px] text-[#243529] font-normal leading-[1.75] mb-6">
                  Enjoy free private on-site parking on secluded grounds, high-speed WiFi, and personal luggage assistance from Ohiya Railway Station just 200 meters away.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Free secure private parking on-site</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">200m Ohiya Station luggage escort</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">High-speed WiFi covering all areas</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13.5px] sm:text-sm text-[#1F2923]">
                    <div className="w-4 h-4 rounded-full bg-[#243D2C]/10 text-[#243D2C] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-medium text-[#243529]">Peace of mind amidst quiet pine forests</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE5DC] flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#4F6154] font-medium">Included in Stay</span>
                <span className="font-semibold text-[#243D2C] bg-[#F8F9F7] px-3 py-1 rounded-full border border-[#EAE5DC]">
                  Complimentary
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quick Highland Comforts Strip */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E6E3] shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-[#E2E6E3]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#243D2C] text-[#C58E47]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#243D2C]">
                  All-Inclusive Highland Comforts
                </h4>
              </div>
            </div>

            <span className="text-xs font-bold text-[#C58E47] bg-[#C58E47]/10 px-3 py-1 rounded-full border border-[#C58E47]/30 flex-shrink-0">
              100% Free for Guests
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickBadges.map((badge, idx) => {
              const BIcon = badge.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-2xl bg-[#F8F9F7] border border-[#E2E6E3] hover:border-[#C58E47] transition-colors"
                >
                  <BIcon className="w-4 h-4 text-[#C58E47] flex-shrink-0" />
                  <span className="text-xs font-semibold text-[#1F2923] leading-snug">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
