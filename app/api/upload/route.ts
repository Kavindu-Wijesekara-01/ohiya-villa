import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { safeErrorMessage } from "@/lib/sanitize";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_INLINE_DATA_URL_BYTES = 2 * 1024 * 1024; // 2 MB fallback for read-only serverless FS

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
        { success: false, message: "Only JPG, PNG, WebP, and AVIF images are allowed." },
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

    let ext = "jpg";
    if (file.type === "image/png") ext = "png";
    else if (file.type === "image/webp") ext = "webp";
    else if (file.type === "image/avif") ext = "avif";

    const uniqueHash = crypto.randomBytes(6).toString("hex");
    const filename = `villa-${Date.now()}-${uniqueHash}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const targetPath = path.join(uploadDir, filename);

    let resolvedUrl = `/uploads/${filename}`;

    try {
      await mkdir(uploadDir, { recursive: true });
      await writeFile(targetPath, buffer);
    } catch (fsErr: unknown) {
      const code = (fsErr as NodeJS.ErrnoException)?.code;
      // Graceful fallback for read-only serverless hosting (e.g. Vercel / Netlify)
      if (code === "EROFS" || code === "EACCES" || code === "EPERM") {
        if (buffer.length > MAX_INLINE_DATA_URL_BYTES) {
          return NextResponse.json(
            {
              success: false,
              message: "In serverless hosting, please upload images under 2MB.",
            },
            { status: 400 }
          );
        }
        resolvedUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
      } else {
        throw fsErr;
      }
    }

    return NextResponse.json({
      success: true,
      url: resolvedUrl,
      filePath: resolvedUrl,
      message: "Image uploaded successfully.",
    });
  } catch (error: unknown) {
    const message = safeErrorMessage(error, "Failed to upload image. Please try again.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
