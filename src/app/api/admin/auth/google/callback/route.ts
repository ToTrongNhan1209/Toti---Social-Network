import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, isAuthorizedAdminEmail, ADMIN_COOKIE_NAME } from "@/lib/auth";

/**
 * GET /api/admin/auth/google/callback
 * Handles authorization code returned by Google.
 * Exchanges code for access_token & profile, verifies admin authorization, sets session cookie.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    req.nextUrl.host;
  const isLocalHost =
    host.includes("localhost") || host.includes("127.0.0.1");
  const protocol = isLocalHost ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;
  const redirectUri = `${siteUrl}/api/admin/auth/google/callback`;

  if (error || !code) {
    return NextResponse.redirect(
      new URL(
        `/admin/login?error=${encodeURIComponent(
          error || "Không nhận được mã ủy quyền từ Google"
        )}`,
        req.url
      )
    );
  }

  const isLocal =
    req.nextUrl.hostname === "localhost" || req.nextUrl.hostname === "127.0.0.1";
  const clientId = isLocal
    ? (process.env.LOCAL_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "")
    : (process.env.HOSTED_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "");
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/admin/login?error=missing_credentials", req.url)
    );
  }

  try {
    // 1. Exchange auth code for tokens with Google
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google token exchange error:", tokenData);
      const desc =
        tokenData.error_description || tokenData.error || "Không thể xác thực mã từ Google";
      return NextResponse.redirect(
        new URL(`/admin/login?error=${encodeURIComponent(desc)}`, req.url)
      );
    }

    // 2. Fetch Google profile userinfo
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userinfoRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(
        new URL("/admin/login?error=no_email_from_google", req.url)
      );
    }

    const cleanEmail = googleUser.email.toLowerCase();

    // 3. Retrieve Staff Profile & Role Permissions
    const { getStaffByEmail, getRoleById, updateStaff, isAuthorizedStaffEmail } = await import("@/lib/staff-store");
    const isStaff = isAuthorizedStaffEmail(cleanEmail);
    const isAdmin = isAuthorizedAdminEmail(cleanEmail);

    // Check if email is in the authorized admin list or registered staff
    if (!isStaff && !isAdmin) {
      return NextResponse.redirect(
        new URL(
          `/admin/login?error=${encodeURIComponent(
            `Tài khoản Google (${cleanEmail}) không có quyền quản trị hệ thống. Vui lòng liên hệ Tô Trọng Nhân.`
          )}`,
          req.url
        )
      );
    }

    const staff = getStaffByEmail(cleanEmail);

    if (staff && staff.status === "locked") {
      return NextResponse.redirect(
        new URL(
          `/admin/login?error=${encodeURIComponent(
            `Tài khoản nhân viên (${cleanEmail}) đã bị tạm khóa. Vui lòng liên hệ Tô Trọng Nhân.`
          )}`,
          req.url
        )
      );
    }

    const role = staff ? getRoleById(staff.roleId) : null;
    const roleName = role ? role.name : (cleanEmail === "totrongnhan1209@gmail.com" ? "Super Administrator" : "Quản Trị Viên");
    const permissions = role
      ? role.permissions
      : [
          "manage_staff",
          "manage_services",
          "manage_blog",
          "manage_comments",
          "view_analytics",
          "manage_contacts",
          "manage_settings",
        ];

    // Update last login timestamp if registered staff
    if (staff) {
      try {
        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")} - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
        updateStaff(staff.id, { lastLoginAt: formattedTime });
      } catch {
        // Ignore
      }
    }

    // 5. Sign session token with role & permissions using HMAC-SHA256
    const token = await signAdminToken({
      email: cleanEmail,
      name: staff?.name || googleUser.name || "Tô Trọng Nhân",
      avatar:
        googleUser.picture ||
        staff?.avatar ||
        "/logo/final-avatar.png",
      role: roleName,
      roleId: staff?.roleId || "super_admin",
      permissions: permissions as any,
      authProvider: "google",
    });

    // 6. Set session cookie and redirect to Admin panel
    const response = NextResponse.redirect(new URL("/admin", req.url));
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth callback exception:", err);
    return NextResponse.redirect(
      new URL("/admin/login?error=server_error", req.url)
    );
  }
}
