/**
 * middleware.ts – Next.js Global Anti-DDoS, Rate Limiting & Admin Auth Guard
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, isMaliciousBot, isQueryFlood } from "@/lib/ddos-shield";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const userAgent = req.headers.get("user-agent");

  // Extract client IP
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  // ── 1. Anti-DDoS & Scanner Detection ──────────────────────────────────────
  if (isMaliciousBot(userAgent)) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Access Denied: Malicious scanner or unauthorized automated script detected.",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  if (isQueryFlood(pathname + search)) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: "Bad Request: URL length exceeds security threshold.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── 2. Rate Limiting by Route Category ───────────────────────────────────
  // Note: Only rate-limit API calls and mutating/POST requests. Never lock out normal HTML page visits.
  const isHtmlPageGet = req.method === "GET" && !pathname.startsWith("/api/");
  const isLoginRoute = pathname.startsWith("/admin/login");

  let rateCheck: ReturnType<typeof checkRateLimit> = {
    allowed: true,
    remaining: 999,
    resetSeconds: 60,
    isBlocked: false,
    blockedUntilSeconds: 0,
  };

  if (!isHtmlPageGet && !isLoginRoute) {
    let category: "public" | "sensitiveApi" | "adminAuth" = "public";

    if (pathname.startsWith("/api/admin/auth")) {
      category = "adminAuth";
    } else if (
      pathname.startsWith("/api/contact") ||
      pathname.startsWith("/api/comments") ||
      pathname.startsWith("/api/newsletter")
    ) {
      category = "sensitiveApi";
    }

    rateCheck = checkRateLimit(ip, category);

    if (!rateCheck.allowed) {
      const retryAfter = rateCheck.blockedUntilSeconds || rateCheck.resetSeconds || 60;
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: rateCheck.isBlocked
            ? `Hệ thống tạm thời khóa IP ${ip} do phát hiện lưu lượng bất thường (DDoS Protection). Thử lại sau ${retryAfter} giây.`
            : `Yêu cầu quá nhanh (Rate Limit). Vui lòng thử lại sau ${retryAfter} giây.`,
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-DDoS-Protection": "Active",
          },
        }
      );
    }
  }

  // ── 3. Admin Authentication Guard ─────────────────────────────────────────
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isAuthWhitelist =
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/api/admin/auth");

  if ((isAdminRoute || isAdminApiRoute) && !isAuthWhitelist) {
    const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminToken(sessionCookie);

    if (!session) {
      if (isAdminApiRoute) {
        return NextResponse.json(
          {
            success: false,
            message: "Phiên đăng nhập quản trị không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập Google.",
          },
          { status: 401 }
        );
      }

      // Redirect to Admin Login page
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 4. Set Security & Rate Limit Headers ──────────────────────────────────
  const response = NextResponse.next();

  response.headers.set("X-DDoS-Shield", "Enabled");
  response.headers.set("X-RateLimit-Remaining", String(rateCheck.remaining));
  response.headers.set("X-RateLimit-Reset", String(rateCheck.resetSeconds));

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static media files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp4|webm)).*)",
  ],
};
