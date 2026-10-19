"use client";

/**
 * components/platform/PlatformPageTemplate.tsx
 * Template trang chuyên sâu cho từng mạng xã hội (Facebook, TikTok, Instagram, YouTube, Threads, Telegram)
 * Lấy cảm hứng từ cấu trúc đa nền tảng của SocialBoost kết hợp Mint Green Design System của Tô Trọng Nhân
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BRAND,
  Platform,
  Service,
  ServiceCategory,
  pricingTiers,
  services,
  PLATFORMS_CATALOG,
} from "@/lib/data";
import {
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ChevronRight,
  Clock,
} from "lucide-react";
import FaqAccordion from "@/components/ui/FaqAccordion";

// ── Authentic Colored Platform Icons ─────────────────────────────────────────

import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";

export function PlatformIcon({
  name,
  size = 28,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  return <SocialPlatformLogo platform={name} size={size} />;
}

// ── Platform Page Component ──────────────────────────────────────────────────

export default function PlatformPageTemplate({
  platformKey,
}: {
  platformKey: Platform;
}) {
  const meta = PLATFORMS_CATALOG.find((p) => p.id === platformKey) || PLATFORMS_CATALOG[0];
  const [allServices, setAllServices] = useState<Service[]>(services);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.services)) {
          setAllServices(data.services);
        }
      })
      .catch(() => {});
  }, []);

  const platformServices = allServices.filter((s) => s.platform === platformKey);
  const platformPricing = pricingTiers.filter((p) => p.platform === platformKey);

  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">("all");

  const filteredServices =
    activeCategory === "all"
      ? platformServices
      : platformServices.filter((s) => s.category === activeCategory);

  return (
    <div className="mesh-bg" style={{ paddingTop: "98px", minHeight: "100vh" }}>
      {/* ── 1. Hero Section ────────────────────────────────────────── */}
      <section
        className="section"
        style={{
          paddingTop: "3rem",
          paddingBottom: "3.5rem",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid #B9DCCD",
          background: `radial-gradient(circle at 50% 10%, ${meta.bgLight} 0%, transparent 70%)`,
        }}
      >
        <div className="container-xl" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
            {/* Platform badge */}
            <div className="animate-slide-up" style={{ marginBottom: "1.25rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 1rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: meta.color,
                  background: meta.bgLight,
                  border: `1px solid ${meta.borderLight}`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
              >
                <PlatformIcon name={meta.iconSvgName} size={18} color={meta.color} />
                <span>{meta.badge} • Dịch Vụ {meta.name} Uy Tín #1</span>
              </span>
            </div>

            {/* Title */}
            <h1
              className="animate-slide-up delay-100"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                fontWeight: 800,
                color: "#183B32",
                lineHeight: 1.18,
                marginBottom: "1.25rem",
                letterSpacing: "-0.02em",
              }}
            >
              Tăng Trưởng{" "}
              <span style={{ color: meta.color }}>{meta.name}</span>{" "}
              <span className="animate-gradient-text">Siêu Tốc &amp; An Toàn</span>
            </h1>

            {/* Tagline & Lead */}
            <p
              className="animate-slide-up delay-200"
              style={{
                fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
                color: "#48665B",
                lineHeight: 1.8,
                maxWidth: 680,
                margin: "0 auto 2rem",
              }}
            >
              {meta.tagline}. {meta.description} Hỗ trợ xử lý nhanh 15 phút, bảo hành 30 ngày bù tụt tự động cùng Tô Trọng Nhân.
            </p>

            {/* CTAs */}
            <div
              className="animate-slide-up delay-300"
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "2.5rem",
              }}
            >
              <a
                href="#services-list"
                className="btn-primary btn-shimmer"
                style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
              >
                Xem {platformServices.length} Dịch Vụ {meta.name} <ArrowRight size={18} />
              </a>
              <a
                href={`https://zalo.me/${BRAND.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline card-glow"
                style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
              >
                <MessageCircle size={18} /> Tư Vấn Zalo Toti
              </a>
            </div>

            {/* Stat Highlights Pills */}
            <div
              className="animate-slide-up delay-400"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
                padding: "1.25rem",
                background: "rgba(255, 255, 255, 0.85)",
                borderRadius: "20px",
                border: "1px solid #B9DCCD",
                boxShadow: "0 8px 24px rgba(24, 59, 50, 0.05)",
                backdropFilter: "blur(12px)",
              }}
            >
              {meta.statHighlights.map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.45rem", fontWeight: 800, color: meta.color }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#71877E", marginTop: "0.2rem" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Platform Dock: Quick Switcher ────────────────────────── */}
      <nav
        style={{
          borderBottom: "1px solid #B9DCCD",
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(12px)",
          padding: "0.75rem 0",
          overflowX: "auto",
        }}
        aria-label="Chuyển đổi nhanh nền tảng"
      >
        <div className="container-xl">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              minWidth: "max-content",
            }}
          >
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#71877E", marginRight: "0.5rem" }}>
              Nền tảng khác:
            </span>
            {PLATFORMS_CATALOG.map((p) => {
              const isCurrent = p.id === platformKey;
              return (
                <Link
                  key={p.id}
                  href={`/${p.slug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "999px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    background: isCurrent ? meta.color : "#FFFFFF",
                    color: isCurrent ? "#FFFFFF" : "#183B32",
                    border: `1px solid ${isCurrent ? meta.color : "#B9DCCD"}`,
                    boxShadow: isCurrent ? "0 4px 12px rgba(0,0,0,0.12)" : "none",
                  }}
                >
                  <PlatformIcon
                    name={p.iconSvgName}
                    size={16}
                    color={isCurrent ? "#FFFFFF" : p.color}
                  />
                  <span>{p.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── 3. Services Catalog & Filter ───────────────────────────── */}
      <section id="services-list" className="section" style={{ paddingBottom: "4rem" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="section-label">Danh mục dịch vụ</span>
            <h2 className="section-title">Các Gói Dịch Vụ {meta.name}</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Lựa chọn đúng dịch vụ theo mục tiêu: tăng tương tác, mở khóa livestream, đạt ngưỡng bật kiếm tiền
            </p>

            {/* Category Filter Pills */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "1.75rem",
              }}
            >
              {[
                { key: "all", label: "Tất Cả Dịch Vụ" },
                { key: "growth", label: "👥 Tăng Trưởng Follow / Sub" },
                { key: "interaction", label: "❤️ Like / Tim / Seeding" },
                { key: "reach", label: "🔥 View Video / Reels / Shorts" },
                { key: "live_vip", label: "👁️ Mắt Livestream & VIP" },
              ].map((tab) => {
                const isActive = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key as ServiceCategory | "all")}
                    style={{
                      padding: "0.5rem 1.1rem",
                      borderRadius: "999px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: `1px solid ${isActive ? "#237A60" : "#B9DCCD"}`,
                      background: isActive ? "#237A60" : "#FFFFFF",
                      color: isActive ? "#FFFFFF" : "#183B32",
                      boxShadow: isActive ? "0 4px 12px rgba(35, 122, 96, 0.2)" : "none",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="card card-glow"
                style={{
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  background: "#FFFFFF",
                  border: "1.5px solid #B9DCCD",
                  borderRadius: "20px",
                }}
              >
                {/* Accent top line if popular */}
                {service.popular && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: meta.color,
                    borderRadius: "20px 20px 0 0",
                  }} />
                )}

                <div>
                  {/* Top Row: Icon on left, Popular badge on right */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1.2rem",
                    gap: "0.75rem",
                  }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: "#FFFFFF",
                        border: `1.5px solid ${meta.borderLight}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(24, 59, 50, 0.05)",
                      }}
                    >
                      <SocialPlatformLogo platform={service.platform} size={36} />
                    </div>

                    {service.popular && (
                      <span
                        style={{
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
                        }}
                      >
                        🔥 Phổ biến
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: "clamp(1.12rem, 2.5vw, 1.25rem)",
                      fontWeight: 800,
                      color: "#183B32",
                      lineHeight: 1.38,
                      marginBottom: "0.6rem",
                    }}
                  >
                    {service.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "#48665B",
                      lineHeight: 1.7,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {service.description}
                  </p>

                  {/* Features list */}
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 1.5rem 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.45rem",
                    }}
                  >
                    {service.features.map((feat: string) => (
                      <li
                        key={feat}
                        style={{
                          fontSize: "0.82rem",
                          color: "#183B32",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.45rem",
                        }}
                      >
                        <CheckCircle2 size={15} color="#237A60" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and CTA button */}
                <div
                  style={{
                    paddingTop: "1.25rem",
                    borderTop: "1px solid #E5F0EA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#71877E" }}>Đơn giá từ</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#237A60" }}>
                      {service.startingPrice.toLocaleString("vi-VN")} đ
                      <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "#71877E", marginLeft: 4 }}>
                        /{service.unit}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://zalo.me/${BRAND.zalo}?text=Chào%20Tô%20Trọng%20Nhân,%20mình%20cần%20tư%20vấn%20gói%20${encodeURIComponent(service.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      fontSize: "0.85rem",
                      padding: "0.55rem 1.1rem",
                      borderRadius: "10px",
                    }}
                  >
                    Đặt Ngay <ChevronRight size={15} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Dedicated Pricing Packages Table ─────────────────────── */}
      {platformPricing.length > 0 && (
        <section
          className="section"
          style={{
            paddingTop: "3.5rem",
            paddingBottom: "4.5rem",
            background: "rgba(255, 255, 255, 0.6)",
            borderTop: "1px solid #B9DCCD",
            borderBottom: "1px solid #B9DCCD",
          }}
        >
          <div className="container-xl">
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <span className="section-label">Bảng Giá Đề Xuất</span>
              <h2 className="section-title">Báo Giá Gói {meta.name} Nổi Bật</h2>
              <p className="section-sub" style={{ margin: "0 auto" }}>
                Số lượng chuẩn hóa, bảo hành 30 ngày bù tụt, không phát sinh chi phí ẩn
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                gap: "1.5rem",
                maxWidth: 1040,
                margin: "0 auto",
              }}
            >
              {platformPricing.map((pkg) => (
                <div
                  key={pkg.id}
                  className="card card-glow"
                  style={{
                    padding: "2rem",
                    borderRadius: "20px",
                    background: pkg.highlight ? "linear-gradient(180deg, #FFFFFF 0%, #E8F8F1 100%)" : "#FFFFFF",
                    border: pkg.highlight ? "2px solid #237A60" : "1.5px solid #B9DCCD",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {pkg.highlight && (
                    <span
                      style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#237A60",
                        color: "#FFFFFF",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        padding: "0.25rem 0.9rem",
                        borderRadius: "999px",
                      }}
                    >
                      ⭐ Gói Khuyên Dùng
                    </span>
                  )}

                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#183B32", marginBottom: "0.5rem" }}>
                    {pkg.name}
                  </div>

                  <div style={{ fontSize: "1.85rem", fontWeight: 900, color: meta.color, marginBottom: "0.5rem" }}>
                    {pkg.price.toLocaleString("vi-VN")} đ
                  </div>

                  <div
                    style={{
                      display: "inline-block",
                      background: meta.bgLight,
                      color: meta.color,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      padding: "0.3rem 0.8rem",
                      borderRadius: "8px",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {pkg.quantity}
                  </div>

                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#48665B",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Clock size={16} /> Thời gian hoàn thành: <strong>{pkg.deliveryTime}</strong>
                  </div>

                  <a
                    href={`https://zalo.me/${BRAND.zalo}?text=Chào%20Tô%20Trọng%20Nhân,%20mình%20muốn%20đặt%20gói%20${encodeURIComponent(pkg.name)}%20(${encodeURIComponent(pkg.quantity)})%20giá%20${pkg.price.toLocaleString("vi-VN")}đ`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Đặt Gói Này <ArrowRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Platform FAQ Accordion ──────────────────────────────── */}
      <section className="section" style={{ paddingBottom: "4.5rem" }}>
        <div className="container-xl" style={{ maxWidth: 840 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="section-label">Hỏi &amp; Đáp</span>
            <h2 className="section-title">Câu Hỏi Thường Gặp Về Dịch Vụ {meta.name}</h2>
          </div>

          <FaqAccordion items={meta.faqs} />
        </div>
      </section>

      {/* ── 6. Bottom Direct Help Banner ────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #183B32 0%, #237A60 100%)",
          color: "#FFFFFF",
          padding: "3.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div className="container-xl" style={{ maxWidth: 720 }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "1rem" }}>
            Cần Tăng Trưởng Kênh {meta.name} Ngay Hôm Nay?
          </h2>
          <p style={{ color: "#D7F3E8", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Liên hệ trực tiếp cùng <strong>Tô Trọng Nhân (Toti)</strong> để nhận báo giá chiết khấu ưu đãi và lộ trình tăng tương tác chuẩn thuật toán.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`https://zalo.me/${BRAND.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-shimmer"
              style={{ background: "#A6E4D1", color: "#183B32", fontWeight: 800, padding: "0.85rem 2rem" }}
            >
              <MessageCircle size={18} /> Chat Zalo Ngay ({BRAND.zalo})
            </a>
            <a
              href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
              className="btn-outline"
              style={{ color: "#FFFFFF", borderColor: "#A6E4D1", padding: "0.85rem 2rem" }}
            >
              📞 Gọi Hotline {BRAND.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
