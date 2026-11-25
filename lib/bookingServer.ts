import mongoose from "mongoose";
import Booking from "@/models/Booking";
import {
  RoomType,
  getConflictingRoomTypes,
  parseBookingDateToUtcNoon,
  rangesOverlapYMD,
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
  status: string;
  checkInYMD: string;
  checkOutYMD: string;
  createdAt?: Date;
}

/**
 * Find any active (pending or confirmed) booking that overlaps [checkInYMD, checkOutYMD)
 * for any conflicting room type. Uses a 24h coarse MongoDB window + exact YYYY-MM-DD comparison.
 */
export async function findConflictingBooking(params: {
  roomType: RoomType;
  checkInYMD: string;
  checkOutYMD: string;
  excludeBookingId?: string;
}): Promise<ConflictDetail | null> {
  const { roomType, checkInYMD, checkOutYMD, excludeBookingId } = params;
  const parsedIn = parseBookingDateToUtcNoon(checkInYMD);
  const parsedOut = parseBookingDateToUtcNoon(checkOutYMD);
  if (!parsedIn || !parsedOut) return null;

  const oneDayMs = 24 * 60 * 60 * 1000;
  const conflictingRoomTypes = getConflictingRoomTypes(roomType);

  const query: Record<string, unknown> = {
    status: { $in: ["confirmed", "pending"] },
    roomType: { $in: conflictingRoomTypes },
    checkIn: { $lt: new Date(parsedOut.date.getTime() + oneDayMs) },
    checkOut: { $gt: new Date(parsedIn.date.getTime() - oneDayMs) },
  };

  if (excludeBookingId && mongoose.Types.ObjectId.isValid(excludeBookingId)) {
    query._id = { $ne: new mongoose.Types.ObjectId(excludeBookingId) };
  }

  const candidates = await Booking.find(
    query,
    "_id customerName roomType roomName status checkIn checkOut createdAt"
  )
    .sort({ createdAt: 1 })
    .lean()
    .exec();

  for (const doc of candidates) {
    const existingInYMD = toVillaYMD(doc.checkIn as Date);
    const existingOutYMD = toVillaYMD(doc.checkOut as Date);
    if (!existingInYMD || !existingOutYMD) continue;

    if (rangesOverlapYMD(existingInYMD, existingOutYMD, checkInYMD, checkOutYMD)) {
      return {
        _id: String(doc._id),
        customerName: String(doc.customerName || "Guest"),
        roomType: String(doc.roomType),
        roomName: String(doc.roomName || doc.roomType),
        status: String(doc.status),
        checkInYMD: existingInYMD,
        checkOutYMD: existingOutYMD,
        createdAt: doc.createdAt ? new Date(doc.createdAt as Date) : undefined,
      };
    }
  }

  return null;
}

export function buildConflictMessage(
  requestedRoom: RoomType,
  conflict: ConflictDetail,
  includeDetails: boolean
): string {
  if (includeDetails) {
    return `Dates overlap with ${conflict.customerName}'s ${conflict.status} booking (${conflict.roomName}: ${conflict.checkInYMD} to ${conflict.checkOutYMD}).`;
  }
  return requestedRoom === "full"
    ? "The villa already has rooms reserved during these dates. Please choose other dates."
    : "This room is already reserved for the selected dates. Please choose another date or room.";
}
