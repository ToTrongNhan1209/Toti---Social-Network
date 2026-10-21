/**
 * lib/auth.ts
 * Admin Google Authentication & Session Security
 */

export interface AdminSession {
  email: string;
  name: string;
  avatar: string;
  role: string;
  roleId?: string;
  permissions?: string[];
  authProvider: "google" | "demo";
  issuedAt: number;
  expiresAt: number;
}

export const ADMIN_COOKIE_NAME = "totrongnhan_admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Default allowed master admin email
const DEFAULT_ALLOWED_EMAILS = [
  "totrongnhan1209@gmail.com",
];

// Fallback secret for local development
const SECRET_KEY =
  process.env.ADMIN_AUTH_SECRET ||
  "totrongnhan_super_secure_admin_jwt_secret_mint_2026";

/**
 * Check if the email is allowed to access Admin
 */
export function isAuthorizedAdminEmail(email: string): boolean {
  const cleanEmail = email.trim().toLowerCase();

  // If environment variable ADMIN_ALLOWED_EMAILS is set, use it strictly
  if (process.env.ADMIN_ALLOWED_EMAILS) {
    const envEmails = process.env.ADMIN_ALLOWED_EMAILS
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    return envEmails.includes(cleanEmail);
  }

  // Fallback strictly to default master admin email
  return DEFAULT_ALLOWED_EMAILS.includes(cleanEmail);
}

/**
 * Creates a signed base64 session token using HMAC-SHA256 (Web Crypto native)
 */
export async function signAdminToken(
  sessionData: Omit<AdminSession, "issuedAt" | "expiresAt">
): Promise<string> {
  const now = Date.now();
  const session: AdminSession = {
    ...sessionData,
    issuedAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };

  const payloadStr = JSON.stringify(session);
  const payloadB64 = Buffer.from(payloadStr, "utf-8").toString("base64url");

  // Sign with HMAC
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadB64)
  );

  const signatureB64 = Buffer.from(signatureBuffer).toString("base64url");
  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies a signed session token
 */
export async function verifyAdminToken(
  token: string | null | undefined
): Promise<AdminSession | null> {
  if (!token || !token.includes(".")) return null;

  try {
    const [payloadB64, signatureB64] = token.split(".");
    if (!payloadB64 || !signatureB64) return null;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SECRET_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = Buffer.from(signatureB64, "base64url");
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(payloadB64)
    );

    if (!valid) return null;

    const payloadStr = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const session = JSON.parse(payloadStr) as AdminSession;

    // Check expiration
    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
