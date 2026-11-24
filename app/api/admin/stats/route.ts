import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Review from "@/models/Review";
import GalleryItem from "@/models/GalleryItem";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { safeErrorMessage } from "@/lib/sanitize";

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalReviews,
      pendingReviews,
      approvedReviews,
      totalPhotos,
      recentBookings,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "cancelled" }),
      Review.countDocuments(),
      Review.countDocuments({ isApproved: false }),
      Review.countDocuments({ isApproved: true }),
      GalleryItem.countDocuments(),
      Booking.find().sort({ createdAt: -1 }).limit(5).lean().exec(),
    ]);

    // Estimated revenue from confirmed bookings
    const confirmedList = await Booking.find({ status: "confirmed" }, "totalPrice").lean().exec();
    const totalRevenueEst = confirmedList.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenueEst,
        totalReviews,
        pendingReviews,
        approvedReviews,
        totalPhotos,
      },
      recentBookings,
    });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to load dashboard metrics.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
