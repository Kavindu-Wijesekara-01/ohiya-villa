"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Plus,
  Phone,
  Mail,
  CreditCard,
  MessageCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  MAX_TRIPLE_ROOMS,
  RoomType,
  getDefaultRoomMeta,
  isNightInRangeYMD,
  normalizeRoomCounts,
  toVillaYMD,
} from "@/lib/bookingUtils";

export interface AdminCalendarBooking {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCountry?: string;
  idOrPassport?: string;
  specialRequests?: string;
  roomType: string;
  roomName: string;
  doubleRooms?: number;
  tripleRooms?: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

interface AdminRoomConfig {
  roomId: CalendarUnitId;
  roomNumber?: string;
  name: string;
  pricePerNight: number;
}

interface AdminRoomCalendarsProps {
  bookings: AdminCalendarBooking[];
  rooms: Array<{
    roomId?: string;
    roomNumber?: string;
    name?: string;
    pricePerNight?: number;
  }>;
  onQuickBook: (roomType: RoomType, checkInYMD?: string) => void;
  onUpdateStatus: (id: string, status: "confirmed" | "cancelled") => Promise<void> | void;
}

interface DayStatusInfo {
  kind: "available" | "confirmed" | "pending" | "conflict-confirmed" | "conflict-pending";
  booking: AdminCalendarBooking | null;
}

type CalendarUnitId = "double" | "triple" | "full";
const ROOM_IDS: CalendarUnitId[] = ["double", "triple", "full"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatYMD(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export default function AdminRoomCalendars({
  bookings,
  rooms,
  onQuickBook,
  onUpdateStatus,
}: AdminRoomCalendarsProps) {
  const now = useMemo(() => new Date(), []);
  const todayYMD = useMemo(() => toVillaYMD(now), [now]);

  const [viewMonth, setViewMonth] = useState<Date>(
    () => new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [selectedDates, setSelectedDates] = useState<Record<CalendarUnitId, string>>({
    double: "",
    triple: "",
    full: "",
  });
  const [listFilterByRoom, setListFilterByRoom] = useState<
    Record<CalendarUnitId, "confirmed" | "pending">
  >({
    double: "confirmed",
    triple: "confirmed",
    full: "confirmed",
  });

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIdx = new Date(year, month, 1).getDay();
  const monthLabel = viewMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Only active bookings affect live room availability (never cancelled/completed)
  const activeBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "confirmed" || b.status === "pending")
        .map((b) => ({
          ...b,
          inYMD: toVillaYMD(b.checkIn),
          outYMD: toVillaYMD(b.checkOut),
        }))
        .filter((b) => b.inYMD && b.outYMD),
    [bookings]
  );

  const roomConfigs: AdminRoomConfig[] = useMemo(
    () =>
      ROOM_IDS.map((roomId, idx) => {
        const dyn = rooms.find((r) => r.roomId === roomId);
        const fb = getDefaultRoomMeta(roomId);
        return {
          roomId,
          roomNumber: dyn?.roomNumber || (roomId === "full" ? "WHOLE VILLA" : `ROOM 0${idx + 1}`),
          name: dyn?.name || fb.name,
          pricePerNight:
            dyn && typeof dyn.pricePerNight === "number" ? dyn.pricePerNight : fb.pricePerNight,
        };
      }),
    [rooms]
  );

  const getDayStatus = (roomId: RoomType, dateYMD: string): DayStatusInfo => {
    const onDate = activeBookings.filter((b) =>
      isNightInRangeYMD(dateYMD, b.inYMD, b.outYMD)
    );

    const matching = onDate.filter((b) => {
      const counts = normalizeRoomCounts({
        roomType: b.roomType,
        doubleRooms: b.doubleRooms,
        tripleRooms: b.tripleRooms,
      });
      if (roomId === "double") return counts.doubleRooms > 0;
      if (roomId === "triple") return counts.tripleRooms > 0;
      return counts.doubleRooms > 0 || counts.tripleRooms > 0;
    });

    if (roomId === "triple") {
      const tripleUsed = matching.reduce(
        (sum, b) =>
          sum +
          normalizeRoomCounts({
            roomType: b.roomType,
            doubleRooms: b.doubleRooms,
            tripleRooms: b.tripleRooms,
          }).tripleRooms,
        0
      );
      if (tripleUsed >= MAX_TRIPLE_ROOMS) {
        const directConfirmed = matching.find(
          (b) => (b.roomType === "triple" || b.roomType === "custom") && b.status === "confirmed"
        );
        if (directConfirmed) return { kind: "confirmed", booking: directConfirmed };
        const directPending = matching.find(
          (b) => (b.roomType === "triple" || b.roomType === "custom") && b.status === "pending"
        );
        if (directPending) return { kind: "pending", booking: directPending };
        const conflictConfirmed = matching.find((b) => b.status === "confirmed");
        if (conflictConfirmed) return { kind: "conflict-confirmed", booking: conflictConfirmed };
        const conflictPending = matching.find((b) => b.status === "pending");
        if (conflictPending) return { kind: "conflict-pending", booking: conflictPending };
      } else if (tripleUsed > 0) {
        // 1 of 2 triple rooms occupied -> show as pending/partial hold so admin knows 1 triple remains
        const holder = matching[0];
        return {
          kind: holder.status === "confirmed" ? "conflict-confirmed" : "conflict-pending",
          booking: holder,
        };
      }
      return { kind: "available", booking: null };
    }

    // Prioritize direct confirmed > direct pending > shared conflict confirmed > shared conflict pending
    const directConfirmed = matching.find(
      (b) => (b.roomType === roomId || (roomId === "double" && b.roomType === "custom")) && b.status === "confirmed"
    );
    if (directConfirmed) return { kind: "confirmed", booking: directConfirmed };

    const directPending = matching.find(
      (b) => (b.roomType === roomId || (roomId === "double" && b.roomType === "custom")) && b.status === "pending"
    );
    if (directPending) return { kind: "pending", booking: directPending };

    const conflictConfirmed = matching.find((b) => b.status === "confirmed");
    if (conflictConfirmed) return { kind: "conflict-confirmed", booking: conflictConfirmed };

    const conflictPending = matching.find((b) => b.status === "pending");
    if (conflictPending) return { kind: "conflict-pending", booking: conflictPending };

    return { kind: "available", booking: null };
  };

  return (
    <section aria-label="Room Availability Calendars" className="space-y-4">
      {/* Section Header + Clean Month Switcher & Legend */}
      <div className="bg-white rounded-2xl border border-[#EAE5DC] p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#243D2C] leading-tight">
              Room Availability Calendars
            </h3>
            <p className="text-xs text-[#7B887E] mt-0.5">
              Separate live schedule per unit with anti-overlap protection
            </p>
          </div>

          {/* Concise Professional Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#4F6154]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#1E5E3F] inline-block" />
              <span>Confirmed</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-500 inline-block" />
              <span>Pending</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 border border-slate-400 inline-block" />
              <span>Blocked (Overlap)</span>
            </span>
          </div>
        </div>

        {/* Month Navigation + Quick Manual Booking */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
          <div className="inline-flex items-center bg-[#F8F9F7] border border-[#EAE5DC] rounded-xl p-1">
            <button
              type="button"
              onClick={() => setViewMonth(new Date(year, month - 1, 1))}
              className="p-1.5 rounded-lg hover:bg-white text-[#243D2C] transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 sm:px-3 text-xs font-bold text-[#243D2C] min-w-[116px] text-center">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={() => setViewMonth(new Date(year, month + 1, 1))}
              className="p-1.5 rounded-lg hover:bg-white text-[#243D2C] transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1))}
            className="px-3 py-2 rounded-xl bg-[#F8F9F7] hover:bg-gray-100 border border-[#EAE5DC] text-xs font-semibold text-[#4F6154] transition-colors"
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => onQuickBook("double")}
            className="px-3.5 py-2 rounded-xl bg-[#243D2C] hover:bg-[#192C1F] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#DFB775]" />
            <span>Manual Booking</span>
          </button>
        </div>
      </div>

      {/* 3 Separate Room Calendars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {roomConfigs.map((room) => {
          const directConfirmedList = activeBookings.filter(
            (b) => b.roomType === room.roomId && b.status === "confirmed"
          );
          const directPendingList = activeBookings.filter(
            (b) => b.roomType === room.roomId && b.status === "pending"
          );
          const listTab = listFilterByRoom[room.roomId];
          const visibleList = listTab === "confirmed" ? directConfirmedList : directPendingList;

          const selectedYMD = selectedDates[room.roomId];
          const selectedInfo = selectedYMD ? getDayStatus(room.roomId, selectedYMD) : null;

          return (
            <div
              key={room.roomId}
              className="bg-white rounded-2xl border border-[#EAE5DC] shadow-xs flex flex-col justify-between overflow-hidden min-w-0"
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 border-b border-[#EAE5DC] bg-[#FAF9F5]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#243D2C] text-white">
                    {room.roomNumber}
                  </span>
                  <span className="text-xs font-bold text-[#243D2C]">
                    ${room.pricePerNight}
                    <span className="text-[11px] font-normal text-[#7B887E]">/night</span>
                  </span>
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#1F2923] truncate">
                  {room.name}
                </h4>

                {/* Clean Status Counts */}
                <div className="flex items-center gap-3 mt-2.5 text-[11px] font-semibold">
                  <span className="text-[#1E5E3F]">
                    Confirmed: {directConfirmedList.length}
                  </span>
                  <span className="text-[#EAE5DC]">•</span>
                  <span className="text-amber-700">
                    Pending: {directPendingList.length}
                  </span>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-3.5 sm:p-4">
                <div className="grid grid-cols-7 gap-1 mb-1.5">
                  {WEEKDAYS.map((wd) => (
                    <div
                      key={wd}
                      className="text-center text-[10px] font-bold uppercase tracking-wider text-[#7B887E] py-1"
                    >
                      {wd}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayIdx }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="h-9 sm:h-9" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const dateYMD = formatYMD(year, month, day);
                    const info = getDayStatus(room.roomId, dateYMD);
                    const isToday = dateYMD === todayYMD;
                    const isPast = dateYMD < todayYMD;
                    const isSelected = selectedYMD === dateYMD;

                    let cellClass =
                      "bg-white text-[#1F2923] hover:bg-[#F2EFE9] border border-transparent";

                    if (info.kind === "confirmed") {
                      cellClass =
                        "bg-[#1E5E3F] text-white font-bold hover:bg-[#164A31] border border-[#1E5E3F]";
                    } else if (info.kind === "pending") {
                      cellClass =
                        "bg-amber-100 text-amber-900 font-bold border border-amber-400 hover:bg-amber-200/80";
                    } else if (info.kind === "conflict-confirmed") {
                      cellClass =
                        "bg-slate-200/90 text-slate-700 font-semibold border border-slate-300 hover:bg-slate-300/70";
                    } else if (info.kind === "conflict-pending") {
                      cellClass =
                        "bg-stone-100 text-stone-700 font-semibold border border-dashed border-amber-400 hover:bg-stone-200/70";
                    } else if (isPast) {
                      cellClass = "bg-white text-[#7B887E]/55 hover:bg-gray-50";
                    }

                    return (
                      <button
                        key={dateYMD}
                        type="button"
                        onClick={() =>
                          setSelectedDates((prev) => ({
                            ...prev,
                            [room.roomId]: prev[room.roomId] === dateYMD ? "" : dateYMD,
                          }))
                        }
                        title={
                          info.booking
                            ? `${info.booking.customerName} (${info.booking.status} - ${info.booking.roomName})`
                            : `${dateYMD} • Available`
                        }
                        className={`relative h-9 rounded-lg text-xs flex flex-col items-center justify-center transition-all ${cellClass} ${
                          isSelected ? "ring-2 ring-[#C58E47] ring-offset-1" : ""
                        } ${isToday && !isSelected ? "underline decoration-[#C58E47] decoration-2 underline-offset-2" : ""}`}
                      >
                        <span>{day}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Date Quick Detail Panel */}
                {selectedYMD && selectedInfo && (
                  <div className="mt-3 p-3 rounded-xl bg-[#F8F9F7] border border-[#EAE5DC] text-xs">
                    {selectedInfo.booking ? (
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-[#243D2C] truncate">
                              {selectedInfo.booking.customerName}
                              {selectedInfo.booking.customerCountry
                                ? ` (${selectedInfo.booking.customerCountry})`
                                : ""}
                            </p>
                            <p className="text-[11px] text-[#7B887E]">
                              {toVillaYMD(selectedInfo.booking.checkIn)} to{" "}
                              {toVillaYMD(selectedInfo.booking.checkOut)} ({selectedInfo.booking.nights}n •{" "}
                              {selectedInfo.booking.guests} guests)
                            </p>
                            {selectedInfo.booking.idOrPassport && (
                              <p className="text-[11px] font-mono text-[#4F6154] flex items-center gap-1 mt-0.5">
                                <CreditCard className="w-3 h-3 text-[#C58E47]" />
                                <span>{selectedInfo.booking.idOrPassport}</span>
                              </p>
                            )}
                            {selectedInfo.booking.customerEmail && (
                              <p className="text-[11px] text-[#4F6154] flex items-center gap-1 mt-0.5 truncate">
                                <Mail className="w-3 h-3 text-[#C58E47] shrink-0" />
                                <span className="truncate">{selectedInfo.booking.customerEmail}</span>
                              </p>
                            )}
                            {(selectedInfo.kind === "conflict-confirmed" ||
                              selectedInfo.kind === "conflict-pending") && (
                              <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                                Held via {selectedInfo.booking.roomName}
                              </p>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                              selectedInfo.booking.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {selectedInfo.booking.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-[#EAE5DC]">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <a
                              href={`tel:${selectedInfo.booking.customerPhone.replace(/[^0-9+]/g, "")}`}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#243D2C] hover:underline"
                            >
                              <Phone className="w-3 h-3 text-[#C58E47]" />
                              <span>{selectedInfo.booking.customerPhone}</span>
                            </a>
                            <a
                              href={`https://wa.me/${selectedInfo.booking.customerPhone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </div>

                          {selectedInfo.booking.status === "pending" && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateStatus(selectedInfo.booking!._id, "confirmed")
                                }
                                className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold inline-flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Confirm</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateStatus(selectedInfo.booking!._id, "cancelled")
                                }
                                className="px-2 py-1 rounded-md bg-white hover:bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold inline-flex items-center gap-1"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-[#243D2C] block">{selectedYMD}</span>
                          <span className="text-[11px] text-[#7B887E]">
                            {selectedYMD < todayYMD ? "Past date" : "Available for booking"}
                          </span>
                        </div>
                        {selectedYMD >= todayYMD && (
                          <button
                            type="button"
                            onClick={() => onQuickBook(room.roomId, selectedYMD)}
                            className="px-3 py-1.5 rounded-lg bg-[#243D2C] hover:bg-[#192C1F] text-white text-[11px] font-bold inline-flex items-center gap-1 shrink-0"
                          >
                            <Plus className="w-3 h-3 text-[#DFB775]" />
                            <span>Book Date</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Separate Confirmed / Pending Reservation List per Room */}
              <div className="border-t border-[#EAE5DC] bg-[#FAF9F5]/60 p-3.5 sm:p-4">
                <div className="grid grid-cols-2 gap-1.5 bg-[#F2EFE9] p-1 rounded-xl mb-3">
                  <button
                    type="button"
                    onClick={() =>
                      setListFilterByRoom((prev) => ({ ...prev, [room.roomId]: "confirmed" }))
                    }
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                      listTab === "confirmed"
                        ? "bg-white text-[#1E5E3F] shadow-2xs"
                        : "text-[#7B887E] hover:text-[#1F2923]"
                    }`}
                  >
                    Booked ({directConfirmedList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setListFilterByRoom((prev) => ({ ...prev, [room.roomId]: "pending" }))
                    }
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                      listTab === "pending"
                        ? "bg-white text-amber-800 shadow-2xs"
                        : "text-[#7B887E] hover:text-[#1F2923]"
                    }`}
                  >
                    Pending ({directPendingList.length})
                  </button>
                </div>

                {visibleList.length === 0 ? (
                  <div className="py-3 text-center text-[11px] text-[#7B887E] flex items-center justify-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 opacity-60" />
                    <span>
                      No {listTab === "confirmed" ? "booked" : "pending"} dates for this unit
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-0.5">
                    {visibleList.map((b) => (
                      <div
                        key={b._id}
                        className="p-2.5 rounded-xl bg-white border border-[#EAE5DC] flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-[#1F2923] truncate">{b.customerName}</p>
                          <p className="text-[11px] text-[#7B887E]">
                            {toVillaYMD(b.checkIn)} → {toVillaYMD(b.checkOut)}
                          </p>
                        </div>

                        {b.status === "pending" ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(b._id, "confirmed")}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              title="Confirm Booking"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(b._id, "cancelled")}
                              className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-bold text-[#1E5E3F] shrink-0">
                            ${b.totalPrice}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
