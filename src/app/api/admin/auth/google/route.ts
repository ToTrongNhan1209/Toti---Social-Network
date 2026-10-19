import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/auth/google
 * Initiates standard Google OAuth 2.0 Authorization Code flow.
 * Redirects the user to Google's official accounts.google.com consent/account-picker screen.
 */
export async function GET(req: NextRequest) {
  const clientId =
    process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin || "http://localhost:3000";
  const redirectUri = `${siteUrl}/api/admin/auth/google/callback`;

  // If Client ID is not configured in .env.local yet, redirect back with informative message
  if (!clientId || clientId.includes("example") || clientId.length < 15) {
    return NextResponse.redirect(
      new URL("/admin/login?error=missing_credentials", req.url)
    );
  }

  // Redirect to Google's official OAuth 2.0 authorization endpoint
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(googleAuthUrl.toString());
}
