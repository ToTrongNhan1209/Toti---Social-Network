import { NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/blog-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = getPostById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy bài viết" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("API GET /api/admin/blog/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi tìm bài viết" },
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

    const updated = updatePost(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy bài viết để cập nhật" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: updated,
      message: "Cập nhật bài viết thành công",
    });
  } catch (error) {
    console.error("API PUT /api/admin/blog/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật bài viết" },
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
    const deleted = deletePost(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy bài viết để xóa" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa bài viết thành công",
    });
  } catch (error) {
    console.error("API DELETE /api/admin/blog/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa bài viết" },
      { status: 500 }
    );
  }
}
