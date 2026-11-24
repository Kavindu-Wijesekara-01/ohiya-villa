import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Review from "@/models/Review";
import { ensureDefaultData } from "@/lib/seedData";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { sanitizeText, safeErrorMessage } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureDefaultData();

    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("admin") === "true";

    if (adminMode) {
      const isAuth = await isAuthenticatedAdmin();
      if (!isAuth) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }

      const reviews = await Review.find().sort({ createdAt: -1 }).lean().exec();
      return NextResponse.json({ success: true, reviews });
    }

    // Public website: fetch ONLY approved reviews
    const reviews = await Review.find({ isApproved: true })
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to load guest reviews.");
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
      return NextResponse.json({ success: false, message: "Invalid payload format" }, { status: 400 });
    }

    const { author, origin, tag, quote, rating } = body;

    const cleanAuthor = sanitizeText(author, 80);
    const cleanOrigin = origin ? sanitizeText(origin, 80) : "Guest";
    const cleanTag = tag ? sanitizeText(tag, 80) : "Verified Stay";
    const cleanQuote = sanitizeText(quote, 800);
    const cleanRating = Math.min(Math.max(Math.round(Number(rating) || 5), 1), 5);

    if (!cleanAuthor || cleanAuthor.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!cleanQuote || cleanQuote.length < 5) {
      return NextResponse.json(
        { success: false, message: "Please write a brief comment about your stay (at least 5 characters)." },
        { status: 400 }
      );
    }

    const newReview = await Review.create({
      author: cleanAuthor,
      origin: cleanOrigin,
      tag: cleanTag,
      quote: cleanQuote,
      rating: cleanRating,
      isApproved: false, // Requires explicit host approval before appearing on site
      isFeatured: false,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you. Your review has been submitted to Susantha and will appear once verified.",
      review: {
        _id: newReview._id,
        author: newReview.author,
        origin: newReview.origin,
        tag: newReview.tag,
        rating: newReview.rating,
        createdAt: newReview.createdAt,
      },
    });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to submit review.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
