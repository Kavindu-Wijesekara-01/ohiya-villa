import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { sanitizeText, isValidEmail, isValidPhone, safeErrorMessage } from "@/lib/sanitize";

type RoomType = "double" | "triple" | "full";

/**
 * Intelligent room conflict resolver:
 * - 'double' conflicts with other 'double' bookings AND 'full' villa bookings.
 * - 'triple' conflicts with other 'triple' bookings AND 'full' villa bookings.
 * - 'full' conflicts with ANY room booking ('double', 'triple', or 'full').
 */
function getConflictingRoomTypes(requestedRoom: string): RoomType[] {
  if (requestedRoom === "double") {
    return ["double", "full"];
  }
  if (requestedRoom === "triple") {
    return ["triple", "full"];
  }
  // 'full' takes over the entire bungalow
  return ["double", "triple", "full"];
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const bookedDatesOnly = searchParams.get("bookedDates") === "true";
    const roomType = searchParams.get("roomType") || "double";

    // Public endpoint for occupied / booked dates on calendar
    // Strictly projects only checkIn, checkOut, roomType to prevent any PII leakage
    if (bookedDatesOnly) {
      const conflictingTypes = getConflictingRoomTypes(roomType);

      const confirmedBookings = await Booking.find(
        {
          status: { $in: ["confirmed", "pending"] },
          roomType: { $in: conflictingTypes },
          checkOut: { $gte: new Date() },
        },
        "checkIn checkOut roomType"
      )
        .lean()
        .exec();

      return NextResponse.json({
        success: true,
        bookedRanges: confirmedBookings,
      });
    }

    // Otherwise, check admin authentication to list full booking details
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const status = searchParams.get("status");
    const query: any = {};
    if (status && status !== "all") {
      const cleanStatus = sanitizeText(status, 20);
      if (["pending", "confirmed", "cancelled", "completed"].includes(cleanStatus)) {
        query.status = cleanStatus;
      }
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean().exec();

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Unable to load booking records.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON payload" }, { status: 400 });
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      roomType,
      roomName,
      checkIn,
      checkOut,
      guests,
      specialRequests,
    } = body;

    const cleanName = sanitizeText(customerName, 80);
    const cleanPhone = sanitizeText(customerPhone, 30);
    const cleanEmail = customerEmail ? sanitizeText(customerEmail, 120) : "";
    const cleanRequests = specialRequests ? sanitizeText(specialRequests, 500) : "";

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please provide your name." },
        { status: 400 }
      );
    }

    if (!isValidPhone(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid contact number." },
        { status: 400 }
      );
    }

    if (cleanEmail && !isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, message: "Check-in and check-out dates are required." },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid reservation dates." },
        { status: 400 }
      );
    }

    // Normalize dates to start of day for accurate comparison
    checkInDate.setHours(0, 0, 0, 0);
    checkOutDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return NextResponse.json(
        { success: false, message: "Check-in date cannot be in the past." },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { success: false, message: "Check-out date must be after check-in date." },
        { status: 400 }
      );
    }

    const diffMs = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));

    if (nights > 60) {
      return NextResponse.json(
        { success: false, message: "For long stays exceeding 60 nights, please contact Susantha directly." },
        { status: 400 }
      );
    }

    const validRoomType: RoomType = ["double", "triple", "full"].includes(roomType) ? (roomType as RoomType) : "double";

    // ─────────────────────────────────────────────────────────────
    // INTELLIGENT ANTI-OVERBOOKING CHECK
    // ─────────────────────────────────────────────────────────────
    const conflictingRoomTypes = getConflictingRoomTypes(validRoomType);

    const existingConflict = await Booking.findOne({
      status: { $in: ["confirmed", "pending"] },
      roomType: { $in: conflictingRoomTypes },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).lean();

    if (existingConflict) {
      return NextResponse.json(
        {
          success: false,
          conflict: true,
          message:
            validRoomType === "full"
              ? "The villa already has rooms reserved during these dates. Please choose other dates."
              : "This room is already reserved for the selected dates. Please choose another date or room.",
        },
        { status: 409 }
      );
    }

    let ratePerNight = 20;
    let computedRoomName = "Double Room with Mountain View";
    if (validRoomType === "triple") {
      ratePerNight = 23;
      computedRoomName = "Spacious Triple Bedroom";
    } else if (validRoomType === "full") {
      ratePerNight = 60;
      computedRoomName = "Full Bungalow Exclusive Stay";
    }

    const cleanGuests = Math.min(Math.max(Number(guests) || 2, 1), 12);
    const totalPrice = ratePerNight * nights;

    const newBooking = await Booking.create({
      customerName: cleanName,
      customerPhone: cleanPhone,
      customerEmail: cleanEmail,
      roomType: validRoomType,
      roomName: sanitizeText(roomName, 80) || computedRoomName,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: cleanGuests,
      totalPrice,
      currency: "USD",
      status: "pending",
      specialRequests: cleanRequests,
    });

    return NextResponse.json({
      success: true,
      message: "Your reservation request has been received. Susantha will confirm your stay.",
      booking: {
        _id: newBooking._id,
        customerName: newBooking.customerName,
        roomName: newBooking.roomName,
        checkIn: newBooking.checkIn,
        checkOut: newBooking.checkOut,
        nights: newBooking.nights,
        guests: newBooking.guests,
        totalPrice: newBooking.totalPrice,
        currency: newBooking.currency,
        status: newBooking.status,
      },
    });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to submit reservation. Please try again.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
