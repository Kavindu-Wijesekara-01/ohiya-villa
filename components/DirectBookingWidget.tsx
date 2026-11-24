"use client";

import { useState } from "react";
import { Calendar, Users, Home, MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";

export default function DirectBookingWidget() {
  const [roomType, setRoomType] = useState<"double" | "triple" | "full">("double");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const roomDetails = {
    double: {
      name: "Double Room",
      rate: "$20 / night",
      capacity: "1-2 Guests",
      features: "Private Balcony, Mountain View, En-suite Hot Water",
    },
    triple: {
      name: "Triple Room",
      rate: "$23 / night",
      capacity: "2-3 Guests",
      features: "Spacious Layout, Landmark View, En-suite Hot Water",
    },
    full: {
      name: "Full Bungalow Stay",
      rate: "Custom Group Rate",
      capacity: "Up to 8-10 Guests",
      features: "All 3 Bedrooms Exclusive, Kitchen, Garden, Parking",
    },
  };

  const getWhatsAppMessage = () => {
    const selected = roomDetails[roomType].name;
    const checkInText = checkIn ? `Check-in: ${checkIn}` : "Check-in: [Flexible]";
    const checkOutText = checkOut ? `Check-out: ${checkOut}` : "Check-out: [Flexible]";
    return encodeURIComponent(
      `Hello Susantha, I would like to check availability at Dawn Breezy Bungalow, Ohiya:\n• Room: ${selected}\n• ${checkInText}\n• ${checkOutText}\n• Guests: ${guests}\n\nPlease share your direct booking rate and confirmation.`
    );
  };

  return (
    <div className="reveal-init bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E6E3] shadow-lg -mt-10 relative z-20 max-w-5xl mx-auto mb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C58E47]">
            Direct Concierge
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#243D2C]">
            Instant WhatsApp Availability &amp; Rate Inquiry
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#243D2C] bg-[#F8F9F7] px-3.5 py-1.5 rounded-full border border-[#E2E6E3]">
          <Sparkles className="w-3.5 h-3.5 text-[#C58E47]" />
          <span>Pay at Property • No Prepayment</span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          window.open(
            `https://wa.me/94714194368?text=${getWhatsAppMessage()}`,
            "_blank",
            "noopener,noreferrer"
          );
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
      >
        {/* Room Type Selector */}
        <div>
          <label htmlFor="room-select" className="block text-xs font-bold text-[#1F2923] mb-1.5">
            Select Accommodation
          </label>
          <div className="relative">
            <select
              id="room-select"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as any)}
              className="w-full bg-[#F8F9F7] border border-[#E2E6E3] rounded-xl px-3.5 py-3 text-xs sm:text-sm font-semibold text-[#1F2923] focus:outline-hidden focus:ring-2 focus:ring-[#243D2C]"
            >
              <option value="double">Double Room ($20)</option>
              <option value="triple">Triple Room ($23)</option>
              <option value="full">Full Bungalow (Custom Rate)</option>
            </select>
          </div>
        </div>

        {/* Check-In Date */}
        <div>
          <label htmlFor="check-in-date" className="block text-xs font-bold text-[#1F2923] mb-1.5">
            Check-in Date
          </label>
          <input
            id="check-in-date"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-[#F8F9F7] border border-[#E2E6E3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1F2923] focus:outline-hidden focus:ring-2 focus:ring-[#243D2C]"
          />
        </div>

        {/* Check-Out Date */}
        <div>
          <label htmlFor="check-out-date" className="block text-xs font-bold text-[#1F2923] mb-1.5">
            Check-out Date
          </label>
          <input
            id="check-out-date"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-[#F8F9F7] border border-[#E2E6E3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1F2923] focus:outline-hidden focus:ring-2 focus:ring-[#243D2C]"
          />
        </div>

        {/* Submit to WhatsApp Button */}
        <div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#243D2C] hover:bg-[#192C1F] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 border border-[#243D2C] hover:border-[#C58E47]"
          >
            <MessageCircle className="w-4 h-4 fill-current text-[#C58E47]" />
            <span>Check Availability</span>
          </button>
        </div>
      </form>

      {/* Selected Room Snapshot note */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-[#7B887E] border-t border-gray-100 gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#C58E47]" />
          <span>
            <strong>{roomDetails[roomType].name}:</strong> {roomDetails[roomType].features}
          </span>
        </div>
        <span className="font-semibold text-[#243D2C]">
          Estimated Direct Rate: {roomDetails[roomType].rate}
        </span>
      </div>
    </div>
  );
}
