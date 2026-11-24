import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { safeErrorMessage } from "@/lib/sanitize";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image file provided." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only JPG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image file size must be under 10MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine extension
    let ext = "jpg";
    if (file.type === "image/png") ext = "png";
    else if (file.type === "image/webp") ext = "webp";
    else if (file.type === "image/avif") ext = "avif";

    // Generate clean unique filename
    const uniqueHash = crypto.randomBytes(6).toString("hex");
    const filename = `villa-${Date.now()}-${uniqueHash}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const targetPath = path.join(uploadDir, filename);

    await writeFile(targetPath, buffer);

    const publicPath = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      filePath: publicPath,
      message: "Image uploaded successfully.",
    });
  } catch (error: any) {
    const message = safeErrorMessage(error, "Failed to upload image. Please try again.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
