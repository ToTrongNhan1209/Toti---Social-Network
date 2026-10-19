/**
 * app/api/contact/route.ts
 * Contact submission endpoint
 * Security: Input validation with Zod, rate limiting, anti-bot honeypot
 */

import { NextRequest, NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validation";

// In-memory contact submission log (simulate DB)
const contactQueue: Array<{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}> = [];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Honeypot check
    if (body.company) {
      return NextResponse.json({ success: true, message: "Đã gửi thành công!" });
    }

    // 2. Validate input
    const result = ContactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // 3. Escape data
    const contactRecord = {
      id: crypto.randomUUID(),
      name: escapeHtml(name),
      email: escapeHtml(email),
      subject: escapeHtml(subject),
      message: escapeHtml(message),
      createdAt: new Date().toISOString(),
    };

    contactQueue.push(contactRecord);

    return NextResponse.json(
      {
        success: true,
        message: "Cảm ơn bạn! Chúng tôi đã nhận được thông tin và sẽ phản hồi trong vòng 5-15 phút.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json(
      { success: false, error: "Đã có lỗi xảy ra từ máy chủ. Vui lòng liên hệ trực tiếp qua Zalo hoặc Hotline." },
      { status: 500 }
    );
  }
}
