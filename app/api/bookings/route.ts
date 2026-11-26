import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { sanitizeText, isValidEmail, isValidPhone, safeErrorMessage, isDatabaseUnavailableError } from "@/lib/sanitize";
import {
  calculateNightlyRate,
  calculateNightsYMD,
  deriveRoomTypeFromSelection,
  formatRoomSelectionName,
  getDefaultRoomMeta,
  getMaxGuestsForSelection,
  isValidRoomType,
  normalizeRoomCounts,
  parseBookingDateToUtcNoon,
  toVillaYMD,
  RoomType,
} from "@/lib/bookingUtils";
import {
  buildConflictMessage,
  findConflictingBooking,
  withBookingLock,
} from "@/lib/bookingServer";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const bookedDatesOnly = searchParams.get("bookedDates") === "true";
    // Public endpoint for occupied / booked dates on calendar
    // Strictly projects only checkIn, checkOut, roomType, doubleRooms, tripleRooms to prevent any PII leakage
    if (bookedDatesOnly) {
      const yesterdayUtc = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const confirmedBookings = await Booking.find(
        {
          status: { $in: ["confirmed", "pending"] },
          checkOut: { $gte: yesterdayUtc },
        },
        "checkIn checkOut roomType doubleRooms tripleRooms"
      )
        .lean()
        .exec();

      const bookedRanges = confirmedBookings.map((b) => {
        const counts = normalizeRoomCounts({
          roomType: String(b.roomType || "double"),
          doubleRooms: b.doubleRooms,
          tripleRooms: b.tripleRooms,
        });
        return {
          _id: b._id,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          checkInYMD: toVillaYMD(b.checkIn as Date),
          checkOutYMD: toVillaYMD(b.checkOut as Date),
          roomType: b.roomType,
          doubleRooms: counts.doubleRooms,
          tripleRooms: counts.tripleRooms,
        };
      });

      return NextResponse.json({
        success: true,
        bookedRanges,
      });
    }

    // Otherwise, check admin authentication to list full booking details
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
    }

    const status = searchParams.get("status");
    const query: Record<string, unknown> = {};
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
  } catch (error: unknown) {
    const message = safeErrorMessage(error, "Unable to load booking records.");
    return NextResponse.json(
      { success: false, message },
      { status: isDatabaseUnavailableError(error) ? 503 : 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON payload" }, { status: 400 });
    }

    const isAdmin = await isAuthenticatedAdmin();

    const {
      customerName,
      customerPhone,
      customerEmail,
      customerCountry,
      idOrPassport,
      roomType,
      roomName,
      doubleRooms: rawDoubleRooms,
      tripleRooms: rawTripleRooms,
      checkIn,
      checkOut,
      guests,
      specialRequests,
      status: requestedStatus,
      totalPrice: requestedTotalPrice,
    } = body;

    const cleanName = sanitizeText(customerName, 80);
    const cleanPhone = sanitizeText(customerPhone, 30);
    const cleanEmail = customerEmail ? sanitizeText(customerEmail, 120) : "";
    const cleanCountry = customerCountry ? sanitizeText(customerCountry, 80) : "";
    const cleanIdOrPassport = idOrPassport ? sanitizeText(idOrPassport, 50) : "";
    const normalizedIdOrPassport = cleanIdOrPassport.replace(/\s+/g, "").toUpperCase();
    const cleanRequests = specialRequests ? sanitizeText(specialRequests, 500) : "";

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please provide the guest name." },
        { status: 400 }
      );
    }

    if (!isValidPhone(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid WhatsApp / contact number." },
        { status: 400 }
      );
    }

    if (!isAdmin && (!cleanCountry || cleanCountry.length < 2)) {
      return NextResponse.json(
        { success: false, message: "Please select your country." },
        { status: 400 }
      );
    }

    if (!isAdmin && normalizedIdOrPassport.length < 5) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid NIC or Passport number (at least 5 characters).",
        },
        { status: 400 }
      );
    }

    if (!isAdmin && (!cleanEmail || !isValidEmail(cleanEmail))) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
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

    const parsedIn = parseBookingDateToUtcNoon(checkIn as string | Date);
    const parsedOut = parseBookingDateToUtcNoon(checkOut as string | Date);

    if (!parsedIn || !parsedOut) {
      return NextResponse.json(
        { success: false, message: "Invalid reservation dates." },
        { status: 400 }
      );
    }

    const todayYMD = toVillaYMD(new Date());

    if (!isAdmin && parsedIn.ymd < todayYMD) {
      return NextResponse.json(
        { success: false, message: "Check-in date cannot be in the past." },
        { status: 400 }
      );
    }

    if (parsedOut.ymd <= parsedIn.ymd) {
      return NextResponse.json(
        { success: false, message: "Check-out date must be after check-in date." },
        { status: 400 }
      );
    }

    const nights = calculateNightsYMD(parsedIn.ymd, parsedOut.ymd);

    if (nights < 1) {
      return NextResponse.json(
        { success: false, message: "Stay must be at least 1 night." },
        { status: 400 }
      );
    }

    if (!isAdmin && nights > 60) {
      return NextResponse.json(
        { success: false, message: "For long stays exceeding 60 nights, please contact Susantha directly." },
        { status: 400 }
      );
    }

    const hasExplicitCounts =
      typeof rawDoubleRooms === "number" || typeof rawTripleRooms === "number";
    if (
      hasExplicitCounts &&
      (Number(rawDoubleRooms) || 0) <= 0 &&
      (Number(rawTripleRooms) || 0) <= 0
    ) {
      return NextResponse.json(
        { success: false, message: "Please select at least 1 bedroom." },
        { status: 400 }
      );
    }

    const requestedRoomType: RoomType = isValidRoomType(roomType) ? roomType : "double";
    const selection = normalizeRoomCounts({
      roomType: requestedRoomType,
      doubleRooms: typeof rawDoubleRooms === "number" ? rawDoubleRooms : undefined,
      tripleRooms: typeof rawTripleRooms === "number" ? rawTripleRooms : undefined,
    });
    const validRoomType = deriveRoomTypeFromSelection(selection);

    // Look up live rates from Room collection for double, triple, and full
    const roomDocs = await Room.find({ roomId: { $in: ["double", "triple", "full"] } })
      .lean()
      .exec();
    const getPrice = (id: "double" | "triple" | "full") => {
      const doc = roomDocs.find((r) => r.roomId === id);
      return doc && typeof doc.pricePerNight === "number"
        ? doc.pricePerNight
        : getDefaultRoomMeta(id).pricePerNight;
    };

    const ratePerNight = calculateNightlyRate(selection, {
      doublePrice: getPrice("double"),
      triplePrice: getPrice("triple"),
      fullPrice: getPrice("full"),
    });
    const computedRoomName = formatRoomSelectionName(selection);

    const maxGuests = isAdmin ? 12 : getMaxGuestsForSelection(selection);
    const cleanGuests = Math.min(Math.max(Number(guests) || 1, 1), maxGuests);
    const autoTotalPrice = ratePerNight * nights;
    const finalTotalPrice =
      isAdmin &&
        typeof requestedTotalPrice === "number" &&
        Number.isFinite(requestedTotalPrice) &&
        requestedTotalPrice >= 0
        ? Math.round(requestedTotalPrice)
        : autoTotalPrice;

    // Public /booking requests always start as "pending" even if host is logged in;
    // Admin manual bookings explicitly send status="confirmed" and are directly approved.
    const finalStatus: "pending" | "confirmed" =
      isAdmin && requestedStatus === "confirmed"
        ? "confirmed"
        : "pending";

    // ─────────────────────────────────────────────────────────────
    // SERIALIZED ATOMIC ANTI-OVERBOOKING & ANTI-OVERLAP CHECK
    // ─────────────────────────────────────────────────────────────
    const result = await withBookingLock(async () => {
      const existingConflict = await findConflictingBooking({
        selection,
        checkInYMD: parsedIn.ymd,
        checkOutYMD: parsedOut.ymd,
      });

      if (existingConflict) {
        return {
          conflict: true as const,
          detail: existingConflict,
        };
      }

      const newBooking = await Booking.create({
        customerName: cleanName,
        customerPhone: cleanPhone,
        customerEmail: cleanEmail,
        customerCountry: cleanCountry,
        idOrPassport: cleanIdOrPassport,
        idOrPassportNormalized: normalizedIdOrPassport,
        roomType: validRoomType,
        roomName: sanitizeText(roomName, 80) || computedRoomName,
        doubleRooms: selection.doubleRooms,
        tripleRooms: selection.tripleRooms,
        checkIn: parsedIn.date,
        checkOut: parsedOut.date,
        nights,
        guests: cleanGuests,
        totalPrice: finalTotalPrice,
        currency: "USD",
        status: finalStatus,
        specialRequests: cleanRequests,
      });

      // Post-create verification to guard against concurrent writes across serverless workers
      const raceConflict = await findConflictingBooking({
        selection,
        checkInYMD: parsedIn.ymd,
        checkOutYMD: parsedOut.ymd,
        excludeBookingId: String(newBooking._id),
      });

      if (
        raceConflict &&
        raceConflict.createdAt &&
        newBooking.createdAt &&
        raceConflict.createdAt.getTime() <= newBooking.createdAt.getTime()
      ) {
        await Booking.findByIdAndDelete(newBooking._id).exec();
        return {
          conflict: true as const,
          detail: raceConflict,
        };
      }

      return {
        conflict: false as const,
        booking: newBooking,
      };
    });

    if (result.conflict) {
      return NextResponse.json(
        {
          success: false,
          conflict: true,
          message: buildConflictMessage(selection, result.detail, isAdmin),
        },
        { status: 409 }
      );
    }

    const newBooking = result.booking;

    return NextResponse.json({
      success: true,
      message: isAdmin
        ? "Manual reservation added with overlap protection."
        : "Your reservation request has been received. Susantha will confirm your stay.",
      booking: {
        _id: newBooking._id,
        customerName: newBooking.customerName,
        customerCountry: newBooking.customerCountry,
        idOrPassport: newBooking.idOrPassport,
        customerPhone: newBooking.customerPhone,
        customerEmail: newBooking.customerEmail,
        roomType: newBooking.roomType,
        roomName: newBooking.roomName,
        doubleRooms: newBooking.doubleRooms,
        tripleRooms: newBooking.tripleRooms,
        checkIn: newBooking.checkIn,
        checkOut: newBooking.checkOut,
        nights: newBooking.nights,
        guests: newBooking.guests,
        totalPrice: newBooking.totalPrice,
        currency: newBooking.currency,
        status: newBooking.status,
        specialRequests: newBooking.specialRequests,
      },
    });
  } catch (error: unknown) {
    const message = safeErrorMessage(error, "Failed to submit reservation. Please try again.");
    return NextResponse.json(
      { success: false, message },
      { status: isDatabaseUnavailableError(error) ? 503 : 500 }
    );
  }
}
