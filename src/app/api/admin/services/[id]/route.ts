import { NextResponse } from "next/server";
import { getServiceById, updateService, deleteService } from "@/lib/services-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = getServiceById(id);
    if (!service) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy dịch vụ" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("API GET /api/admin/services/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tìm dịch vụ" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = updateService(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy dịch vụ để cập nhật" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      service: updated,
      message: "Cập nhật dịch vụ thành công",
    });
  } catch (error) {
    console.error("API PUT /api/admin/services/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật dịch vụ" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteService(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy dịch vụ để xóa" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa dịch vụ thành công",
    });
  } catch (error) {
    console.error("API DELETE /api/admin/services/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa dịch vụ" },
      { status: 500 }
    );
  }
}
