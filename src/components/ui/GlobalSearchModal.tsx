"use client";

/**
 * components/ui/GlobalSearchModal.tsx
 * Quick Search & Command Palette Modal for ToTrongNhan client site.
 * Search through services, blog posts, platforms, and quick contact info.
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  Zap,
  BookOpen,
  Phone,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";
import { services, blogPosts as posts, BRAND, Platform } from "@/lib/data";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [activePlatformFilter, setActivePlatformFilter] = useState<Platform | "all">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = React.useCallback(() => {
    setQuery("");
    setActivePlatformFilter("all");
    onClose();
  }, [onClose]);

  // Focus input and lock body scroll when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    const q = query.toLowerCase().trim();
    return services.filter((s) => {
      const matchPlatform =
        activePlatformFilter === "all" || s.platform === activePlatformFilter;
      if (!matchPlatform) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.platform.toLowerCase().includes(q) ||
        s.features.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [query, activePlatformFilter]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return posts.slice(0, 3);
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "clamp(1rem, 5vh, 4rem) 1rem",
        background: "rgba(24, 59, 50, 0.55)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#FFFFFF",
          borderRadius: "20px",
          border: "1.5px solid #B9DCCD",
          boxShadow: "0 24px 64px rgba(24, 59, 50, 0.25)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "85vh",
          overflow: "hidden",
          animation: "scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 1.25rem",
            borderBottom: "1.5px solid #E5F0EA",
            gap: "0.85rem",
            background: "#FFFFFF",
          }}
        >
          <Search size={22} style={{ color: "#237A60", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm dịch vụ Facebook, TikTok, Instagram, bài viết, giá..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "#183B32",
              background: "transparent",
              fontFamily: "inherit",
            }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{
                border: "none",
                background: "#E8F8F1",
                color: "#237A60",
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              title="Xóa tìm kiếm"
            >
              <X size={15} />
            </button>
          ) : (
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#71877E",
                background: "#F4FBF8",
                border: "1px solid #D7EAE1",
                padding: "0.2rem 0.5rem",
                borderRadius: "6px",
              }}
            >
              ESC để đóng
            </span>
          )}
          <button
            type="button"
            onClick={handleClose}
            style={{
              border: "none",
              background: "#F4FBF8",
              color: "#607F74",
              width: 32,
              height: 32,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="Đóng cửa sổ tìm kiếm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Platform Quick Filter Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.75rem 1.25rem",
            background: "#F8FCFA",
            borderBottom: "1px solid #E5F0EA",
            overflowX: "auto",
            scrollbarWidth: "none",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#71877E", marginRight: "0.25rem" }}>
            Lọc:
          </span>
          {(
            [
              { id: "all", label: "Tất cả", platform: null },
              { id: "tiktok", label: "TikTok", platform: "tiktok" },
              { id: "facebook", label: "Facebook", platform: "facebook" },
              { id: "instagram", label: "Instagram", platform: "instagram" },
              { id: "youtube", label: "YouTube", platform: "youtube" },
              { id: "threads", label: "Threads", platform: "threads" },
              { id: "telegram", label: "Telegram", platform: "telegram" },
            ] as const
          ).map((item) => {
            const isSelected = activePlatformFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePlatformFilter(item.id as Platform | "all")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "999px",
                  border: isSelected ? "1.5px solid #237A60" : "1px solid #D7EAE1",
                  background: isSelected ? "#237A60" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#183B32",
                  fontSize: "0.78rem",
                  fontWeight: isSelected ? 700 : 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                {item.platform && <SocialPlatformLogo platform={item.platform} size={14} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Results Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Quick Contact & Action Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.5rem",
            }}
          >
            <a
              href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 0.85rem",
                borderRadius: "10px",
                background: "#E8F8F1",
                color: "#237A60",
                fontSize: "0.82rem",
                fontWeight: 700,
                textDecoration: "none",
                border: "1px solid #B9DCCD",
              }}
            >
              <Phone size={15} />
              <span>Gọi: {BRAND.phone}</span>
            </a>
            <a
              href={`https://zalo.me/${BRAND.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 0.85rem",
                borderRadius: "10px",
                background: "#0068FF14",
                color: "#0068FF",
                fontSize: "0.82rem",
                fontWeight: 700,
                textDecoration: "none",
                border: "1px solid #0068FF33",
              }}
            >
              <MessageCircle size={15} />
              <span>Zalo Toti: {BRAND.zalo}</span>
            </a>
            <Link
              href="/pricing"
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 0.85rem",
                borderRadius: "10px",
                background: "#F4FBF8",
                color: "#183B32",
                fontSize: "0.82rem",
                fontWeight: 700,
                textDecoration: "none",
                border: "1px solid #D7EAE1",
              }}
            >
              <Zap size={15} style={{ color: "#237A60" }} />
              <span>Bảng Giá &amp; Tính Tiền</span>
            </Link>
          </div>

          {/* Section: Services Results */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.65rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#607F74",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <Zap size={13} style={{ color: "#237A60" }} />
                <span>Dịch Vụ Mạng Xã Hội ({filteredServices.length})</span>
              </div>
              <Link
                href="/services"
                onClick={onClose}
                style={{
                  fontSize: "0.78rem",
                  color: "#237A60",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Xem tất cả dịch vụ →
              </Link>
            </div>

            {filteredServices.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                {filteredServices.slice(0, 6).map((service) => (
                  <Link
                    key={service.id}
                    href={`/services#${service.id}`}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.85rem",
                      padding: "0.75rem 0.9rem",
                      borderRadius: "12px",
                      background: "#FFFFFF",
                      border: "1px solid #E5F0EA",
                      textDecoration: "none",
                      color: "#183B32",
                      transition: "all 0.15s ease",
                    }}
                    className="hover:border-[#237A60] hover:bg-[#F4FBF8]"
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "10px",
                        background: "#F8FCFA",
                        border: "1px solid #D7EAE1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <SocialPlatformLogo platform={service.platform} size={22} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          color: "#183B32",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {service.title}
                        </span>
                        {service.popular && (
                          <span
                            style={{
                              fontSize: "0.62rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              background: "#E8F8F1",
                              color: "#237A60",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "4px",
                              flexShrink: 0,
                            }}
                          >
                            Hot
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#607F74",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginTop: "2px",
                        }}
                      >
                        {service.description}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#237A60" }}>
                        {service.startingPrice.toLocaleString("vi-VN")}đ
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "#71877E" }}>/{service.unit}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: "1.25rem",
                  textAlign: "center",
                  background: "#F4FBF8",
                  borderRadius: "12px",
                  fontSize: "0.85rem",
                  color: "#607F74",
                }}
              >
                Không tìm thấy dịch vụ nào phù hợp với từ khóa &ldquo;{query}&rdquo;.
              </div>
            )}
          </div>

          {/* Section: Blog Articles */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.65rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#607F74",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <BookOpen size={13} style={{ color: "#237A60" }} />
                <span>Bài Viết Blog &amp; Mẹo MXH</span>
              </div>
              <Link
                href="/blog"
                onClick={onClose}
                style={{
                  fontSize: "0.78rem",
                  color: "#237A60",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Xem tất cả bài viết →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {filteredPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "12px",
                    background: "#FFFFFF",
                    border: "1px solid #E5F0EA",
                    textDecoration: "none",
                    color: "#183B32",
                    transition: "all 0.15s ease",
                  }}
                  className="hover:border-[#237A60] hover:bg-[#F4FBF8]"
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: "#E8F8F1",
                      color: "#237A60",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: "#183B32",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.title}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#71877E", marginTop: "1px" }}>
                      Chuyên mục: {post.category} • {post.readTime} phút đọc
                    </div>
                  </div>
                  <ArrowRight size={15} style={{ color: "#237A60", flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "0.75rem 1.25rem",
            background: "#F8FCFA",
            borderTop: "1px solid #E5F0EA",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "#71877E",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Sparkles size={13} style={{ color: "#237A60" }} />
            <span>ToTrongNhan (Toti) • Hỗ trợ tăng tương tác MXH 24/7</span>
          </div>
          <a
            href={`https://zalo.me/${BRAND.zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#237A60",
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <span>Tư vấn riêng gói đặc biệt qua Zalo</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
