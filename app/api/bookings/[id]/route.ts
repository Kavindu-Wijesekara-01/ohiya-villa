import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { sanitizeText, safeErrorMessage } from "@/lib/sanitize";
import { isValidRoomType, toVillaYMD, RoomType } from "@/lib/bookingUtils";
import {
  buildConflictMessage,
  findConflictingBooking,
  withBookingLock,
} from "@/lib/bookingServer";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
    }

    await connectToDatabase();
    const body = await req.json();

    const allowedUpdates: Record<string, unknown> = {};
    if (body.status && ["pending", "confirmed", "cancelled", "completed"].includes(body.status)) {
      allowedUpdates.status = body.status;
    }
    if (typeof body.specialRequests === "string") {
      allowedUpdates.specialRequests = sanitizeText(body.specialRequests, 500);
    }

    const result = await withBookingLock(async () => {
      const existing = await Booking.findById(id).lean().exec();
      if (!existing) {
        return { notFound: true as const };
      }

      const nextStatus = (allowedUpdates.status as string) || existing.status;
      const roomType: RoomType = isValidRoomType(existing.roomType) ? existing.roomType : "double";
      const checkInYMD = toVillaYMD(existing.checkIn as Date);
      const checkOutYMD = toVillaYMD(existing.checkOut as Date);

      // Enforce anti-overbooking whenever a booking is kept or moved into an active state
      if (["pending", "confirmed"].includes(nextStatus) && checkInYMD && checkOutYMD) {
        const conflict = await findConflictingBooking({
          roomType,
          checkInYMD,
          checkOutYMD,
          excludeBookingId: id,
        });

        if (conflict) {
          return {
            notFound: false as const,
            conflict: true as const,
            detail: conflict,
            roomType,
          };
        }
      }

      const updated = await Booking.findByIdAndUpdate(
        id,
        { $set: allowedUpdates },
        { new: true, runValidators: true }
      )
        .lean()
        .exec();

      return {
        notFound: false as const,
        conflict: false as const,
        booking: updated,
      };
    });

    if (result.notFound) {
      return NextResponse.json({ success: false, message: "Booking record not found" }, { status: 404 });
    }

    if (result.conflict) {
      return NextResponse.json(
        {
          success: false,
          conflict: true,
          message: buildConflictMessage(result.roomType, result.detail, true),
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, booking: result.booking });
  } catch (error: unknown) {
    const message = safeErrorMessage(error, "Failed to update booking status.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid booking ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await Booking.findByIdAndDelete(id).lean().exec();
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Booking record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Booking record deleted successfully" });
  } catch (error: unknown) {
    const message = safeErrorMessage(error, "Failed to delete booking.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
