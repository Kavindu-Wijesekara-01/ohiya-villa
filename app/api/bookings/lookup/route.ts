import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { sanitizeText, safeErrorMessage, isDatabaseUnavailableError } from "@/lib/sanitize";

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawIdentity = searchParams.get("identity") || "";
    const cleanIdentity = sanitizeText(rawIdentity, 50);
    const normalized = cleanIdentity.replace(/\s+/g, "").toUpperCase();

    if (normalized.length < 4) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter at least 4 characters of your NIC or Passport number.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const exactRegex = new RegExp(`^${escapeRegExp(cleanIdentity)}$`, "i");
    const bookings = await Booking.find({
      $or: [
        { idOrPassportNormalized: normalized },
        { idOrPassport: exactRegex },
      ],
    })
      .select(
        "_id customerName customerCountry idOrPassport roomType roomName doubleRooms tripleRooms checkIn checkOut nights guests totalPrice currency status specialRequests createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(30)
      .lean()
      .exec();

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      (err as { digest?: string }).digest === "NEXT_PRERENDER_INTERRUPTED"
    ) {
      throw err;
    }
    console.error("Booking Lookup GET Error:", err);
    return NextResponse.json(
      { success: false, message: safeErrorMessage(err) },
      { status: isDatabaseUnavailableError(err) ? 503 : 500 }
    );
  }
}
