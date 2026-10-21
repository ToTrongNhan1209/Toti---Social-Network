"use client";

/**
 * components/layout/Navbar.tsx – ToTrongNhan
 * Creative, High-End Floating Capsule Header with Soft Mint Aesthetics
 * Clean, legible, attractive design with live status ticker and mega menu.
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Search,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";
import GlobalSearchModal from "@/components/ui/GlobalSearchModal";
import { BRAND } from "@/lib/data";

interface PlatformItem {
  id: string;
  name: string;
  href: string;
  platform: string;
  desc: string;
  badge?: string;
  color: string;
}

const PLATFORMS_MEGA: PlatformItem[] = [
  {
    id: "facebook",
    name: "Facebook",
    href: "/facebook",
    platform: "facebook",
    desc: "Tăng Like, Follow, View Reels, Group",
    badge: "Phổ biến",
    color: "#1877F2",
  },
  {
    id: "tiktok",
    name: "TikTok",
    href: "/tiktok",
    platform: "tiktok",
    desc: "Follow chuẩn, Tim video, Mắt Live",
    badge: "Hot Trend",
    color: "#000000",
  },
  {
    id: "instagram",
    name: "Instagram",
    href: "/instagram",
    platform: "instagram",
    desc: "Follow Việt/Tây, Tim, Story & Reels",
    badge: "Quốc tế",
    color: "#E1306C",
  },
  {
    id: "youtube",
    name: "YouTube",
    href: "/youtube",
    platform: "youtube",
    desc: "Subscribers, View 4000h bật kiếm tiền",
    badge: "Chuẩn BKT",
    color: "#FF0000",
  },
  {
    id: "threads",
    name: "Threads",
    href: "/threads",
    platform: "threads",
    desc: "Tương tác bài đăng, Follow tài khoản",
    badge: "Mới",
    color: "#101010",
  },
  {
    id: "telegram",
    name: "Telegram",
    href: "/telegram",
    platform: "telegram",
    desc: "Member kênh, Group, Tăng lượt xem",
    badge: "Bảo mật",
    color: "#229ED9",
  },
];

type NavLinkItem = {
  id: string;
  label: string;
  href: string;
  isMega?: boolean;
};

const NAV_LINKS: NavLinkItem[] = [
  { id: "home", label: "Trang Chủ", href: "/" },
  { id: "platforms", label: "Nền Tảng", href: "/services", isMega: true },
  { id: "services", label: "Tất Cả Dịch Vụ", href: "/services" },
  { id: "pricing", label: "Bảng Giá", href: "/pricing" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "about", label: "Về Toti", href: "/about" },
  { id: "contact", label: "Liên Hệ", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [prevPathname, setPrevPathname] = useState(pathname);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on route navigation
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setDropOpen(false);
  }

  // Live real-time clock (Vietnam GMT+7)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Ho_Chi_Minh",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll listener for dynamic floating capsule
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mega menu grace timeout for smooth cursor movement
  const handleDropdownEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setDropOpen(true);
  };

  const handleDropdownLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropOpen(false);
    }, 220);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Top Running Status & Hotline Bar ─────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
          height: scrolled ? 0 : "34px",
          opacity: scrolled ? 0 : 1,
          transform: scrolled ? "translateY(-100%)" : "translateY(0)",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden",
          background: "linear-gradient(90deg, #112822 0%, #183B32 50%, #237A60 100%)",
          color: "#FFFFFF",
          fontSize: "0.78rem",
          fontWeight: 600,
          borderBottom: "1px solid rgba(166, 228, 209, 0.25)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="container-xl"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "1rem",
          }}
        >
          {/* Left: System Status & Clock */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexShrink: 0 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                color: "#A6E4D1",
                background: "rgba(166, 228, 209, 0.15)",
                padding: "0.15rem 0.55rem",
                borderRadius: "999px",
                fontSize: "0.72rem",
                border: "1px solid rgba(166, 228, 209, 0.3)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 6px #4ade80",
                }}
              />
              Hệ thống: 100% Online
            </span>

            {currentTime && (
              <span
                className="hide-mobile"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.72rem",
                }}
              >
                <Clock size={12} style={{ color: "#A6E4D1" }} />
                <span>VN {currentTime} GMT+7</span>
              </span>
            )}
          </div>

          {/* Center: Live Running Ticker */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              whiteSpace: "nowrap",
              maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
            }}
          >
            <div className="marquee-track" style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.9)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "1.5rem" }}>
                <span>💎 <strong>TÔ TRỌNG NHÂN (TOTI)</strong>: Dịch vụ Tăng Trưởng MXH Hàng Đầu</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                <span>⚡ Xử lý tự động siêu tốc 30 phút</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                <span>🛡️ An toàn 100% không yêu cầu mật khẩu</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                <span>✨ Bảo hành 30 ngày bù tụt tự động</span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                <span>📞 Hotline: {BRAND.phone}</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Links */}
          <div
            className="hide-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexShrink: 0,
              fontSize: "0.74rem",
            }}
          >
            <a
              href={`https://zalo.me/${BRAND.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#A6E4D1",
                textDecoration: "none",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span>Zalo Tư Vấn: {BRAND.zalo}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Dynamic Header / Floating Capsule ───────────────────────── */}
      <header
        className={`floating-island-navbar ${scrolled ? "is-floating" : ""}`}
        style={{
          position: "fixed",
          top: scrolled ? "14px" : "34px",
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled
            ? "rgba(255, 255, 255, 0.94)"
            : "rgba(244, 251, 248, 0.95)",
          borderBottom: scrolled ? "none" : "1px solid #D7EAE1",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: scrolled
            ? "0 18px 45px -10px rgba(24, 59, 50, 0.12), 0 0 0 1px rgba(166, 228, 209, 0.75)"
            : "0 4px 18px rgba(24, 59, 50, 0.03)",
        }}
      >
        <div
          className="container-xl"
          style={{
            height: scrolled ? "60px" : "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.25rem",
            transition: "height 0.3s ease",
          }}
        >
          {/* 1. Official Brand Logo Lockup */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "relative",
                transition: "transform 0.2s ease",
              }}
              className="hover:scale-105"
            >
              <BrandLogo size={scrolled ? 38 : 44} showText={false} href="/" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span
                  style={{
                    fontSize: "1.08rem",
                    fontWeight: 850,
                    color: "#183B32",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Tô Trọng Nhân
                </span>
                <span
                  title="Dịch vụ MXH xác minh uy tín"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    background: "#237A60",
                    color: "#FFFFFF",
                    fontSize: "0.62rem",
                    fontWeight: 900,
                  }}
                >
                  ✓
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 650,
                  color: "#527568",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Social Growth Agency
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation with Clean Mega Menu */}
          <nav
            className="hide-mobile"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) =>
              link.isMega ? (
                <div
                  key={link.id}
                  style={{ position: "relative" }}
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    type="button"
                    onClick={() => setDropOpen((prev) => !prev)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.5rem 0.9rem",
                      borderRadius: "999px",
                      border: "none",
                      background: dropOpen
                        ? "rgba(166, 228, 209, 0.35)"
                        : isActive(link.href)
                        ? "rgba(166, 228, 209, 0.25)"
                        : "transparent",
                      color:
                        dropOpen || isActive(link.href)
                          ? "#237A60"
                          : "#183B32",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    aria-expanded={dropOpen}
                  >
                    <span>{link.label}</span>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "999px",
                        background: "#E8F8F1",
                        color: "#237A60",
                        fontWeight: 800,
                      }}
                    >
                      6 App
                    </span>
                    <ChevronDown
                      size={14}
                      style={{
                        transform: dropOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.25s ease",
                      }}
                    />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {dropOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        paddingTop: "12px",
                        zIndex: 200,
                        width: "580px",
                        maxWidth: "92vw",
                      }}
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div
                        className="animate-slide-up"
                        style={{
                          background: "#FFFFFF",
                          border: "1.5px solid #A6E4D1",
                          borderRadius: "20px",
                          padding: "1.25rem",
                          boxShadow:
                            "0 22px 50px -10px rgba(24, 59, 50, 0.18), 0 0 0 1px rgba(255,255,255,0.9) inset",
                        }}
                      >
                        {/* Mega Menu Header */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingBottom: "0.75rem",
                            marginBottom: "0.85rem",
                            borderBottom: "1px solid #E8F8F1",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                            <Sparkles size={16} style={{ color: "#237A60" }} />
                            <span
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: 800,
                                color: "#183B32",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              Hệ Sinh Thái 6 Nền Tảng MXH
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color: "#237A60",
                              background: "#E8F8F1",
                              padding: "0.15rem 0.55rem",
                              borderRadius: "999px",
                            }}
                          >
                            ⚡ Chuẩn Thuật Toán 2026
                          </span>
                        </div>

                        {/* 2-Column Grid */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "0.6rem",
                            marginBottom: "1rem",
                          }}
                        >
                          {PLATFORMS_MEGA.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setDropOpen(false)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                padding: "0.65rem 0.85rem",
                                borderRadius: "14px",
                                textDecoration: "none",
                                border: "1px solid transparent",
                                background: "#FAFCFB",
                                transition: "all 0.18s ease",
                              }}
                              className="hover:bg-[#E8F8F1] hover:border-[#A6E4D1]"
                            >
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: "10px",
                                  background: "#FFFFFF",
                                  border: "1px solid #D7EAE1",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  boxShadow: "0 2px 8px rgba(24,59,50,0.04)",
                                }}
                              >
                                <SocialPlatformLogo platform={item.platform} size={22} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "0.1rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.88rem",
                                      fontWeight: 800,
                                      color: "#183B32",
                                    }}
                                  >
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <span
                                      style={{
                                        fontSize: "0.65rem",
                                        fontWeight: 700,
                                        color: item.color,
                                        background: "rgba(0,0,0,0.04)",
                                        padding: "0.08rem 0.35rem",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p
                                  style={{
                                    fontSize: "0.72rem",
                                    color: "#527568",
                                    margin: 0,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {/* Bottom Highlight Consultation Banner */}
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #E8F8F1 0%, #D7F3E8 100%)",
                            borderRadius: "12px",
                            padding: "0.75rem 1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: "1px solid #B9DCCD",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: "#237A60",
                                color: "#FFFFFF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                              }}
                            >
                              💡
                            </div>
                            <div>
                              <p
                                style={{
                                  fontSize: "0.78rem",
                                  fontWeight: 800,
                                  color: "#183B32",
                                  margin: 0,
                                }}
                              >
                                Cần tư vấn chiến lược tăng trưởng riêng?
                              </p>
                              <p
                                style={{
                                  fontSize: "0.7rem",
                                  color: "#48665B",
                                  margin: 0,
                                }}
                              >
                                Tô Trọng Nhân hỗ trợ trực tiếp 1-1 qua Zalo
                              </p>
                            </div>
                          </div>
                          <a
                            href={`https://zalo.me/${BRAND.zalo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: "0.35rem 0.8rem",
                              borderRadius: "999px",
                              background: "#237A60",
                              color: "#FFFFFF",
                              fontSize: "0.76rem",
                              fontWeight: 700,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              whiteSpace: "nowrap",
                              boxShadow: "0 4px 12px rgba(35, 122, 96, 0.2)",
                            }}
                          >
                            Nhắn Zalo <ArrowRight size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.id}
                  href={link.href}
                  style={{
                    padding: "0.5rem 0.85rem",
                    borderRadius: "999px",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: isActive(link.href)
                      ? "#237A60"
                      : "#183B32",
                    background: isActive(link.href)
                      ? "rgba(166, 228, 209, 0.3)"
                      : "transparent",
                    transition: "all 0.18s ease",
                    textDecoration: "none",
                    position: "relative",
                  }}
                  className={
                    !isActive(link.href)
                      ? "hover:bg-[#E8F8F1] hover:text-[#237A60]"
                      : undefined
                  }
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "#237A60",
                      }}
                    />
                  )}
                </Link>
              )
            )}
          </nav>

          {/* 3. Right Action Area (Clean, Legible, High-Conversion) */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}>
            {/* Quick Search Pill */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="hide-mobile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.45rem 0.85rem",
                borderRadius: "999px",
                border: "1px solid #B9DCCD",
                background: "#FFFFFF",
                color: "#48665B",
                fontSize: "0.84rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              title="Tìm kiếm dịch vụ & bài viết (Ctrl + K)"
            >
              <Search size={14} style={{ color: "#237A60" }} />
              <span>Tìm dịch vụ...</span>
              <kbd
                style={{
                  fontSize: "0.65rem",
                  color: "#237A60",
                  background: "#E8F8F1",
                  border: "1px solid #A6E4D1",
                  padding: "0.1rem 0.38rem",
                  borderRadius: "6px",
                  fontWeight: 800,
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Clean Hotline Pill with Live Online Dot */}
            <a
              href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
              className="hide-mobile hover:border-[#237A60] hover:bg-[#E8F8F1]"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.45rem 0.85rem",
                borderRadius: "999px",
                border: "1px solid #B9DCCD",
                background: "#FFFFFF",
                color: "#183B32",
                fontSize: "0.84rem",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              title="Hotline hỗ trợ trực tiếp 24/7"
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#10B981",
                  boxShadow: "0 0 6px #10B981",
                }}
              />
              <Phone size={13} style={{ color: "#237A60" }} />
              <span>{BRAND.phone}</span>
            </a>

            {/* Standout Primary CTA Button */}
            <Link
              href="/contact"
              className="btn-primary btn-shimmer group"
              style={{
                fontSize: "0.86rem",
                padding: "0.5rem 1.15rem",
                borderRadius: "999px",
                whiteSpace: "nowrap",
                fontWeight: 750,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                boxShadow: "0 6px 20px rgba(35, 122, 96, 0.28)",
                transition: "all 0.2s ease",
              }}
            >
              <span>Đặt Dịch Vụ</span>
              <ArrowRight
                size={14}
                style={{
                  transition: "transform 0.2s ease",
                }}
                className="group-hover:translate-x-0.5"
              />
            </Link>

            {/* Mobile Search Button */}
            <button
              type="button"
              className="hide-desktop"
              onClick={() => setSearchModalOpen(true)}
              aria-label="Search"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "1px solid #B9DCCD",
                color: "#237A60",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Search size={17} />
            </button>

            {/* Mobile Hamburger Drawer Toggle */}
            <button
              type="button"
              className="hide-desktop"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: menuOpen ? "#E8F8F1" : "#FFFFFF",
                border: "1px solid #B9DCCD",
                color: "#183B32",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Slide-Over Drawer ───────────────────────────────────── */}
        {menuOpen && (
          <div
            className="animate-slide-up"
            style={{
              borderTop: "1px solid #D7EAE1",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(24px)",
              padding: "1rem 1.25rem 1.5rem",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 18px 40px rgba(24, 59, 50, 0.12)",
            }}
          >
            {/* Mobile 6 Platforms Quick Grid */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#527568",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.6rem",
                }}
              >
                6 Nền Tảng Dịch Vụ
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {PLATFORMS_MEGA.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                      padding: "0.65rem 0.4rem",
                      borderRadius: "12px",
                      background: "#F4FBF8",
                      border: "1px solid #D7EAE1",
                      textDecoration: "none",
                    }}
                  >
                    <SocialPlatformLogo platform={item.platform} size={22} />
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#183B32",
                      }}
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {NAV_LINKS.filter((l) => !l.isMega).map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.7rem 0.85rem",
                    borderRadius: "10px",
                    color: isActive(link.href) ? "#237A60" : "#183B32",
                    fontWeight: 700,
                    fontSize: "0.92rem",
                    background: isActive(link.href) ? "#E8F8F1" : "transparent",
                    textDecoration: "none",
                  }}
                >
                  <span>{link.label}</span>
                  <ArrowRight size={14} style={{ opacity: 0.5 }} />
                </Link>
              ))}
            </div>

            {/* Mobile Contact Quick Actions */}
            <div
              style={{
                borderTop: "1px solid #D7EAE1",
                marginTop: "1.25rem",
                paddingTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              <a
                href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  background: "#E8F8F1",
                  color: "#237A60",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  border: "1px solid #A6E4D1",
                }}
              >
                <Phone size={16} /> Hotline: {BRAND.phone}
              </a>

              <a
                href={`https://zalo.me/${BRAND.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  background: "#0068FF",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(0, 104, 255, 0.25)",
                }}
              >
                💬 Chat Zalo Trực Tiếp ({BRAND.zalo})
              </a>
            </div>
          </div>
        )}

        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
        />
      </header>
    </>
  );
}
