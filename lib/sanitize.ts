/**
 * Input sanitization and validation utilities for robust security lockdown.
 */

export function sanitizeText(input: unknown, maxLength: number = 500): string {
  if (typeof input !== "string") return "";
  // Strip control characters and HTML tags, normalize whitespace
  const sanitized = input
    .replace(/<[^>]*>?/gm, "") // remove HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // remove control chars
    .trim();
  return sanitized.slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  if (!email) return true; // optional
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return email.length <= 120 && emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  // Allow international phone format (+, digits, spaces, hyphens, parentheses), at least 7 digits
  const cleaned = phone.replace(/[^0-9]/g, "");
  return cleaned.length >= 7 && cleaned.length <= 16;
}

export function isValidDate(dateStr: unknown): boolean {
  if (!dateStr || typeof dateStr !== "string") return false;
  const parsed = new Date(dateStr);
  return !isNaN(parsed.getTime());
}

export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const name = error.name || "";
  const msg = error.message || "";
  return (
    name === "MongooseServerSelectionError" ||
    name === "MongoNetworkError" ||
    msg.includes("Could not connect to any servers in your MongoDB Atlas cluster") ||
    msg.includes("IP whitelist") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("ENOTFOUND")
  );
}

export function safeErrorMessage(error: unknown, fallback: string = "An unexpected error occurred. Please try again."): string {
  if (isDatabaseUnavailableError(error)) {
    console.error("[Database Unavailable]: MongoDB connection failed.", error instanceof Error ? `${error.name}: ${error.message}` : error);
    return "Database connection unavailable right now. Please try again shortly or contact Susantha directly.";
  }
  if (process.env.NODE_ENV !== "production" && error instanceof Error) {
    console.error("[Internal Server Error]:", error);
  } else if (error instanceof Error) {
    console.error("[Server Error]:", error.message);
  }
  return fallback;
}
