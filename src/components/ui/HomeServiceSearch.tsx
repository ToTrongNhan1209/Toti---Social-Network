"use client";

/**
 * components/ui/HomeServiceSearch.tsx
 * Real-time instant service search widget for ToTrongNhan Homepage.
 * Instant filtering across Facebook, TikTok, Instagram, YouTube, Threads, Telegram.
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Zap, TrendingUp, Sparkles } from "lucide-react";
import type { Service } from "@/lib/data";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";

interface HomeServiceSearchProps {
  services: Service[];
}

const QUICK_SUGGESTIONS = [
  "Follow TikTok",
  "Like Fanpage",
  "Follow Instagram",
  "View Reels",
  "Sub YouTube",
  "Threads",
  "Mắt Livestream",
];

export default function HomeServiceSearch({ services }: HomeServiceSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter services
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return services.filter((s) => {
      const title = s.title.toLowerCase();
      const desc = (s.description || "").toLowerCase();
      const plat = s.platform.toLowerCase();
      const cat = s.category.toLowerCase();
      const features = (s.features || []).join(" ").toLowerCase();
      return (
        title.includes(q) ||
        desc.includes(q) ||
        plat.includes(q) ||
        cat.includes(q) ||
        features.includes(q)
      );
    });
  }, [query, services]);

  const handleSelectSuggestion = (tag: string) => {
    setQuery(tag);
    setIsOpen(true);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        maxWidth: 680,
        margin: "0 auto 2.25rem",
        zIndex: 50,
      }}
    >
      {/* ── Main Search Input Bar ──────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "#FFFFFF",
          border: isOpen && query.trim() ? "2px solid #237A60" : "2px solid #B9DCCD",
          borderRadius: "18px",
          padding: "0.45rem 0.6rem 0.45rem 1.25rem",
          boxShadow: isOpen && query.trim()
            ? "0 12px 36px rgba(35, 122, 96, 0.16)"
            : "0 4px 20px rgba(24, 59, 50, 0.06)",
          transition: "all 0.25s ease",
        }}
      >
        <Search
          size={20}
          style={{
            color: "#237A60",
            flexShrink: 0,
            marginRight: "0.75rem",
          }}
        />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Tìm dịch vụ: tăng follow, like fanpage, tim tiktok, view reels, youtube..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "clamp(0.88rem, 2vw, 0.98rem)",
            fontWeight: 600,
            color: "#183B32",
            background: "transparent",
            padding: "0.4rem 0",
          }}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            aria-label="Xóa tìm kiếm"
            style={{
              background: "#F4FBF8",
              border: "none",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#607F74",
              marginRight: "0.4rem",
              transition: "all 0.15s ease",
            }}
            className="hover:bg-[#E8F8F1] hover:text-[#183B32]"
          >
            <X size={15} />
          </button>
        )}

        <Link
          href={query.trim() ? `/services?q=${encodeURIComponent(query.trim())}` : "/services"}
          style={{
            background: "linear-gradient(135deg, #183B32 0%, #237A60 100%)",
            color: "#FFFFFF",
            padding: "0.6rem 1.15rem",
            borderRadius: "12px",
            fontSize: "0.85rem",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            textDecoration: "none",
            flexShrink: 0,
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(24, 59, 50, 0.15)",
          }}
          className="hover:opacity-95"
        >
          <span>Tìm</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* ── Quick Suggestion Tags ──────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          marginTop: "0.65rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.74rem",
            fontWeight: 700,
            color: "#48665B",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <Sparkles size={12} style={{ color: "#237A60" }} /> Gợi ý nhanh:
        </span>
        {QUICK_SUGGESTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleSelectSuggestion(tag)}
            style={{
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              background: "#FFFFFF",
              border: query === tag ? "1px solid #237A60" : "1px solid #D7EAE1",
              color: query === tag ? "#237A60" : "#48665B",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow: "0 1px 4px rgba(24, 59, 50, 0.03)",
            }}
            className="hover:border-[#237A60] hover:text-[#237A60]"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ── Live Search Results Dropdown ────────────────────────────── */}
      {isOpen && query.trim().length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% - 10px)",
            left: 0,
            right: 0,
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            boxShadow: "0 16px 40px rgba(24, 59, 50, 0.14)",
            overflow: "hidden",
            maxHeight: "380px",
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
            marginTop: "0.5rem",
          }}
        >
          {/* Results Header */}
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "#F4FBF8",
              borderBottom: "1px solid #D7EAE1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#183B32",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Zap size={14} style={{ color: "#237A60" }} />
              Tìm thấy {results.length} dịch vụ phù hợp
            </span>
            <Link
              href="/services"
              style={{
                color: "#237A60",
                fontSize: "0.78rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Xem tất cả
            </Link>
          </div>

          {/* Results List */}
          <div style={{ overflowY: "auto", padding: "0.5rem" }}>
            {results.length > 0 ? (
              results.map((item) => (
                <Link
                  key={item.id}
                  href={`/services#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "12px",
                    textDecoration: "none",
                    color: "#183B32",
                    transition: "all 0.15s ease",
                    marginBottom: "4px",
                  }}
                  className="hover:bg-[#E8F8F1]"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                    <div style={{ flexShrink: 0 }}>
                      <SocialPlatformLogo platform={item.platform} size={32} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#607F74",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 360,
                        }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "0.75rem" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#237A60" }}>
                      {item.startingPrice.toLocaleString("vi-VN")}₫
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#71877E" }}>
                      /{item.unit || "gói"}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ padding: "2rem 1rem", textAlign: "center", color: "#607F74" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}>🔍</div>
                <div style={{ fontWeight: 700, color: "#183B32", marginBottom: "0.25rem" }}>
                  Không tìm thấy dịch vụ cho &quot;{query}&quot;
                </div>
                <p style={{ fontSize: "0.82rem", margin: 0, marginBottom: "0.75rem" }}>
                  Hãy thử tìm kiếm với các từ khóa phổ biến: follow, like, tim, view, mắt xem...
                </p>
                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "#237A60",
                    textDecoration: "none",
                  }}
                >
                  <TrendingUp size={14} /> Hoặc yêu cầu dịch vụ theo nhu cầu riêng
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
