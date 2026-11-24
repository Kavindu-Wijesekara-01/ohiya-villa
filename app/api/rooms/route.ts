import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/models/Room";
import { ensureDefaultData } from "@/lib/seedData";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { sanitizeText, safeErrorMessage } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureDefaultData();

    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("admin") === "true";

    const query: any = {};
    if (adminMode) {
      const isAuth = await isAuthenticatedAdmin();
      if (!isAuth) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
    } else {
      query.isActive = true;
    }

    const rooms = await Room.find(query).sort({ order: 1 }).lean().exec();

    return NextResponse.json({
      success: true,
      rooms,
    });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to fetch room packages.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();

    // Support single room update or bulk rooms update
    if (Array.isArray(body.rooms)) {
      const updatedRooms = [];
      for (const item of body.rooms) {
        if (!item.roomId && !item._id) continue;

        const updateFields: any = {};
        if (typeof item.pricePerNight === "number") {
          updateFields.pricePerNight = Math.max(0, item.pricePerNight);
          updateFields.priceLabel = `$${updateFields.pricePerNight}`;
        }
        if (typeof item.name === "string") updateFields.name = sanitizeText(item.name, 120);
        if (typeof item.subtitle === "string") updateFields.subtitle = sanitizeText(item.subtitle, 200);
        if (typeof item.description === "string") updateFields.description = sanitizeText(item.description, 1000);
        if (typeof item.capacity === "string") updateFields.capacity = sanitizeText(item.capacity, 60);

        if (Array.isArray(item.features)) {
          updateFields.features = item.features.map((f: string) => sanitizeText(f, 200)).filter(Boolean);
        }
        if (Array.isArray(item.amenities)) {
          updateFields.amenities = item.amenities.map((a: string) => sanitizeText(a, 200)).filter(Boolean);
        }
        if (Array.isArray(item.goodToKnow)) {
          updateFields.goodToKnow = item.goodToKnow.map((g: string) => sanitizeText(g, 300)).filter(Boolean);
        }
        if (item.specs && typeof item.specs === "object") {
          updateFields.specs = {
            bed: sanitizeText(item.specs.bed || "", 100),
            sleeps: sanitizeText(item.specs.sleeps || "", 60),
            outlook: sanitizeText(item.specs.outlook || "", 100),
            bathroom: sanitizeText(item.specs.bathroom || "", 100),
          };
        }

        const query = item._id ? { _id: item._id } : { roomId: item.roomId };
        const updated = await Room.findOneAndUpdate(query, { $set: updateFields }, { new: true }).lean().exec();
        if (updated) updatedRooms.push(updated);
      }

      return NextResponse.json({
        success: true,
        message: "Room packages updated successfully",
        rooms: updatedRooms,
      });
    }

    // Single room update
    const { roomId, _id, pricePerNight, name, subtitle, description, capacity, features, amenities, goodToKnow, specs } = body;
    const query = _id ? { _id } : { roomId };

    const updateFields: any = {};
    if (typeof pricePerNight === "number") {
      updateFields.pricePerNight = Math.max(0, pricePerNight);
      updateFields.priceLabel = `$${updateFields.pricePerNight}`;
    }
    if (typeof name === "string") updateFields.name = sanitizeText(name, 120);
    if (typeof subtitle === "string") updateFields.subtitle = sanitizeText(subtitle, 200);
    if (typeof description === "string") updateFields.description = sanitizeText(description, 1000);
    if (typeof capacity === "string") updateFields.capacity = sanitizeText(capacity, 60);

    if (Array.isArray(features)) {
      updateFields.features = features.map((f: string) => sanitizeText(f, 200)).filter(Boolean);
    }
    if (Array.isArray(amenities)) {
      updateFields.amenities = amenities.map((a: string) => sanitizeText(a, 200)).filter(Boolean);
    }
    if (Array.isArray(goodToKnow)) {
      updateFields.goodToKnow = goodToKnow.map((g: string) => sanitizeText(g, 300)).filter(Boolean);
    }
    if (specs && typeof specs === "object") {
      updateFields.specs = {
        bed: sanitizeText(specs.bed || "", 100),
        sleeps: sanitizeText(specs.sleeps || "", 60),
        outlook: sanitizeText(specs.outlook || "", 100),
        bathroom: sanitizeText(specs.bathroom || "", 100),
      };
    }

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
    const message = safeErrorMessage(error, "Failed to update room package.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
