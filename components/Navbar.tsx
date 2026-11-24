"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Rooms", href: "/#rooms" },
    { name: "Booking", href: "/booking" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Transport", href: "/#transport" },
    { name: "Facilities", href: "/#facilities" },
    { name: "Nearby", href: "/#nearby" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact", href: "/#contact" },
  ];

  // Solid clean luxury pine always on subpages or when scrolled; transparent gradient on unscrolled homepage
  const isSolid = scrolled || !isHomePage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isSolid
          ? "bg-[#0D1912] border-b border-[#233F2C]/80 shadow-md text-white"
          : "bg-gradient-to-b from-black/85 via-black/45 to-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Brand & Prominent Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden"
        >
          {/* Clear, High-Visibility Circular Logo Badge */}
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#C58E47]/80 shadow-md flex-shrink-0 bg-white ring-1 ring-black/20">
            <Image
              src="/logo.jpeg"
              alt="Dawn Breezy Bungalow Logo"
              fill
              sizes="44px"
              className="object-cover group-hover:scale-108 transition-transform duration-300"
              priority
            />
          </div>
          {/* Clean, Refined Brand Typography - Stacked Two-Line Luxury Wordmark */}
          <div className="flex flex-col justify-center">
            <span className="font-brand text-xs sm:text-[13px] tracking-[0.22em] uppercase font-bold text-white group-hover:text-[#D4A362] transition-colors leading-tight">
              Dawn Breezy
            </span>
            <span className="font-brand text-[10.5px] sm:text-[11.5px] tracking-[0.32em] uppercase font-bold text-[#C58E47] group-hover:text-[#DFB775] transition-colors leading-tight mt-0.5">
              Bungalow
            </span>
          </div>
        </Link>

        {/* Center Nav Links - Clean & Sharp (Visible on Tablet & Desktop) */}
        <nav
          className="hidden md:flex items-center gap-4 lg:gap-7"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs lg:text-[13px] font-medium tracking-wide text-white/90 hover:text-[#D4A362] transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA (Tablet & Desktop) - Clean Solid Button */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#C58E47] hover:bg-[#A97633] text-white text-xs font-semibold transition-all duration-200 shadow-md hover:scale-103 active:scale-97"
          >
            <span>Book Your Stay</span>
          </Link>
        </div>

        {/* Mobile Actions Button (< 768px) */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="tel:+94714194368"
            aria-label="Call Host Susantha"
            className="p-2 rounded-full bg-white/10 text-white/95 hover:text-[#D4A362] transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-white/10 text-white hover:text-[#D4A362] transition-colors focus:outline-hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Solid Clean Luxury Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden w-full bg-[#0D1912] border-b border-[#233F2C] px-4 py-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 text-white">
          <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-white/90 hover:text-[#D4A362] py-2 px-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/15 space-y-2.5">
              <Link
                href="/#rooms"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/25 transition-colors shadow-xs"
              >
                <span>View Rooms &amp; Rates</span>
              </Link>
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#C58E47] text-white text-xs font-semibold hover:bg-[#A97633] transition-colors shadow-xs"
              >
                <span>Book Direct Online</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
