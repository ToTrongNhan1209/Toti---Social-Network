"use client";

/**
 * components/ui/SocialPlatformLogo.tsx
 * Authentic full-color official brand logos for all services & platforms:
 * Facebook, TikTok, Instagram, YouTube, Threads, Telegram, Zalo, Google.
 */

import React from "react";

export type PlatformType =
  | "facebook"
  | "tiktok"
  | "instagram"
  | "youtube"
  | "threads"
  | "telegram"
  | "zalo"
  | "google"
  | string;

interface SocialPlatformLogoProps {
  platform: PlatformType;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Whether to show in a rounded square badge container (default: true) */
  badge?: boolean;
}

export default function SocialPlatformLogo({
  platform,
  size = 24,
  className = "",
  style = {},
  badge = true,
}: SocialPlatformLogoProps) {
  const normKey = (platform || "").toLowerCase().trim();
  const isFb = normKey.includes("facebook") || normKey === "fb" || normKey.startsWith("fb");
  const isTt = normKey.includes("tiktok") || normKey === "tt" || normKey.startsWith("tt");
  const isIg = normKey.includes("instagram") || normKey === "ig" || normKey.startsWith("ig");
  const isYt = normKey.includes("youtube") || normKey === "yt" || normKey.startsWith("yt");
  const isThreads = normKey.includes("threads");
  const isTele = normKey.includes("telegram") || normKey === "tele";
  const isZalo = normKey.includes("zalo");
  const isGoogle = normKey.includes("google");

  // ── 1. FACEBOOK (Official Royal Blue & White 'f') ────────────────────────
  if (isFb) {
    if (!badge) {
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          style={style}
          role="img"
          aria-label="Facebook"
        >
          <path
            fill="#1877F2"
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        style={{ borderRadius: "22%", flexShrink: 0, ...style }}
        role="img"
        aria-label="Facebook"
      >
        <rect width="32" height="32" rx="7.5" fill="#1877F2" />
        <path
          fill="#FFFFFF"
          d="M21.5 16.5h-3.3v11.5h-4.8V16.5H11v-4.1h2.4V9.6c0-2.4 1.4-3.7 3.6-3.7 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.7-1.6 1.5v2.4h2.7l-.4 4.1z"
        />
      </svg>
    );
  }

  // ── 2. TIKTOK (Official 3D Chromatic Cyan & Red Note on Dark) ───────────
  if (isTt) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        style={{ borderRadius: "22%", flexShrink: 0, ...style }}
        role="img"
        aria-label="TikTok"
      >
        <rect width="32" height="32" rx="7.5" fill="#010101" />
        <g transform="translate(6, 5) scale(0.64)">
          {/* Cyan layer */}
          <path
            fill="#25F4EE"
            d="M21.6 6.3c-1.4-.9-2.4-2.3-2.7-3.9h-3.4v17.4c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.4 0 .9.1 1.3.2V12c-.4-.1-.9-.1-1.3-.1-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8V11.2c2 1.4 4.4 2.3 7 2.3V10c-1.8 0-3.6-1.4-4.9-3.7z"
          />
          {/* Red layer */}
          <path
            fill="#FE2C55"
            d="M23.6 8.3c-1.4-.9-2.4-2.3-2.7-3.9h-3.4v17.4c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.4 0 .9.1 1.3.2V14c-.4-.1-.9-.1-1.3-.1-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8V13.2c2 1.4 4.4 2.3 7 2.3V12c-1.8 0-3.6-1.4-4.9-3.7z"
            style={{ mixBlendMode: "screen" }}
          />
          {/* White core */}
          <path
            fill="#FFFFFF"
            d="M22.6 7.3c-1.4-.9-2.4-2.3-2.7-3.9h-3.4v17.4c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.4 0 .9.1 1.3.2V13c-.4-.1-.9-.1-1.3-.1-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8V12.2c2 1.4 4.4 2.3 7 2.3V11c-1.8 0-3.6-1.4-4.9-3.7z"
          />
        </g>
      </svg>
    );
  }

  // ── 3. INSTAGRAM (Official Radiant Sunset Purple-Orange Gradient) ───────
  if (isIg) {
    const gradId = "ig-brand-gradient-def";

    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        style={{ borderRadius: "22%", flexShrink: 0, ...style }}
        role="img"
        aria-label="Instagram"
      >
        <defs>
          <radialGradient id={gradId} cx="20%" cy="105%" r="135%">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="15%" stopColor="#FD5949" />
            <stop offset="45%" stopColor="#D6249F" />
            <stop offset="100%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <rect width="32" height="32" rx="7.5" fill={`url(#${gradId})`} />
        {/* Outer Camera Squircle */}
        <rect
          x="6.5"
          y="6.5"
          width="19"
          height="19"
          rx="5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.2"
        />
        {/* Center Lens */}
        <circle
          cx="16"
          cy="16"
          r="4.8"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.2"
        />
        {/* Top-Right Flash Dot */}
        <circle cx="21.5" cy="10.5" r="1.3" fill="#FFFFFF" />
      </svg>
    );
  }

  // ── 4. YOUTUBE (Official Bright Red & White Play Triangle) ───────────────
  if (isYt) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        style={{ borderRadius: "22%", flexShrink: 0, ...style }}
        role="img"
        aria-label="YouTube"
      >
        <rect width="32" height="32" rx="7.5" fill="#FF0000" />
        <path fill="#FFFFFF" d="M13 10.5v11l9-5.5-9-5.5z" />
      </svg>
    );
  }

  // ── 5. THREADS (Official Pitch Black with White Spiral @ Glyph) ──────────
  if (isThreads) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        style={{ borderRadius: "22%", flexShrink: 0, ...style }}
        role="img"
        aria-label="Threads"
      >
        <rect width="32" height="32" rx="7.5" fill="#101010" />
        <path
          fill="#FFFFFF"
          d="M19.9 14.8c-.1-.5-.4-.9-.8-1.2-.6-.5-1.5-.7-2.6-.7-1.3 0-2.3.4-3 1.1-.6.7-.9 1.7-.9 3 0 1.2.3 2.2.9 2.9.7.7 1.7 1.1 3 1.1 1.1 0 2-.3 2.7-.9.5-.4.8-1 1-1.7h2.2c-.2 1.3-.8 2.3-1.7 3.1-1.1.9-2.6 1.4-4.3 1.4-1.9 0-3.5-.6-4.6-1.8s-1.7-2.8-1.7-4.8c0-2 .6-3.6 1.7-4.8s2.7-1.8 4.6-1.8c1.8 0 3.3.5 4.3 1.5 1 .9 1.6 2.3 1.7 4h-2.5zm-3.4 3.7c.6 0 1-.2 1.3-.5.3-.3.5-.7.5-1.3 0-.5-.2-.9-.5-1.2-.3-.3-.7-.5-1.3-.5s-1 .2-1.3.5c-.3.3-.5.7-.5 1.2 0 .5.2.9.5 1.3.3.3.8.5 1.3.5z"
        />
      </svg>
    );
  }

  // ── 6. TELEGRAM (Official Cyan Blue & White Paper Airplane) ─────────────
  if (isTele) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        style={{ borderRadius: "22%", flexShrink: 0, ...style }}
        role="img"
        aria-label="Telegram"
      >
        <rect width="32" height="32" rx="7.5" fill="#2AABEE" />
        <path
          fill="#FFFFFF"
          d="M7.8 15.6l15-6.2c.7-.3 1.3.2 1.1.9l-2.6 12.3c-.2.9-.8 1.1-1.5.7l-4.1-3.1-2 1.9c-.2.2-.4.4-.8.4l.3-4.1 7.4-6.7c.3-.3-.1-.5-.5-.2l-9.2 5.8-3.9-1.2c-.9-.3-.9-.9.2-1.4z"
        />
      </svg>
    );
  }

  // ── 7. ZALO (Official Royal Cyan-Blue with White 'Zalo' Wordmark) ────────
  if (isZalo) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        style={{ borderRadius: "22%", flexShrink: 0, ...style }}
        role="img"
        aria-label="Zalo"
      >
        <rect width="32" height="32" rx="7.5" fill="#0068FF" />
        <g fill="#FFFFFF">
          {/* Z */}
          <path d="M8 11.5h5.5l-4.8 7.2v1.8h7.2v-2h-4.6l4.7-7v-2H8v2z" />
          {/* a */}
          <path d="M17.5 16.5c-.8 0-1.3.6-1.3 1.3s.5 1.3 1.3 1.3 1.3-.6 1.3-1.3-.5-1.3-1.3-1.3zm1.6-1.3v4.6c0 .4.3.7.7.7v1.8c-.8 0-1.5-.4-1.9-1.1-.5.8-1.4 1.3-2.4 1.3-1.7 0-3-1.3-3-3s1.3-3 3-3c1 0 1.9.5 2.4 1.3v-1.6h1.2v-1z" />
          {/* l */}
          <path d="M22 11h2v9.5h-2V11z" />
          {/* o */}
          <path d="M26.5 15.2c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm0 1.8c-.7 0-1.2.5-1.2 1.2s.5 1.2 1.2 1.2 1.2-.5 1.2-1.2-.5-1.2-1.2-1.2z" />
        </g>
      </svg>
    );
  }

  // ── 8. GOOGLE (Official 4-Color 'G') ────────────────────────────────────
  if (isGoogle) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        style={{ borderRadius: "22%", flexShrink: 0, ...style }}
        role="img"
        aria-label="Google"
      >
        <rect width="32" height="32" rx="7.5" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
        <g transform="translate(4, 4) scale(1)">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </g>
      </svg>
    );
  }

  // ── Default Global / Web Globe ──────────────────────────────────────────
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: "22%", flexShrink: 0, ...style }}
      role="img"
      aria-label="Platform"
    >
      <rect width="32" height="32" rx="7.5" fill="#237A60" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      <ellipse cx="16" cy="16" rx="4" ry="8" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="8" y1="16" x2="24" y2="16" stroke="#FFFFFF" strokeWidth="1.5" />
    </svg>
  );
}
