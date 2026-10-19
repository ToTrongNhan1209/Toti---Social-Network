"use client";

/**
 * app/admin/page.tsx – Dedicated Standalone Admin CMS Dashboard
 * Independent application layout without client header/footer.
 * Multi-tab CMS: Services CRUD (Dịch vụ), Blog Posts CRUD (Bài viết), and System Overview.
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  BookOpen,
  LayoutDashboard,
  ExternalLink,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  User,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import AdminServicesManager from "@/components/admin/AdminServicesManager";
import AdminBlogManager from "@/components/admin/AdminBlogManager";
import AdminOverviewManager from "@/components/admin/AdminOverviewManager";
import AdminProfileManager from "@/components/admin/AdminProfileManager";
import AdminWeatherWidget from "@/components/admin/AdminWeatherWidget";

type AdminTab = "services" | "blog" | "overview" | "profile";

const ADMIN_NAV_ITEMS: {
  id: AdminTab;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}[] = [
  { id: "overview", label: "Dashboard & Biểu Đồ", desc: "Thống kê doanh thu & Tăng trưởng", icon: LayoutDashboard },
  { id: "services", label: "Quản Lý Dịch Vụ",     desc: "Dịch vụ MXH & Bảng giá",         icon: Zap },
  { id: "blog",     label: "Bài Viết Blog",        desc: "Tin tức & Hướng dẫn",            icon: BookOpen },
  { id: "profile",  label: "Hồ Sơ Quản Trị",      desc: "Thông tin cá nhân & Zalo",       icon: User },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [adminUser, setAdminUser] = useState<{
    email: string;
    name: string;
    avatar: string;
    role: string;
  } | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync sidebar collapse state from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem("toti_admin_sidebar_collapsed");
        if (saved !== null) {
          setSidebarCollapsed(saved === "true");
        }
      } catch {
        // Ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("toti_admin_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const router = useRouter();

  // Auth Verification
  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.admin) {
          setAdminUser(data.admin);
          setAuthChecking(false);
        } else {
          router.push("/admin/login?from=/admin");
        }
      })
      .catch(() => {
        router.push("/admin/login?from=/admin");
      });
  }, [router]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  if (authChecking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4FBF8",
          color: "#183B32",
        }}
      >
        <div style={{ marginBottom: "1.25rem" }}>
          <BrandLogo size={56} showText={false} />
        </div>
        <div style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: "0.4rem" }}>
          Đang Xác Thực Phiên Quản Trị...
        </div>
        <p style={{ color: "#607F74", fontSize: "0.88rem", margin: 0 }}>
          Kiểm tra chữ ký số HMAC &amp; quyền truy cập Google OAuth 2.0
        </p>
      </div>
    );
  }

  const currentTabItem = ADMIN_NAV_ITEMS.find((item) => item.id === activeTab) || ADMIN_NAV_ITEMS[0];
  const CurrentIcon = currentTabItem.icon;

  const renderSidebarContent = (isMobile = false, isCollapsed = false) => {
    // ── Collapsed Mode (Desktop Icon-only) ──────────────────────────────
    if (isCollapsed && !isMobile) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "1rem 0.5rem",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          {/* Logo in Collapsed Mode */}
          <Link
            href="/admin"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              paddingBottom: "0.85rem",
              borderBottom: "1.5px solid #E5F0EA",
              textDecoration: "none",
            }}
            title="ToTrongNhan CMS"
          >
            <BrandLogo size={32} showText={false} />
          </Link>

          {/* Quick Expand Toggle Button */}
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            style={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              border: "1px solid #B9DCCD",
              background: "#F4FBF8",
              color: "#237A60",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              margin: "0.85rem 0",
              transition: "all 0.18s ease",
            }}
            title="Mở rộng thanh menu (Bấm để bung rộng)"
          >
            <ChevronsRight size={18} />
          </button>

          {/* Collapsed Admin Profile Avatar */}
          {adminUser && (
            <div
              onClick={() => setActiveTab("profile")}
              style={{
                position: "relative",
                cursor: "pointer",
                marginBottom: "1.2rem",
                borderRadius: "50%",
                padding: "2px",
                border: activeTab === "profile" ? "2px solid #237A60" : "2px solid transparent",
                transition: "all 0.15s ease",
              }}
              title={`${adminUser.name} - Super Admin (Bấm để xem hồ sơ)`}
            >
              <img
                src={adminUser.avatar}
                alt={adminUser.name}
                style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo/final-avatar.png";
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 1,
                  right: 1,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#237A60",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 0 5px #237A60",
                }}
              />
            </div>
          )}

          {/* Collapsed Nav Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.55rem",
              width: "100%",
              alignItems: "center",
              flex: 1,
            }}
          >
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    border: "none",
                    background: isActive ? "#237A60" : "transparent",
                    color: isActive ? "#FFFFFF" : "#607F74",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    boxShadow: isActive ? "0 4px 14px rgba(35, 122, 96, 0.28)" : "none",
                    position: "relative",
                  }}
                  title={`${item.label} • ${item.desc}`}
                >
                  <Icon size={20} />
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        left: -5,
                        width: 3.5,
                        height: 22,
                        borderRadius: 3,
                        background: "#237A60",
                      }}
                    />
                  )}
                </button>
              );
            })}

            {/* DDoS Shield Mini Icon */}
            <div
              style={{
                marginTop: "0.85rem",
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#E8F8F1",
                border: "1px solid #B9DCCD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#237A60",
                cursor: "help",
              }}
              title="Tường lửa Anti-DDoS 24/7 Active • Bảo vệ HMAC & Rate-limit"
            >
              <ShieldCheck size={18} />
            </div>
          </div>

          {/* Collapsed Bottom Action Icons */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: "0.85rem",
              borderTop: "1.5px solid #E5F0EA",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Link
              href="/"
              target="_blank"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "10px",
                border: "1px solid #B9DCCD",
                background: "#F4FBF8",
                color: "#237A60",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
              title="Mở Xem Website Client"
            >
              <ExternalLink size={17} />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "10px",
                border: "1px solid #F8D7DA",
                background: "#FFF8F8",
                color: "#D9383A",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              title="Đăng Xuất Admin"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      );
    }

    // ── Expanded Mode (Full Sidebar) ────────────────────────────────────
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "1.25rem 1rem",
          boxSizing: "border-box",
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "1.1rem",
            borderBottom: "1.5px solid #E5F0EA",
            marginBottom: "1.1rem",
          }}
        >
          <Link
            href="/admin"
            onClick={() => isMobile && setMobileMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }}
          >
            <BrandLogo size={36} showText={false} />
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#183B32", letterSpacing: "-0.01em" }}>
                  ToTrongNhan
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "3px" }}>
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    padding: "0.1rem 0.45rem",
                    borderRadius: "4px",
                    background: "#E8F8F1",
                    color: "#237A60",
                    border: "1px solid #B9DCCD",
                    letterSpacing: "0.05em",
                  }}
                >
                  TOTI CMS
                </span>
                <span style={{ fontSize: "0.68rem", color: "#607F74", fontWeight: 600 }}>v2.5</span>
              </div>
            </div>
          </Link>

          {/* Action button on header: Close on mobile, Collapse on desktop */}
          {isMobile ? (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                border: "1px solid #B9DCCD",
                background: "#F4FBF8",
                color: "#183B32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              title="Đóng menu"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              style={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                border: "1px solid #B9DCCD",
                background: "#F4FBF8",
                color: "#183B32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              title="Thu gọn menu (Nhấn để thu gọn)"
            >
              <ChevronsLeft size={16} />
            </button>
          )}
        </div>

        {/* Admin Profile Mini Card */}
        {adminUser && (
          <div
            onClick={() => {
              setActiveTab("profile");
              if (isMobile) setMobileMenuOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 0.85rem",
              borderRadius: "12px",
              background: activeTab === "profile" ? "#E8F8F1" : "#F8FCFA",
              border: `1.5px solid ${activeTab === "profile" ? "#237A60" : "#D7EAE1"}`,
              marginBottom: "1.1rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="Bấm để xem và chỉnh sửa Hồ Sơ Admin"
          >
            <div style={{ position: "relative" }}>
              <img
                src={adminUser.avatar}
                alt={adminUser.name}
                style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "1.5px solid #237A60" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo/final-avatar.png";
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#237A60",
                  border: "2px solid #FFFFFF",
                  boxShadow: "0 0 6px #237A60",
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0, lineHeight: 1.2 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  color: "#183B32",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {adminUser.name}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#237A60", fontWeight: 600, marginTop: "2px" }}>
                Super Admin • Online
              </div>
            </div>
            <ChevronRight size={15} style={{ color: activeTab === "profile" ? "#237A60" : "#A2B1AA" }} />
          </div>
        )}

        {/* Navigation Section */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <div
            style={{
              fontSize: "0.68rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#71877E",
              padding: "0.2rem 0.5rem",
              marginBottom: "0.15rem",
            }}
          >
            Menu Điều Hướng
          </div>

          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setMobileMenuOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  border: "none",
                  background: isActive ? "#237A60" : "transparent",
                  color: isActive ? "#FFFFFF" : "#183B32",
                  fontSize: "0.88rem",
                  fontWeight: isActive ? 700 : 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  boxShadow: isActive ? "0 4px 12px rgba(35, 122, 96, 0.22)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: isActive ? "rgba(255, 255, 255, 0.18)" : "#E8F8F1",
                    color: isActive ? "#FFFFFF" : "#237A60",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={17} />
                </div>
                <div style={{ flex: 1, minWidth: 0, lineHeight: 1.25 }}>
                  <div style={{ fontSize: "0.88rem", fontWeight: isActive ? 700 : 600 }}>{item.label}</div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: isActive ? "rgba(255, 255, 255, 0.8)" : "#71877E",
                      marginTop: "1px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
                {isActive && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#A6E4D1",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            );
          })}

          {/* Anti-DDoS Security Badge */}
          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.65rem 0.8rem",
              borderRadius: "10px",
              background: "#F4FBF8",
              border: "1px solid #D7EAE1",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#237A60",
                display: "inline-block",
                boxShadow: "0 0 6px #237A60",
                flexShrink: 0,
              }}
            />
            <div style={{ lineHeight: 1.2, fontSize: "0.75rem" }}>
              <div style={{ fontWeight: 700, color: "#183B32" }}>Anti-DDoS 24/7</div>
              <div style={{ color: "#607F74", fontSize: "0.68rem" }}>HMAC Token &amp; Shield Active</div>
            </div>
          </div>
        </div>

        {/* Sidebar Bottom Actions */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "0.85rem",
            borderTop: "1.5px solid #E5F0EA",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <Link
            href="/"
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              padding: "0.55rem 0.85rem",
              borderRadius: "8px",
              border: "1px solid #B9DCCD",
              background: "#FFFFFF",
              color: "#237A60",
              fontSize: "0.82rem",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
          >
            <ExternalLink size={15} /> Xem Website Client
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              padding: "0.55rem 0.85rem",
              borderRadius: "8px",
              border: "1px solid #F8D7DA",
              background: "#FFF8F8",
              color: "#D9383A",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            title="Đăng xuất quản trị"
          >
            <LogOut size={15} /> Đăng Xuất Admin
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflow: "hidden",
        background: "#F4FBF8",
        color: "#183B32",
        display: "flex",
      }}
    >
      {/* ── Toast Notification ───────────────────────────────────────── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            background: toast.type === "success" ? "#237A60" : "#D9383A",
            color: "#FFFFFF",
            padding: "0.85rem 1.4rem",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            fontSize: "0.92rem",
            fontWeight: 600,
            animation: "slideIn 0.3s ease",
          }}
        >
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* ── Mobile Sidebar Drawer Backdrop ───────────────────────────── */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(24, 59, 50, 0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 9998,
          }}
        />
      )}

      {/* ── Mobile Slide-in Drawer from Left ─────────────────────────── */}
      {mobileMenuOpen && (
        <aside
          className="lg:hidden"
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            width: 285,
            background: "#FFFFFF",
            borderRight: "1.5px solid #B9DCCD",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflowY: "auto",
            boxShadow: "4px 0 24px rgba(24, 59, 50, 0.15)",
          }}
        >
          {renderSidebarContent(true, false)}
        </aside>
      )}

      {/* ── Dedicated Desktop Left Navigation Sidebar (Collapsible) ──── */}
      <aside
        className="hidden lg:flex"
        style={{
          width: sidebarCollapsed ? 76 : 275,
          flexShrink: 0,
          background: "#FFFFFF",
          borderRight: "1.5px solid #D7EAE1",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 100,
          overflowY: "auto",
          overflowX: "hidden",
          transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          scrollbarWidth: "none",
          boxShadow: "2px 0 12px rgba(24, 59, 50, 0.03)",
        }}
      >
        {renderSidebarContent(false, sidebarCollapsed)}
      </aside>

      {/* ── Main Content Area on Right ───────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Top Header Bar (Fixed at Top) */}
        <header
          style={{
            flexShrink: 0,
            height: "68px",
            background: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(10px)",
            borderBottom: "1.5px solid #D7EAE1",
            zIndex: 40,
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.03)",
          }}
        >
          <div
            style={{
              padding: "0 1.25rem",
              height: "68px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            {/* Left: Mobile hamburger (mobile only) & Current Tab Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Mobile Hamburger Button (Only shown on mobile devices < 1024px) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="cms-mobile-menu-trigger"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  border: "1.5px solid #B9DCCD",
                  background: "#F4FBF8",
                  color: "#183B32",
                  cursor: "pointer",
                }}
                title="Mở thanh quản trị bên trái"
              >
                <Menu size={22} />
              </button>

              {/* Breadcrumb / Title */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 34,
                    height: 34,
                    borderRadius: "8px",
                    background: "#E8F8F1",
                    color: "#237A60",
                  }}
                >
                  <CurrentIcon size={18} />
                </div>
                <div style={{ whiteSpace: "nowrap" }}>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: "#183B32",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentTabItem.label}
                  </h1>
                  <span style={{ fontSize: "0.72rem", color: "#607F74", whiteSpace: "nowrap" }}>
                    Bảng Điều Khiển • {currentTabItem.desc}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Weather & Location, DDoS Shield, Website Link & Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "nowrap", flexShrink: 0 }}>
              {/* Real-time Weather & Location Widget in Topbar */}
              <div className="cms-weather-topbar">
                <AdminWeatherWidget variant="compact" />
              </div>

              {/* Anti-DDoS Badge */}
              <div
                className="cms-firewall-topbar"
                style={{
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "999px",
                  background: "#F4FBF8",
                  border: "1px solid #D7EAE1",
                  fontSize: "0.75rem",
                  color: "#237A60",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#237A60",
                    boxShadow: "0 0 6px #237A60",
                  }}
                />
                <span>Tường lửa 24/7</span>
              </div>

              {/* Public Website Link */}
              <Link
                href="/"
                target="_blank"
                className="cms-website-link-topbar"
                style={{
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 0.85rem",
                  borderRadius: "8px",
                  border: "1px solid #B9DCCD",
                  background: "#F4FBF8",
                  color: "#237A60",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                <ExternalLink size={14} /> Mở Website
              </Link>

              {/* Admin Profile Chip */}
              {adminUser && (
                <div
                  onClick={() => setActiveTab("profile")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.3rem 0.65rem",
                    borderRadius: "999px",
                    background: "#F4FBF8",
                    border: "1.5px solid #B9DCCD",
                    cursor: "pointer",
                  }}
                  title="Hồ sơ quản trị viên (Bấm để xem)"
                >
                  <img
                    src={adminUser.avatar}
                    alt={adminUser.name}
                    style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logo/final-avatar.png";
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#183B32",
                      display: "none",
                    }}
                    className="sm:inline"
                  >
                    {adminUser.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Scrollable Body Area (Fixed Navbar & Sidebar, Scrollable Content) ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Main Dashboard Content */}
          <main style={{ flex: 1, padding: "1.75rem 1.25rem 3.5rem" }}>
            <div style={{ maxWidth: 1360, margin: "0 auto", width: "100%" }}>
              {activeTab === "overview" && <AdminOverviewManager onSwitchTab={setActiveTab} />}
              {activeTab === "services" && <AdminServicesManager onToast={showToast} onSwitchTab={setActiveTab} />}
              {activeTab === "blog" && <AdminBlogManager onToast={showToast} />}
              {activeTab === "profile" && (
                <AdminProfileManager
                  onToast={showToast}
                  onProfileUpdated={(updated) => {
                    setAdminUser((prev) =>
                      prev
                        ? {
                            ...prev,
                            name: updated.name,
                            avatar: updated.avatar,
                          }
                        : null
                    );
                  }}
                />
              )}
            </div>
          </main>

          {/* Admin Minimal Footer */}
          <footer
            style={{
              flexShrink: 0,
              borderTop: "1px solid #D7EAE1",
              background: "#FFFFFF",
              padding: "1rem 1.25rem",
              fontSize: "0.8rem",
              color: "#607F74",
            }}
          >
            <div
              style={{
                maxWidth: 1360,
                margin: "0 auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div>
                © {new Date().getFullYear()} ToTrongNhan Control Center • Thanh điều hướng bên trái &amp; Navbar cố định.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={14} style={{ color: "#237A60" }} />
                <span>Xác thực Google OAuth 2.0 &amp; Anti-DDoS Active</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
