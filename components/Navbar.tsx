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
          ? "bg-[#0D1912]/95 backdrop-blur-md border-b border-[#C58E47]/20 shadow-[0_8px_30px_rgba(0,0,0,0.22)] text-white"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Brand & Prominent Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden"
        >
          {/* Clear, High-Visibility Circular Logo Badge (cropped to fill seal cleanly) */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#DFB775] shadow-lg flex-shrink-0 bg-white ring-2 ring-[#DFB775]/20">
            <Image
              src="/logo.jpeg"
              alt="Dawn Breezy Bungalow Logo"
              fill
              sizes="96px"
              quality={95}
              className="object-cover scale-[1.24] group-hover:scale-[1.3] transition-transform duration-300"
              priority
            />
          </div>
          {/* Clean, Bold Brand Typography - Stacked Two-Line Luxury Wordmark */}
          <div className="flex flex-col justify-center">
            <span className="font-brand text-[13px] sm:text-[15px] tracking-[0.18em] uppercase font-extrabold text-white group-hover:text-[#DFB775] transition-colors leading-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.75)]">
              Dawn Breezy
            </span>
            <span className="font-brand text-[11px] sm:text-[12.5px] tracking-[0.28em] uppercase font-extrabold text-[#E8BE74] group-hover:text-[#F3CE8A] transition-colors leading-tight mt-0.5 [text-shadow:0_2px_8px_rgba(0,0,0,0.75)]">
              Bungalow
            </span>
          </div>
        </Link>

        {/* Center Nav Links - Clean & Sharp (Visible on Tablet & Desktop) */}
        <nav
          className="hidden md:flex items-center gap-5 lg:gap-7"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative py-1 text-xs lg:text-[13px] font-medium tracking-wide text-white/85 hover:text-[#DFB775] transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-[#C58E47] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA (Tablet & Desktop) - Clean Solid Button */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C58E47] to-[#B37C35] hover:from-[#D4A362] hover:to-[#C58E47] text-white text-xs font-semibold tracking-wide transition-all duration-200 shadow-md shadow-[#C58E47]/20 border border-[#DFB775]/40 hover:scale-103 active:scale-97"
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
