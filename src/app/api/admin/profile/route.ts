import { NextRequest, NextResponse } from "next/server";
import { getAdminProfile, updateAdminProfile } from "@/lib/profile-store";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Yêu cầu đăng nhập quản trị" },
        { status: 401 }
      );
    }

    const profile = getAdminProfile();
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("API GET /api/admin/profile error:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy thông tin hồ sơ quản trị" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Yêu cầu đăng nhập quản trị" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Họ tên không được để trống" },
        { status: 400 }
      );
    }

    const updatedProfile = updateAdminProfile(body);
    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "Cập nhật hồ sơ quản trị viên thành công",
    });
  } catch (error) {
    console.error("API PUT /api/admin/profile error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi cập nhật hồ sơ" },
      { status: 500 }
    );
  }
}
