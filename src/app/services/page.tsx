/**
 * app/services/page.tsx – Trang dịch vụ ToTrongNhan
 */

import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, type Platform } from "@/lib/data";
import { getAllServices } from "@/lib/services-store";
import { CheckCircle2, MessageCircle, Zap } from "lucide-react";
import PricingCalculator from "@/components/ui/PricingCalculator";
import FaqAccordion from "@/components/ui/FaqAccordion";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";

export const metadata: Metadata = {
  title: "Dịch Vụ Mạng Xã Hội Chuyên Nghiệp",
  description: "Dịch vụ tăng followers, like, view cho Facebook, TikTok, Instagram. Chất lượng cao, an toàn, bảo hành 30 ngày.",
};

const platformTabs: { key: Platform | "all"; label: string; color: string }[] = [
  { key: "all",       label: "Tất Cả",     color: "#237A60" },
  { key: "facebook",  label: "Facebook",   color: "#1877F2" },
  { key: "tiktok",    label: "TikTok",     color: "#FF0050" },
  { key: "instagram", label: "Instagram",  color: "#E1306C" },
  { key: "youtube",   label: "YouTube",    color: "#FF0000" },
  { key: "threads",   label: "Threads",    color: "#000000" },
  { key: "telegram",  label: "Telegram",   color: "#229ED9" },
];

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string }>;
}) {
  const { platform } = await searchParams;
  const activePlatform = (platform as Platform) || "all";
  const allServices = getAllServices();
  const filtered = activePlatform === "all"
    ? allServices
    : allServices.filter((s) => s.platform === activePlatform);

  return (
    <div className="mesh-bg" style={{ paddingTop: "98px", minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: "2.5rem" }}>
        <div className="container-xl" style={{ textAlign: "center" }}>
          <span className="section-label">
            <Zap size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            Hệ Sinh Thái Dịch Vụ MXH
          </span>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}>
            Bứt Phá Thương Hiệu Trên Mạng Xã Hội
          </h1>
          <p className="section-sub" style={{ margin: "0 auto 2.5rem" }}>
            Tất cả dịch vụ tăng trưởng Facebook, TikTok và Instagram an toàn nhất hiện nay.
            100% người dùng thật, không cần mật khẩu, bảo hành 30 ngày bù tụt miễn phí.
          </p>

          {/* Platform filter tabs */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            {platformTabs.map((tab) => {
              const isActive = activePlatform === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={tab.key === "all" ? "/services" : `/services?platform=${tab.key}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.55rem 1.25rem", borderRadius: 50,
                    border: `1.5px solid ${isActive ? "#237A60" : "#D7EAE1"}`,
                    background: isActive ? "#E8F8F1" : "#FFFFFF",
                    color: isActive ? "#183B32" : "#48665B",
                    fontWeight: 700, fontSize: "0.92rem", textDecoration: "none",
                    boxShadow: "0 2px 6px rgba(24, 59, 50, 0.04)",
                    transition: "all 0.2s",
                  }}
                >
                  {tab.key === "all" ? (
                    <span style={{ fontSize: "1.1rem" }}>🌐</span>
                  ) : (
                    <SocialPlatformLogo platform={tab.key} size={20} />
                  )}
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Service Cards Grid ─────────────────────────────────────────── */}
      <section style={{ paddingBottom: "4rem" }}>
        <div className="container-xl">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1.75rem" }}>
            {filtered.map((svc) => (
              <div
                key={svc.id}
                id={svc.id}
                className="card"
                style={{ padding: "clamp(1.25rem, 3.5vw, 2rem)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                {/* Accent top line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: "#237A60",
                  borderRadius: "16px 16px 0 0",
                }} />

                <div>
                  {/* Top Row: Icon on left, Badges (Popular + Platform) on right */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1.1rem",
                    gap: "0.75rem",
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: "#FFFFFF",
                      border: "1.5px solid #D7EAE1",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(24, 59, 50, 0.06)",
                    }}>
                      <SocialPlatformLogo platform={svc.platform} size={36} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {svc.popular && (
                        <span style={{
                          background: "linear-gradient(135deg, #183B32 0%, #237A60 100%)",
                          color: "#A6E4D1",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "0.28rem 0.7rem",
                          borderRadius: "999px",
                          letterSpacing: "0.04em",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          boxShadow: "0 2px 8px rgba(24, 59, 50, 0.12)",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}>
                          🔥 PHỔ BIẾN
                        </span>
                      )}
                      <span style={{
                        display: "inline-block",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "999px",
                        background: "#D7F3E8",
                        border: "1px solid #B9DCCD",
                        color: "#183B32",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                      }}>
                        {svc.platform}
                      </span>
                    </div>
                  </div>

                  {/* Title: Full width, zero overlap */}
                  <h2 style={{
                    fontSize: "clamp(1.12rem, 2.5vw, 1.25rem)",
                    fontWeight: 700,
                    lineHeight: 1.38,
                    marginBottom: "0.55rem",
                    color: "#183B32",
                  }}>
                    {svc.title}
                  </h2>

                  <p style={{ color: "#48665B", fontSize: "0.88rem", lineHeight: 1.68, marginBottom: "1.25rem" }}>
                    {svc.description}
                  </p>

                  {/* Features checklist */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {svc.features.map((f) => (
                      <li key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.88rem", color: "#183B32" }}>
                        <CheckCircle2 size={15} style={{ color: "#237A60", flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price + CTA */}
                <div style={{ paddingTop: "1.25rem", borderTop: "1px solid #E5F0EA" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#71877E" }}>Giá khởi điểm từ</span>
                    <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#183B32" }}>
                      {svc.startingPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                    <a
                      href={`https://zalo.me/${BRAND.zalo}?text=${encodeURIComponent(`Chào ToTrongNhan, tôi muốn được tư vấn dịch vụ: ${svc.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{
                        padding: "0.65rem 0.5rem",
                        fontSize: "0.85rem",
                        justifyContent: "center",
                      }}
                    >
                      <MessageCircle size={15} /> Đặt Ngay
                    </a>
                    <Link
                      href="/pricing"
                      className="btn-outline"
                      style={{
                        padding: "0.65rem 0.5rem",
                        fontSize: "0.85rem",
                        justifyContent: "center",
                      }}
                    >
                      Xem Bảng Giá
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── Interactive Calculator Section ────────────────────────────── */}
      <section className="section">
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="section-label">Công cụ dự toán</span>
            <h2 className="section-title">Tính Chi Phí Theo Số Lượng</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Ước tính giá chính xác theo số lượng bạn cần với ưu đãi tự động
            </p>
          </div>
          <PricingCalculator />
        </div>
      </section>

      <hr className="divider" />

      {/* ── FAQs Section ──────────────────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: "6rem", background: "#EDF8F3" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Câu hỏi thường gặp</span>
            <h2 className="section-title">Thắc Mắc Về Dịch Vụ</h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

    </div>
  );
}
