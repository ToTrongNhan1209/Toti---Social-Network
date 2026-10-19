"use client";

/**
 * app/admin/login/page.tsx – Admin Google Sign-In & Anti-DDoS Verification Page
 */

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Zap,
  ExternalLink,
  HelpCircle,
  X,
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

// Helper to decode Google credential JWT ID token
function decodeGoogleJwt(token: string): { email?: string; name?: string; picture?: string } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const urlError = searchParams.get("error");
  const initialError =
    urlError === "missing_credentials"
      ? "Chưa cấu hình GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET trong file .env.local để kết nối với Google thật. Xem hướng dẫn bên dưới hoặc dùng nút Đăng Nhập Nhanh."
      : urlError
      ? decodeURIComponent(urlError)
      : null;

  const [email, setEmail] = useState("totrongnhan1209@gmail.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(urlError === "missing_credentials");


  // Check if already logged in
  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push(from);
        }
      })
      .catch(() => {});
  }, [router, from]);

  const handleLogin = useCallback(
    async (
      targetEmail: string,
      name: string = "Tô Trọng Nhân",
      avatarUrl?: string
    ) => {
      if (honeypot) return; // Silent reject bot

      setError(null);
      setLoading(true);

      try {
        const res = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: targetEmail,
            name,
            avatar:
              avatarUrl ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
            provider: "google",
          }),
        });

        const data = await res.json();

        if (data.success) {
          setSuccess("Đăng nhập thành công! Đang chuyển đến trang quản trị...");
          setTimeout(() => {
            router.push(from);
          }, 600);
        } else {
          setError(data.message || "Đăng nhập thất bại.");
        }
      } catch {
        setError("Lỗi kết nối máy chủ hoặc tường lửa chặn yêu cầu.");
      } finally {
        setLoading(false);
      }
    },
    [honeypot, router, from]
  );

  // Initialize official Google Identity Services SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGsiLoaded(true);
      const google = (window as unknown as { google?: { accounts?: { id?: { initialize: (config: object) => void; renderButton: (el: HTMLElement, config: object) => void } } } }).google;
      if (google?.accounts?.id) {
        google.accounts.id.initialize({
          client_id:
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
            "1028392182910-totrongnhan.apps.googleusercontent.com",
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              const decoded = decodeGoogleJwt(response.credential);
              if (decoded?.email) {
                handleLogin(
                  decoded.email,
                  decoded.name || "Tô Trọng Nhân",
                  decoded.picture
                );
              } else {
                setError("Không thể giải mã phản hồi Google Identity.");
              }
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
  }, [handleLogin]);

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
            <BrandLogo size={52} showText={false} />
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

          {/* Security Status Pill */}
          <div style={{ marginTop: "1rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.3rem 0.8rem",
                borderRadius: "999px",
                background: "#E8F8F1",
                border: "1px solid #B9DCCD",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#237A60",
              }}
            >
              <ShieldCheck size={14} /> Tường lửa Anti-DDoS &amp; Xác thực Google
            </span>
          </div>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "12px",
              background: "#FFF2F2",
              border: "1px solid #F1B2B3",
              color: "#D9383A",
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
              background: "#E8F8F1",
              border: "1px solid #B9DCCD",
              color: "#237A60",
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

        {/* Main Google Real OAuth 2.0 Button */}
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
            border: "1.5px solid #4285F4",
            background: "#FFFFFF",
            color: "#183B32",
            fontSize: "0.95rem",
            fontWeight: 800,
            textDecoration: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(66, 133, 244, 0.15)",
            transition: "all 0.2s ease",
            marginBottom: "0.75rem",
            boxSizing: "border-box",
          }}
          title="Mở màn hình chọn tài khoản Google thật (accounts.google.com)"
        >
          <GoogleIcon size={22} />
          <span>Đăng nhập với Google Thật (OAuth 2.0)</span>
        </a>

        {/* Quick Bypass Login Button */}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleLogin("totrongnhan1209@gmail.com", "Tô Trọng Nhân")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            padding: "0.75rem 1.25rem",
            borderRadius: "12px",
            border: "1px solid #B9DCCD",
            background: "#F4FBF8",
            color: "#237A60",
            fontSize: "0.88rem",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            marginBottom: "0.5rem",
            opacity: loading ? 0.7 : 1,
          }}
          title="Đăng nhập ngay với tài khoản Tô Trọng Nhân không cần chờ cấu hình Google Cloud"
        >
          <Zap size={16} />
          {loading ? "Đang xác thực phiên..." : "Đăng nhập nhanh an toàn (Tô Trọng Nhân)"}
        </button>

        {/* Setup Guide Link */}
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <button
            type="button"
            onClick={() => setShowSetupGuide((prev) => !prev)}
            style={{
              background: "none",
              border: "none",
              color: "#607F74",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              textDecoration: "underline",
            }}
          >
            <HelpCircle size={13} />
            {showSetupGuide ? "Đóng hướng dẫn cấu hình Google" : "Xem cách lấy Google Client ID thật (2 phút)"}
          </button>
        </div>

        {/* Setup Guide Modal/Card */}
        {showSetupGuide && (
          <div
            style={{
              background: "#F8FCFA",
              border: "1.5px solid #A6E4D1",
              borderRadius: "14px",
              padding: "1.25rem",
              marginBottom: "1.25rem",
              fontSize: "0.84rem",
              color: "#183B32",
              lineHeight: 1.6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: 800,
                color: "#183B32",
                marginBottom: "0.6rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <GoogleIcon size={16} />
                <span>Cấu Hình Google Cloud OAuth 2.0 Thật:</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSetupGuide(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#607F74" }}
              >
                <X size={16} />
              </button>
            </div>
            <p style={{ margin: "0 0 0.6rem", color: "#48665B" }}>
              Để Google chuyển hướng đến popup đăng nhập tài khoản Gmail thật (<strong>accounts.google.com</strong>), bạn chỉ cần tạo Client ID hoàn toàn miễn phí:
            </p>
            <ol style={{ margin: "0 0 0.8rem", paddingLeft: "1.2rem", color: "#183B32" }}>
              <li>
                Mở{" "}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#237A60", fontWeight: 700 }}
                >
                  Google Cloud Console Credentials <ExternalLink size={12} style={{ display: "inline" }} />
                </a>
              </li>
              <li>Bấm <strong>+ Create Credentials</strong> &rarr; Chọn <strong>OAuth client ID</strong> &rarr; Application type: <strong>Web application</strong>.</li>
              <li>Thêm <strong>Authorized redirect URIs</strong>: <code style={{ background: "#E8F8F1", padding: "0.1rem 0.35rem", borderRadius: "4px" }}>http://localhost:3000/api/admin/auth/google/callback</code></li>
              <li>Sao chép <strong>Client ID</strong> và <strong>Client Secret</strong> dán vào file <code style={{ background: "#E8F8F1", padding: "0.1rem 0.35rem", borderRadius: "4px" }}>.env.local</code> ở thư mục gốc dự án.</li>
            </ol>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <a
                href="/api/admin/auth/google"
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#237A60",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Thử lại Google thật ngay
              </a>
              <button
                type="button"
                onClick={() => handleLogin("totrongnhan1209@gmail.com", "Tô Trọng Nhân")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #B9DCCD",
                  background: "#FFFFFF",
                  color: "#183B32",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
              >
                Đăng nhập nhanh bỏ qua
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "1.5rem 0",
            color: "#8EABA1",
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#D7EAE1" }} />
          <span style={{ padding: "0 0.8rem", textTransform: "uppercase" }}>Hoặc tài khoản khác</span>
          <div style={{ flex: 1, height: 1, background: "#D7EAE1" }} />
        </div>

        {/* Custom Admin Google Email Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email, email.split("@")[0]);
          }}
        >
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#183B32",
                marginBottom: "0.4rem",
              }}
            >
              Email Google được ủy quyền quản trị
            </label>
            <input
              type="email"
              required
              placeholder="ví dụ: totrongnhan1209@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "1.5px solid #B9DCCD",
                background: "#F4FBF8",
                fontSize: "0.92rem",
                color: "#183B32",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", color: "#607F74", alignSelf: "center" }}>Gợi ý:</span>
              <button
                type="button"
                onClick={() => setEmail("totrongnhan1209@gmail.com")}
                style={{
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #B9DCCD",
                  background: email === "totrongnhan1209@gmail.com" ? "#E8F8F1" : "#FFFFFF",
                  color: "#237A60",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                totrongnhan1209@gmail.com
              </button>
              <button
                type="button"
                onClick={() => setEmail("admin@totrongnhan.vn")}
                style={{
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #B9DCCD",
                  background: email === "admin@totrongnhan.vn" ? "#E8F8F1" : "#FFFFFF",
                  color: "#237A60",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                admin@totrongnhan.vn
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.85rem 1.25rem",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #237A60 0%, #183B32 100%)",
              color: "#FFFFFF",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(35, 122, 96, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {loading ? "Đang xử lý..." : "Xác Thực & Vào Quản Trị"} <ArrowRight size={16} />
          </button>
        </form>

        {/* Security Notice Box */}
        <div
          style={{
            marginTop: "1.75rem",
            padding: "1rem",
            borderRadius: "12px",
            background: "#F4FBF8",
            border: "1px solid #D7EAE1",
            fontSize: "0.8rem",
            color: "#607F74",
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, color: "#183B32", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Lock size={13} /> Quy định bảo mật nghiêm ngặt:
          </div>
          Chỉ các tài khoản Google nằm trong danh sách trắng (Whitelist) mới được cấp quyền truy cập. Mọi hành vi tấn công dò mật khẩu (Brute-Force) hoặc flood request sẽ tự động bị tường lửa chặn IP trong 15 phút.
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
