import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { sanitizeText, safeErrorMessage } from "@/lib/sanitize";

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

    const allowedUpdates: Record<string, any> = {};
    if (body.status && ["pending", "confirmed", "cancelled", "completed"].includes(body.status)) {
      allowedUpdates.status = body.status;
    }
    if (typeof body.specialRequests === "string") {
      allowedUpdates.specialRequests = sanitizeText(body.specialRequests, 500);
    }

    const updated = await Booking.findByIdAndUpdate(id, { $set: allowedUpdates }, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ success: false, message: "Booking record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
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
    const deleted = await Booking.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Booking record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Booking record deleted successfully" });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to delete booking.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
