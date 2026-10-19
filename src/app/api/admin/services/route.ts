import { NextResponse } from "next/server";
import { getAllServices, createService } from "@/lib/services-store";

export async function GET() {
  try {
    const services = getAllServices();
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("API GET /api/admin/services error:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy danh sách dịch vụ" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, message: "Tên dịch vụ không được để trống" },
        { status: 400 }
      );
    }

    if (!body.platform) {
      return NextResponse.json(
        { success: false, message: "Vui lòng chọn nền tảng mạng xã hội" },
        { status: 400 }
      );
    }

    const service = createService(body);
    return NextResponse.json({
      success: true,
      service,
      message: "Tạo dịch vụ mới thành công",
    });
  } catch (error) {
    console.error("API POST /api/admin/services error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tạo dịch vụ" },
      { status: 500 }
    );
  }
}
