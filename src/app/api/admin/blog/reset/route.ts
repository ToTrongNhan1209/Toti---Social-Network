import { NextResponse } from "next/server";
import { resetPostsToDefault } from "@/lib/blog-store";

export async function POST() {
  try {
    const posts = resetPostsToDefault();
    return NextResponse.json({
      success: true,
      posts,
      message: "Đã khôi phục dữ liệu bài viết mặc định thành công",
    });
  } catch (error) {
    console.error("API POST /api/admin/blog/reset error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi khôi phục bài viết" },
      { status: 500 }
    );
  }
}
