import mongoose from "mongoose";
import Booking from "@/models/Booking";
import {
  RoomSelection,
  RoomType,
  hasCapacityConflictYMD,
  isEntireVillaSelection,
  normalizeRoomCounts,
  parseBookingDateToUtcNoon,
  toVillaYMD,
} from "@/lib/bookingUtils";

// In-process async mutex chain to prevent concurrent reservation race conditions
let bookingWriteQueue: Promise<unknown> = Promise.resolve();

export async function withBookingLock<T>(task: () => Promise<T>): Promise<T> {
  const previous = bookingWriteQueue;
  let release!: () => void;
  bookingWriteQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => {});
  try {
    return await task();
  } finally {
    release();
  }
}

export interface ConflictDetail {
  _id: string;
  customerName: string;
  roomType: string;
  roomName: string;
  doubleRooms: number;
  tripleRooms: number;
  status: string;
  checkInYMD: string;
  checkOutYMD: string;
  createdAt?: Date;
}

/**
 * Find any active (pending or confirmed) booking combination that exceeds remaining
 * villa capacity (1 Double Bedroom, 2 Triple Bedrooms) during [checkInYMD, checkOutYMD).
 */
export async function findConflictingBooking(params: {
  roomType?: RoomType;
  selection?: RoomSelection;
  checkInYMD: string;
  checkOutYMD: string;
  excludeBookingId?: string;
}): Promise<ConflictDetail | null> {
  const { roomType, selection, checkInYMD, checkOutYMD, excludeBookingId } = params;
  const parsedIn = parseBookingDateToUtcNoon(checkInYMD);
  const parsedOut = parseBookingDateToUtcNoon(checkOutYMD);
  if (!parsedIn || !parsedOut) return null;

  const requested = selection || normalizeRoomCounts({ roomType });
  const oneDayMs = 24 * 60 * 60 * 1000;

  const query: Record<string, unknown> = {
    status: { $in: ["confirmed", "pending"] },
    checkIn: { $lt: new Date(parsedOut.date.getTime() + oneDayMs) },
    checkOut: { $gt: new Date(parsedIn.date.getTime() - oneDayMs) },
  };

  if (excludeBookingId && mongoose.Types.ObjectId.isValid(excludeBookingId)) {
    query._id = { $ne: new mongoose.Types.ObjectId(excludeBookingId) };
  }

  const candidates = await Booking.find(
    query,
    "_id customerName roomType roomName doubleRooms tripleRooms status checkIn checkOut createdAt"
  )
    .sort({ createdAt: 1 })
    .lean()
    .exec();

  const normalizedCandidates = candidates
    .map((doc) => {
      const existingInYMD = toVillaYMD(doc.checkIn as Date);
      const existingOutYMD = toVillaYMD(doc.checkOut as Date);
      const counts = normalizeRoomCounts({
        roomType: String(doc.roomType || "double"),
        doubleRooms: doc.doubleRooms,
        tripleRooms: doc.tripleRooms,
      });
      return {
        _id: String(doc._id),
        customerName: String(doc.customerName || "Guest"),
        roomType: String(doc.roomType),
        roomName: String(doc.roomName || doc.roomType),
        doubleRooms: counts.doubleRooms,
        tripleRooms: counts.tripleRooms,
        status: String(doc.status),
        checkInYMD: existingInYMD,
        checkOutYMD: existingOutYMD,
        createdAt: doc.createdAt ? new Date(doc.createdAt as Date) : undefined,
      };
    })
    .filter((c) => Boolean(c.checkInYMD && c.checkOutYMD));

  return hasCapacityConflictYMD({
    requested,
    checkInYMD,
    checkOutYMD,
    ranges: normalizedCandidates,
  });
}

export function buildConflictMessage(
  requested: RoomType | RoomSelection,
  conflict: ConflictDetail,
  includeDetails: boolean
): string {
  if (includeDetails) {
    return `Dates overlap with ${conflict.customerName}'s ${conflict.status} booking (${conflict.roomName}: ${conflict.checkInYMD} to ${conflict.checkOutYMD}).`;
  }
  const isFull =
    typeof requested === "string"
      ? requested === "full"
      : isEntireVillaSelection(requested);
  return isFull
    ? "The villa already has rooms reserved during these dates. Please choose other dates."
    : "One or more of your selected rooms are already reserved for these dates. Please adjust your room selection or dates.";
}
