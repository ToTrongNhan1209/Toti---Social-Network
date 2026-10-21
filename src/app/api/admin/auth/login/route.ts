import { NextRequest, NextResponse } from "next/server";
import {
  signAdminToken,
  isAuthorizedAdminEmail,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth";

/**
 * POST /api/admin/auth/login
 * Strictly verifies the Google ID Token returned by Google Identity Services.
 * Rejects any unverified, plain email, or mock logins.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential } = body;

    // Reject any request without real Google credential token
    if (!credential || typeof credential !== "string") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Chỉ cho phép đăng nhập bằng tài khoản Google thật. Không nhận được Google Identity Token.",
        },
        { status: 400 }
      );
    }

    // Verify token directly with Google's official tokeninfo endpoint
    const tokenInfoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
      { cache: "no-store" }
    );

    if (!tokenInfoRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Mã xác thực Google không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại qua Google.",
        },
        { status: 401 }
      );
    }

    const tokenInfo = await tokenInfoRes.json();

    // Check email verification status
    if (!tokenInfo.email || tokenInfo.email_verified === "false") {
      return NextResponse.json(
        {
          success: false,
          message: "Tài khoản Google chưa được xác thực email chính chủ.",
        },
        { status: 403 }
      );
    }

    // Validate audience if client ID is configured
    const expectedClientId =
      process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (expectedClientId && tokenInfo.aud && tokenInfo.aud !== expectedClientId) {
      console.warn("Google token aud mismatch:", tokenInfo.aud, expectedClientId);
      return NextResponse.json(
        {
          success: false,
          message: "Mã Google ID không khớp với ứng dụng của bạn.",
        },
        { status: 403 }
      );
    }

    const cleanEmail = tokenInfo.email.trim().toLowerCase();

    // Verify authorized admin email whitelist
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: `Tài khoản Google (${cleanEmail}) không có quyền quản trị hệ thống. Vui lòng liên hệ Tô Trọng Nhân.`,
        },
        { status: 403 }
      );
    }

    const adminName = tokenInfo.name?.trim() || "Tô Trọng Nhân";
    const adminAvatar =
      tokenInfo.picture?.trim() || "/logo/final-avatar.png";

    // Generate signed session token with HMAC-SHA256
    const token = await signAdminToken({
      email: cleanEmail,
      name: adminName,
      avatar: adminAvatar,
      role: "Super Administrator",
      authProvider: "google",
    });

    const response = NextResponse.json({
      success: true,
      message: `Đăng nhập Google thành công! Xin chào ${adminName}.`,
      admin: {
        email: cleanEmail,
        name: adminName,
        avatar: adminAvatar,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Admin Google login verification error:", err);
    return NextResponse.json(
      { success: false, message: "Lỗi kết nối máy chủ Google khi xác thực tài khoản." },
      { status: 500 }
    );
  }
}
