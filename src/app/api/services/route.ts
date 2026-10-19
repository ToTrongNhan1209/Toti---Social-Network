import { NextResponse } from "next/server";
import { getAllServices } from "@/lib/services-store";

export async function GET() {
  try {
    const services = getAllServices();
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("API GET /api/services error:", error);
    return NextResponse.json(
      { success: false, message: "Không thể tải danh sách dịch vụ" },
      { status: 500 }
    );
  }
}
