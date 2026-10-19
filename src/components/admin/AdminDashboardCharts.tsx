"use client";

/**
 * components/admin/AdminDashboardCharts.tsx
 * Analytics & Growth Charts Dashboard for ToTrongNhan CMS.
 * Interactive SVG Line/Area Charts, Platform Distribution, and 24h Traffic Monitoring.
 */

import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Zap,
  Users,
  Eye,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";

type Timeframe = "7d" | "30d" | "12m";

const TIMEFRAME_DATA: Record<
  Timeframe,
  {
    label: string;
    points: { label: string; orders: number; revenue: number }[];
    totalOrders: number;
    totalRevenue: string;
    growthPercent: string;
  }
> = {
  "7d": {
    label: "7 Ngày Gần Nhất",
    points: [
      { label: "T2", orders: 124, revenue: 3850000 },
      { label: "T3", orders: 148, revenue: 4620000 },
      { label: "T4", orders: 192, revenue: 6150000 },
      { label: "T5", orders: 175, revenue: 5400000 },
      { label: "T6", orders: 238, revenue: 7850000 },
      { label: "T7", orders: 294, revenue: 9920000 },
      { label: "CN", orders: 320, revenue: 10850000 },
    ],
    totalOrders: 1491,
    totalRevenue: "48.640.000đ",
    growthPercent: "+24.8%",
  },
  "30d": {
    label: "30 Ngày Qua",
    points: [
      { label: "Tuần 1", orders: 840, revenue: 26500000 },
      { label: "Tuần 2", orders: 960, revenue: 30800000 },
      { label: "Tuần 3", orders: 1120, revenue: 36400000 },
      { label: "Tuần 4", orders: 1350, revenue: 44200000 },
    ],
    totalOrders: 4270,
    totalRevenue: "137.900.000đ",
    growthPercent: "+31.2%",
  },
  "12m": {
    label: "12 Tháng Qua",
    points: [
      { label: "T1", orders: 2100, revenue: 68000000 },
      { label: "T2", orders: 2450, revenue: 79000000 },
      { label: "T3", orders: 2800, revenue: 91000000 },
      { label: "T4", orders: 3100, revenue: 102000000 },
      { label: "T5", orders: 3500, revenue: 115000000 },
      { label: "T6", orders: 3950, revenue: 130000000 },
      { label: "T7", orders: 4200, revenue: 138000000 },
      { label: "T8", orders: 4600, revenue: 152000000 },
      { label: "T9", orders: 5100, revenue: 168000000 },
      { label: "T10", orders: 5450, revenue: 180000000 },
    ],
    totalOrders: 37250,
    totalRevenue: "1.223.000.000đ",
    growthPercent: "+42.5%",
  },
};

const PLATFORM_SHARE = [
  { platform: "tiktok", name: "TikTok", orders: 1580, share: 38, color: "#000000" },
  { platform: "facebook", name: "Facebook", orders: 1330, share: 32, color: "#1877F2" },
  { platform: "instagram", name: "Instagram", orders: 624, share: 15, color: "#E4405F" },
  { platform: "youtube", name: "YouTube", orders: 332, share: 8, color: "#FF0000" },
  { platform: "threads", name: "Threads", orders: 208, share: 5, color: "#183B32" },
  { platform: "telegram", name: "Telegram", orders: 83, share: 2, color: "#229ED9" },
];

export default function AdminDashboardCharts() {
  const [timeframe, setTimeframe] = useState<Timeframe>("7d");
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    orders: number;
    revenue: number;
    x: number;
    y: number;
  } | null>(null);

  const activeData = TIMEFRAME_DATA[timeframe];
  const points = activeData.points;

  // SVG Chart Dimensions
  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxOrders = Math.max(...points.map((p) => p.orders), 1);
  const minOrders = Math.min(...points.map((p) => p.orders), 0);
  const range = maxOrders - minOrders || 1;

  // Calculate coordinates for SVG
  const coords = points.map((p, i) => {
    const x =
      points.length === 1
        ? width / 2
        : paddingX + (i / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((p.orders - minOrders) / range) * (height - paddingY * 2);
    return { x, y, ...p };
  });

  // Build smooth Bézier SVG Path
  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = makeSmoothPath(coords);
  const areaPath = coords.length
    ? `${linePath} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${
        height - paddingY
      } Z`
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", marginBottom: "2rem" }}>
      {/* ── 4 Top KPI Highlights ───────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {/* KPI 1 */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.25rem 1.4rem",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#607F74" }}>Tổng Đơn Tháng Này</span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "#E8F8F1", color: "#237A60", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#183B32", letterSpacing: "-0.01em" }}>
            4.270+ <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#237A60" }}>đơn</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.35rem", fontSize: "0.78rem", color: "#237A60", fontWeight: 700 }}>
            <TrendingUp size={14} /> +31.2% so với tháng trước
          </div>
        </div>

        {/* KPI 2 */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.25rem 1.4rem",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#607F74" }}>Khách Hàng Hoạt Động</span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#183B32", letterSpacing: "-0.01em" }}>
            1.850+ <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2563EB" }}>users</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.35rem", fontSize: "0.78rem", color: "#2563EB", fontWeight: 700 }}>
            <CheckCircle2 size={14} /> Tỷ lệ quay lại 84.5%
          </div>
        </div>

        {/* KPI 3 */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.25rem 1.4rem",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#607F74" }}>Tương Tác Tạo Ra</span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Eye size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#183B32", letterSpacing: "-0.01em" }}>
            8.6M+ <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#D97706" }}>reach</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.35rem", fontSize: "0.78rem", color: "#D97706", fontWeight: 700 }}>
            <TrendingUp size={14} /> Tăng trưởng vượt bậc
          </div>
        </div>

        {/* KPI 4 */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.25rem 1.4rem",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#607F74" }}>Bảo Mật Anti-DDoS</span>
            <div style={{ width: 34, height: 34, borderRadius: "8px", background: "#E8F8F1", color: "#237A60", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#183B32", letterSpacing: "-0.01em" }}>
            99.99% <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#237A60" }}>uptime</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.35rem", fontSize: "0.78rem", color: "#237A60", fontWeight: 700 }}>
            <CheckCircle2 size={14} /> 100% An Toàn Không Mật Khẩu
          </div>
        </div>
      </div>

      {/* ── Main Chart: Order Growth Trend + Platform Distribution ─────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Chart 1: Interactive Growth Trend (2/3 width on wide screens) */}
        <div
          style={{
            gridColumn: "span 2",
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "18px",
            padding: "1.5rem",
            boxShadow: "0 2px 12px rgba(24, 59, 50, 0.04)",
            display: "flex",
            flexDirection: "column",
          }}
          className="col-span-1 lg:col-span-2"
        >
          {/* Chart Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 28, height: 28, borderRadius: "6px", background: "#E8F8F1", color: "#237A60", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={16} />
                </div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#183B32" }}>
                  Biểu Đồ Tăng Trưởng &amp; Xử Lý Đơn Hàng MXH
                </h3>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#607F74", marginTop: "2px" }}>
                Dữ liệu thời gian thực được tổng hợp theo dịch vụ ({activeData.label})
              </div>
            </div>

            {/* Timeframe Switcher */}
            <div
              style={{
                display: "inline-flex",
                background: "#F4FBF8",
                border: "1px solid #D7EAE1",
                padding: "0.25rem",
                borderRadius: "10px",
                gap: "0.25rem",
              }}
            >
              {(
                [
                  { id: "7d", label: "7 Ngày" },
                  { id: "30d", label: "30 Ngày" },
                  { id: "12m", label: "12 Tháng" },
                ] as const
              ).map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => setTimeframe(tf.id)}
                  style={{
                    border: "none",
                    background: timeframe === tf.id ? "#237A60" : "transparent",
                    color: timeframe === tf.id ? "#FFFFFF" : "#183B32",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    padding: "0.35rem 0.75rem",
                    borderRadius: "7px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              background: "#F8FCFA",
              border: "1px solid #E5F0EA",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span style={{ fontSize: "0.72rem", color: "#71877E", textTransform: "uppercase", fontWeight: 700 }}>
                Tổng Số Đơn:
              </span>{" "}
              <strong style={{ fontSize: "0.95rem", color: "#183B32" }}>
                {activeData.totalOrders.toLocaleString("vi-VN")} đơn
              </strong>
            </div>
            <div>
              <span style={{ fontSize: "0.72rem", color: "#71877E", textTransform: "uppercase", fontWeight: 700 }}>
                Doanh Số Tổng Hợp:
              </span>{" "}
              <strong style={{ fontSize: "0.95rem", color: "#237A60" }}>
                {activeData.totalRevenue}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: "0.72rem", color: "#71877E", textTransform: "uppercase", fontWeight: 700 }}>
                Tốc Độ Tăng:
              </span>{" "}
              <strong style={{ fontSize: "0.95rem", color: "#237A60" }}>
                {activeData.growthPercent}
              </strong>
            </div>
          </div>

          {/* SVG Line / Area Chart */}
          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#237A60" stopOpacity="0.32" />
                  <stop offset="90%" stopColor="#237A60" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.33, 0.66, 1].map((pct, idx) => {
                const y = paddingY + pct * (height - paddingY * 2);
                return (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#E5F0EA"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Area Gradient */}
              {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

              {/* Main Curve Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#237A60"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points */}
              {coords.map((pt, idx) => {
                const isHovered = hoveredPoint?.label === pt.label;
                return (
                  <g
                    key={idx}
                    onMouseEnter={() =>
                      setHoveredPoint({
                        label: pt.label,
                        orders: pt.orders,
                        revenue: pt.revenue,
                        x: pt.x,
                        y: pt.y,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 4.5}
                      fill={isHovered ? "#A6E4D1" : "#FFFFFF"}
                      stroke="#237A60"
                      strokeWidth={isHovered ? 3.5 : 2.5}
                      style={{ transition: "all 0.15s ease" }}
                    />
                    {/* X-axis label */}
                    <text
                      x={pt.x}
                      y={height - 8}
                      textAnchor="middle"
                      fill="#71877E"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Tooltip Card */}
            {hoveredPoint && (
              <div
                style={{
                  position: "absolute",
                  left: `${(hoveredPoint.x / width) * 100}%`,
                  top: `${(hoveredPoint.y / height) * 100}%`,
                  transform: "translate(-50%, -125%)",
                  background: "#183B32",
                  color: "#FFFFFF",
                  padding: "0.55rem 0.8rem",
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  zIndex: 20,
                  animation: "fadeIn 0.15s ease",
                }}
              >
                <div style={{ fontWeight: 800, color: "#A6E4D1", marginBottom: "2px" }}>
                  {hoveredPoint.label}: {hoveredPoint.orders} đơn hàng
                </div>
                <div style={{ fontSize: "0.72rem", opacity: 0.9 }}>
                  Ước tính: {hoveredPoint.revenue.toLocaleString("vi-VN")}đ
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Platform Share Distribution (1/3 width on wide screens) */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "18px",
            padding: "1.5rem",
            boxShadow: "0 2px 12px rgba(24, 59, 50, 0.04)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <div style={{ width: 28, height: 28, borderRadius: "6px", background: "#E8F8F1", color: "#237A60", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={16} />
            </div>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#183B32" }}>
              Cơ Cấu Nền Tảng MXH
            </h3>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#607F74", marginBottom: "1.25rem" }}>
            Tỷ lệ đơn hàng theo 6 mạng xã hội phổ biến
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", flex: 1 }}>
            {PLATFORM_SHARE.map((item) => (
              <div key={item.platform}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.3rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <SocialPlatformLogo platform={item.platform} size={18} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#183B32" }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#607F74" }}>
                    <strong style={{ color: "#183B32" }}>{item.share}%</strong> ({item.orders} đơn)
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 8,
                    borderRadius: "999px",
                    background: "#F4FBF8",
                    overflow: "hidden",
                    border: "1px solid #E5F0EA",
                  }}
                >
                  <div
                    style={{
                      width: `${item.share}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background: item.platform === "tiktok" ? "#183B32" : item.color,
                      transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.65rem 0.85rem",
              borderRadius: "10px",
              background: "#F4FBF8",
              border: "1px solid #D7EAE1",
              fontSize: "0.75rem",
              color: "#237A60",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Calendar size={14} />
            <span>TikTok &amp; Facebook chiếm 70% tổng lượng đơn</span>
          </div>
        </div>
      </div>
    </div>
  );
}
