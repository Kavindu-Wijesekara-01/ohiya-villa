import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/models/Room";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { sanitizeText, safeErrorMessage } from "@/lib/sanitize";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { roomId: id };
    const room = await Room.findOne(query).lean().exec();

    if (!room) {
      return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, room });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to fetch room.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();

    const updateFields: any = {};
    if (typeof body.pricePerNight === "number") {
      updateFields.pricePerNight = Math.max(0, body.pricePerNight);
      updateFields.priceLabel = `$${updateFields.pricePerNight}`;
    }
    if (typeof body.name === "string") updateFields.name = sanitizeText(body.name, 120);
    if (typeof body.subtitle === "string") updateFields.subtitle = sanitizeText(body.subtitle, 200);
    if (typeof body.description === "string") updateFields.description = sanitizeText(body.description, 1000);
    if (typeof body.capacity === "string") updateFields.capacity = sanitizeText(body.capacity, 60);

    if (Array.isArray(body.features)) {
      updateFields.features = body.features.map((f: string) => sanitizeText(f, 200)).filter(Boolean);
    }
    if (Array.isArray(body.amenities)) {
      updateFields.amenities = body.amenities.map((a: string) => sanitizeText(a, 200)).filter(Boolean);
    }
    if (Array.isArray(body.goodToKnow)) {
      updateFields.goodToKnow = body.goodToKnow.map((g: string) => sanitizeText(g, 300)).filter(Boolean);
    }
    if (body.specs && typeof body.specs === "object") {
      updateFields.specs = {
        bed: sanitizeText(body.specs.bed || "", 100),
        sleeps: sanitizeText(body.specs.sleeps || "", 60),
        outlook: sanitizeText(body.specs.outlook || "", 100),
        bathroom: sanitizeText(body.specs.bathroom || "", 100),
      };
    }

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { roomId: id };
    const updated = await Room.findOneAndUpdate(query, { $set: updateFields }, { new: true }).lean().exec();

    if (!updated) {
      return NextResponse.json({ success: false, message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Room updated successfully",
      room: updated,
    });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to update room.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
