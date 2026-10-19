import { NextResponse } from "next/server";
import { resetServicesToDefault } from "@/lib/services-store";

export async function POST() {
  try {
    const services = resetServicesToDefault();
    return NextResponse.json({
      success: true,
      services,
      message: "Đã khôi phục danh mục dịch vụ gốc thành công",
    });
  } catch (error) {
    console.error("API POST /api/admin/services/reset error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi khôi phục dịch vụ" },
      { status: 500 }
    );
  }
}
