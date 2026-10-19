"use client";

/**
 * components/ui/BrandLogo.tsx
 * Official Brand Logo for Tô Trọng Nhân.
 * Rendered with the authentic Mint Green Brand Palette:
 * Deep Forest Pine (#183B32 - #237A60) & Radiant Mint (#A6E4D1) + Pure White.
 */

import Link from "next/link";
import React from "react";

interface BrandLogoProps {
  size?: number;
  variant?: "symbol" | "horizontal" | "badge";
  colorMode?: "mint" | "dark" | "white";
  showText?: boolean;
  className?: string;
  href?: string;
}

export default function BrandLogo({
  size = 42,
  colorMode = "mint",
  showText = false,
  className = "",
  href,
}: BrandLogoProps) {
  const content = (
    <div
      className={`inline-flex items-center flex-shrink-0 select-none ${className}`}
      style={{ textDecoration: "none" }}
    >
      {/* ── Mint Green Emblem ────────────────────────────────────────── */}
      <div
        style={{
          width: size,
          height: size,
          position: "relative",
          borderRadius: Math.round(size * 0.24),
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(24, 59, 50, 0.18)",
          border: colorMode === "white" ? "1.5px solid #A6E4D1" : "1.5px solid rgba(166, 228, 209, 0.8)",
          background: "linear-gradient(145deg, #183B32 0%, #237A60 60%, #112721 100%)",
          transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        className="hover:scale-105"
      >
        <svg
          viewBox="0 0 256 256"
          width="82%"
          height="82%"
          role="img"
          aria-label="Tô Trọng Nhân Logo"
          style={{ display: "block" }}
        >
          {/* Subtle top-left radial glow */}
          <radialGradient id={`mintGlow-${size}`} cx="30%" cy="25%" r="65%">
            <stop offset="0%" stopColor="#A6E4D1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#183B32" stopOpacity="0" />
          </radialGradient>
          <rect width="256" height="256" rx="57.6" fill={`url(#mintGlow-${size})`} />

          {/* Centered TN Infinity Unlock Master Symbol */}
          <g transform="translate(34.82 38.46) scale(0.728)">
            {/* Top Shackle / T Arch in Brilliant Pure White */}
            <path
              fill="#FFFFFF"
              fillRule="evenodd"
              d="M64 104 V78 C64 42.6 92.6 14 128 14 C163.4 14 192 42.6 192 78 V104 H160 V78 C160 60.3 145.7 46 128 46 C110.3 46 96 60.3 96 78 V104 Z"
            />

            {/* T Stem in Glowing Mint Accent */}
            <polygon fill="#A6E4D1" points="112,90 144,90 144,138 112,138" />

            {/* Lock Body & N with Genuine Keyhole in Pure White */}
            <path
              fill="#FFFFFF"
              fillRule="evenodd"
              d="
                M 44 104 H 76 V 222 H 44 Z 
                M 180 104 H 212 V 222 H 180 Z 
                M 76 110 H 112 L 180 178 V 216 H 144 L 76 148 Z 
                M 44 204 H 116 V 232 H 44 Z
                M 140 204 H 212 V 232 H 140 Z
                M 128 146 A 15 15 0 1 0 128.1 146 Z
                M 122 158 H 134 L 138 186 H 118 Z
              "
            />
          </g>

          {/* ── TOTI Master Brand Seal at Emblem Base ── */}
          <g transform="translate(128, 206)">
            <rect
              x="-44"
              y="-13"
              width="88"
              height="26"
              rx="13"
              fill="#112721"
              stroke="#A6E4D1"
              strokeWidth="2.5"
            />
            <text
              x="0"
              y="5.5"
              textAnchor="middle"
              fill="#A6E4D1"
              fontSize="14"
              fontWeight="900"
              letterSpacing="2.8"
            >
              TOTI
            </text>
          </g>
        </svg>
      </div>

      {/* ── Optional Text Branding ───────────────────────────────────── */}
      {showText && (
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "0.75rem", lineHeight: 1.15 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 900,
                background: colorMode === "white" ? "rgba(166, 228, 209, 0.2)" : "#E8F8F1",
                color: colorMode === "white" ? "#A6E4D1" : "#237A60",
                padding: "0.18rem 0.45rem",
                borderRadius: "6px",
                border: colorMode === "white" ? "1px solid rgba(166, 228, 209, 0.4)" : "1.2px solid #B9DCCD",
                letterSpacing: "0.06em",
                lineHeight: 1,
                boxShadow: colorMode === "white" ? "none" : "0 1px 3px rgba(24, 59, 50, 0.05)",
              }}
            >
              TOTI
            </span>
            <span
              style={{
                fontSize: "1.06rem",
                fontWeight: 800,
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.01em",
                color: colorMode === "white" ? "#FFFFFF" : "#183B32",
              }}
            >
              TÔ TRỌNG NHÂN
            </span>
          </div>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: colorMode === "white" ? "#A6E4D1" : "#237A60",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginTop: "3px",
            }}
          >
            Social Growth Expert
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Tô Trọng Nhân Home" style={{ textDecoration: "none", display: "inline-block" }}>
        {content}
      </Link>
    );
  }

  return content;
}
