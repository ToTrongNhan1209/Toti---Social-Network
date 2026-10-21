import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminToken(token);

  if (!session) {
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    admin: {
      email: session.email,
      name: session.name,
      avatar: session.avatar,
      role: session.role,
      roleId: session.roleId || "super_admin",
      permissions: session.permissions || [
        "manage_staff",
        "manage_services",
        "manage_blog",
        "manage_comments",
        "view_analytics",
        "manage_contacts",
        "manage_settings",
      ],
      authProvider: session.authProvider,
    },
  });
}
