import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import GalleryItem from "@/models/GalleryItem";
import { ensureDefaultData } from "@/lib/seedData";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { sanitizeText, safeErrorMessage } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureDefaultData();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const adminMode = searchParams.get("admin") === "true";

    const query: any = {};
    if (adminMode) {
      const isAuth = await isAuthenticatedAdmin();
      if (!isAuth) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
    } else {
      query.isVisible = true;
    }

    if (category && category !== "all") {
      const cleanCat = sanitizeText(category, 20);
      if (["scenery", "property", "rooms", "interior"].includes(cleanCat)) {
        query.category = cleanCat;
      }
    }

    const items = await GalleryItem.find(query).sort({ order: 1, createdAt: -1 }).lean().exec();

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to fetch gallery photos.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();
    const { src, title, subtitle, category, aspect, order, isVisible } = body;

    const rawSrc = typeof src === "string" ? src.trim() : "";
    const isDataImage = /^data:image\/(?:jpeg|png|webp|avif);base64,[A-Za-z0-9+/=]+$/.test(rawSrc);
    const isLocalAsset = /^\/(?:uploads|photos|images)\/[A-Za-z0-9._\-\/% ]+$/.test(rawSrc) && !rawSrc.includes("..");

    const cleanSrc = isDataImage
      ? rawSrc.slice(0, 3_000_000)
      : isLocalAsset
      ? sanitizeText(rawSrc, 300)
      : "";
    const cleanTitle = sanitizeText(title, 100);
    const cleanSubtitle = subtitle ? sanitizeText(subtitle, 200) : "";
    const cleanCategory = ["scenery", "property", "rooms", "interior"].includes(category)
      ? category
      : "scenery";
    const cleanAspect = ["aspect-[4/3]", "aspect-[16/10]", "aspect-[4/5]", "aspect-square", "aspect-[16/11]", "aspect-[3/4]"].includes(aspect)
      ? aspect
      : "aspect-[4/3]";

    if (!cleanSrc || !cleanTitle) {
      return NextResponse.json(
        { success: false, message: "A valid uploaded image and title are required." },
        { status: 400 }
      );
    }

    const newItem = await GalleryItem.create({
      src: cleanSrc,
      title: cleanTitle,
      subtitle: cleanSubtitle,
      category: cleanCategory,
      aspect: cleanAspect,
      order: Number(order) || 0,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
    });

    return NextResponse.json({
      success: true,
      item: newItem,
      message: "Gallery photo added successfully.",
    });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to add gallery photo.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
