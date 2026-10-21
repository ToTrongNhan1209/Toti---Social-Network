"use client";

/**
 * components/ui/FloatingActions.tsx
 * Floating quick contact dock in Mint Green design system
 */

import { useState, useEffect } from "react";
import { Phone, ArrowUp, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/data";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(clamp(1rem, 2.5vw, 1.75rem) + 68px)",
        right: "clamp(1rem, 2.5vw, 1.75rem)",
        zIndex: 997,
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        alignItems: "center",
      }}
    >
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Cuộn lên đầu trang"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#FFFFFF",
            border: "1px solid #D7EAE1",
            color: "#237A60",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(24, 59, 50, 0.08)",
            transition: "all 0.15s ease",
          }}
          className="hover:bg-[#E8F8F1] hover:scale-105"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Hotline Call button */}
      <a
        href={`tel:${BRAND.phone.replace(/\s+/g, "")}`}
        aria-label="Gọi hotline"
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#183B32",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(24, 59, 50, 0.2)",
          textDecoration: "none",
          transition: "transform 0.15s ease",
        }}
        className="hover:scale-105"
      >
        <Phone size={20} />
      </a>

      {/* Zalo Button with pulsing mint ring */}
      <a
        href={`https://zalo.me/${BRAND.zalo}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo hỗ trợ"
        className="pulse-ring-zalo"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#237A60",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(35, 122, 96, 0.4)",
          textDecoration: "none",
        }}
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
