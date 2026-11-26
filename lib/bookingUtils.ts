export type RoomType = "double" | "triple" | "full" | "custom";

export const VILLA_TIMEZONE = "Asia/Colombo";
export const MAX_DOUBLE_ROOMS = 1;
export const MAX_TRIPLE_ROOMS = 2;
export const TOTAL_VILLA_ROOMS = MAX_DOUBLE_ROOMS + MAX_TRIPLE_ROOMS; // 3 rooms

export interface RoomSelection {
  doubleRooms: number;
  tripleRooms: number;
}

export function isValidRoomType(value: unknown): value is RoomType {
  return value === "double" || value === "triple" || value === "full" || value === "custom";
}

/**
 * Normalize legacy or explicit room counts into { doubleRooms, tripleRooms }
 * clamped to the villa's physical inventory (1 Double, 2 Triple).
 */
export function normalizeRoomCounts(input: {
  roomType?: string | null;
  doubleRooms?: unknown;
  tripleRooms?: unknown;
}): RoomSelection {
  const hasExplicitDouble =
    typeof input.doubleRooms === "number" && Number.isFinite(input.doubleRooms);
  const hasExplicitTriple =
    typeof input.tripleRooms === "number" && Number.isFinite(input.tripleRooms);

  if (hasExplicitDouble || hasExplicitTriple) {
    const d = Math.min(
      MAX_DOUBLE_ROOMS,
      Math.max(0, Math.floor(hasExplicitDouble ? (input.doubleRooms as number) : 0))
    );
    const t = Math.min(
      MAX_TRIPLE_ROOMS,
      Math.max(0, Math.floor(hasExplicitTriple ? (input.tripleRooms as number) : 0))
    );
    if (d + t > 0) {
      return { doubleRooms: d, tripleRooms: t };
    }
  }

  if (input.roomType === "full") {
    return { doubleRooms: MAX_DOUBLE_ROOMS, tripleRooms: MAX_TRIPLE_ROOMS };
  }
  if (input.roomType === "triple") {
    return { doubleRooms: 0, tripleRooms: 1 };
  }
  if (input.roomType === "custom") {
    return { doubleRooms: 1, tripleRooms: 1 };
  }
  return { doubleRooms: 1, tripleRooms: 0 };
}

export function isEntireVillaSelection(sel: RoomSelection): boolean {
  return sel.doubleRooms === MAX_DOUBLE_ROOMS && sel.tripleRooms === MAX_TRIPLE_ROOMS;
}

export function getTotalRoomCount(sel: RoomSelection): number {
  return sel.doubleRooms + sel.tripleRooms;
}

export function deriveRoomTypeFromSelection(sel: RoomSelection): RoomType {
  if (isEntireVillaSelection(sel)) return "full";
  if (sel.doubleRooms === 1 && sel.tripleRooms === 0) return "double";
  if (sel.doubleRooms === 0 && sel.tripleRooms === 1) return "triple";
  return "custom";
}

export function formatRoomSelectionName(sel: RoomSelection): string {
  if (isEntireVillaSelection(sel)) {
    return "Entire Villa";
  }
  const parts: string[] = [];
  if (sel.doubleRooms > 0) {
    parts.push(`${sel.doubleRooms} Double ${sel.doubleRooms === 1 ? "Bedroom" : "Bedrooms"}`);
  }
  if (sel.tripleRooms > 0) {
    parts.push(`${sel.tripleRooms} Triple ${sel.tripleRooms === 1 ? "Bedroom" : "Bedrooms"}`);
  }
  return parts.length > 0 ? parts.join(" + ") : "1 Double Bedroom";
}

export function getMaxGuestsForSelection(sel: RoomSelection): number {
  if (isEntireVillaSelection(sel)) return 10;
  return Math.max(1, sel.doubleRooms * 2 + sel.tripleRooms * 3);
}

export function calculateNightlyRate(
  sel: RoomSelection,
  prices: { doublePrice: number; triplePrice: number; fullPrice: number }
): number {
  if (isEntireVillaSelection(sel)) {
    return prices.fullPrice;
  }
  return sel.doubleRooms * prices.doublePrice + sel.tripleRooms * prices.triplePrice;
}

/**
 * Legacy room conflict helper (retained for compatibility).
 */
export function getConflictingRoomTypes(requestedRoom: RoomType): RoomType[] {
  if (requestedRoom === "double") {
    return ["double", "full", "custom"];
  }
  if (requestedRoom === "triple") {
    return ["triple", "full", "custom"];
  }
  return ["double", "triple", "full", "custom"];
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

export interface OccupiedRangeLike {
  checkIn?: Date | string;
  checkOut?: Date | string;
  checkInYMD?: string;
  checkOutYMD?: string;
  roomType?: string;
  doubleRooms?: number;
  tripleRooms?: number;
}

/**
 * Compute how many Double and Triple bedrooms are already occupied on a specific night YYYY-MM-DD.
 */
export function getUsedRoomsOnNight(
  nightYMD: string,
  ranges: OccupiedRangeLike[]
): RoomSelection {
  let doubleRooms = 0;
  let tripleRooms = 0;
  for (const r of ranges) {
    const startYMD = r.checkInYMD || (r.checkIn ? toVillaYMD(r.checkIn) : "");
    const endYMD = r.checkOutYMD || (r.checkOut ? toVillaYMD(r.checkOut) : "");
    if (!startYMD || !endYMD) continue;
    if (isNightInRangeYMD(nightYMD, startYMD, endYMD)) {
      const counts = normalizeRoomCounts({
        roomType: r.roomType,
        doubleRooms: r.doubleRooms,
        tripleRooms: r.tripleRooms,
      });
      doubleRooms += counts.doubleRooms;
      tripleRooms += counts.tripleRooms;
    }
  }
  return { doubleRooms, tripleRooms };
}

/**
 * Check whether a requested room selection fits within remaining villa capacity
 * across every night of [checkInYMD, checkOutYMD).
 */
export function hasCapacityConflictYMD<T extends OccupiedRangeLike>(params: {
  requested: RoomSelection;
  checkInYMD: string;
  checkOutYMD: string;
  ranges: T[];
}): T | null {
  const { requested, checkInYMD, checkOutYMD, ranges } = params;
  const overlapping = ranges.filter((r) => {
    const startYMD = r.checkInYMD || (r.checkIn ? toVillaYMD(r.checkIn) : "");
    const endYMD = r.checkOutYMD || (r.checkOut ? toVillaYMD(r.checkOut) : "");
    return Boolean(startYMD && endYMD && rangesOverlapYMD(checkInYMD, checkOutYMD, startYMD, endYMD));
  });

  if (overlapping.length === 0) return null;

  const checkPoints = new Set<string>([checkInYMD]);
  for (const r of overlapping) {
    const startYMD = r.checkInYMD || (r.checkIn ? toVillaYMD(r.checkIn) : "");
    if (startYMD > checkInYMD && startYMD < checkOutYMD) {
      checkPoints.add(startYMD);
    }
  }

  for (const point of checkPoints) {
    let usedDouble = 0;
    let usedTriple = 0;
    let firstBlocker: T | null = null;

    for (const r of overlapping) {
      const startYMD = r.checkInYMD || (r.checkIn ? toVillaYMD(r.checkIn) : "");
      const endYMD = r.checkOutYMD || (r.checkOut ? toVillaYMD(r.checkOut) : "");
      if (!isNightInRangeYMD(point, startYMD, endYMD)) continue;

      const counts = normalizeRoomCounts({
        roomType: r.roomType,
        doubleRooms: r.doubleRooms,
        tripleRooms: r.tripleRooms,
      });
      usedDouble += counts.doubleRooms;
      usedTriple += counts.tripleRooms;
      if (
        !firstBlocker &&
        ((requested.doubleRooms > 0 && counts.doubleRooms > 0) ||
          (requested.tripleRooms > 0 && counts.tripleRooms > 0))
      ) {
        firstBlocker = r;
      }
    }

    if (
      usedDouble + requested.doubleRooms > MAX_DOUBLE_ROOMS ||
      usedTriple + requested.tripleRooms > MAX_TRIPLE_ROOMS
    ) {
      return firstBlocker || overlapping[0];
    }
  }

  return null;
}

export function getDefaultRoomMeta(roomType: RoomType): { name: string; pricePerNight: number } {
  if (roomType === "triple") {
    return { name: "Triple Room with Private Bathroom", pricePerNight: 23 };
  }
  if (roomType === "full") {
    return { name: "Entire Villa", pricePerNight: 65 };
  }
  if (roomType === "custom") {
    return { name: "Custom Room Combination", pricePerNight: 43 };
  }
  return { name: "Double Room with Mountain View", pricePerNight: 20 };
}
