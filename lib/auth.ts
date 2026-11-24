import crypto from "crypto";
import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

export function createAdminToken(): string {
  const payload = `admin:${Date.now()}`;
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payloadB64, signature] = parts;

    const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
    const [role, timestampStr] = payload.split(":");
    if (role !== "admin") return false;

    const timestamp = parseInt(timestampStr, 10);
    // Token valid for 7 days
    if (isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000 || timestamp > Date.now() + 60000) {
      return false;
    }

    const expectedSignature = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length) return false;

    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    return verifyAdminToken(token);
  } catch {
    return false;
  }
}

export function checkAdminPassword(providedPassword: string): boolean {
  if (!providedPassword || typeof providedPassword !== "string") return false;
  const expectedPassword = ADMIN_PASSWORD;
  const providedBuffer = Buffer.from(providedPassword);
  const expectedBuffer = Buffer.from(expectedPassword);
  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}
