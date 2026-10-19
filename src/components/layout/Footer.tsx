"use client";

/**
 * components/layout/Footer.tsx – ToTrongNhan
 * Soft Mint Green Design System Footer
 * Background: #183B32, text: #FFFFFF, secondary text: #C4DED3, divider: #35594D
 */

import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";
import { BRAND } from "@/lib/data";

const SOCIAL_LINKS = [
  { platform: "facebook",  href: BRAND.fanpage,   label: "Facebook" },
  { platform: "tiktok",    href: BRAND.tiktok,    label: "TikTok" },
  { platform: "instagram", href: BRAND.instagram, label: "Instagram" },
  { platform: "youtube",   href: BRAND.youtube,   label: "YouTube" },
  { platform: "zalo",      href: `https://zalo.me/${BRAND.zalo}`, label: "Zalo" },
];

const SERVICE_LINKS = [
  { label: "Dịch Vụ Facebook",  href: "/services?platform=facebook",  platform: "facebook" },
  { label: "Dịch Vụ TikTok",    href: "/services?platform=tiktok",    platform: "tiktok" },
  { label: "Dịch Vụ Instagram", href: "/services?platform=instagram", platform: "instagram" },
  { label: "Dịch Vụ YouTube",   href: "/services?platform=youtube",   platform: "youtube" },
  { label: "Dịch Vụ Threads",   href: "/services?platform=threads",   platform: "threads" },
  { label: "Dịch Vụ Telegram",  href: "/services?platform=telegram",  platform: "telegram" },
];

const QUICK_LINKS = [
  { label: "Về Chúng Tôi",     href: "/about"   },
  { label: "Bảng Giá",         href: "/pricing"  },
  { label: "Blog",             href: "/blog"     },
  { label: "Quản Trị Blog",  href: "/admin"    },
  { label: "Liên Hệ",          href: "/contact"  },
  { label: "Chính Sách",       href: "/privacy"  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#183B32",
        color: "#C4DED3",
        borderTop: "1px solid #35594D",
      }}
      role="contentinfo"
    >
      {/* ── CTA Strip ────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(35,122,96,0.3) 0%, rgba(166,228,209,0.15) 100%)",
        borderBottom: "1px solid #35594D",
        padding: "3rem 1.5rem",
        textAlign: "center",
      }}>
        <div className="container-xl">
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.25rem, 3vw, 1.85rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
            Cần Hỗ Trợ Tăng Trưởng Kênh? Liên Hệ Ngay!
          </h2>
          <p style={{ color: "#C4DED3", marginBottom: "1.75rem", fontSize: "0.95rem" }}>
            Hỗ trợ 24/7 – Tư vấn chiến lược miễn phí – Báo giá nhanh trong 5 phút
          </p>
          <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`https://zalo.me/${BRAND.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "10px",
                background: "#A6E4D1",
                color: "#183B32",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              className="hover:bg-[#8DD9C1] hover:scale-[1.02]"
            >
              <MessageCircle size={17} /> Chat Zalo ({BRAND.zalo})
            </a>
            <a
              href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "10px",
                background: "transparent",
                color: "#FFFFFF",
                border: "1px solid #D7EAE1",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
              className="hover:bg-white/10"
            >
              <Phone size={17} /> Hotline: {BRAND.phone}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Footer ──────────────────────────────────────────────── */}
      <div className="container-xl" style={{ padding: "clamp(2.5rem, 5vw, 4rem) 1.5rem 2.5rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: "2.5rem",
        }}>
          {/* Brand col */}
          <div style={{ maxWidth: 300 }}>
            <div style={{ marginBottom: "1rem" }}>
              <BrandLogo colorMode="white" size={38} showText={true} />
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.8, marginBottom: "1.5rem", color: "#C4DED3" }}>
              Chuyên cung cấp dịch vụ hỗ trợ mạng xã hội Facebook, TikTok, Instagram – uy tín, chất lượng, bảo hành 30 ngày.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {SOCIAL_LINKS.map(({ platform, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "rgba(215, 243, 232, 0.08)",
                    border: "1px solid #35594D",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  className="hover:scale-110 hover:border-[#A6E4D1]"
                >
                  <SocialPlatformLogo platform={platform} size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
              Dịch Vụ
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.55rem",
                      color: "#C4DED3",
                      fontSize: "0.875rem",
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    className="hover:text-[#A6E4D1]"
                  >
                    <SocialPlatformLogo platform={l.platform} size={18} />
                    <span>{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
              Liên Kết
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    style={{ color: "#C4DED3", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.15s" }}
                    className="hover:text-[#A6E4D1]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
              Liên Hệ
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <li style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <Phone size={15} style={{ color: "#A6E4D1", marginTop: "3px", flexShrink: 0 }} />
                <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} style={{ color: "#C4DED3", fontSize: "0.875rem", textDecoration: "none" }} className="hover:text-[#A6E4D1]">
                  {BRAND.phone}
                </a>
              </li>
              <li style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <Mail size={15} style={{ color: "#A6E4D1", marginTop: "3px", flexShrink: 0 }} />
                <a href={`mailto:${BRAND.email}`} style={{ color: "#C4DED3", fontSize: "0.875rem", textDecoration: "none" }} className="hover:text-[#A6E4D1]">
                  {BRAND.email}
                </a>
              </li>
              <li style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <MessageCircle size={15} style={{ color: "#A6E4D1", marginTop: "3px", flexShrink: 0 }} />
                <a href={`https://zalo.me/${BRAND.zalo}`} target="_blank" rel="noopener noreferrer" style={{ color: "#C4DED3", fontSize: "0.875rem", textDecoration: "none" }} className="hover:text-[#A6E4D1]">
                  Zalo: {BRAND.zalo}
                </a>
              </li>
              <li style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <MapPin size={15} style={{ color: "#A6E4D1", marginTop: "3px", flexShrink: 0 }} />
                <span style={{ color: "#C4DED3", fontSize: "0.875rem" }}>{BRAND.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Copyright ─────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #35594D", padding: "1.25rem 1.5rem" }}>
        <div className="container-xl" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <p style={{ fontSize: "0.8rem", color: "#C4DED3", margin: 0 }}>
            © {new Date().getFullYear()} ToTrongNhan. Mọi quyền được bảo lưu.
          </p>
          <p style={{ fontSize: "0.8rem", color: "#C4DED3", margin: 0 }}>
            Hệ thống dịch vụ mạng xã hội chuyên nghiệp
          </p>
        </div>
      </div>
    </footer>
  );
}
