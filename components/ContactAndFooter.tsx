"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Clock, MapPin, MessageCircle, Phone, Train, ArrowRight, Sparkles } from "lucide-react";

const WHATSAPP_NUMBER = "94714194368";

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
  const [form, setForm] = useState({
    name: "",
    checkIn: "",
    checkOut: "",
    guests: "1 Guest",
  });

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = [
      "Hello Susantha, I would like to enquire about staying at Dawn Breezy Bungalow, Ohiya.",
      "",
      `Name: ${form.name}`,
      `Guests: ${form.guests}`,
      form.checkIn ? `Check in: ${form.checkIn}` : "",
      form.checkOut ? `Check out: ${form.checkOut}` : "",
      "",
      "Could you please confirm availability and direct booking details?",
    ].filter(Boolean);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

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

          {/* Right: Direct Concierge Enquiry Card */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-[#14231A] rounded-3xl p-6 sm:p-8 border border-[#233F2C] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C58E47]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C58E47]/15 border border-[#C58E47]/30 text-[10px] font-bold uppercase tracking-wider text-[#DFB775] mb-2">
                    <Sparkles className="w-3 h-3 text-[#C58E47]" />
                    <span>DIRECT MOUNTAIN CONCIERGE</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#F2ECE1]">
                    Send an Enquiry to Host Susantha
                  </h3>
                </div>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C58E47] hover:bg-[#D4A362] text-[#0D1912] text-xs font-bold transition-all shadow-md self-start sm:self-auto hover:scale-103 active:scale-97"
                >
                  <span>Book Online</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-[#96A49B] mb-6 leading-relaxed">
                Have questions about train pickup times, 5:30 AM Horton Plains transport, or home-cooked Ceylon meals? Send Susantha a direct message and we will respond promptly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#DFB775] mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Smith"
                      value={form.name}
                      onChange={update("name")}
                      className="w-full rounded-xl border border-[#2F4337] bg-[#0E1712] px-3.5 py-2.5 text-xs sm:text-sm text-[#F2ECE1] placeholder:text-[#617367] focus:border-[#C58E47] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#DFB775] mb-1.5">
                      Number of Guests
                    </label>
                    <select
                      value={form.guests}
                      onChange={update("guests")}
                      className="w-full rounded-xl border border-[#2F4337] bg-[#0E1712] px-3.5 py-2.5 text-xs sm:text-sm text-[#F2ECE1] focus:border-[#C58E47] focus:outline-none transition-colors"
                    >
                      <option value="1 Guest">1 Guest</option>
                      <option value="2 Guests">2 Guests</option>
                      <option value="3 Guests">3 Guests</option>
                      <option value="4 Guests">4 Guests</option>
                      <option value="5+ Family or Group">5+ Family or Group</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#DFB775] mb-1.5">
                      Check in Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={form.checkIn}
                      onChange={update("checkIn")}
                      className="w-full rounded-xl border border-[#2F4337] bg-[#0E1712] px-3.5 py-2.5 text-xs sm:text-sm text-[#F2ECE1] focus:border-[#C58E47] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#DFB775] mb-1.5">
                      Check out Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={form.checkOut}
                      onChange={update("checkOut")}
                      className="w-full rounded-xl border border-[#2F4337] bg-[#0E1712] px-3.5 py-2.5 text-xs sm:text-sm text-[#F2ECE1] focus:border-[#C58E47] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-3 px-5 rounded-full bg-[#C58E47] hover:bg-[#D4A362] text-[#0D1912] font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-102 active:scale-98 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Send Message on WhatsApp</span>
                  </button>

                  <Link
                    href="/booking"
                    className="w-full sm:w-auto py-3 px-5 rounded-full bg-[#1F3327] hover:bg-[#284132] text-white font-semibold text-xs sm:text-sm transition-all border border-[#2E4A38] text-center hover:scale-102 active:scale-98"
                  >
                    Check Calendar Availability
                  </Link>
                </div>
              </form>
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