"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone, Train, ArrowRight, Sparkles, UtensilsCrossed, ShieldCheck, Calendar } from "lucide-react";

const NAV_LINKS = [
  { label: "Rooms & Rates", href: "#rooms" },
  { label: "Gallery", href: "#gallery" },
  { label: "Horton Plains Transport", href: "#transport" },
  { label: "Facilities", href: "#facilities" },
  { label: "Nearby Attractions", href: "#nearby" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

/*
 * Phone numbers.
 * NOTE: "070 605 670" has only 9 digits. Sri Lankan numbers have 10 digits
 * (e.g. 070 605 670X). Fix the number below, then set `verified: true`
 * and it will appear on the site automatically.
 */
const PHONES = [
  {
    label: "WhatsApp & calls (fastest)",
    display: "+94 71 419 4368",
    href: "https://wa.me/94714194368",
    external: true,
    verified: true,
  },
  {
    label: "Mobile",
    display: "+94 75 117 2079",
    href: "tel:+94751172079",
    external: false,
    verified: true,
  },
  {
    label: "Landline",
    display: "070 605 670",
    href: "tel:070605670",
    external: false,
    verified: false, // <-- set to true after adding the missing digit
  },
].filter((p) => p.verified);

export default function ContactAndFooter() {
  return (
    <footer
      id="contact"
      className="bg-[#0E1712] text-[#F2ECE1] selection:bg-[#C59B5F] selection:text-[#0E1712]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* ───────── Heading ───────── */}
        <div className="pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-14 max-w-2xl">
          <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-[1.1] text-[#F2ECE1]">
            Book directly with us
          </h2>
          <p className="mt-5 text-[15px] sm:text-base text-[#96A49B] leading-relaxed">
            Send an enquiry or call us for room availability, train pick-ups and
            Horton Plains trips. Direct bookings have no platform fees, and you
            pay at the property.
          </p>
        </div>

        {/* ───────── Contact details + Boutique Highland Sanctuary Card ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-14 sm:pb-20">
          {/* Left: contact details */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <h3 className="font-serif text-2xl text-[#F2ECE1] mb-6">
              Contact details
            </h3>

            <ul className="divide-y divide-[#233229] border-y border-[#233229]">
              {PHONES.map((p) => (
                <li key={p.display}>
                  <a
                    href={p.href}
                    {...(p.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                    className="flex items-center gap-4 py-4 group"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17271D] text-[#C59B5F] group-hover:bg-[#C59B5F] group-hover:text-[#0E1712] transition-colors">
                      {p.external ? (
                        <MessageCircle className="h-[18px] w-[18px]" />
                      ) : (
                        <Phone className="h-[18px] w-[18px]" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-[#96A49B]">
                        {p.label}
                      </span>
                      <span className="block text-lg sm:text-xl text-[#F2ECE1] group-hover:text-[#C59B5F] transition-colors">
                        {p.display}
                      </span>
                    </span>
                  </a>
                </li>
              ))}

              <li className="flex items-start gap-4 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17271D] text-[#C59B5F]">
                  <MapPin className="h-[18px] w-[18px]" />
                </span>
                <address className="not-italic min-w-0">
                  <span className="block text-sm text-[#96A49B]">Address</span>
                  <span className="block text-[15px] sm:text-base text-[#F2ECE1] leading-snug">
                    Welimada Road, 90168 Ohiya,
                    <br />
                    Central Highlands, Sri Lanka
                  </span>
                </address>
              </li>

              <li className="flex items-start gap-4 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17271D] text-[#C59B5F]">
                  <Clock className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <span className="block text-sm text-[#96A49B]">Check in</span>
                  <span className="block text-[15px] sm:text-base text-[#F2ECE1]">
                    Round the clock access, including late train arrivals
                  </span>
                </div>
              </li>
            </ul>

            <p className="mt-6 text-sm text-[#96A49B]">
              Your host:{" "}
              <span className="text-[#F2ECE1]">Susantha Jayasiri</span>
            </p>
          </div>

          {/* Right: Boutique Highland Villa Showcase Card */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-gradient-to-br from-[#14231A] to-[#0D1812] rounded-3xl p-6 sm:p-8 lg:p-9 border border-[#233F2C] shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
              {/* Ambient Glows */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#C58E47]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#233F2C]/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Visual Imagery Preview */}
                <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#264230] mb-6 group">
                  <Image
                    src="/photos/outside-cool-view.jpeg"
                    alt="Panoramic view from Dawn Breezy Bungalow in Ohiya"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1712] via-[#0E1712]/40 to-transparent" />
                  
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-[#C58E47]/40 text-[11px] font-semibold text-[#DFB775]">
                    <Sparkles className="w-3 h-3 text-[#C58E47]" />
                    <span>1,774m Highland Altitude</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#F2ECE1]">
                    <div className="font-serif italic text-sm text-[#F2ECE1]/90 drop-shadow-sm">
                      Misty pine valley mornings
                    </div>
                    <span className="text-[11px] text-[#A6B5AB] px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs">
                      Ohiya, Sri Lanka
                    </span>
                  </div>
                </div>

                {/* Eyebrow & Title */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C58E47]/15 border border-[#C58E47]/30 text-xs font-semibold uppercase tracking-wider text-[#DFB775] mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#C58E47]" />
                  <span>Highland Boutique Sanctuary</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#F2ECE1] mb-3 leading-snug">
                  Wake up above the clouds in quiet Ohiya
                </h3>

                <p className="text-sm sm:text-[15px] text-[#A6B5AB] leading-relaxed mb-6">
                  Perched peacefully along Welimada Road, our family bungalow welcomes trekkers, couples, and traveling families. Reserve directly with host Susantha for personal highland care, flexible arrival times, and zero hidden platform charges.
                </p>

                {/* 4 Feature Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0E1712]/75 border border-[#233F2C]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17271D] text-[#C59B5F]">
                      <Train className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#F2ECE1]">200m from Station</div>
                      <div className="text-[11px] text-[#839388]">3 minute stroll, free luggage pickup</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0E1712]/75 border border-[#233F2C]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17271D] text-[#C59B5F]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#F2ECE1]">5:30 AM Horton Plains</div>
                      <div className="text-[11px] text-[#839388]">On site safari car to World&apos;s End</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0E1712]/75 border border-[#233F2C]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17271D] text-[#C59B5F]">
                      <UtensilsCrossed className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#F2ECE1]">Warm Ceylon Meals</div>
                      <div className="text-[11px] text-[#839388]">Fresh home cooked dishes on request</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0E1712]/75 border border-[#233F2C]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17271D] text-[#C59B5F]">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#F2ECE1]">Zero Prepayment</div>
                      <div className="text-[11px] text-[#839388]">Pay upon arrival at the bungalow</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Booking & Calling CTA Block */}
              <div className="relative z-10 pt-5 border-t border-[#233F2C] flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/booking"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#C58E47] hover:bg-[#D4A362] text-[#0D1912] font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-102 active:scale-98"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Check Live Dates &amp; Reserve Online</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href="tel:+94714194368"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-transparent hover:bg-white/5 text-[#F2ECE1] font-semibold text-xs sm:text-sm transition-all border border-[#2F4337]"
                >
                  <Phone className="w-4 h-4 text-[#C58E47]" />
                  <span>Call Susantha</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ───────── Getting here ───────── */}
        <div className="border-t border-[#233229] py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F2ECE1] mb-4">
              Getting here
            </h3>
            <p className="text-[15px] text-[#96A49B] leading-relaxed mb-8">
              We are 200 m uphill from Ohiya Railway Station, about a 3-minute
              walk at 1,774 m above sea level.
            </p>

            <div className="flex items-start gap-4 mb-8">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#17271D] text-[#C59B5F]">
                <Train className="h-[18px] w-[18px]" />
              </span>
              <p className="text-[15px] text-[#96A49B] leading-relaxed">
                Travelling on the Colombo to Kandy to Badulla line? Message us your
                arrival time and we will meet you at the station. Luggage help
                is free on request.
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Ohiya+Railway+Station+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[#2F4337] px-5 py-3 text-sm text-[#F2ECE1] hover:border-[#C59B5F] hover:text-[#C59B5F] transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Get directions
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="relative w-full overflow-hidden rounded-md border border-[#233229] aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[320px]">
              <iframe
                title="Map showing Dawn Breezy Bungalow near Ohiya Railway Station"
                src="https://www.google.com/maps?q=Ohiya+Railway+Station+Sri+Lanka&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[30%] contrast-[0.95]"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* ───────── Brand + navigation ───────── */}
        <div className="border-t border-[#233229] py-10 sm:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#C59B5F]/40 bg-[#17271D]">
              <Image
                src="/logo.jpeg"
                alt="Dawn Breezy Bungalow logo"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-serif text-xl tracking-tight text-[#F2ECE1]">
                Dawn Breezy Bungalow
              </p>
              <p className="text-sm text-[#849489] mt-0.5">
                Ohiya, Central Highlands, Sri Lanka
              </p>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-7 gap-y-3 text-sm text-[#96A49B]"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-1 hover:text-[#F2ECE1] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* ───────── Legal ───────── */}
        <div className="border-t border-[#233229] py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6B7A70]">
          <p>© 2026 Dawn Breezy Bungalow, Ohiya. All rights reserved.</p>
          <p>Also listed on Booking.com as Ohiya View Resort.</p>
        </div>
      </div>
    </footer>
  );
}