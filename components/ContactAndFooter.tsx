"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { Clock, MapPin, MessageCircle, Phone, Train } from "lucide-react";

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

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3.5 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:border-[#0E1712] focus:outline-none focus:ring-1 focus:ring-[#0E1712] transition-colors";

const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";

export default function ContactAndFooter() {
  const [form, setForm] = useState({
    name: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
  });

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const lines = [
      "Hello Susantha, I would like to enquire about a stay at Dawn Breezy Bungalow, Ohiya.",
      "",
      `Name: ${form.name}`,
      form.checkIn && `Check-in: ${form.checkIn}`,
      form.checkOut && `Check-out: ${form.checkOut}`,
      `Guests: ${form.guests}`,
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

        {/* ───────── Contact details + enquiry form ───────── */}
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
                  <span className="block text-sm text-[#96A49B]">Check-in</span>
                  <span className="block text-[15px] sm:text-base text-[#F2ECE1]">
                    24-hour access, including late train arrivals
                  </span>
                </div>
              </li>
            </ul>

            <p className="mt-6 text-sm text-[#96A49B]">
              Your host:{" "}
              <span className="text-[#F2ECE1]">Susantha Jayasiri</span>
            </p>
          </div>

          {/* Right: enquiry form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white text-neutral-900 p-6 sm:p-8 lg:p-10"
            >
              <h3 className="font-serif text-2xl sm:text-3xl text-[#0E1712] mb-6">
                Send an enquiry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className={labelClass}>
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={update("name")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="checkIn" className={labelClass}>
                    Check-in
                  </label>
                  <input
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    value={form.checkIn}
                    onChange={update("checkIn")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="checkOut" className={labelClass}>
                    Check-out
                  </label>
                  <input
                    id="checkOut"
                    name="checkOut"
                    type="date"
                    min={form.checkIn || undefined}
                    value={form.checkOut}
                    onChange={update("checkOut")}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="guests" className={labelClass}>
                    Guests
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={form.guests}
                    onChange={update("guests")}
                    className={inputClass}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                    <option value="9+">9 or more</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#0E1712] px-7 py-3.5 text-[15px] font-medium text-white hover:bg-[#1B2B21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E1712] transition-colors"
              >
                <MessageCircle className="h-[18px] w-[18px]" />
                Send on WhatsApp
              </button>
            </form>
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
                Travelling on the Colombo–Kandy–Badulla line? Message us your
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