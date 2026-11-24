import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import GalleryItem from "@/models/GalleryItem";
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
      return NextResponse.json({ success: false, message: "Invalid photo ID" }, { status: 400 });
    }

    await connectToDatabase();
    const body = await req.json();

    const allowedUpdates: Record<string, any> = {};
    if (typeof body.title === "string") allowedUpdates.title = sanitizeText(body.title, 100);
    if (typeof body.subtitle === "string") allowedUpdates.subtitle = sanitizeText(body.subtitle, 200);
    if (typeof body.category === "string" && ["scenery", "property", "rooms", "interior"].includes(body.category)) {
      allowedUpdates.category = body.category;
    }
    if (typeof body.isVisible === "boolean") allowedUpdates.isVisible = body.isVisible;
    if (typeof body.order === "number") allowedUpdates.order = body.order;

    const updated = await GalleryItem.findByIdAndUpdate(id, { $set: allowedUpdates }, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ success: false, message: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to update gallery photo.");
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
      return NextResponse.json({ success: false, message: "Invalid photo ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleted = await GalleryItem.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Photo deleted from gallery." });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to delete photo.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
