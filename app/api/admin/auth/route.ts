import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, createAdminToken, isAuthenticatedAdmin } from "@/lib/auth";
import { safeErrorMessage } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const { password } = body;

    if (!password || typeof password !== "string" || !checkAdminPassword(password)) {
      // Small artificial delay to mitigate timing & brute-force attacks
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json(
        { success: false, message: "Invalid administrator credentials" },
        { status: 401 }
      );
    }

    const token = createAdminToken();

    const response = NextResponse.json({
      success: true,
      message: "Admin authenticated successfully",
    });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    const message = safeErrorMessage(error, "Authentication failed.");
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const isAuth = await isAuthenticatedAdmin();
    return NextResponse.json({ authenticated: isAuth });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Session closed successfully" });
  response.cookies.delete("admin_session");
  return response;
}
