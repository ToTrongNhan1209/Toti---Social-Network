"use client";

/**
 * components/ui/SystemStatusBanner.tsx
 * Soft Mint Green System Status Banner
 */

import { ShieldCheck, Zap, Users } from "lucide-react";

export default function SystemStatusBanner() {
  return (
    <div
      style={{
        background: "var(--color-primary-pale)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        padding: "0.75rem 1rem",
        fontSize: "0.85rem",
        color: "var(--color-text-secondary)",
      }}
    >
      <div
        className="container-xl"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#237A60",
              boxShadow: "0 0 6px rgba(35,122,96,0.6)",
              display: "inline-block",
            }}
          />
          <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>Hệ Thống API:</span>
          <span style={{ color: "var(--color-action)", fontWeight: 600 }}>Hoạt động ổn định 100%</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Zap size={14} style={{ color: "var(--color-action)" }} />
            <span>Tốc độ: <strong>Bắt đầu sau 15-60p</strong></span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <ShieldCheck size={14} style={{ color: "var(--color-action)" }} />
            <span>Cam kết: <strong>Bảo hành 30 ngày bù tụt</strong></span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Users size={14} style={{ color: "var(--color-action)" }} />
            <span>Tư vấn viên: <strong style={{ color: "var(--color-text-primary)" }}>Trực tuyến 24/7</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
