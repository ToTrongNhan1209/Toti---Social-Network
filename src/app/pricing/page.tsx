/**
 * app/pricing/page.tsx – Bảng giá ToTrongNhan
 */

import type { Metadata } from "next";
import { pricingTiers, BRAND } from "@/lib/data";
import { CheckCircle2, Zap } from "lucide-react";
import PricingCalculator from "@/components/ui/PricingCalculator";
import FaqAccordion from "@/components/ui/FaqAccordion";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";

export const metadata: Metadata = {
  title: "Bảng Giá Dịch Vụ Mạng Xã Hội",
  description: "Bảng giá dịch vụ tăng followers Facebook, TikTok, Instagram. Giá rẻ, chất lượng cao, nhiều gói lựa chọn phù hợp mọi nhu cầu.",
};

const platformGroups = [
  { id: "fb-followers",  label: "Followers Facebook",  platform: "facebook" },
  { id: "tt-followers",  label: "Followers TikTok",    platform: "tiktok" },
  { id: "ig-followers",  label: "Followers Instagram", platform: "instagram" },
];

const guarantees = [
  { emoji: "🔒", title: "Bảo mật tuyệt đối",    desc: "Không yêu cầu mật khẩu hay bất kỳ thông tin nhạy cảm nào" },
  { emoji: "✅", title: "Bảo hành 30 ngày",     desc: "Hoàn bù miễn phí 100% nếu số lượng giảm trong 30 ngày" },
  { emoji: "⚡", title: "Giao hàng nhanh",       desc: "Bắt đầu xử lý trong vòng 15-60 phút sau khi xác nhận" },
  { emoji: "💬", title: "Hỗ trợ 24/7",           desc: "Đội ngũ kỹ thuật viên luôn sẵn sàng tư vấn & giải đáp" },
  { emoji: "💰", title: "Giá cạnh tranh",        desc: "Bảng giá gốc minh bạch, chiết khấu lớn cho đại lý & KOL" },
  { emoji: "🔄", title: "Cam kết hoàn tiền",     desc: "100% hoàn tiền nếu không thể hoàn thành đúng cam kết" },
];

export default function PricingPage() {
  return (
    <div className="mesh-bg" style={{ paddingTop: "98px", minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: "3rem" }}>
        <div className="container-xl" style={{ textAlign: "center" }}>
          <span className="section-label">
            <Zap size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            Minh Bạch & Tiết Kiệm
          </span>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}>
            Bảng Giá Dịch Vụ Mạng Xã Hội
          </h1>
          <p className="section-sub" style={{ margin: "0 auto" }}>
            Không phí ẩn, không phụ thu. Bắt đầu tăng trưởng kênh của bạn ngay hôm nay với các gói giá
            ưu đãi và chính sách bảo hành 30 ngày bù tụt miễn phí.
          </p>
        </div>
      </section>

      {/* ── Pricing Tables ───────────────────────────────────────────── */}
      <section style={{ paddingBottom: "3rem" }}>
        <div className="container-xl">
          {platformGroups.map((group) => {
            const tiers = pricingTiers.filter((t) => t.serviceId === group.id);
            return (
              <div key={group.id} style={{ marginBottom: "4rem" }}>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.65rem", color: "#183B32" }}>
                  <SocialPlatformLogo platform={group.platform} size={28} />
                  <span>{group.label}</span>
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                  {tiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="card"
                      style={{
                        padding: "1.75rem",
                        position: "relative",
                        background: tier.highlight ? "#E8F8F1" : "#FFFFFF",
                        border: tier.highlight
                          ? "1px solid #B9DCCD"
                          : "1px solid #D7EAE1",
                        transform: tier.highlight ? "scale(1.02)" : "none",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: tier.highlight
                          ? "0 10px 25px rgba(35, 122, 96, 0.1)"
                          : "0 2px 8px rgba(24, 59, 50, 0.04)",
                      }}
                    >
                      {tier.highlight && (
                        <div style={{
                          position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                          background: "#237A60", color: "#FFFFFF",
                          fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.9rem",
                          borderRadius: 50, whiteSpace: "nowrap", letterSpacing: "0.04em",
                          boxShadow: "0 4px 12px rgba(35, 122, 96, 0.25)",
                        }}>
                          ⭐ PHỔ BIẾN NHẤT
                        </div>
                      )}

                      <div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <div style={{ fontSize: "0.8rem", color: "#71877E", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            {tier.name}
                          </div>
                          <div style={{ fontSize: "2rem", fontWeight: 800, color: tier.highlight ? "#237A60" : "#183B32", fontFamily: "var(--font-heading)", margin: "0.4rem 0" }}>
                            {tier.price.toLocaleString("vi-VN")}₫
                          </div>
                          <div style={{ fontSize: "1.05rem", color: "#183B32", fontWeight: 700 }}>{tier.quantity}</div>
                        </div>

                        <div style={{ borderTop: "1px solid #E5F0EA", margin: "1rem 0", paddingTop: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#48665B" }}>
                            <CheckCircle2 size={15} style={{ color: "#237A60" }} />
                            Giao hàng: <strong>{tier.deliveryTime}</strong>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#48665B", marginTop: "0.5rem" }}>
                            <CheckCircle2 size={15} style={{ color: "#237A60" }} />
                            Bảo hành 30 ngày bù tụt
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#48665B", marginTop: "0.5rem" }}>
                            <CheckCircle2 size={15} style={{ color: "#237A60" }} />
                            An toàn 100% (No Password)
                          </div>
                        </div>
                      </div>

                      <a
                        href={`https://zalo.me/${BRAND.zalo}?text=${encodeURIComponent(`Chào ToTrongNhan, tôi muốn đặt gói: ${group.label} - Gói ${tier.name} (${tier.quantity}) với giá ${tier.price.toLocaleString("vi-VN")}đ`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={tier.highlight ? "btn-primary" : "btn-outline"}
                        style={{ width: "100%", justifyContent: "center", fontSize: "0.9rem", marginTop: "1rem" }}
                      >
                        {tier.highlight ? <><Zap size={15} /> Đặt Gói Này</> : "Đặt Gói Này"}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <hr className="divider" />

      {/* ── Interactive Custom Quantity Tool ─────────────────────────── */}
      <section className="section" style={{ paddingBottom: "4rem" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="section-label">Tùy biến số lượng</span>
            <h2 className="section-title">Bạn Cần Số Lượng Khác?</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Sử dụng công cụ dự toán bên dưới để chọn chính xác số lượng bạn mong muốn và nhận chiết khấu tự động
            </p>
          </div>
          <PricingCalculator />
        </div>
      </section>

      <hr className="divider" />

      {/* ── Guarantees ───────────────────────────────────────────────── */}
      <section style={{ background: "#EDF8F3", padding: "4rem 0" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="section-label">Cam kết của chúng tôi</span>
            <h2 className="section-title">An Tâm Tuyệt Đối Khi Sử Dụng</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {guarantees.map((g) => (
              <div key={g.title} className="card" style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start", background: "#FFFFFF", border: "1px solid #D7EAE1" }}>
                <span style={{ fontSize: "1.75rem", flexShrink: 0 }}>{g.emoji}</span>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.3rem", color: "#183B32" }}>{g.title}</h3>
                  <p style={{ color: "#48665B", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── FAQs ─────────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: "6rem" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Hỏi & Đáp</span>
            <h2 className="section-title">Thắc Mắc Về Thanh Toán & Đơn Hàng</h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

    </div>
  );
}
