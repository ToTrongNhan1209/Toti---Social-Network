import { NextRequest, NextResponse } from "next/server";
import {
  getAllRoles,
  addRole,
  updateRole,
  deleteRole,
  AVAILABLE_PERMISSIONS,
} from "@/lib/staff-store";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

/**
 * GET /api/admin/roles
 * Returns all roles and the catalog of available permission keys
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

    const roles = getAllRoles();

    return NextResponse.json({
      success: true,
      roles,
      availablePermissions: AVAILABLE_PERMISSIONS,
    });
  } catch (error: any) {
    console.error("GET /api/admin/roles error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách vai trò" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/roles
 * Creates a new custom role with specific permissions
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
    const { name, description, color, permissions } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập tên vai trò" },
        { status: 400 }
      );
    }

    if (!Array.isArray(permissions) || permissions.length === 0) {
      return NextResponse.json(
        { success: false, message: "Vui lòng chọn ít nhất một quyền hạn cho vai trò này" },
        { status: 400 }
      );
    }

    const newRole = addRole({
      name: name.trim(),
      description: description?.trim() || "Vai trò tùy chỉnh trong hệ thống",
      color: color?.trim() || "#237A60",
      permissions,
    });

    return NextResponse.json({
      success: true,
      role: newRole,
      message: `Đã tạo vai trò "${newRole.name}" thành công`,
    });
  } catch (error: any) {
    console.error("POST /api/admin/roles error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi khi tạo vai trò mới" },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/admin/roles
 * Updates an existing role
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
    const { id, name, description, color, permissions } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID vai trò cần cập nhật" },
        { status: 400 }
      );
    }

    const updated = updateRole(id, {
      ...(name ? { name: name.trim() } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
      ...(color ? { color: color.trim() } : {}),
      ...(Array.isArray(permissions) ? { permissions } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy vai trò" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      role: updated,
      message: "Cập nhật vai trò thành công",
    });
  } catch (error: any) {
    console.error("PUT /api/admin/roles error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi khi cập nhật vai trò" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/roles
 * Deletes a custom role
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
        { success: false, message: "Thiếu ID vai trò cần xóa" },
        { status: 400 }
      );
    }

    const result = deleteRole(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Không thể xóa vai trò này" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa vai trò thành công",
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/roles error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi xóa vai trò" },
      { status: 500 }
    );
  }
}
