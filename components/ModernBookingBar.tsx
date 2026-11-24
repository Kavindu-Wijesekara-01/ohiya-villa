"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Users,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from "lucide-react";

interface RoomOption {
  id: "double" | "triple" | "full";
  name: string;
  pricePerNight: number | null;
  priceLabel: string;
  capacity: string;
}

const ROOM_OPTIONS: RoomOption[] = [
  {
    id: "double",
    name: "Double Room",
    pricePerNight: 20,
    priceLabel: "$20",
    capacity: "Up to 2 Adults",
  },
  {
    id: "triple",
    name: "Triple Room",
    pricePerNight: 23,
    priceLabel: "$23",
    capacity: "Up to 3 Guests",
  },
  {
    id: "full",
    name: "Full Villa",
    pricePerNight: null,
    priceLabel: "Group Rate",
    capacity: "Up to 10 Guests",
  },
];

export default function ModernBookingBar() {
  const [selectedRoom, setSelectedRoom] = useState<RoomOption>(ROOM_OPTIONS[0]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(2);

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [displayMonth, setDisplayMonth] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    const dIn = new Date(today);
    dIn.setDate(today.getDate() + 1);
    const dOut = new Date(today);
    dOut.setDate(today.getDate() + 3);

    setCheckInDate(dIn);
    setCheckOutDate(dOut);
    setDisplayMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setIsClient(true);
  }, []);

  // Fade-up scroll trigger: reveals smoothly when scrolling slightly down from hero
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setHasScrolled(true);
      return;
    }

    const handleScroll = () => {
      // Fade up smoothly when user scrolls a bit down from hero (scrollY > 50px)
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  // Calculate nights
  const nights =
    checkInDate && checkOutDate
      ? Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 2;

  // Format date helper
  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const nextMonth = () => {
    if (!displayMonth) return;
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    if (!displayMonth) return;
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const year = displayMonth ? displayMonth.getFullYear() : 2026;
  const month = displayMonth ? displayMonth.getMonth() : 0;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);

    if (!checkInDate || (checkInDate && checkOutDate) || clickedDate < checkInDate) {
      setCheckInDate(clickedDate);
      setCheckOutDate(null);
    } else {
      if (clickedDate.getTime() === checkInDate.getTime()) {
        const nextDay = new Date(clickedDate);
        nextDay.setDate(clickedDate.getDate() + 1);
        setCheckOutDate(nextDay);
      } else {
        setCheckOutDate(clickedDate);
      }
      setIsCalendarOpen(false);
    }
  };

  // Build WhatsApp reservation link
  const buildWhatsAppUrl = () => {
    const checkInStr = checkInDate ? checkInDate.toLocaleDateString("en-GB") : "Flexible";
    const checkOutStr = checkOutDate ? checkOutDate.toLocaleDateString("en-GB") : "Flexible";
    const totalEst =
      selectedRoom.pricePerNight !== null
        ? `Estimated Total: $${selectedRoom.pricePerNight * nights}`
        : "Inquiring about group rates";

    const message = encodeURIComponent(
      `Hello Susantha,\nI would like to check availability at Dawn Breezy Bungalow, Ohiya:\n` +
        `• Accommodation: ${selectedRoom.name}\n` +
        `• Check-in: ${checkInStr}\n` +
        `• Check-out: ${checkOutStr} (${nights} night${nights > 1 ? "s" : ""})\n` +
        `• Guests: ${guestCount}\n` +
        `• ${totalEst}\n\n` +
        `Please confirm availability and local booking rates.`
    );
    return `https://wa.me/94714194368?text=${message}`;
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto -mt-10 sm:-mt-12 lg:-mt-14 mb-8 sm:mb-12 relative z-30 px-3 sm:px-6 transition-all duration-700 ease-out ${
        hasScrolled
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {/* Floating Luxury Booking Capsule - Relais & Châteaux Glassmorphism */}
      <div className="bg-[#FAF9F6]/95 backdrop-blur-2xl rounded-2xl lg:rounded-full p-2.5 sm:p-3 lg:p-2.5 shadow-2xl shadow-black/25 border border-[#DFB775]/45 hover:border-[#DFB775] transition-all">
        {/* Desktop View: Sleek Horizontal Single-Row Bar */}
        <div className="hidden lg:grid grid-cols-12 gap-2.5 items-center">
          {/* Room Selector */}
          <div className="col-span-4 flex items-center p-1 bg-[#F2EFE9] rounded-full border border-[#E5DFD5]">
            {ROOM_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRoom(opt)}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all duration-200 text-center ${
                  selectedRoom.id === opt.id
                    ? "bg-[#243D2C] text-white shadow-xs"
                    : "text-[#7B887E] hover:text-[#1F2923]"
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>

          {/* Dates Trigger with Popover */}
          <div className="col-span-3 relative" ref={calendarRef}>
            <button
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#F8F9F7] hover:bg-[#F0F2EE] border border-[#E2E6E3]/80 text-left transition-colors"
            >
              <CalendarIcon className="w-4 h-4 text-[#C58E47] flex-shrink-0" />
              <span className="text-xs font-semibold text-[#1F2923] truncate flex-1">
                {isClient ? `${formatDate(checkInDate)} – ${formatDate(checkOutDate)}` : "Select Dates"}
              </span>
              <span className="text-[10px] font-bold text-[#C58E47] bg-[#C58E47]/15 px-1.5 py-0.5 rounded-md">
                {nights}N
              </span>
            </button>

            {/* Custom Modern Calendar Popover */}
            {isCalendarOpen && displayMonth && (
              <div className="absolute top-full left-0 mt-2 p-3.5 bg-white rounded-2xl shadow-2xl border border-[#E2E6E3] z-50 w-72 animate-calendar-pop">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-[#243D2C]">
                    {displayMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="p-1 rounded-md hover:bg-[#F8F9F7] text-[#1F2923]"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="p-1 rounded-md hover:bg-[#F8F9F7] text-[#1F2923]"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#7B887E] mb-1.5 uppercase">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-7" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateObj = new Date(year, month, dayNum);
                    dateObj.setHours(0, 0, 0, 0);

                    const isCheckIn = checkInDate && dateObj.getTime() === checkInDate.getTime();
                    const isCheckOut = checkOutDate && dateObj.getTime() === checkOutDate.getTime();
                    const isInRange =
                      checkInDate && checkOutDate && dateObj > checkInDate && dateObj < checkOutDate;

                    const todayStart = new Date();
                    todayStart.setHours(0, 0, 0, 0);
                    const isPast = dateObj < todayStart;

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleDayClick(dayNum)}
                        className={`h-7 rounded-md text-xs font-semibold flex items-center justify-center transition-all ${
                          isPast
                            ? "text-gray-300 cursor-not-allowed"
                            : isCheckIn || isCheckOut
                            ? "bg-[#243D2C] text-white shadow-xs"
                            : isInRange
                            ? "bg-[#C58E47]/20 text-[#243D2C] rounded-none"
                            : "hover:bg-[#F8F9F7] text-[#1F2923]"
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Guests Stepper */}
          <div className="col-span-2 flex items-center justify-between px-3 py-1.5 rounded-full bg-[#F8F9F7] border border-[#E2E6E3]/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2923]">
              <Users className="w-3.5 h-3.5 text-[#C58E47]" />
              <span>{guestCount} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                className="w-5 h-5 rounded-full bg-white border border-[#E2E6E3] flex items-center justify-center text-xs font-bold text-[#1F2923] hover:bg-gray-100"
                aria-label="Decrease guests"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                className="w-5 h-5 rounded-full bg-white border border-[#E2E6E3] flex items-center justify-center text-xs font-bold text-[#1F2923] hover:bg-gray-100"
                aria-label="Increase guests"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="col-span-3">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-full bg-[#243D2C] hover:bg-[#192C1F] text-white text-xs font-bold transition-all shadow-xs hover:scale-102 active:scale-98"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current text-[#C58E47]" />
              <span>
                {selectedRoom.pricePerNight !== null
                  ? `Reserve • $${selectedRoom.pricePerNight * nights}`
                  : "Check Group Rates"}
              </span>
            </a>
          </div>
        </div>

        {/* Mobile & Tablet View: Clean, Compact Responsive Layout with Zero Fluff */}
        <div className="lg:hidden space-y-2.5 p-1">
          {/* Row 1: Room Selector Pills */}
          <div className="flex items-center p-1 bg-[#F2EFE9] rounded-xl border border-[#E5DFD5]">
            {ROOM_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRoom(opt)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 text-center truncate ${
                  selectedRoom.id === opt.id
                    ? "bg-[#243D2C] text-white shadow-xs"
                    : "text-[#7B887E] hover:text-[#1F2923]"
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>

          {/* Row 2: Dates + Guests in 2 Columns on Mobile, 3 Columns on Tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="grid grid-cols-2 sm:col-span-8 gap-2">
              <div className="relative" ref={calendarRef}>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full flex items-center justify-between gap-1.5 p-2 rounded-xl bg-[#F8F9F7] border border-[#E2E6E3]/80 text-left"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#C58E47] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs font-semibold text-[#1F2923] truncate">
                      {isClient ? `${formatDate(checkInDate)} – ${formatDate(checkOutDate)}` : "Dates"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#C58E47] bg-[#C58E47]/15 px-1 py-0.5 rounded">
                    {nights}N
                  </span>
                </button>

                {/* Mobile Calendar Popover */}
                {isCalendarOpen && displayMonth && (
                  <div className="absolute top-full left-0 right-0 sm:w-72 mt-1.5 p-3 bg-white rounded-2xl shadow-2xl border border-[#E2E6E3] z-50 animate-calendar-pop">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-[#243D2C]">
                        {displayMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </h4>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={prevMonth}
                          className="p-1 rounded hover:bg-[#F8F9F7] text-[#1F2923]"
                          aria-label="Previous month"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={nextMonth}
                          className="p-1 rounded hover:bg-[#F8F9F7] text-[#1F2923]"
                          aria-label="Next month"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-[#7B887E] mb-1 uppercase">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayIndex }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-6" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const dateObj = new Date(year, month, dayNum);
                        dateObj.setHours(0, 0, 0, 0);

                        const isCheckIn = checkInDate && dateObj.getTime() === checkInDate.getTime();
                        const isCheckOut = checkOutDate && dateObj.getTime() === checkOutDate.getTime();
                        const isInRange =
                          checkInDate && checkOutDate && dateObj > checkInDate && dateObj < checkOutDate;

                        const todayStart = new Date();
                        todayStart.setHours(0, 0, 0, 0);
                        const isPast = dateObj < todayStart;

                        return (
                          <button
                            key={dayNum}
                            type="button"
                            disabled={isPast}
                            onClick={() => handleDayClick(dayNum)}
                            className={`h-6 rounded text-[11px] font-semibold flex items-center justify-center transition-all ${
                              isPast
                                ? "text-gray-300 cursor-not-allowed"
                                : isCheckIn || isCheckOut
                                ? "bg-[#243D2C] text-white shadow-xs"
                                : isInRange
                                ? "bg-[#C58E47]/20 text-[#243D2C] rounded-none"
                                : "hover:bg-[#F8F9F7] text-[#1F2923]"
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Guests Counter */}
              <div className="flex items-center justify-between p-1.5 px-2.5 rounded-xl bg-[#F8F9F7] border border-[#E2E6E3]/80">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#1F2923]">
                  <Users className="w-3.5 h-3.5 text-[#C58E47] flex-shrink-0" />
                  <span>{guestCount} {guestCount === 1 ? "Guest" : "Guests"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="w-5 h-5 rounded-md bg-white border border-[#E2E6E3] flex items-center justify-center text-xs font-bold text-[#1F2923] hover:bg-gray-50"
                    aria-label="Decrease guests"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                    className="w-5 h-5 rounded-md bg-white border border-[#E2E6E3] flex items-center justify-center text-xs font-bold text-[#1F2923] hover:bg-gray-50"
                    aria-label="Increase guests"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Button: Inline on Tablet (col-span-4), Row 3 on Mobile */}
            <div className="sm:col-span-4">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full min-h-[38px] flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#243D2C] hover:bg-[#17271D] text-white text-xs font-bold shadow-xs transition-all active:scale-98"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current text-[#C58E47]" />
                <span>
                  {selectedRoom.pricePerNight !== null
                    ? `Reserve • $${selectedRoom.pricePerNight * nights}`
                    : "Check Rates"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
