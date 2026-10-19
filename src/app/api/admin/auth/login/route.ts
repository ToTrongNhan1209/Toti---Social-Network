import { NextRequest, NextResponse } from "next/server";
import {
  signAdminToken,
  isAuthorizedAdminEmail,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, avatar, provider = "google" } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, message: "Email không được để trống" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify authorized admin email
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: `Tài khoản Google (${cleanEmail}) không có quyền truy cập quản trị. Vui lòng liên hệ Tô Trọng Nhân.`,
        },
        { status: 403 }
      );
    }

    const adminName = name?.trim() || "Tô Trọng Nhân";
    const adminAvatar =
      avatar?.trim() ||
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face";

    // Generate signed session token
    const token = await signAdminToken({
      email: cleanEmail,
      name: adminName,
      avatar: adminAvatar,
      role: "Super Administrator",
      authProvider: provider === "demo" ? "demo" : "google",
    });

    const response = NextResponse.json({
      success: true,
      message: "Đăng nhập Google thành công! Đang chuyển hướng...",
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
    console.error("Admin login API error:", err);
    const errMsg = (err as Error)?.message || "Lỗi hệ thống khi xác thực tài khoản Google";
    return NextResponse.json(
      { success: false, message: `Lỗi hệ thống: ${errMsg}` },
      { status: 500 }
    );
  }
}
