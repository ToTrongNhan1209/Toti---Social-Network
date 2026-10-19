/**
 * app/api/newsletter/route.ts
 * Newsletter subscription endpoint
 * Security: Input validation (Rule #7), rate limiting in middleware (Rule #12),
 * minimal response (Rule #17), no sensitive data exposed
 */

import { NextRequest, NextResponse } from "next/server";
import { NewsletterSchema } from "@/lib/validation";

// In production: use a DB or email service (Mailchimp, Resend, etc.)
const subscribers = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── 1. Anti-bot honeypot check ──────────────────────────────────
    if (body.phone) {
      // Silently ignore bots
      return NextResponse.json({ success: true });
    }

    // ── 2. Input Validation (Rule #7) ───────────────────────────────
    const result = NewsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // ── 3. Check for duplicates ─────────────────────────────────────
    if (subscribers.has(email)) {
      return NextResponse.json(
        { success: false, error: "Email này đã được đăng ký." },
        { status: 409 }
      );
    }

    // ── 4. Store subscription (replace with real DB in production) ──
    subscribers.add(email);

    // ── 5. Minimal API response (Rule #17) ─────────────────────────
    return NextResponse.json(
      { success: true, message: "Đăng ký thành công!" },
      { status: 201 }
    );

  } catch (err) {
    console.error("[newsletter] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
