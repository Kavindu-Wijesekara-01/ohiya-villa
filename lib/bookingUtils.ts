export type RoomType = "double" | "triple" | "full";

export const VILLA_TIMEZONE = "Asia/Colombo";

export function isValidRoomType(value: unknown): value is RoomType {
  return value === "double" || value === "triple" || value === "full";
}

/**
 * Intelligent room conflict resolver:
 * - 'double' conflicts with other 'double' bookings AND 'full' villa bookings.
 * - 'triple' conflicts with other 'triple' bookings AND 'full' villa bookings.
 * - 'full' conflicts with ANY room booking ('double', 'triple', or 'full').
 */
export function getConflictingRoomTypes(requestedRoom: RoomType): RoomType[] {
  if (requestedRoom === "double") {
    return ["double", "full"];
  }
  if (requestedRoom === "triple") {
    return ["triple", "full"];
  }
  return ["double", "triple", "full"];
}

const villaYmdFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: VILLA_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Convert any Date or ISO string into a YYYY-MM-DD string in the villa's local timezone (Asia/Colombo).
 * If already a bare YYYY-MM-DD string, returns it as-is.
 */
export function toVillaYMD(input: Date | string): string {
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
  }
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) return "";
  return villaYmdFormatter.format(date);
}

/**
 * Format a local browser Date (year, month, day) into YYYY-MM-DD without UTC shifting.
 */
export function formatLocalDateYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Parse a YYYY-MM-DD string (or Date/ISO string) into a canonical UTC Noon Date (12:00:00.000Z).
 * UTC Noon ensures the calendar date matches across every timezone from UTC-11 to UTC+11.
 */
export function parseBookingDateToUtcNoon(input: Date | string): { date: Date; ymd: string } | null {
  const ymd = toVillaYMD(input);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
  if (isNaN(date.getTime())) return null;
  return { date, ymd };
}

/**
 * Calculate nights between two YYYY-MM-DD calendar dates.
 */
export function calculateNightsYMD(checkInYMD: string, checkOutYMD: string): number {
  const [y1, m1, d1] = checkInYMD.split("-").map(Number);
  const [y2, m2, d2] = checkOutYMD.split("-").map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

/**
 * Exact half-open interval overlap check for calendar dates [checkIn, checkOut).
 * Allows same-day check-out and check-in (e.g., Guest A out Nov 28, Guest B in Nov 28).
 */
export function rangesOverlapYMD(
  aInYMD: string,
  aOutYMD: string,
  bInYMD: string,
  bOutYMD: string
): boolean {
  return aInYMD < bOutYMD && aOutYMD > bInYMD;
}

/**
 * Check if a specific calendar night YYYY-MM-DD falls inside an occupied range [checkInYMD, checkOutYMD).
 */
export function isNightInRangeYMD(
  nightYMD: string,
  rangeInYMD: string,
  rangeOutYMD: string
): boolean {
  return nightYMD >= rangeInYMD && nightYMD < rangeOutYMD;
}

export function getDefaultRoomMeta(roomType: RoomType): { name: string; pricePerNight: number } {
  if (roomType === "triple") {
    return { name: "Triple Room with Private Bathroom", pricePerNight: 23 };
  }
  if (roomType === "full") {
    return { name: "Full Bungalow Exclusive Stay", pricePerNight: 65 };
  }
  return { name: "Double Room with Mountain View", pricePerNight: 20 };
}
