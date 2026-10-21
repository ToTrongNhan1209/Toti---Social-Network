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
  const siteUrl = req.nextUrl.origin || "http://localhost:3000";
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
    ? (process.env.LOCAL_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "274672652455-k2lhi691i2jhvfn7a8ss1365g6acvm8e.apps.googleusercontent.com")
    : (process.env.GOOGLE_CLIENT_ID || "274672652455-7rare3ft6a63dbou4bi5b6sctq9sr54b.apps.googleusercontent.com");
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

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

    // 3. Check if email is in the authorized admin list
    if (!isAuthorizedAdminEmail(cleanEmail)) {
      return NextResponse.redirect(
        new URL(
          `/admin/login?error=${encodeURIComponent(
            `Tài khoản Google (${cleanEmail}) không có quyền quản trị hệ thống. Vui lòng liên hệ Tô Trọng Nhân.`
          )}`,
          req.url
        )
      );
    }

    // 4. Sign session token using HMAC-SHA256
    const token = await signAdminToken({
      email: cleanEmail,
      name: googleUser.name || "Tô Trọng Nhân",
      avatar:
        googleUser.picture ||
        "/logo/final-avatar.png",
      role: "Super Administrator",
      authProvider: "google",
    });

    // 5. Set session cookie and redirect to Admin panel
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
