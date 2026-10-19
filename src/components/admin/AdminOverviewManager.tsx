"use client";

/**
 * components/admin/AdminOverviewManager.tsx
 * System Overview, Analytics & Health Dashboard for ToTrongNhan CMS.
 */

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Server,
  Lock,
  Plus,
} from "lucide-react";
import AdminWeatherWidget from "@/components/admin/AdminWeatherWidget";
import AdminDashboardCharts from "@/components/admin/AdminDashboardCharts";
import TypewriterText from "@/components/ui/TypewriterText";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";

export default function AdminOverviewManager({
  onSwitchTab,
}: {
  onSwitchTab: (tab: "services" | "blog" | "overview" | "profile") => void;
}) {
  return (
    <div>
      {/* ── Banner Header ────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #183B32 0%, #237A60 100%)",
          borderRadius: "20px",
          padding: "2rem 2.5rem",
          color: "#FFFFFF",
          marginBottom: "2rem",
          boxShadow: "0 12px 32px rgba(24, 59, 50, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              fontSize: "0.78rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            <ShieldCheck size={14} /> ToTrongNhan Control Center • Phiên Bản Quản Trị Độc Lập
          </div>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
              fontWeight: 800,
              margin: 0,
              marginBottom: "0.5rem",
              color: "#FFFFFF",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.25)",
              letterSpacing: "-0.01em",
            }}
          >
            Chào mừng trở lại, Tô Trọng Nhân!
          </h2>
          <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.9, lineHeight: 1.6 }}>
            Trang quản trị CMS hoạt động độc lập không bị phụ thuộc vào giao diện client. Toàn bộ dịch vụ, bài viết và bảo mật hệ thống đang trong trạng thái tối ưu 24/7.
          </p>

          {/* Live Typewriter System Status */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "0.85rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              background: "rgba(0, 0, 0, 0.22)",
              border: "1px solid rgba(166, 228, 209, 0.35)",
              fontSize: "0.82rem",
              color: "#A6E4D1",
              maxWidth: "100%",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#A6E4D1",
                display: "inline-block",
                boxShadow: "0 0 6px #A6E4D1",
                flexShrink: 0,
              }}
            />
            <span style={{ fontWeight: 800, color: "#A6E4D1", flexShrink: 0 }}>Hệ thống:</span>
            <TypewriterText
              texts={[
                "Tường lửa Anti-DDoS đang giám sát an toàn 24/7...",
                "Đã kết nối trạm thời tiết & định vị thực tế tại Gia Lai...",
                "Quản lý Dịch vụ CRUD và Bài viết Blog đã sẵn sàng...",
                "Xác thực bảo mật cao cấp với Google OAuth 2.0...",
              ]}
              typingSpeed={35}
              deletingSpeed={18}
              pauseDuration={2600}
              cursorColor="#A6E4D1"
              style={{ fontWeight: 600, color: "#FFFFFF" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => onSwitchTab("services")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.75rem 1.4rem",
              borderRadius: "12px",
              border: "none",
              background: "#FFFFFF",
              color: "#183B32",
              fontSize: "0.92rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Plus size={16} /> Thêm Dịch Vụ Mới
          </button>
          <button
            type="button"
            onClick={() => onSwitchTab("blog")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.75rem 1.4rem",
              borderRadius: "12px",
              border: "1.5px solid rgba(255, 255, 255, 0.4)",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#FFFFFF",
              fontSize: "0.92rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <BookOpen size={16} /> Soạn Bài Viết
          </button>
        </div>
      </div>

      {/* ── Visual Analytics & Performance Charts Dashboard ──────── */}
      <AdminDashboardCharts />

      {/* ── Real-time Weather & Current Location ──────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <AdminWeatherWidget variant="card" />
      </div>

      {/* ── Security & System Health Cards ────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {/* Anti-DDoS Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: "#E8F8F1",
                color: "#237A60",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: "#183B32", fontSize: "1.05rem" }}>
                Tường Lửa Anti-DDoS
              </div>
              <div style={{ fontSize: "0.8rem", color: "#237A60", fontWeight: 700 }}>
                ● Đang Hoạt Động (Active)
              </div>
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#607F74", lineHeight: 1.6, margin: 0, marginBottom: "1rem" }}>
            Sliding Window bảo vệ 15 req/phút cho các API nhạy cảm. Tự động phát hiện và khóa IP các bot quét lỗ hổng hoặc flood URL query.
          </p>
          <div
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: "#F4FBF8",
              border: "1px solid #D7EAE1",
              fontSize: "0.78rem",
              color: "#183B32",
              fontFamily: "monospace",
            }}
          >
            Rate-Limit: 15 req/min • Lock: 900s
          </div>
        </div>

        {/* Google OAuth Session */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: "#EFF6FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: "#183B32", fontSize: "1.05rem" }}>
                Xác Thực Quản Trị
              </div>
              <div style={{ fontSize: "0.8rem", color: "#2563EB", fontWeight: 700 }}>
                ● Google OAuth 2.0 Whitelist
              </div>
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#607F74", lineHeight: 1.6, margin: 0, marginBottom: "1rem" }}>
            Mã hóa phiên làm việc HMAC SHA-256 bảo vệ chống giả mạo token. Chỉ email được cấp phép trong danh sách trắng mới có quyền chỉnh sửa.
          </p>
          <div
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: "#F4FBF8",
              border: "1px solid #D7EAE1",
              fontSize: "0.78rem",
              color: "#183B32",
              fontFamily: "monospace",
            }}
          >
            Email: totrongnhan1209@gmail.com
          </div>
        </div>

        {/* Next.js Runtime Status */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.5rem",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: "#FFFBEB",
                color: "#D97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Server size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: "#183B32", fontSize: "1.05rem" }}>
                Máy Chủ &amp; Lưu Trữ
              </div>
              <div style={{ fontSize: "0.8rem", color: "#D97706", fontWeight: 700 }}>
                ● File-Store JSON &amp; In-Memory Cache
              </div>
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#607F74", lineHeight: 1.6, margin: 0, marginBottom: "1rem" }}>
            Dữ liệu dịch vụ và blog được lưu trữ an toàn trong `src/data/services.json` và `src/data/posts.json` kèm cơ chế ghi file nguyên tử (atomic rename).
          </p>
          <div
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: "#F4FBF8",
              border: "1px solid #D7EAE1",
              fontSize: "0.78rem",
              color: "#183B32",
              fontFamily: "monospace",
            }}
          >
            Next.js App Router • React 19
          </div>
        </div>
      </div>

      {/* ── Quick Navigation Cards ─────────────────────────────────── */}
      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#183B32", marginBottom: "1rem" }}>
        Lối Tắt Quản Trị Nhanh
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.25rem",
        }}
      >
        <div
          onClick={() => onSwitchTab("services")}
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.5rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
          }}
          className="hover:border-[#237A60] hover:shadow-md"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap" }}>
              <SocialPlatformLogo platform="facebook" size={24} />
              <SocialPlatformLogo platform="tiktok" size={24} />
              <SocialPlatformLogo platform="instagram" size={24} />
              <SocialPlatformLogo platform="youtube" size={24} />
              <SocialPlatformLogo platform="threads" size={24} />
              <SocialPlatformLogo platform="telegram" size={24} />
            </div>
            <ArrowRight size={18} style={{ color: "#237A60" }} />
          </div>
          <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#183B32", margin: "0 0 0.35rem" }}>
            Quản Lý Toàn Bộ Dịch Vụ
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#607F74", margin: 0, lineHeight: 1.5 }}>
            Thêm mới, sửa giá, đổi đơn vị tính, bật/tắt dịch vụ Phổ biến cho Facebook, TikTok, Instagram, YouTube, Threads, Telegram.
          </p>
        </div>

        <div
          onClick={() => onSwitchTab("blog")}
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.5rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
          }}
          className="hover:border-[#237A60] hover:shadow-md"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "1.8rem" }}>📝</div>
            <ArrowRight size={18} style={{ color: "#237A60" }} />
          </div>
          <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#183B32", margin: "0 0 0.35rem" }}>
            Quản Lý Bài Viết Blog &amp; SEO
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#607F74", margin: 0, lineHeight: 1.5 }}>
            Soạn thảo bài viết mới với trình soạn thảo trực quan, chọn ảnh bìa, phân loại chuyên mục và tối ưu từ khóa SEO Google.
          </p>
        </div>

        <div
          onClick={() => onSwitchTab("profile")}
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.5rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
          }}
          className="hover:border-[#237A60] hover:shadow-md"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "1.8rem" }}>👤</div>
            <ArrowRight size={18} style={{ color: "#237A60" }} />
          </div>
          <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#183B32", margin: "0 0 0.35rem" }}>
            Hồ Sơ &amp; Bảo Mật Google
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#607F74", margin: 0, lineHeight: 1.5 }}>
            Xem và chỉnh sửa họ tên, avatar, số điện thoại, tiểu sử và thông tin tài khoản Google ủy quyền.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.5rem",
            textDecoration: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
            display: "block",
          }}
          className="hover:border-[#237A60] hover:shadow-md"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "1.8rem" }}>🌐</div>
            <ArrowRight size={18} style={{ color: "#237A60" }} />
          </div>
          <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#183B32", margin: "0 0 0.35rem" }}>
            Xem Giao Diện Client
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#607F74", margin: 0, lineHeight: 1.5 }}>
            Kiểm tra trải nghiệm người dùng thực tế trên website công khai (Trang chủ, Dịch vụ, Công cụ tính giá, Blog).
          </p>
        </Link>
      </div>
    </div>
  );
}
