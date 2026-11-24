import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Review from "@/models/Review";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { safeErrorMessage } from "@/lib/sanitize";

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
      return NextResponse.json({ success: false, message: "Invalid review ID" }, { status: 400 });
    }

    await connectToDatabase();
    const body = await req.json();

    const allowedUpdates: Record<string, any> = {};
    if (typeof body.isApproved === "boolean") allowedUpdates.isApproved = body.isApproved;
    if (typeof body.isFeatured === "boolean") allowedUpdates.isFeatured = body.isFeatured;

    const updated = await Review.findByIdAndUpdate(id, { $set: allowedUpdates }, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to update review.");
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
      return NextResponse.json({ success: false, message: "Invalid review ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await Review.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully." });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to delete review.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
