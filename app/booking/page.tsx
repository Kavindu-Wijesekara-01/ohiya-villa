"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ContactAndFooter from "@/components/ContactAndFooter";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import {
  MAX_DOUBLE_ROOMS,
  MAX_TRIPLE_ROOMS,
  RoomSelection,
  calculateNightlyRate,
  deriveRoomTypeFromSelection,
  formatLocalDateYMD,
  formatRoomSelectionName,
  getMaxGuestsForSelection,
  getTotalRoomCount,
  getUsedRoomsOnNight,
  hasCapacityConflictYMD,
  isEntireVillaSelection,
  toVillaYMD,
} from "@/lib/bookingUtils";
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
  X,
  Globe,
  CreditCard,
  Search,
  Clock,
  XCircle,
  History
} from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

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
  checkInYMD?: string;
  checkOutYMD?: string;
  roomType: string;
  doubleRooms?: number;
  tripleRooms?: number;
}

function getInitialRoomCounts(roomParam: string | null): RoomSelection {
  if (roomParam === "triple") return { doubleRooms: 0, tripleRooms: 1 };
  if (roomParam === "full") return { doubleRooms: MAX_DOUBLE_ROOMS, tripleRooms: MAX_TRIPLE_ROOMS };
  return { doubleRooms: 1, tripleRooms: 0 };
}

function BookingContent() {
  const searchParams = useSearchParams();
  const initialSelection = getInitialRoomCounts(searchParams?.get("room") ?? null);

  const [roomOptions, setRoomOptions] = useState<RoomOption[]>(ROOM_OPTIONS);
  const [doubleCount, setDoubleCount] = useState<number>(initialSelection.doubleRooms);
  const [tripleCount, setTripleCount] = useState<number>(initialSelection.tripleRooms);

  const selection: RoomSelection = {
    doubleRooms: doubleCount,
    tripleRooms: tripleCount,
  };
  const isEntireVilla = isEntireVillaSelection(selection);
  const totalRoomsSelected = getTotalRoomCount(selection);
  const selectionName = formatRoomSelectionName(selection);
  const maxGuestsAllowed = getMaxGuestsForSelection(selection);
  const derivedRoomType = deriveRoomTypeFromSelection(selection);

  const doubleMeta = roomOptions.find((r) => r.id === "double") || ROOM_OPTIONS[0];
  const tripleMeta = roomOptions.find((r) => r.id === "triple") || ROOM_OPTIONS[1];
  const fullMeta = roomOptions.find((r) => r.id === "full") || ROOM_OPTIONS[2];

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
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [inMonth, setInMonth] = useState<Date | null>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [outMonth, setOutMonth] = useState<Date | null>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loadingBookedDates, setLoadingBookedDates] = useState(false);

  const [guestCount, setGuestCount] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [customerCountry, setCustomerCountry] = useState("");
  const [idOrPassport, setIdOrPassport] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [requestPickup, setRequestPickup] = useState(true);

  const [bookingMode, setBookingMode] = useState<"book" | "history">("book");
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupSearched, setLookupSearched] = useState(false);
  const [lookupResults, setLookupResults] = useState<
    Array<{
      _id: string;
      customerName: string;
      customerCountry?: string;
      idOrPassport?: string;
      roomType: string;
      roomName: string;
      checkIn: string;
      checkOut: string;
      nights: number;
      guests: number;
      totalPrice: number;
      currency: string;
      status: "pending" | "confirmed" | "cancelled" | "completed";
      specialRequests?: string;
      createdAt: string;
    }>
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const calendarSectionRef = useRef<HTMLDivElement>(null);

  // Sync room param if URL changes
  useEffect(() => {
    const roomParam = searchParams?.get("room");
    if (roomParam && ["double", "triple", "full"].includes(roomParam)) {
      const next = getInitialRoomCounts(roomParam);
      setDoubleCount(next.doubleRooms);
      setTripleCount(next.tripleRooms);
    }
  }, [searchParams]);

  // Clamp guest count whenever room capacity changes
  useEffect(() => {
    setGuestCount((prev) => Math.min(Math.max(1, prev), maxGuestsAllowed));
  }, [maxGuestsAllowed]);

  const applyRoomSelection = (nextDouble: number, nextTriple: number) => {
    const clampedDouble = Math.min(MAX_DOUBLE_ROOMS, Math.max(0, nextDouble));
    const clampedTriple = Math.min(MAX_TRIPLE_ROOMS, Math.max(0, nextTriple));
    if (clampedDouble + clampedTriple === 0) return;
    setDoubleCount(clampedDouble);
    setTripleCount(clampedTriple);
    setErrorMessage("");
  };

  // Fetch all active booked ranges dynamically
  const fetchBookedDates = useCallback(async () => {
    setLoadingBookedDates(true);
    try {
      const res = await fetch(`/api/bookings?bookedDates=true`);
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
    fetchBookedDates();
  }, [fetchBookedDates]);

  // Normalize date helper
  const normalizeDate = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };

  // Determine if a night lacks capacity for the currently selected room combination
  const isNightBooked = useCallback(
    (targetDate: Date) => {
      const targetYMD = formatLocalDateYMD(targetDate);
      const used = getUsedRoomsOnNight(targetYMD, bookedRanges);
      return (
        used.doubleRooms + doubleCount > MAX_DOUBLE_ROOMS ||
        used.tripleRooms + tripleCount > MAX_TRIPLE_ROOMS
      );
    },
    [bookedRanges, doubleCount, tripleCount]
  );

  // Validation rules for check-in
  const isCheckInDisabled = useCallback(
    (targetDate: Date) => {
      const todayYMD = toVillaYMD(new Date());
      const targetYMD = formatLocalDateYMD(targetDate);
      if (targetYMD < todayYMD) return true;
      return isNightBooked(targetDate);
    },
    [isNightBooked]
  );

  // Validation rules for check-out (strict anti-overlap across room capacity)
  const isCheckOutDisabled = useCallback(
    (targetDate: Date, overrideCheckIn?: Date | null) => {
      const effectiveIn = overrideCheckIn !== undefined ? overrideCheckIn : checkInDate;
      if (!effectiveIn) return true;

      const inYMD = formatLocalDateYMD(effectiveIn);
      const outYMD = formatLocalDateYMD(targetDate);

      // Check-out must be strictly after check-in
      if (outYMD <= inYMD) return true;

      // Must not exceed remaining villa capacity on any night in [inYMD, outYMD)
      return (
        hasCapacityConflictYMD({
          requested: { doubleRooms: doubleCount, tripleRooms: tripleCount },
          checkInYMD: inYMD,
          checkOutYMD: outYMD,
          ranges: bookedRanges,
        }) !== null
      );
    },
    [checkInDate, bookedRanges, doubleCount, tripleCount]
  );

  // Auto-clear selected dates if switching rooms or loading live dates reveals a conflict
  useEffect(() => {
    if (!checkInDate) return;
    if (isCheckInDisabled(checkInDate)) {
      setCheckInDate(null);
      setCheckOutDate(null);
      return;
    }
    if (checkOutDate && isCheckOutDisabled(checkOutDate, checkInDate)) {
      setCheckOutDate(null);
    }
  }, [bookedRanges, checkInDate, checkOutDate, isCheckInDisabled, isCheckOutDisabled]);

  // Calculate nights
  const nights =
    checkInDate && checkOutDate
      ? Math.max(1, Math.round((normalizeDate(checkOutDate).getTime() - normalizeDate(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

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

  // Handle clicking a day on Check-in calendar (selects 1 check-in day only; guest picks check-out next on the Check-out calendar)
  const handleCheckInSelect = (dateObj: Date) => {
    if (isCheckInDisabled(dateObj)) return;
    setCheckInDate(dateObj);
    setCheckOutDate(null);
    setErrorMessage("");

    // Position the Check-out calendar on the next available check-out day's month
    const nextDay = new Date(dateObj);
    nextDay.setDate(dateObj.getDate() + 1);
    setOutMonth(new Date(nextDay.getFullYear(), nextDay.getMonth(), 1));
  };

  // Handle clicking a day on Check-out calendar
  const handleCheckOutSelect = (dateObj: Date) => {
    if (isCheckOutDisabled(dateObj)) return;
    setCheckOutDate(dateObj);
    setErrorMessage("");
  };

  // Total price calculation
  const roomRate = calculateNightlyRate(selection, {
    doublePrice: doubleMeta.pricePerNight ?? 20,
    triplePrice: tripleMeta.pricePerNight ?? 23,
    fullPrice: fullMeta.pricePerNight ?? 65,
  });
  const totalPrice = roomRate * nights;

  // Form submission directly to MongoDB backend
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalRoomsSelected < 1) {
      setErrorMessage("Please select at least 1 bedroom.");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please select both your check-in and check-out dates.");
      return;
    }

    if (isCheckInDisabled(checkInDate) || isCheckOutDisabled(checkOutDate, checkInDate)) {
      setErrorMessage("Selected dates do not have enough available rooms for your selection. Please adjust your rooms or dates.");
      fetchBookedDates();
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
          customerCountry,
          idOrPassport,
          customerPhone,
          customerEmail,
          roomType: derivedRoomType,
          roomName: selectionName,
          doubleRooms: doubleCount,
          tripleRooms: tripleCount,
          checkIn: formatLocalDateYMD(checkInDate),
          checkOut: formatLocalDateYMD(checkOutDate),
          guests: guestCount,
          specialRequests: fullSpecialRequests,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedBooking(data.booking);
        if (idOrPassport.trim()) {
          setLookupQuery(idOrPassport.trim());
        }
        fetchBookedDates();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(data.message || "Failed to complete reservation. Please try again or select other dates.");
        fetchBookedDates();
      }
    } catch {
      setErrorMessage("A connection error occurred. Please verify your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookupBookings = async (overrideIdentity?: string) => {
    const query = (overrideIdentity ?? lookupQuery).trim();
    if (query.replace(/\s+/g, "").length < 4) {
      setLookupError("Please enter at least 4 characters of your NIC or Passport number.");
      return;
    }

    setLookupLoading(true);
    setLookupError("");
    setLookupSearched(false);

    try {
      const res = await fetch(
        `/api/bookings/lookup?identity=${encodeURIComponent(query)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setLookupResults(data.data || []);
        setLookupSearched(true);
      } else {
        setLookupError(data.message || "Could not look up booking history.");
        setLookupResults([]);
      }
    } catch {
      setLookupError("Connection error while checking your booking history.");
    } finally {
      setLookupLoading(false);
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

    const isWaitingForCheckIn = mode === "checkOut" && !checkInDate;

    return (
      <div className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-sm flex flex-col justify-between transition-all ${
        isWaitingForCheckIn
          ? "border-[#EAE5DC] opacity-80"
          : mode === "checkOut" && checkInDate && !checkOutDate
          ? "border-[#C58E47] ring-2 ring-[#C58E47]/15"
          : "border-[#EAE5DC]"
      }`}>
        {/* Month Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58E47] block">
              {mode === "checkIn" ? "Step 2A: Check In Calendar" : "Step 2B: Check Out Calendar"}
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

        {isWaitingForCheckIn && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#EAE5DC] text-[11px] font-semibold text-[#7B887E] text-center">
            Select your Check in date on the left calendar first
          </div>
        )}

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

            // Strictly allow & highlight only 1 day per calendar:
            // Check-in calendar shows ONLY the Check-in date; Check-out calendar shows ONLY the Check-out date.
            const isCheckIn = mode === "checkIn" && Boolean(checkInDate && dateObj.getTime() === normalizeDate(checkInDate).getTime());
            const isCheckOut = mode === "checkOut" && Boolean(checkOutDate && dateObj.getTime() === normalizeDate(checkOutDate).getTime());

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
      timeZone: "Asia/Colombo",
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const checkOutStr = new Date(confirmedBooking.checkOut).toLocaleDateString("en-US", {
      timeZone: "Asia/Colombo",
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const waText = [
      `Hello Susantha, I have submitted a reservation request at Dawn Breezy Bungalow!`,
      ``,
      `Reference: ${refCode}`,
      `Guest Name: ${confirmedBooking.customerName}`,
      confirmedBooking.customerCountry ? `Country: ${confirmedBooking.customerCountry}` : "",
      confirmedBooking.idOrPassport ? `ID / Passport: ${confirmedBooking.idOrPassport}` : "",
      `WhatsApp / Phone: ${confirmedBooking.customerPhone}`,
      confirmedBooking.customerEmail ? `Email: ${confirmedBooking.customerEmail}` : "",
      `Accommodation: ${confirmedBooking.roomName}`,
      `Dates: ${checkInStr} to ${checkOutStr} (${confirmedBooking.nights} nights)`,
      `Guests: ${confirmedBooking.guests}`,
      `Total Payable: $${confirmedBooking.totalPrice}`,
      `Current Status: ${confirmedBooking.status === "confirmed" ? "Confirmed" : "Pending Host Approval"}`,
      confirmedBooking.specialRequests ? `Special Request: ${confirmedBooking.specialRequests}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/94714194368?text=${encodeURIComponent(waText)}`;
    const isConfirmed = confirmedBooking.status === "confirmed";

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

          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm ${
              isConfirmed
                ? "bg-emerald-100 text-emerald-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {isConfirmed ? (
              <CheckCircle2 className="w-9 h-9" />
            ) : (
              <Clock className="w-9 h-9" />
            )}
          </div>

          <span
            className={`text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border inline-block ${
              isConfirmed
                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                : "text-amber-800 bg-amber-50 border-amber-200"
            }`}
          >
            {isConfirmed
              ? "Approved & Confirmed by Host"
              : "Reservation Request Received • Pending Host Approval"}
          </span>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#243D2C] mt-4 mb-2">
            {isConfirmed ? "Your Stay is Confirmed" : "Awaiting Host Confirmation"}
          </h2>
          <p className="text-sm text-[#58685D] max-w-lg mx-auto mb-6">
            Thank you, {confirmedBooking.customerName}.{" "}
            {isConfirmed
              ? "Your reservation is officially confirmed at Dawn Breezy Bungalow."
              : "Your booking request is saved as Pending and sent to Host Susantha for direct approval. You can track live approval anytime using your NIC / Passport number."}
          </p>

          <div className="inline-block bg-[#FAF9F6] border border-[#EAE5DC] rounded-2xl px-5 py-2.5 mb-8">
            <span className="text-xs text-[#7B887E] uppercase tracking-wider block">Reservation Reference</span>
            <span className="font-mono text-lg font-bold text-[#243D2C]">
              {refCode}
            </span>
          </div>

          {/* Details Table */}
          <div className="max-w-xl mx-auto bg-[#FAF9F6] rounded-2xl p-5 border border-[#EAE5DC] text-left text-xs sm:text-sm space-y-3 mb-8">
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80 gap-2">
              <span className="text-[#7B887E]">Guest &amp; Country:</span>
              <span className="font-bold text-[#243D2C] text-right">
                {confirmedBooking.customerName}
                {confirmedBooking.customerCountry ? ` (${confirmedBooking.customerCountry})` : ""}
              </span>
            </div>
            {confirmedBooking.idOrPassport && (
              <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80 gap-2">
                <span className="text-[#7B887E]">NIC / Passport Number:</span>
                <span className="font-mono font-bold text-[#243D2C]">
                  {confirmedBooking.idOrPassport}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80 gap-2">
              <span className="text-[#7B887E]">WhatsApp / Contact:</span>
              <span className="font-mono font-bold text-[#243D2C]">
                {confirmedBooking.customerPhone}
              </span>
            </div>
            {confirmedBooking.customerEmail && (
              <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80 gap-2">
                <span className="text-[#7B887E]">Email:</span>
                <span className="font-semibold text-[#243D2C] break-all text-right">
                  {confirmedBooking.customerEmail}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80 gap-2">
              <span className="text-[#7B887E]">Accommodation:</span>
              <span className="font-bold text-[#243D2C] text-right">{confirmedBooking.roomName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80 gap-2">
              <span className="text-[#7B887E]">Check-in Date:</span>
              <span className="font-bold text-[#243D2C]">{checkInStr}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80 gap-2">
              <span className="text-[#7B887E]">Check-out Date:</span>
              <span className="font-bold text-[#243D2C]">{checkOutStr}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80 gap-2">
              <span className="text-[#7B887E]">Duration &amp; Guests:</span>
              <span className="font-bold text-[#243D2C]">
                {confirmedBooking.nights} Nights • {confirmedBooking.guests} Guests
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE5DC]/80 gap-2">
              <span className="text-[#7B887E]">Approval Status:</span>
              <span
                className={`font-bold ${
                  isConfirmed ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {isConfirmed ? "Confirmed by Host" : "Pending Host Approval"}
              </span>
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

          {/* Action Buttons: Track History, WhatsApp Susantha, Call Susantha, Close */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
            {confirmedBooking.idOrPassport && (
              <button
                type="button"
                onClick={() => {
                  const identity = confirmedBooking.idOrPassport;
                  setConfirmedBooking(null);
                  setBookingMode("history");
                  setLookupQuery(identity);
                  handleLookupBookings(identity);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#C58E47] hover:bg-[#b07b38] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <History className="w-4 h-4" />
                <span>Track Approval Status</span>
              </button>
            )}

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

        {/* Mode Switcher: New Reservation vs Check Booking Status / Past History */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 bg-[#F2EFE9] p-1.5 rounded-2xl border border-[#EAE5DC]">
          <button
            type="button"
            onClick={() => setBookingMode("book")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
              bookingMode === "book"
                ? "bg-[#243D2C] text-white shadow-sm"
                : "text-[#4F6154] hover:text-[#243D2C]"
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-[#DFB775]" />
            <span>New Reservation</span>
          </button>
          <button
            type="button"
            onClick={() => setBookingMode("history")}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
              bookingMode === "history"
                ? "bg-[#243D2C] text-white shadow-sm"
                : "text-[#4F6154] hover:text-[#243D2C]"
            }`}
          >
            <History className="w-4 h-4 text-[#DFB775]" />
            <span>Check Status &amp; Past History</span>
          </button>
        </div>
      </div>

      {bookingMode === "history" ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE5DC] shadow-sm">
            <span className="text-xs font-bold text-[#C58E47] uppercase tracking-wider block mb-1">
              Guest Booking Lookup
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#243D2C] mb-2">
              Check Approval Status &amp; Stay History
            </h2>
            <p className="text-xs sm:text-sm text-[#58685D] mb-6">
              Enter your National ID (NIC) or Passport number used during booking to see all your past &amp; upcoming reservations and whether Host Susantha has approved them.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLookupBookings();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <CreditCard className="w-4 h-4 text-[#C58E47] absolute left-4 top-3.5" />
                <input
                  type="text"
                  aria-label="NIC or Passport Number"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[#1F2923] font-mono focus:outline-hidden focus:border-[#C58E47]"
                />
              </div>
              <button
                type="submit"
                disabled={lookupLoading}
                className="px-6 py-3 rounded-xl bg-[#243D2C] hover:bg-[#192C1F] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 disabled:opacity-60"
              >
                <Search className="w-4 h-4 text-[#DFB775]" />
                <span>{lookupLoading ? "Searching..." : "Check Bookings"}</span>
              </button>
            </form>

            {lookupError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{lookupError}</span>
              </div>
            )}
          </div>

          {lookupSearched && (
            <div className="space-y-4">
              {lookupResults.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border border-[#EAE5DC]">
                  <History className="w-10 h-10 text-[#C58E47]/50 mx-auto mb-3" />
                  <h3 className="font-serif text-xl font-bold text-[#243D2C]">
                    No Bookings Found
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58685D] mt-1 max-w-md mx-auto">
                    We could not find any reservations matching <span className="font-mono font-bold text-[#243D2C]">{lookupQuery}</span>. Please double-check your NIC or Passport number.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                    <p className="text-xs sm:text-sm font-semibold text-[#243D2C]">
                      Found {lookupResults.length}{" "}
                      {lookupResults.length === 1 ? "reservation" : "reservations"} for{" "}
                      <span className="font-mono text-[#C58E47]">{lookupQuery.toUpperCase()}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => handleLookupBookings()}
                      className="text-xs font-bold text-[#243D2C] hover:text-[#C58E47] underline cursor-pointer"
                    >
                      Refresh Status
                    </button>
                  </div>

                  <div className="space-y-3">
                    {lookupResults.map((item) => {
                      const statusMeta =
                        item.status === "confirmed"
                          ? {
                              label: "Approved by Admin (Confirmed)",
                              cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
                              Icon: CheckCircle2,
                            }
                          : item.status === "pending"
                          ? {
                              label: "Pending Admin Approval",
                              cls: "bg-amber-50 text-amber-800 border-amber-200",
                              Icon: Clock,
                            }
                          : item.status === "completed"
                          ? {
                              label: "Completed Stay",
                              cls: "bg-slate-100 text-slate-700 border-slate-200",
                              Icon: Check,
                            }
                          : {
                              label: "Declined / Cancelled",
                              cls: "bg-red-50 text-red-800 border-red-200",
                              Icon: XCircle,
                            };

                      const StatusIcon = statusMeta.Icon;

                      return (
                        <div
                          key={item._id}
                          className="bg-white rounded-2xl border border-[#EAE5DC] p-5 shadow-xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE5DC]">
                            <div>
                              <span className="text-[11px] font-mono text-[#7B887E] block">
                                Ref #DBB-{item._id.slice(-6).toUpperCase()} • Submitted{" "}
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                              <h4 className="font-serif text-lg font-bold text-[#243D2C]">
                                {item.roomName}
                              </h4>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border self-start sm:self-center ${statusMeta.cls}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              <span>{statusMeta.label}</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="text-[11px] text-[#7B887E] block">Guest</span>
                              <span className="font-bold text-[#243D2C]">
                                {item.customerName}
                                {item.customerCountry ? ` (${item.customerCountry})` : ""}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] text-[#7B887E] block">Check-In → Check-Out</span>
                              <span className="font-semibold text-[#243D2C]">
                                {toVillaYMD(item.checkIn)} → {toVillaYMD(item.checkOut)}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] text-[#7B887E] block">Stay &amp; Guests</span>
                              <span className="font-semibold text-[#243D2C]">
                                {item.nights} {item.nights === 1 ? "night" : "nights"} • {item.guests}{" "}
                                {item.guests === 1 ? "guest" : "guests"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] text-[#7B887E] block">Total on Arrival</span>
                              <span className="font-bold text-[#C58E47] font-mono text-sm">
                                ${item.totalPrice}
                              </span>
                            </div>
                          </div>

                          {item.specialRequests && (
                            <p className="text-[11px] text-[#58685D] bg-[#FAF9F5] px-3 py-2 rounded-xl border border-[#EAE5DC]">
                              Note: {item.specialRequests}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Room Chooser, Dual Calendars, Guest Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-10 sm:space-y-12">
          {/* STEP 1: FLEXIBLE ROOM SELECTION (1 Double + 2 Triple Bedrooms) */}
          <section className="scroll-reveal">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-bold text-[#C58E47] uppercase tracking-wider">Step 1</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#243D2C]">
                  Choose Your Rooms
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {isEntireVilla && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C58E47] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    Entire Villa
                  </span>
                )}
                <span className="text-xs font-semibold text-[#243D2C] bg-[#FAF9F5] px-3 py-1 rounded-full border border-[#EAE5DC]">
                  {totalRoomsSelected} of 3 Rooms Selected
                </span>
              </div>
            </div>

            {/* Quick Combination Presets */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {[
                { label: "1 Double", d: 1, t: 0 },
                { label: "1 Triple", d: 0, t: 1 },
                { label: "2 Triple", d: 0, t: 2 },
                { label: "1 Double + 1 Triple", d: 1, t: 1 },
                { label: "Entire Villa (All 3 Rooms)", d: 1, t: 2 },
              ].map((preset) => {
                const active = doubleCount === preset.d && tripleCount === preset.t;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyRoomSelection(preset.d, preset.t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      active
                        ? "bg-[#243D2C] text-white border-[#243D2C] shadow-xs"
                        : "bg-white text-[#4F6154] border-[#EAE5DC] hover:border-[#C58E47] hover:text-[#243D2C]"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* 2 Room Type Cards with Quantity Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Double Bedroom Card (Max 1) */}
              <div
                className={`editorial-card rounded-[26px] p-4 sm:p-5 border-2 flex flex-col justify-between transition-all ${
                  doubleCount > 0
                    ? "bg-gradient-to-b from-[#FAF7F0] to-white border-[#243D2C] shadow-lg ring-4 ring-[#C58E47]/15"
                    : "bg-white border-[#E6DFD3] hover:border-[#DFB775]"
                }`}
              >
                <div>
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-3.5 bg-stone-200 ring-1 ring-black/5">
                    <Image
                      src={doubleMeta.image}
                      alt={doubleMeta.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 text-[#243D2C] text-[10px] font-bold uppercase tracking-wider">
                      1 Room Available
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/75 text-white text-[11px] font-bold border border-white/15">
                      {doubleMeta.priceLabel}
                      <span className="text-[9px] font-normal"> / night</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58E47]">
                      Sleeps up to 2 Guests
                    </span>
                    {doubleCount > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#243D2C] bg-[#243D2C]/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-[#243D2C]" />
                        <span>{doubleCount} Selected</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-base font-bold text-[#243D2C] mb-1">
                    Double Bedroom
                  </h4>
                  <p className="text-xs text-[#7B887E] line-clamp-2 leading-relaxed mb-3">
                    {doubleMeta.subtitle}
                  </p>

                  <div className="pt-3 border-t border-[#EAE5DC]/80 space-y-1 text-[11px] text-[#58685D] mb-4">
                    {doubleMeta.features.slice(0, 3).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 truncate">
                        <Check className="w-3 h-3 text-[#C58E47] flex-shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantity Counter */}
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DC] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#243D2C] block">Quantity</span>
                    <span className="text-[10px] text-[#7B887E]">Max 1 Double Bedroom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={doubleCount <= 0 || totalRoomsSelected <= 1}
                      onClick={() => applyRoomSelection(doubleCount - 1, tripleCount)}
                      className="w-8 h-8 rounded-lg bg-white border border-[#EAE5DC] flex items-center justify-center text-sm font-bold text-[#243D2C] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Decrease Double Bedroom count"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono text-sm font-bold text-[#243D2C]">
                      {doubleCount}
                    </span>
                    <button
                      type="button"
                      disabled={doubleCount >= MAX_DOUBLE_ROOMS}
                      onClick={() => applyRoomSelection(doubleCount + 1, tripleCount)}
                      className="w-8 h-8 rounded-lg bg-white border border-[#EAE5DC] flex items-center justify-center text-sm font-bold text-[#243D2C] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Increase Double Bedroom count"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Triple Bedroom Card (Max 2) */}
              <div
                className={`editorial-card rounded-[26px] p-4 sm:p-5 border-2 flex flex-col justify-between transition-all ${
                  tripleCount > 0
                    ? "bg-gradient-to-b from-[#FAF7F0] to-white border-[#243D2C] shadow-lg ring-4 ring-[#C58E47]/15"
                    : "bg-white border-[#E6DFD3] hover:border-[#DFB775]"
                }`}
              >
                <div>
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-3.5 bg-stone-200 ring-1 ring-black/5">
                    <Image
                      src={tripleMeta.image}
                      alt={tripleMeta.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 text-[#243D2C] text-[10px] font-bold uppercase tracking-wider">
                      2 Rooms Available
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/75 text-white text-[11px] font-bold border border-white/15">
                      {tripleMeta.priceLabel}
                      <span className="text-[9px] font-normal"> / room / night</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58E47]">
                      Sleeps up to 3 Guests / Room
                    </span>
                    {tripleCount > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#243D2C] bg-[#243D2C]/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-[#243D2C]" />
                        <span>{tripleCount} Selected</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-base font-bold text-[#243D2C] mb-1">
                    Triple Bedroom
                  </h4>
                  <p className="text-xs text-[#7B887E] line-clamp-2 leading-relaxed mb-3">
                    {tripleMeta.subtitle}
                  </p>

                  <div className="pt-3 border-t border-[#EAE5DC]/80 space-y-1 text-[11px] text-[#58685D] mb-4">
                    {tripleMeta.features.slice(0, 3).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 truncate">
                        <Check className="w-3 h-3 text-[#C58E47] flex-shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantity Counter */}
                <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#EAE5DC] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#243D2C] block">Quantity</span>
                    <span className="text-[10px] text-[#7B887E]">Max 2 Triple Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={tripleCount <= 0 || totalRoomsSelected <= 1}
                      onClick={() => applyRoomSelection(doubleCount, tripleCount - 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-[#EAE5DC] flex items-center justify-center text-sm font-bold text-[#243D2C] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Decrease Triple Bedroom count"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono text-sm font-bold text-[#243D2C]">
                      {tripleCount}
                    </span>
                    <button
                      type="button"
                      disabled={tripleCount >= MAX_TRIPLE_ROOMS}
                      onClick={() => applyRoomSelection(doubleCount, tripleCount + 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-[#EAE5DC] flex items-center justify-center text-sm font-bold text-[#243D2C] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Increase Triple Bedroom count"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Entire Villa Special Condition Banner */}
            {isEntireVilla && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#243D2C] to-[#1A2E21] text-white border border-[#DFB775]/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C58E47]/25 border border-[#DFB775]/40 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#DFB775]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#DFB775] block">
                      Entire Villa Exclusive Rate Applied
                    </span>
                    <p className="text-xs text-white/90">
                      All 3 rooms selected (1 Double + 2 Triple Bedrooms) — exclusive whole-property access for up to 10 guests at{" "}
                      <strong className="text-[#DFB775]">${roomRate}/night</strong>.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 border border-white/20 shrink-0 self-start sm:self-center">
                  3 / 3 Rooms
                </span>
              </div>
            )}
          </section>

          {/* STEP 2: DUAL CALENDARS SIDE-BY-SIDE (BIGGER & MORE SPACIOUS) */}
          <section ref={calendarSectionRef} className="scroll-reveal scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-bold text-[#C58E47] uppercase tracking-wider">Step 2</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#243D2C]">
                  Select Stay Dates ({selectionName})
                </h3>
                <p className="text-xs text-[#7B887E] mt-0.5">
                  {isEntireVilla
                    ? "Entire Villa • Requires all 3 bedrooms (1 Double + 2 Triple) to be available"
                    : `${totalRoomsSelected} ${totalRoomsSelected === 1 ? "room" : "rooms"} selected (${selectionName}) • Up to ${maxGuestsAllowed} guests`}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2923] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2923] mb-1.5">
                    Country / Nationality *
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#C58E47] absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      value={customerCountry}
                      onChange={(e) => setCustomerCountry(e.target.value)}
                      required
                      className="w-full bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                    >
                      <option value="" disabled>
                        Select your country...
                      </option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2923] mb-1.5">
                    National ID (NIC) or Passport Number *
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-[#C58E47] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={idOrPassport}
                      onChange={(e) => setIdOrPassport(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#1F2923] font-mono focus:outline-hidden focus:border-[#C58E47]"
                      required
                      minLength={5}
                    />
                  </div>
                  <span className="text-[10px] text-[#7B887E] mt-1 block">
                    Required for check-in registration &amp; tracking your approval status
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2923] mb-1.5">
                    Number of Guests *
                  </label>
                  <div className="bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#243D2C]">
                      <Users className="w-4 h-4 text-[#C58E47]" />
                      <span>
                        {guestCount} {guestCount === 1 ? "Guest" : "Guests"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-[#EAE5DC] flex items-center justify-center text-sm font-bold text-[#243D2C] hover:bg-gray-100 cursor-pointer"
                        aria-label="Decrease guest count"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.min(maxGuestsAllowed, guestCount + 1))}
                        disabled={guestCount >= maxGuestsAllowed}
                        className="w-8 h-8 rounded-lg bg-white border border-[#EAE5DC] flex items-center justify-center text-sm font-bold text-[#243D2C] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        aria-label="Increase guest count"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#7B887E] mt-1 block">
                    Total adults &amp; children in your group (1–{maxGuestsAllowed})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2923] mb-1.5">
                    WhatsApp / Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                    required
                  />
                  <span className="text-[10px] text-[#7B887E] mt-1 block">
                    Used by Susantha for WhatsApp confirmation &amp; station pickup
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2923] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-[#EAE5DC] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1F2923] focus:outline-hidden focus:border-[#C58E47]"
                    required
                  />
                  <span className="text-[10px] text-[#7B887E] mt-1 block">
                    Your booking receipt &amp; confirmation reference email
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
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#243D2C] to-[#1A2E21] hover:from-[#1A2E21] hover:to-[#112016] text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#243D2C]/25 flex items-center justify-center gap-2.5 hover:scale-101 active:scale-99 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#DFB775]" />
                      <span>
                        Submit Reservation Request • ${totalPrice}
                      </span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-[#7B887E] mt-2">
                  Requests enter as <strong className="text-[#243D2C]">Pending</strong> until approved by Host Susantha. Check anytime using your NIC / Passport number.
                </p>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Sticky Stay Summary Breakdown (4 Cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="editorial-card bg-white rounded-[28px] p-6 border border-[#E6DFD3]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C58E47] block mb-1">
              Reservation Summary
            </span>
            <h3 className="font-serif text-xl font-bold text-[#243D2C] mb-4">
              Your Highland Stay
            </h3>

            {/* Room Snapshot */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-gray-100">
              <Image
                src={
                  isEntireVilla
                    ? fullMeta.image
                    : doubleCount === 0
                    ? tripleMeta.image
                    : doubleMeta.image
                }
                alt={selectionName}
                fill
                className="object-cover"
              />
              {isEntireVilla && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#C58E47] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  Entire Villa
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-3.5">
                <div className="text-white">
                  <span className="text-xs font-bold block">{selectionName}</span>
                  <span className="text-[10px] text-white/80">
                    {totalRoomsSelected} {totalRoomsSelected === 1 ? "Room" : "Rooms"} • Up to {maxGuestsAllowed} Guests
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Rooms Breakdown */}
            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EAE5DC] mb-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#7B887E]">Booking Type:</span>
                <span className={`font-bold ${isEntireVilla ? "text-[#C58E47]" : "text-[#243D2C]"}`}>
                  {isEntireVilla ? "Entire Villa" : "Custom Room Selection"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7B887E]">Total Rooms:</span>
                <span className="font-bold text-[#243D2C]">
                  {totalRoomsSelected} {totalRoomsSelected === 1 ? "Room" : "Rooms"}
                  {doubleCount > 0 && tripleCount > 0
                    ? ` (${doubleCount}D + ${tripleCount}T)`
                    : ""}
                </span>
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
                  disabled={guestCount >= maxGuestsAllowed}
                  onClick={() => setGuestCount(Math.min(maxGuestsAllowed, guestCount + 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#EAE5DC] flex items-center justify-center text-xs font-bold text-[#243D2C] hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
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
      )}
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
