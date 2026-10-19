"use client";

/**
 * components/ui/PricingCalculator.tsx
 * Công cụ tính toán chi phí dịch vụ & chiết khấu tự động tức thì
 */

import { useState, useMemo } from "react";
import {
  Calculator,
  Zap,
  ShieldCheck,
  Clock,
  Tag,
  TrendingUp,
  ArrowRight,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { BRAND, type Platform } from "@/lib/data";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";

type ServiceOption = {
  id: string;
  name: string;
  platform: Platform;
  unit: string;
  unitPrice: number; // VND per unit
  minQty: number;
  maxQty: number;
  step: number;
  estimatedDelivery: (qty: number) => string;
};

const SERVICE_OPTIONS: ServiceOption[] = [
  // Facebook
  {
    id: "fb-followers",
    name: "Followers Facebook (Người theo dõi thật)",
    platform: "facebook",
    unit: "Followers",
    unitPrice: 90, // 90đ/follower (1.000 = 90.000đ)
    minQty: 500,
    maxQty: 100000,
    step: 500,
    estimatedDelivery: (q) => (q <= 2000 ? "1 - 2 ngày" : q <= 10000 ? "3 - 5 ngày" : "7 - 14 ngày"),
  },
  {
    id: "fb-likes",
    name: "Like Fanpage Facebook (Like người dùng thật)",
    platform: "facebook",
    unit: "Likes",
    unitPrice: 60,
    minQty: 500,
    maxQty: 50000,
    step: 500,
    estimatedDelivery: (q) => (q <= 3000 ? "1 - 2 ngày" : "3 - 5 ngày"),
  },
  {
    id: "fb-post-likes",
    name: "Like / Thả tim bài viết Facebook",
    platform: "facebook",
    unit: "Likes",
    unitPrice: 30,
    minQty: 200,
    maxQty: 20000,
    step: 200,
    estimatedDelivery: () => "30 phút - 2 giờ",
  },
  // TikTok
  {
    id: "tt-followers",
    name: "Followers TikTok (Followers thật hỗ trợ bật Live/Kiếm tiền)",
    platform: "tiktok",
    unit: "Followers",
    unitPrice: 110,
    minQty: 500,
    maxQty: 100000,
    step: 500,
    estimatedDelivery: (q) => (q <= 2000 ? "1 - 2 ngày" : q <= 10000 ? "3 - 5 ngày" : "7 - 12 ngày"),
  },
  {
    id: "tt-views",
    name: "Lượt xem video TikTok (Đẩy For You Page)",
    platform: "tiktok",
    unit: "Views",
    unitPrice: 3, // 3đ/view (10.000 = 30.000đ)
    minQty: 5000,
    maxQty: 500000,
    step: 5000,
    estimatedDelivery: () => "1 - 4 giờ",
  },
  {
    id: "tt-likes",
    name: "Like video TikTok (Tăng engagement)",
    platform: "tiktok",
    unit: "Likes",
    unitPrice: 35,
    minQty: 500,
    maxQty: 50000,
    step: 500,
    estimatedDelivery: () => "1 - 3 giờ",
  },
  // Instagram
  {
    id: "ig-followers",
    name: "Followers Instagram (Tài khoản chất lượng cao)",
    platform: "instagram",
    unit: "Followers",
    unitPrice: 130,
    minQty: 500,
    maxQty: 50000,
    step: 500,
    estimatedDelivery: (q) => (q <= 2000 ? "1 - 2 ngày" : "3 - 7 ngày"),
  },
  {
    id: "ig-likes",
    name: "Like bài viết / Reel Instagram",
    platform: "instagram",
    unit: "Likes",
    unitPrice: 40,
    minQty: 300,
    maxQty: 20000,
    step: 100,
    estimatedDelivery: () => "30 phút - 2 giờ",
  },
  {
    id: "ig-views",
    name: "View Reels Instagram (Đẩy Explore)",
    platform: "instagram",
    unit: "Views",
    unitPrice: 5,
    minQty: 2000,
    maxQty: 200000,
    step: 1000,
    estimatedDelivery: () => "1 - 3 giờ",
  },
  // YouTube
  {
    id: "yt-subscribers",
    name: "Subscriber YouTube Thật (Bật Kiếm Tiền)",
    platform: "youtube",
    unit: "Subscribers",
    unitPrice: 180,
    minQty: 200,
    maxQty: 10000,
    step: 100,
    estimatedDelivery: (q) => (q <= 1000 ? "2 - 3 ngày" : "4 - 7 ngày"),
  },
  {
    id: "yt-views",
    name: "View Video YouTube (High Retention)",
    platform: "youtube",
    unit: "Views",
    unitPrice: 40,
    minQty: 1000,
    maxQty: 100000,
    step: 1000,
    estimatedDelivery: () => "12 - 24 giờ",
  },
  // Threads
  {
    id: "th-followers",
    name: "Followers Threads Meta Thật",
    platform: "threads",
    unit: "Followers",
    unitPrice: 80,
    minQty: 500,
    maxQty: 30000,
    step: 500,
    estimatedDelivery: (q) => (q <= 2000 ? "1 - 2 ngày" : "3 - 5 ngày"),
  },
  // Telegram
  {
    id: "tg-members",
    name: "Thành viên Kênh/Nhóm Telegram",
    platform: "telegram",
    unit: "Members",
    unitPrice: 65,
    minQty: 500,
    maxQty: 50000,
    step: 500,
    estimatedDelivery: () => "1 - 24 giờ",
  },
];

export default function PricingCalculator() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("facebook");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("fb-followers");
  const [quantity, setQuantity] = useState<number>(1000);
  const [copied, setCopied] = useState<boolean>(false);

  const availableServices = useMemo(() => {
    return SERVICE_OPTIONS.filter((s) => s.platform === selectedPlatform);
  }, [selectedPlatform]);

  const currentService = useMemo(() => {
    return (
      SERVICE_OPTIONS.find((s) => s.id === selectedServiceId) || availableServices[0] || SERVICE_OPTIONS[0]
    );
  }, [selectedServiceId, availableServices]);

  // Adjust quantity when service changes if out of bounds
  const handlePlatformChange = (p: Platform) => {
    setSelectedPlatform(p);
    const firstService = SERVICE_OPTIONS.find((s) => s.platform === p);
    if (firstService) {
      setSelectedServiceId(firstService.id);
      setQuantity(firstService.minQty * 2);
    }
  };

  const handleServiceChange = (id: string) => {
    setSelectedServiceId(id);
    const service = SERVICE_OPTIONS.find((s) => s.id === id);
    if (service) {
      if (quantity < service.minQty) setQuantity(service.minQty);
      if (quantity > service.maxQty) setQuantity(service.maxQty);
    }
  };

  // Discount calculation
  const { discountRate, rawPrice, finalPrice, discountAmount } = useMemo(() => {
    let rate = 0;
    if (quantity >= 50000) rate = 0.25;
    else if (quantity >= 10000) rate = 0.2;
    else if (quantity >= 3000) rate = 0.1;

    const raw = quantity * currentService.unitPrice;
    const discount = Math.round(raw * rate);
    const final = raw - discount;

    return {
      discountRate: rate,
      rawPrice: raw,
      finalPrice: final,
      discountAmount: discount,
    };
  }, [quantity, currentService]);

  const formattedFinal = new Intl.NumberFormat("vi-VN").format(finalPrice) + "đ";
  const formattedRaw = new Intl.NumberFormat("vi-VN").format(rawPrice) + "đ";
  const formattedDiscount = new Intl.NumberFormat("vi-VN").format(discountAmount) + "đ";

  const presetQuantities = useMemo(() => {
    const min = currentService.minQty;
    return [min, min * 2, min * 5, min * 10, min * 20].filter(
      (q) => q <= currentService.maxQty
    );
  }, [currentService]);

  const orderMessage = `Chào ToTrongNhan, tôi muốn tư vấn & đặt gói: ${currentService.name} - Số lượng: ${new Intl.NumberFormat("vi-VN").format(quantity)} ${currentService.unit} (Tạm tính: ${formattedFinal}). Vui lòng hỗ trợ tôi nhé!`;

  const copyQuote = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div
      className="card card-glow"
      style={{
        padding: "clamp(1.5rem, 4vw, 2.75rem)",
        background: "#FFFFFF",
        border: "1px solid #D7EAE1",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(24, 59, 50, 0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative mint gradient element */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(166, 228, 209, 0.3) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#D7F3E8",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#237A60",
              }}
            >
              <Calculator size={20} />
            </span>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 700, margin: 0, color: "#183B32" }}>
              Công Cụ Dự Toán & Báo Giá Tức Thì
            </h2>
          </div>
          <p style={{ color: "#48665B", fontSize: "0.95rem", margin: 0 }}>
            Tự do tùy chỉnh số lượng theo ngân sách của bạn • Tự động áp dụng chiết khấu lên đến 25%
          </p>
        </div>

        <div
          style={{
            padding: "0.35rem 0.85rem",
            borderRadius: 50,
            background: "#E8F8F1",
            border: "1px solid #B9DCCD",
            color: "#237A60",
            fontSize: "0.85rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <TrendingUp size={14} /> Giảm giá số lượng lớn
        </div>
      </div>

      {/* ── 1. Select Platform ────────────────────────────────────── */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#183B32", marginBottom: "0.6rem" }}>
          1. CHỌN NỀN TẢNG MẠNG XÃ HỘI
        </label>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {[
            { id: "facebook", label: "Facebook" },
            { id: "tiktok", label: "TikTok" },
            { id: "instagram", label: "Instagram" },
            { id: "youtube", label: "YouTube" },
            { id: "threads", label: "Threads" },
            { id: "telegram", label: "Telegram" },
          ].map((p) => {
            const active = selectedPlatform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePlatformChange(p.id as Platform)}
                style={{
                  flex: "1 1 120px",
                  padding: "0.75rem 1rem",
                  borderRadius: 12,
                  border: `1px solid ${active ? "#237A60" : "#D7EAE1"}`,
                  background: active ? "#D7F3E8" : "#F4FBF8",
                  color: active ? "#183B32" : "#48665B",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  transition: "all 0.2s",
                }}
              >
                <SocialPlatformLogo platform={p.id} size={22} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Select Service ─────────────────────────────────────── */}
      <div style={{ marginBottom: "1.75rem" }}>
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#183B32", marginBottom: "0.6rem" }}>
          2. CHỌN LOẠI DỊCH VỤ CẦN TĂNG
        </label>
        <select
          value={currentService.id}
          onChange={(e) => handleServiceChange(e.target.value)}
          style={{
            width: "100%",
            padding: "0.85rem 1rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            background: "#FFFFFF",
            border: "1px solid #D7EAE1",
            borderRadius: "10px",
            color: "#183B32",
          }}
        >
          {availableServices.map((s) => (
            <option key={s.id} value={s.id} style={{ background: "#FFFFFF", color: "#183B32" }}>
              {s.name} ({s.unitPrice}đ / {s.unit})
            </option>
          ))}
        </select>
      </div>

      {/* ── 3. Adjust Quantity Slider ─────────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#183B32" }}>
            3. SỐ LƯỢNG MONG MUỐN
          </label>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#237A60" }}>
            {new Intl.NumberFormat("vi-VN").format(quantity)}{" "}
            <span style={{ fontSize: "0.85rem", color: "#71877E", fontWeight: 500 }}>
              {currentService.unit}
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={currentService.minQty}
          max={currentService.maxQty}
          step={currentService.step}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{
            width: "100%",
            accentColor: "#237A60",
            cursor: "pointer",
            height: "8px",
            padding: 0,
            marginBottom: "1rem",
          }}
        />

        {/* Presets */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {presetQuantities.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setQuantity(preset)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: 8,
                fontSize: "0.8rem",
                fontWeight: 600,
                border: `1px solid ${quantity === preset ? "#237A60" : "#D7EAE1"}`,
                background: quantity === preset ? "#D7F3E8" : "#FFFFFF",
                color: quantity === preset ? "#183B32" : "#48665B",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {new Intl.NumberFormat("vi-VN").format(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. Price & Estimate Box ───────────────────────────────── */}
      <div
        style={{
          background: "#E8F8F1",
          border: "1px solid #B9DCCD",
          borderRadius: 16,
          padding: "1.75rem",
          marginBottom: "1.75rem",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", alignItems: "center" }}>
          {/* Price breakdown */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <SocialPlatformLogo platform={selectedPlatform} size={22} />
              <span style={{ fontWeight: 800, color: "#183B32", fontSize: "0.95rem" }}>
                {currentService.name}
              </span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "#48665B", marginBottom: "0.25rem" }}>
              Tổng chi phí tạm tính:
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
              <span
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 900,
                  color: "#183B32",
                }}
              >
                {formattedFinal}
              </span>
              {discountRate > 0 && (
                <span
                  style={{
                    fontSize: "1.1rem",
                    color: "#71877E",
                    textDecoration: "line-through",
                  }}
                >
                  {formattedRaw}
                </span>
              )}
            </div>

            {discountRate > 0 && (
              <div style={{ marginTop: "0.4rem", display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem", color: "#237A60", fontWeight: 700 }}>
                <Tag size={14} /> Tiết kiệm {formattedDiscount} (-{discountRate * 100}%)
              </div>
            )}
          </div>

          {/* SLA & Warranty */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.88rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#183B32" }}>
              <Clock size={16} style={{ color: "#237A60" }} />
              <span>Thời gian ước tính: <strong>{currentService.estimatedDelivery(quantity)}</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#183B32" }}>
              <ShieldCheck size={16} style={{ color: "#237A60" }} />
              <span>Bảo hành: <strong>30 ngày bù tụt 100%</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#183B32" }}>
              <Zap size={16} style={{ color: "#237A60" }} />
              <span>Bảo mật: <strong>100% Không cần mật khẩu</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Actions ────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <a
          href={`https://zalo.me/${BRAND.zalo}?text=${encodeURIComponent(orderMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary btn-shimmer"
          style={{
            flex: "2 1 240px",
            justifyContent: "center",
            padding: "0.85rem 1.5rem",
            fontSize: "1rem",
          }}
        >
          <MessageCircle size={18} /> Đặt Gói Ngay Qua Zalo ({formattedFinal}) <ArrowRight size={16} />
        </a>

        <button
          type="button"
          onClick={copyQuote}
          className="btn-outline"
          style={{
            flex: "1 1 160px",
            justifyContent: "center",
            padding: "0.85rem 1.25rem",
            fontSize: "0.95rem",
          }}
        >
          {copied ? (
            <>
              <Check size={16} style={{ color: "#237A60" }} /> Đã Copy Báo Giá!
            </>
          ) : (
            <>
              <Copy size={16} /> Copy Nội Dung Báo Giá
            </>
          )}
        </button>
      </div>
    </div>
  );
}
