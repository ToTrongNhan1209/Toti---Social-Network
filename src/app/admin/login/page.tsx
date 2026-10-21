"use client";

/**
 * app/admin/login/page.tsx – Admin Google Sign-In & Anti-DDoS Verification Page
 */

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

// Google G logo inline SVG
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}


function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const urlError = searchParams.get("error");
  let initialError: string | null = null;
  if (urlError === "missing_credentials") {
    initialError = "Chưa cấu hình GOOGLE_CLIENT_SECRET! Hãy lấy Client Secret từ Google Cloud Console dán vào wrangler.jsonc hoặc .env.local.";
  } else if (urlError && urlError.toLowerCase().includes("client secret")) {
    initialError = "Mã Google Client Secret không khớp với Client ID đang chạy trên hosting. Vui lòng copy chính xác Client Secret tương ứng của Client ID này trong Google Cloud Console.";
  } else if (urlError) {
    initialError = decodeURIComponent(urlError);
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [gsiLoaded, setGsiLoaded] = useState(false);

  // Check if already logged in (only if no error occurred)
  useEffect(() => {
    if (urlError) {
      // Clear any stale session cookies if an error was reported
      fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
      return;
    }

    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push(from);
        }
      })
      .catch(() => {});
  }, [router, from, urlError]);

  const handleGoogleCredentialLogin = useCallback(
    async (credential: string) => {
      if (honeypot) return; // Silent reject bot

      setError(null);
      setLoading(true);

      try {
        const res = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
        });

        const data = await res.json();

        if (data.success) {
          setSuccess(data.message || "Đăng nhập Google thành công! Đang chuyển đến trang quản trị...");
          setTimeout(() => {
            router.push(from);
          }, 600);
        } else {
          setError(data.message || "Đăng nhập Google thất bại.");
        }
      } catch {
        setError("Lỗi kết nối máy chủ khi xác thực tài khoản Google.");
      } finally {
        setLoading(false);
      }
    },
    [honeypot, router, from]
  );

  // Initialize official Google Identity Services SDK
  useEffect(() => {
    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      (isLocal
        ? process.env.LOCAL_GOOGLE_CLIENT_ID || ""
        : process.env.HOSTED_GOOGLE_CLIENT_ID || "");

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGsiLoaded(true);
      const google = (window as unknown as {
        google?: {
          accounts?: {
            id?: {
              initialize: (config: object) => void;
              renderButton: (el: HTMLElement, config: object) => void;
            };
          };
        };
      }).google;

      if (google?.accounts?.id) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              handleGoogleCredentialLogin(response.credential);
            } else {
              setError("Không nhận được token xác thực từ Google.");
            }
          },
        });

        const btnContainer = document.getElementById("gsi-button-container");
        if (btnContainer) {
          google.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            width: 380,
            text: "signin_with",
            locale: "vi",
            shape: "rectangular",
          });
        }
      }
    };
    document.head.appendChild(script);

    return () => {
      try {
        document.head.removeChild(script);
      } catch {
        // Ignore if already unmounted
      }
    };
  }, [handleGoogleCredentialLogin]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 30%, #E8F8F1 0%, #F4FBF8 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#FFFFFF",
          borderRadius: "24px",
          border: "1.5px solid #B9DCCD",
          boxShadow: "0 20px 60px rgba(24, 59, 50, 0.08)",
          padding: "2.5rem 2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Top Back Link */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.85rem",
              color: "#237A60",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} /> Quay về Trang Chủ
          </Link>
        </div>

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-block", marginBottom: "1rem" }}>
            <BrandLogo size={52} showText={false} href="/" />
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#183B32",
              marginBottom: "0.4rem",
            }}
          >
            Đăng Nhập Quản Trị Hệ Thống
          </h1>
          <p style={{ color: "#607F74", fontSize: "0.88rem", margin: 0 }}>
            Tô Trọng Nhân (Toti) • Quản lý dịch vụ &amp; nội dung bài viết
          </p>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "12px",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              fontSize: "0.86rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.6rem",
              marginBottom: "1.25rem",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "12px",
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#166534",
              fontSize: "0.86rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "1.25rem",
            }}
          >
            <CheckCircle2 size={18} />
            <div>{success}</div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "12px",
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#166534",
              fontSize: "0.86rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              marginBottom: "1.25rem",
              fontWeight: 600,
            }}
          >
            <span>⏳ Đang xác thực tài khoản Google...</span>
          </div>
        )}

        {/* Hidden Honeypot for Anti-Bot */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Official Google Identity Services Button Container */}
        <div
          id="gsi-button-container"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: gsiLoaded ? "1rem" : "0",
            minHeight: gsiLoaded ? 44 : 0,
          }}
        />

        {/* Main Google Sign-In Button */}
        <a
          href="/api/admin/auth/google"
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "0.92rem 1.25rem",
            borderRadius: "14px",
            border: "1.5px solid #E2E8F0",
            background: "#FFFFFF",
            color: "#1E293B",
            fontSize: "0.95rem",
            fontWeight: 700,
            textDecoration: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#CBD5E1";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.08)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E2E8F0";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          title="Đăng nhập bằng tài khoản Google"
        >
          <GoogleIcon size={20} />
          <span>Đăng nhập bằng Google</span>
        </a>

        {/* Security & Access Info Footer */}
        <div
          style={{
            marginTop: "1.75rem",
            padding: "0.9rem 1.1rem",
            borderRadius: "14px",
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            fontSize: "0.82rem",
            color: "#64748B",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: "#334155",
              marginBottom: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            <Lock size={13} color="#166534" />
            Cổng Thông Tin Quản Trị
          </div>
          Dành riêng cho Ban Quản Trị và nhân sự được ủy quyền truy cập hệ thống.
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4FBF8" }}>
          <div style={{ color: "#237A60", fontWeight: 700 }}>Đang tải trang đăng nhập...</div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
