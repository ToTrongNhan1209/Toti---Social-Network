"use client";

/**
 * components/layout/Navbar.tsx – ToTrongNhan
 * Soft Mint Green Design System Navigation
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Search } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";
import GlobalSearchModal from "@/components/ui/GlobalSearchModal";
import { BRAND } from "@/lib/data";

type NavLinkItem = {
  id: string;
  label: string;
  href: string;
  children?: { label: string; href: string; platform?: string }[];
};

const NAV_LINKS: NavLinkItem[] = [
  { id: "home",      label: "Trang Chủ",       href: "/" },
  {
    id: "platforms",
    label: "Nền Tảng",
    href: "/services",
    children: [
      { label: "Facebook",  href: "/facebook",  platform: "facebook" },
      { label: "TikTok",    href: "/tiktok",    platform: "tiktok" },
      { label: "Instagram", href: "/instagram", platform: "instagram" },
      { label: "YouTube",   href: "/youtube",   platform: "youtube" },
      { label: "Threads",   href: "/threads",   platform: "threads" },
      { label: "Telegram",  href: "/telegram",  platform: "telegram" },
    ],
  },
  { id: "services",  label: "Tất Cả Dịch Vụ",  href: "/services" },
  { id: "pricing",   label: "Bảng Giá",        href: "/pricing" },
  { id: "blog",      label: "Blog",            href: "/blog" },
  { id: "about",     label: "Về Toti",         href: "/about" },
  { id: "contact",   label: "Liên Hệ",        href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menu and dropdown on route change during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setDropOpen(false);
  }

  const [searchModalOpen, setSearchModalOpen] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cleanup close timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

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
    }, 220); // 220ms grace period so moving cursor to dropdown never abruptly closes it
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: `1px solid ${scrolled ? "#B9DCCD" : "#D7EAE1"}`,
        background: scrolled
          ? "rgba(255, 255, 255, 0.98)"
          : "rgba(244, 251, 248, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition: "all 0.25s ease",
        boxShadow: scrolled ? "0 4px 20px rgba(24, 59, 50, 0.05)" : "none",
      }}
    >
      {/* ── Top Running Ticker (Hotline & Tô Trọng Nhân - Toti) ──────── */}
      <div
        style={{
          background: "linear-gradient(90deg, #183B32 0%, #237A60 50%, #183B32 100%)",
          color: "#FFFFFF",
          fontSize: "0.8rem",
          fontWeight: 600,
          padding: "0.35rem 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
          borderBottom: "1px solid rgba(166, 228, 209, 0.25)",
        }}
      >
        <div className="marquee-track">
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", paddingRight: "2rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#A6E4D1", boxShadow: "0 0 8px #A6E4D1" }} />
              <strong style={{ color: "#A6E4D1" }}>TÔ TRỌNG NHÂN (TOTI)</strong> – Chuyên Gia Hỗ Trợ &amp; Tăng Trưởng MXH Hàng Đầu
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
            <span>
              Hotline Trực Tiếp: <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} style={{ color: "#A6E4D1", fontWeight: 700, textDecoration: "none" }}>{BRAND.phone}</a>
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
            <span>
              Zalo Hỗ Trợ 24/7: <a href={`https://zalo.me/${BRAND.zalo}`} target="_blank" rel="noopener noreferrer" style={{ color: "#A6E4D1", fontWeight: 700, textDecoration: "none" }}>{BRAND.zalo}</a>
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
            <span>🛡️ 100% An Toàn Không Cần Mật Khẩu • ⚡ Xử Lý Siêu Tốc 30 Phút • 💎 Bảo Hành 30 Ngày Bù Tụt</span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#A6E4D1", boxShadow: "0 0 8px #A6E4D1" }} />
              <strong style={{ color: "#A6E4D1" }}>TÔ TRỌNG NHÂN (TOTI)</strong> – Chuyên Gia Hỗ Trợ &amp; Tăng Trưởng MXH Hàng Đầu
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
            <span>
              Hotline Trực Tiếp: <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} style={{ color: "#A6E4D1", fontWeight: 700, textDecoration: "none" }}>{BRAND.phone}</a>
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
            <span>
              Zalo Hỗ Trợ 24/7: <a href={`https://zalo.me/${BRAND.zalo}`} target="_blank" rel="noopener noreferrer" style={{ color: "#A6E4D1", fontWeight: 700, textDecoration: "none" }}>{BRAND.zalo}</a>
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
            <span>🛡️ 100% An Toàn Không Cần Mật Khẩu • ⚡ Xử Lý Siêu Tốc 30 Phút • 💎 Bảo Hành 30 Ngày Bù Tụt</span>
          </div>
        </div>
      </div>

      <div className="container-xl flex items-center justify-between gap-2 sm:gap-6" style={{ height: "64px" }}>

        {/* Official Brand Logo (Image only) */}
        <BrandLogo size={42} showText={false} href="/" />

        {/* Desktop Nav */}
        <nav
          className="hide-mobile"
          style={{ alignItems: "center", gap: "0.25rem", marginLeft: "0.5rem", whiteSpace: "nowrap" }}
          role="navigation"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div
                key={link.id}
                style={{ position: "relative", whiteSpace: "nowrap" }}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => setDropOpen((prev) => !prev)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.3rem",
                    padding: "0.5rem 0.85rem",
                    borderRadius: 8,
                    border: "none",
                    background: dropOpen ? "var(--color-primary-pale)" : "transparent",
                    color: dropOpen ? "var(--color-action)" : "var(--color-text-secondary)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                  aria-expanded={dropOpen}
                >
                  {link.label}
                  <ChevronDown size={14} style={{ transform: dropOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {dropOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      paddingTop: "6px",
                      zIndex: 100,
                    }}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div
                      style={{
                        minWidth: 200,
                        background: "#FFFFFF",
                        border: "1.5px solid #B9DCCD",
                        borderRadius: 14,
                        padding: "0.5rem",
                        boxShadow: "0 12px 32px rgba(24, 59, 50, 0.12)",
                      }}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setDropOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.65rem",
                            padding: "0.6rem 0.85rem",
                            borderRadius: 8,
                            color: "#183B32",
                            fontSize: "0.88rem",
                            fontWeight: 650,
                            transition: "all 0.15s ease",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                          className="hover:bg-[#E8F8F1] hover:text-[#237A60]"
                        >
                          {child.platform ? (
                            <SocialPlatformLogo platform={child.platform} size={20} />
                          ) : null}
                          <span>{child.label}</span>
                        </Link>
                      ))}
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
                  borderRadius: 8,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: isActive(link.href) ? "var(--color-action)" : "var(--color-text-secondary)",
                  background: isActive(link.href) ? "var(--color-primary-pale)" : "transparent",
                  transition: "all 0.15s ease",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
                className={!isActive(link.href) ? "hover:bg-[#E8F8F1] hover:text-[#183B32]" : undefined}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          {/* Search Button – Desktop */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="hide-mobile hover:bg-[#E8F8F1] hover:border-[#B9DCCD]"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.45rem 0.75rem",
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "#FFFFFF",
              color: "var(--color-text-secondary)",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            title="Tìm kiếm dịch vụ & bài viết (Ctrl + K)"
          >
            <Search size={15} style={{ color: "var(--color-action)" }} />
            <span>Tìm kiếm...</span>
            <kbd
              style={{
                fontSize: "0.68rem",
                color: "var(--color-text-muted)",
                background: "var(--color-primary-pale)",
                border: "1px solid var(--color-border-strong)",
                padding: "0.1rem 0.35rem",
                borderRadius: "4px",
              }}
            >
              ⌘K
            </kbd>
          </button>

          {/* Hotline – desktop */}
          <a
            href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
            className="hide-mobile hover:bg-[#E8F8F1] hover:border-[#B9DCCD]"
            style={{
              alignItems: "center", gap: "0.4rem",
              color: "var(--color-text-secondary)", fontSize: "0.85rem",
              textDecoration: "none", fontWeight: 600,
              padding: "0.45rem 0.85rem",
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "#FFFFFF",
              transition: "all 0.15s ease",
            }}
          >
            <Phone size={14} style={{ color: "var(--color-action)" }} />
            {BRAND.phone}
          </a>

          {/* CTA */}
          <Link
            href="/contact"
            className="btn-primary btn-shimmer"
            style={{
              fontSize: "clamp(0.8rem, 2vw, 0.875rem)",
              padding: "clamp(0.45rem, 1.5vw, 0.55rem) clamp(0.75rem, 2vw, 1.25rem)",
              whiteSpace: "nowrap",
            }}
          >
            Đặt Dịch Vụ
          </Link>

          {/* Mobile search button */}
          <button
            type="button"
            className="hide-desktop"
            onClick={() => setSearchModalOpen(true)}
            aria-label="Search"
            style={{
              width: 42, height: 42,
              borderRadius: 8,
              background: "#FFFFFF",
              border: "1px solid var(--color-border)",
              color: "var(--color-action)",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
            title="Tìm kiếm thông tin & dịch vụ"
          >
            <Search size={19} />
          </button>

          {/* Mobile toggle */}
          <button
            className="hide-desktop"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              width: 42, height: 42,
              borderRadius: 8,
              background: menuOpen ? "var(--color-primary-pale)" : "#FFFFFF",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          padding: "1rem 1.25rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          boxShadow: "0 10px 30px rgba(24, 59, 50, 0.08)",
        }}>
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.id} style={{ marginBottom: "0.25rem" }}>
                <div style={{ padding: "0.6rem 0.75rem", color: "var(--color-text-muted)", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {link.label}
                </div>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                      padding: "0.55rem 0.85rem",
                      color: "var(--color-text-secondary)",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      borderRadius: 8,
                    }}
                    className="hover:bg-[#E8F8F1] hover:text-[#183B32]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {child.platform ? (
                      <SocialPlatformLogo platform={child.platform} size={20} />
                    ) : null}
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.id}
                href={link.href}
                style={{
                  display: "block",
                  padding: "0.65rem 0.75rem",
                  borderRadius: 8,
                  color: isActive(link.href) ? "var(--color-action)" : "var(--color-text-primary)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  background: isActive(link.href) ? "var(--color-primary-pale)" : "transparent",
                  textDecoration: "none",
                }}
                className={!isActive(link.href) ? "hover:bg-[#E8F8F1]" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <div style={{ borderTop: "1px solid var(--color-divider)", margin: "0.5rem 0", paddingTop: "0.75rem" }}>
            <a
              href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                color: "var(--color-action)",
                padding: "0.65rem 0.75rem",
                fontWeight: 700,
                textDecoration: "none",
                background: "var(--color-primary-pale)",
                borderRadius: 8,
              }}
            >
              <Phone size={16} /> Hotline: {BRAND.phone}
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
  );
}
