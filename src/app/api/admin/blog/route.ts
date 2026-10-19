import { NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/blog-store";

export async function GET() {
  try {
    const posts = getAllPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("API GET /api/admin/blog error:", error);
    return NextResponse.json(
      { success: false, message: "Không thể lấy danh sách bài viết" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, message: "Tiêu đề bài viết không được để trống" },
        { status: 400 }
      );
    }

    const post = createPost(body);
    return NextResponse.json({ success: true, post, message: "Tạo bài viết thành công" });
  } catch (error) {
    console.error("API POST /api/admin/blog error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tạo bài viết" },
      { status: 500 }
    );
  }
}
