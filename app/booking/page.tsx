"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ContactAndFooter from "@/components/ContactAndFooter";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import {
  Calendar as CalendarIcon,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Phone,
  MapPin,
  ShieldCheck,
  Coffee,
  Car,
  AlertCircle,
  ArrowRight,
  Check,
  MessageCircle,
  X
} from "lucide-react";

interface RoomOption {
  id: "double" | "triple" | "full";
  name: string;
  subtitle: string;
  pricePerNight: number | null;
  priceLabel: string;
  capacity: string;
  image: string;
  features: string[];
}

const ROOM_OPTIONS: RoomOption[] = [
  {
    id: "double",
    name: "Double Room with Private Bathroom",
    subtitle: "Cozy mountain hideaway for couples & solo trekkers",
    pricePerNight: 20,
    priceLabel: "$20",
    capacity: "Up to 2 Guests",
    image: "/photos/2-member-room.jpeg",
    features: [
      "King size bed with plush mountain blankets",
      "Private en-suite bathroom with steaming hot water",
      "Private veranda overlooking misty pine valley",
      "Electric tea kettle and Ceylon tea selection",
      "Complimentary high-speed WiFi",
    ],
  },
  {
    id: "triple",
    name: "Triple Room with Private Bathroom",
    subtitle: "Spacious highland comfort for families & friends",
    pricePerNight: 23,
    priceLabel: "$23",
    capacity: "Up to 3 Guests",
    image: "/photos/triblebedroom.jpg",
    features: [
      "1 Double bed + 1 Single bed setup",
      "Private en-suite hot-water bathroom",
      "Wide windows with panoramic garden & hill view",
      "Electric tea kettle and tea station",
      "Complimentary high-speed WiFi",
    ],
  },
  {
    id: "full",
    name: "Full Villa Exclusive Stay",
    subtitle: "The entire 3-bedroom bungalow exclusively for your group",
    pricePerNight: 65,
    priceLabel: "$65",
    capacity: "Up to 10 Guests",
    image: "/photos/outside-cool-view.jpeg",
    features: [
      "All 3 bedrooms with private hot-water bathrooms",
      "Spacious living room, dining area and private veranda",
      "Kitchen access, private garden and outdoor gazebo",
      "Dedicated parking for up to 3 vehicles",
      "Host Susantha on site for meals & Horton Plains transport",
    ],
  },
];

interface BookedRange {
  _id: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const initialRoom = (searchParams?.get("room") as "double" | "triple" | "full") || "double";

  const [roomOptions, setRoomOptions] = useState<RoomOption[]>(ROOM_OPTIONS);
  const [selectedRoom, setSelectedRoom] = useState<RoomOption>(
    ROOM_OPTIONS.find((r) => r.id === initialRoom) || ROOM_OPTIONS[0]
  );

  // Dynamically load room pricing and package details from MongoDB
  useEffect(() => {
    let ignore = false;
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.success && Array.isArray(data.rooms) && data.rooms.length > 0) {
          setRoomOptions((prev) =>
            prev.map((opt) => {
              const dyn = data.rooms.find((r: any) => r.roomId === opt.id);
              if (!dyn) return opt;
              return {
                ...opt,
                name: dyn.name || opt.name,
                subtitle: dyn.subtitle || opt.subtitle,
                pricePerNight: typeof dyn.pricePerNight === "number" ? dyn.pricePerNight : opt.pricePerNight,
                priceLabel: dyn.priceLabel || `$${dyn.pricePerNight}` || opt.priceLabel,
                capacity: dyn.capacity || opt.capacity,
                features: Array.isArray(dyn.features) && dyn.features.length > 0 ? dyn.features : opt.features,
              };
            })
          );
          setSelectedRoom((current) => {
            const dyn = data.rooms.find((r: any) => r.roomId === current.id);
            if (!dyn) return current;
            return {
              ...current,
              name: dyn.name || current.name,
              subtitle: dyn.subtitle || current.subtitle,
              pricePerNight: typeof dyn.pricePerNight === "number" ? dyn.pricePerNight : current.pricePerNight,
              priceLabel: dyn.priceLabel || `$${dyn.pricePerNight}` || current.priceLabel,
              capacity: dyn.capacity || current.capacity,
              features: Array.isArray(dyn.features) && dyn.features.length > 0 ? dyn.features : current.features,
            };
          });
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  const [checkInDate, setCheckInDate] = useState<Date | null>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dIn = new Date(today);
    dIn.setDate(today.getDate() + 1);
    return dIn;
  });
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dOut = new Date(today);
    dOut.setDate(today.getDate() + 3);
    return dOut;
  });
  const [inMonth, setInMonth] = useState<Date | null>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [outMonth, setOutMonth] = useState<Date | null>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 1);
  });

  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loadingBookedDates, setLoadingBookedDates] = useState(false);

  const [guestCount, setGuestCount] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [requestPickup, setRequestPickup] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const calendarSectionRef = useRef<HTMLDivElement>(null);

  // Sync room param if URL changes
  useEffect(() => {
    const roomParam = searchParams?.get("room");
    if (roomParam && ["double", "triple", "full"].includes(roomParam)) {
      const found = roomOptions.find((r) => r.id === roomParam) || ROOM_OPTIONS.find((r) => r.id === roomParam);
      if (found && found.id !== selectedRoom.id) {
        setSelectedRoom(found);
      }
    }
  }, [searchParams, roomOptions, selectedRoom.id]);

  // Handle switching rooms
  const handleRoomSelect = (opt: RoomOption) => {
    setSelectedRoom(opt);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("room", opt.id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Fetch booked ranges dynamically whenever selected room changes
  const fetchBookedDates = useCallback(async (roomId: string) => {
    setLoadingBookedDates(true);
    try {
      const res = await fetch(`/api/bookings?bookedDates=true&roomType=${encodeURIComponent(roomId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.bookedRanges)) {
          setBookedRanges(data.bookedRanges);
        }
      }
    } catch {
      // Graceful error fallback
    } finally {
      setLoadingBookedDates(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRoom?.id) {
      fetchBookedDates(selectedRoom.id);
    }
  }, [selectedRoom.id, fetchBookedDates]);

  // Normalize date helper
  const normalizeDate = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };

  // Determine if a night is occupied in MongoDB
  const isNightBooked = useCallback(
    (targetDate: Date) => {
      const targetTime = normalizeDate(targetDate).getTime();
      return bookedRanges.some((range) => {
        const start = normalizeDate(new Date(range.checkIn)).getTime();
        const end = normalizeDate(new Date(range.checkOut)).getTime();
        return targetTime >= start && targetTime < end;
      });
    },
    [bookedRanges]
  );

  // Validation rules for check-in
  const isCheckInDisabled = (targetDate: Date) => {
    const today = normalizeDate(new Date());
    const target = normalizeDate(targetDate);
    if (target.getTime() < today.getTime()) return true;
    return isNightBooked(target);
  };

  // Validation rules for check-out (strict anti-overlap)
  const isCheckOutDisabled = (targetDate: Date) => {
    if (!checkInDate) return true;
    const checkInNorm = normalizeDate(checkInDate);
    const target = normalizeDate(targetDate);

    // Check-out must be after check-in
    if (target.getTime() <= checkInNorm.getTime()) return true;

    // Must not span across any occupied night
    const cur = new Date(checkInNorm);
    while (cur.getTime() < target.getTime()) {
      if (isNightBooked(cur)) {
        return true;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return false;
  };

  // Calculate nights
  const nights =
    checkInDate && checkOutDate
      ? Math.max(1, Math.round((normalizeDate(checkOutDate).getTime() - normalizeDate(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
      : 2;

  // Format date helper
  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Days in month calculation
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Handle clicking a day on Check-in calendar
  const handleCheckInSelect = (dateObj: Date) => {
    if (isCheckInDisabled(dateObj)) return;
    setCheckInDate(dateObj);

    // If current check-out is now invalid or spans an occupied night
    const nextDay = new Date(dateObj);
    nextDay.setDate(dateObj.getDate() + 1);

    if (!checkOutDate || checkOutDate <= dateObj || isCheckOutDisabled(checkOutDate)) {
      if (!isCheckOutDisabled(nextDay)) {
        setCheckOutDate(nextDay);
      } else {
        setCheckOutDate(null);
      }
    }
  };

  // Handle clicking a day on Check-out calendar
  const handleCheckOutSelect = (dateObj: Date) => {
    if (isCheckOutDisabled(dateObj)) return;
    setCheckOutDate(dateObj);
  };

  // Total price calculation
  const roomRate = selectedRoom.pricePerNight || 0;
  const totalPrice = roomRate * nights;

  // Form submission directly to MongoDB backend
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please select both your check-in and check-out dates.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const fullSpecialRequests = [
        specialRequests.trim(),
        requestPickup ? "Requested complimentary pickup from Ohiya Railway Station." : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          roomType: selectedRoom.id,
          roomName: selectedRoom.name,
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          guests: guestCount,
          specialRequests: fullSpecialRequests,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedBooking(data.booking);
        fetchBookedDates(selectedRoom.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(data.message || "Failed to complete reservation. Please try again or select other dates.");
      }
    } catch {
      setErrorMessage("A connection error occurred. Please verify your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar renderer component
  const renderCalendar = (
    currentMonth: Date,
    setMonth: React.Dispatch<React.SetStateAction<Date | null>>,
    mode: "checkIn" | "checkOut"
  ) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysCount = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();

    return (
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE5DC] shadow-sm flex flex-col justify-between">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58E47] block">
              {mode === "checkIn" ? "Step 2A: Arrival Date" : "Step 2B: Departure Date"}
            </span>
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#243D2C]">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h4>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMonth(new Date(year, month - 1, 1))}
              className="p-2 rounded-xl bg-[#F8F9F7] hover:bg-[#F2EFE9] text-[#243D2C] transition-colors border border-[#EAE5DC]"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMonth(new Date(year, month + 1, 1))}
              className="p-2 rounded-xl bg-[#F8F9F7] hover:bg-[#F2EFE9] text-[#243D2C] transition-colors border border-[#EAE5DC]"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day Name Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#7B887E] mb-2 uppercase tracking-wider">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-11" />
          ))}

          {Array.from({ length: daysCount }).map((_, i) => {
            const dayNum = i + 1;
            const dateObj = new Date(year, month, dayNum);
            dateObj.setHours(0, 0, 0, 0);

            const isCheckIn = checkInDate && dateObj.getTime() === normalizeDate(checkInDate).getTime();
            const isCheckOut = checkOutDate && dateObj.getTime() === normalizeDate(checkOutDate).getTime();
            const isInRange =
              checkInDate &&
              checkOutDate &&
              dateObj > normalizeDate(checkInDate) &&
              dateObj < normalizeDate(checkOutDate);

            const booked = isNightBooked(dateObj);
            const disabled = mode === "checkIn" ? isCheckInDisabled(dateObj) : isCheckOutDisabled(dateObj);

            return (
              <button
                key={dayNum}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (mode === "checkIn") {
                    handleCheckInSelect(dateObj);
                  } else {
                    handleCheckOutSelect(dateObj);
                  }
                }}
                title={booked ? "Already reserved by another guest" : undefined}
                className={`h-10 sm:h-11 rounded-xl text-xs sm:text-sm font-semibold relative flex flex-col items-center justify-center transition-all ${
                  disabled
                    ? booked
                      ? "bg-rose-50/80 text-rose-300 border border-rose-200/60 cursor-not-allowed line-through"
                      : "text-gray-300 cursor-not-allowed"
                    : isCheckIn || isCheckOut
                    ? "bg-[#243D2C] text-white shadow-md font-bold ring-2 ring-[#DFB775]/50 scale-102"
                    : isInRange
                    ? "bg-[#DFB775]/25 text-[#243D2C] rounded-md font-semibold"
                    : "hover:bg-[#FAF9F5] hover:border-[#DFB775] border border-transparent text-[#1F2923]"
                }`}
              >
                <span>{dayNum}</span>
                {booked && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 absolute bottom-1" />
                )}
                {isCheckIn && (
                  <span className="text-[8px] uppercase tracking-tighter text-[#DFB775] font-bold -mt-0.5">
                    In
                  </span>
                )}
                {isCheckOut && (
                  <span className="text-[8px] uppercase tracking-tighter text-[#DFB775] font-bold -mt-0.5">
                    Out
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footnote per calendar */}
        <div className="mt-4 pt-3 border-t border-[#EAE5DC] text-[11px] text-[#7B887E] flex items-center justify-between">
          <span>{mode === "checkIn" ? "Check in from 1:00 PM" : "Check out by 11:00 AM"}</span>
          <span className="font-semibold text-[#243D2C]">
            {mode === "checkIn"
              ? checkInDate
                ? formatDate(checkInDate)
                : "Not selected"
              : checkOutDate
              ? formatDate(checkOutDate)
              : "Not selected"}
          </span>
        </div>
      </div>
    );
  };

  // If reservation is already confirmed, render the luxurious confirmation receipt
  if (confirmedBooking) {
    const refCode = `#DBB-${(confirmedBooking._id || "").slice(-6).toUpperCase()}`;
    const checkInStr = new Date(confirmedBooking.checkIn).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const checkOutStr = new Date(confirmedBooking.checkOut).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const waText = [
      `Hello Susantha, I have placed a reservation at Dawn Breezy Bungalow!`,
      ``,
      `Reference: ${refCode}`,
      `Guest Name: ${confirmedBooking.customerName}`,
      `Phone: ${confirmedBooking.customerPhone}`,
      `Accommodation: ${confirmedBooking.roomName}`,
      `Dates: ${checkInStr} to ${checkOutStr} (${confirmedBooking.nights} nights)`,
      `Guests: ${confirmedBooking.guests}`,
      `Total Payable: $${confirmedBooking.totalPrice}`,
      confirmedBooking.specialRequests ? `Special Request: ${confirmedBooking.specialRequests}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/94714194368?text=${encodeURIComponent(waText)}`;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-[#DFB775]/40 shadow-2xl p-6 sm:p-10 text-center relative overflow-hidden">
          {/* Top Gold Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#243D2C] via-[#C58E47] to-[#243D2C]" />

          {/* Close 'X' Button at top-right corner */}
          <button
            type="button"
            onClick={() => setConfirmedBooking(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[#58685D] hover:text-[#243D2C] transition-colors"
            title="Close this confirmation window"
            aria-label="Close confirmation"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#C58E47] bg-[#C58E47]/10 px-3.5 py-1.5 rounded-full border border-[#C58E47]/20">
            Booking Confirmed in Guest Ledger
          </span>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#243D2C] mt-4 mb-2">
            Your Stay is Reserved
          </h2>
          <p className="text-sm text-[#58685D] max-w-lg mx-auto mb-6">
            Thank you, {confirmedBooking.customerName}. Your reservation is officially registered at Dawn Breezy Bungalow. Host Susantha and family look forward to welcoming you to the Ohiya highlands.
          </p>

          <div className="inline-block bg-[#FAF9F6] border border-[#EAE5DC] rounded-2xl px-5 py-2.5 mb-8">
            <span className="text-xs text-[#7B887E] uppercase tracking-wider block">Reservation Reference</span>
            <span className="font-mono text-lg font-bold text-[#243D2C]">
              {refCode}
            </span>
          </div>

          {/* Details Table */}
          <div className="max-w-xl mx-auto bg-[#FAF9F6] rounded-2xl p-5 border border-[#EAE5DC] text-left text-xs sm:text-sm space-y-3 mb-8">
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80">
              <span className="text-[#7B887E]">Accommodation:</span>
              <span className="font-bold text-[#243D2C]">{confirmedBooking.roomName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80">
              <span className="text-[#7B887E]">Check-in Date:</span>
              <span className="font-bold text-[#243D2C]">{checkInStr}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80">
              <span className="text-[#7B887E]">Check-out Date:</span>
              <span className="font-bold text-[#243D2C]">{checkOutStr}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80">
              <span className="text-[#7B887E]">Duration & Guests:</span>
              <span className="font-bold text-[#243D2C]">
                {confirmedBooking.nights} Nights • {confirmedBooking.guests} Guests
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80">
              <span className="text-[#7B887E]">Ohiya Station Pickup:</span>
              <span className="font-bold text-emerald-700">Complimentary (200m away)</span>
            </div>
            <div className="flex justify-between py-1 pt-2 text-base">
              <span className="font-bold text-[#243D2C]">Total Payable on Arrival:</span>
              <span className="font-bold text-[#C58E47] text-lg font-mono">
                ${confirmedBooking.totalPrice}
              </span>
            </div>
          </div>

          {/* Susantha Note */}
          <div className="max-w-xl mx-auto bg-[#F2EFE9] rounded-2xl p-4 border border-[#E2E6E3] text-left text-xs text-[#4F6154] leading-relaxed mb-8 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#243D2C] text-[#DFB775] flex items-center justify-center flex-shrink-0 font-serif font-bold text-base">
              S
            </div>
            <div>
              <h5 className="font-bold text-[#243D2C] text-xs mb-0.5">Note from Host Susantha:</h5>
              <p>
                When your train approaches Ohiya Railway Station, feel free to drop a WhatsApp message or give us a quick call. We will meet you right at the station platform to assist with your luggage and welcome you to the bungalow with hot Ceylon tea.
              </p>
            </div>
          </div>

          {/* Action Buttons: WhatsApp Susantha, Call Susantha, and Close Receipt */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold shadow-md hover:scale-102 active:scale-98 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Susantha (+94 71 419 4368)</span>
            </a>

            <a
              href="tel:+94714194368"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#243D2C] hover:bg-[#17271D] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
            >
              <Phone className="w-4 h-4 text-[#DFB775]" />
              <span>Call Susantha</span>
            </a>

            <button
              type="button"
              onClick={() => setConfirmedBooking(null)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-gray-100 text-[#243D2C] text-xs sm:text-sm font-semibold border border-[#EAE5DC] transition-all"
            >
              <X className="w-4 h-4" />
              <span>Close Receipt</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Page Title & Breadcrumb Header */}
      <div className="scroll-reveal text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C58E47]/15 text-[#C58E47] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Direct Host Reservation • Zero Booking Fees</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#243D2C] tracking-tight mb-4">
          Reserve Your Highland Stay
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#58685D] leading-relaxed">
          Select your accommodation and choose your dates on our real-time availability calendar. No prepayment or credit card required. Pay upon arrival at Dawn Breezy Bungalow.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs text-[#243D2C] font-semibold">
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] px-3 py-1.5 rounded-full border border-[#EAE5DC]">
            <MapPin className="w-3.5 h-3.5 text-[#C58E47]" />
            <span>200m from Ohiya Station</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] px-3 py-1.5 rounded-full border border-[#EAE5DC]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C58E47]" />
            <span>Pay on Arrival</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] px-3 py-1.5 rounded-full border border-[#EAE5DC]">
            <Car className="w-3.5 h-3.5 text-[#C58E47]" />
            <span>Free Station Pickup</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] px-3 py-1.5 rounded-full border border-[#EAE5DC]">
            <Coffee className="w-3.5 h-3.5 text-[#C58E47]" />
            <span>Welcome Ceylon Tea</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Room Chooser, Dual Calendars, Guest Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-10 sm:space-y-12">
          {/* STEP 1: SELECT ACCOMMODATION (Expanded Rich Cards) */}
          <section className="scroll-reveal">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-[#C58E47] uppercase tracking-wider">Step 1</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#243D2C]">
                  Choose Your Accommodation
                </h3>
              </div>
              <span className="text-xs text-[#7B887E]">3 room options available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {roomOptions.map((opt) => {
                const isSelected = selectedRoom.id === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleRoomSelect(opt)}
                    className={`scroll-reveal-card cursor-pointer rounded-3xl p-4 sm:p-5 border-2 transition-all flex flex-col justify-between group ${
                      isSelected
                        ? "bg-[#FAF9F5] border-[#243D2C] shadow-lg ring-2 ring-[#243D2C]/10 scale-101"
                        : "bg-white border-[#EAE5DC] hover:border-[#DFB775] hover:shadow-md"
                    }`}
                  >
                    <div>
                      {/* Photo Thumbnail */}
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-3.5 bg-gray-100">
                        <Image
                          src={opt.image}
                          alt={opt.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold">
                          {opt.priceLabel}
                          {opt.pricePerNight && <span className="text-[9px] font-normal"> / night</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58E47]">
                          {opt.capacity}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#243D2C] bg-[#243D2C]/10 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3 text-[#243D2C]" />
                            <span>Selected</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-base font-bold text-[#243D2C] line-clamp-1 mb-1">
                        {opt.name}
                      </h4>
                      <p className="text-xs text-[#7B887E] line-clamp-2 leading-relaxed mb-3">
                        {opt.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EAE5DC]/80 space-y-1 text-[11px] text-[#58685D]">
                      {opt.features.slice(0, 3).map((f, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3 h-3 text-[#C58E47] flex-shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 2: DUAL CALENDARS SIDE-BY-SIDE (BIGGER & MORE SPACIOUS) */}
          <section ref={calendarSectionRef} className="scroll-reveal scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-bold text-[#C58E47] uppercase tracking-wider">Step 2</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#243D2C]">
                  Select Stay Dates ({selectedRoom.name})
                </h3>
                <p className="text-xs text-[#7B887E] mt-0.5">
                  {selectedRoom.id === "double" && "Room 01 (Double) • Booking this room does not block Triple Room dates"}
                  {selectedRoom.id === "triple" && "Room 02 (Triple) • Booking this room does not block Double Room dates"}
                  {selectedRoom.id === "full" && "Entire Villa Exclusive • Requires all bedrooms to be vacant"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {loadingBookedDates && (
                  <span className="text-[#C58E47] font-semibold animate-pulse">
                    Refreshing live dates...
                  </span>
                )}
              </div>
            </div>

            {/* Selected Dates Feedback Banner */}
            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#DFB775]/50 flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#243D2C] text-[#DFB775] flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#7B887E] uppercase tracking-wider block font-bold">
                    Chosen Stay Duration
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-[#243D2C] flex items-center gap-2">
                    <span>{formatDate(checkInDate)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C58E47]" />
                    <span>{formatDate(checkOutDate)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#243D2C] text-white">
                  {nights} {nights === 1 ? "Night" : "Nights"}
                </span>
              </div>
            </div>

            {/* Dual Calendars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inMonth && renderCalendar(inMonth, setInMonth, "checkIn")}
              {outMonth && renderCalendar(outMonth, setOutMonth, "checkOut")}
            </div>

            {/* Calendar Legend */}
            <div className="mt-4 p-3 bg-white rounded-2xl border border-[#EAE5DC] flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 text-xs text-[#58685D]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#243D2C] ring-2 ring-[#DFB775]/40" />
                <span>Your Selected Dates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="line-through text-rose-600 font-medium">Already Reserved / Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white border border-[#EAE5DC]" />
                <span>Available to Book</span>
              </div>
            </div>
          </section>

          {/* STEP 3: GUEST INFORMATION & PREFERENCES */}
          <section className="scroll-reveal">
            <div className="mb-4">
              <span className="text-xs font-bold text-[#C58E47] uppercase tracking-wider">Step 3</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#243D2C]">
                Guest Information &amp; Arrival Details
              </h3>
            </div>

            <form onSubmit={handleSubmitBooking} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE5DC] shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2923] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. David Smith"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2923] mb-1.5">
                    Phone / Contact Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +94 71 234 5678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                    required
                  />
                  <span className="text-[10px] text-[#7B887E] mt-1 block">
                    Used by Susantha for station pickup coordination
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2923] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. david@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                  />
                  <span className="text-[10px] text-[#7B887E] mt-1 block">
                    Optional for booking voucher copy
                  </span>
                </div>
              </div>

              {/* Station Pickup Checkbox */}
              <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DC] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-[#C58E47] flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-[#243D2C] block">
                      Complimentary Ohiya Railway Station Pickup
                    </span>
                    <span className="text-[11px] text-[#7B887E]">
                      Susantha will meet you at Ohiya Station platform (200m away)
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="pickup-toggle"
                  checked={requestPickup}
                  onChange={(e) => setRequestPickup(e.target.checked)}
                  className="w-4 h-4 accent-[#243D2C] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2923] mb-1.5">
                  Train Arrival Time / Special Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Arriving on 2:15 PM train from Kandy. Would also love to book the 5:30 AM Horton Plains sunrise car and have home-cooked dinner upon arrival..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl p-3.5 text-xs sm:text-sm text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#243D2C] hover:bg-[#17271D] text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#243D2C]/20 flex items-center justify-center gap-2.5 hover:scale-101 active:scale-99"
                >
                  {isSubmitting ? (
                    <span>Registering Your Reservation...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#DFB775]" />
                      <span>
                        Confirm Stay at Dawn Breezy • ${totalPrice}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Sticky Stay Summary Breakdown (4 Cols) */}
        <div className="scroll-reveal lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58E47] block mb-1">
              Reservation Summary
            </span>
            <h3 className="font-serif text-xl font-bold text-[#243D2C] mb-4">
              Your Highland Stay
            </h3>

            {/* Room Snapshot */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-gray-100">
              <Image
                src={selectedRoom.image}
                alt={selectedRoom.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3.5">
                <div className="text-white">
                  <span className="text-xs font-bold block">{selectedRoom.name}</span>
                  <span className="text-[10px] text-white/80">{selectedRoom.capacity}</span>
                </div>
              </div>
            </div>

            {/* Guests Selector */}
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EAE5DC] flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#243D2C]">
                <Users className="w-4 h-4 text-[#C58E47]" />
                <span>{guestCount} {guestCount === 1 ? "Guest" : "Guests"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#EAE5DC] flex items-center justify-center text-xs font-bold text-[#243D2C] hover:bg-gray-100"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#EAE5DC] flex items-center justify-center text-xs font-bold text-[#243D2C] hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dates Snapshot */}
            <div className="space-y-2 py-3 border-y border-[#EAE5DC] text-xs">
              <div className="flex justify-between">
                <span className="text-[#7B887E]">Check-in:</span>
                <span className="font-bold text-[#243D2C]">{checkInDate ? formatDate(checkInDate) : "Select date"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7B887E]">Check-out:</span>
                <span className="font-bold text-[#243D2C]">{checkOutDate ? formatDate(checkOutDate) : "Select date"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7B887E]">Total Duration:</span>
                <span className="font-bold text-[#243D2C]">{nights} Nights</span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="py-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7B887E]">
                  ${roomRate} x {nights} nights
                </span>
                <span className="font-semibold text-[#243D2C]">${totalPrice}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Ohiya Station Pickup</span>
                <span className="font-bold">Free ($0)</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Ceylon Tea Station</span>
                <span className="font-bold">Complimentary</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Booking &amp; Service Fee</span>
                <span className="font-bold">$0 (Direct)</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#7B887E] block">Total Payable on Arrival</span>
                <span className="font-serif text-2xl font-bold text-[#243D2C] font-mono">
                  ${totalPrice}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#C58E47] bg-[#C58E47]/15 px-2.5 py-1 rounded-full uppercase">
                Zero Prepayment
              </span>
            </div>

            {/* Direct Host Contact Box */}
            <div className="mt-5 p-3 rounded-xl bg-[#FAF9F5] border border-[#EAE5DC] text-xs text-[#58685D] space-y-1.5">
              <span className="font-bold text-[#243D2C] block">Host Assistance:</span>
              <p className="text-[11px] leading-relaxed">
                Have questions about train times or hiking routes? Contact Susantha directly:
              </p>
              <a
                href="tel:+94714194368"
                className="inline-flex items-center gap-1.5 font-bold text-[#243D2C] hover:text-[#C58E47]"
              >
                <Phone className="w-3.5 h-3.5 text-[#C58E47]" />
                <span>+94 71 419 4368</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8F9F7] text-[#1F2923]">
      <Navbar />

      {/* Hero Header Strip for Booking Subpage */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#0D1912] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/photos/hero-2.jpg"
            alt="Ohiya Highlands"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D1912]/80 via-[#0D1912]/95 to-[#F8F9F7]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#DFB775]">
            Dawn Breezy Bungalow • Ohiya
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mt-1 text-white">
            Online Reservation Portal
          </h2>
        </div>
      </section>

      {/* Main Booking Content inside Suspense boundary */}
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <span className="text-sm font-semibold text-[#C58E47] animate-pulse">
              Loading villa booking engine...
            </span>
          </div>
        }
      >
        <BookingContent />
      </Suspense>

      <ContactAndFooter />
      <FloatingWhatsApp />
    </main>
  );
}
