import { NextRequest, NextResponse } from "next/server";
import {
  getAllStaff,
  getAllRoles,
  addStaff,
  updateStaff,
  deleteStaff,
} from "@/lib/staff-store";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

/**
 * GET /api/admin/staff
 * Returns all staff members and available roles
 */
export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminToken(sessionCookie);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Yêu cầu đăng nhập quản trị viên" },
        { status: 401 }
      );
    }

    const staff = getAllStaff();
    const roles = getAllRoles();

    return NextResponse.json({
      success: true,
      staff,
      roles,
    });
  } catch (error: any) {
    console.error("GET /api/admin/staff error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách nhân viên" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/staff
 * Adds a new staff member with a Google email and assigned role
 */
export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminToken(sessionCookie);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Yêu cầu đăng nhập quản trị viên" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, email, phone, roleId, notes, avatar } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập họ và tên nhân viên" },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập địa chỉ email Google hợp lệ" },
        { status: 400 }
      );
    }

    if (!roleId) {
      return NextResponse.json(
        { success: false, message: "Vui lòng chọn vai trò cho nhân viên" },
        { status: 400 }
      );
    }

    const newStaff = addStaff({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      roleId,
      status: "active",
      notes: notes?.trim() || "",
      avatar: avatar?.trim() || "",
      isPermanent: false,
    });

    return NextResponse.json({
      success: true,
      staff: newStaff,
      message: `Đã thêm nhân viên "${newStaff.name}" thành công. Họ có thể đăng nhập ngay bằng tài khoản Google này.`,
    });
  } catch (error: any) {
    console.error("POST /api/admin/staff error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi khi thêm nhân viên mới" },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/admin/staff
 * Updates staff member role, status, phone, or notes
 */
export async function PUT(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminToken(sessionCookie);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Yêu cầu đăng nhập quản trị viên" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, name, phone, roleId, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID nhân viên cần cập nhật" },
        { status: 400 }
      );
    }

    const updated = updateStaff(id, {
      ...(name ? { name: name.trim() } : {}),
      ...(phone !== undefined ? { phone: phone.trim() } : {}),
      ...(roleId ? { roleId } : {}),
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes: notes.trim() } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy nhân viên" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      staff: updated,
      message: "Cập nhật thông tin nhân viên thành công",
    });
  } catch (error: any) {
    console.error("PUT /api/admin/staff error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi khi cập nhật nhân viên" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/staff
 * Removes a staff member
 */
export async function DELETE(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminToken(sessionCookie);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Yêu cầu đăng nhập quản trị viên" },
        { status: 401 }
      );
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID nhân viên cần xóa" },
        { status: 400 }
      );
    }

    const result = deleteStaff(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Không thể xóa nhân viên này" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa nhân viên khỏi hệ thống",
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/staff error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi xóa nhân viên" },
      { status: 500 }
    );
  }
}
