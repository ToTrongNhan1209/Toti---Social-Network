"use client";

/**
 * app/contact/page.tsx – Trang liên hệ ToTrongNhan
 */

import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { BRAND } from "@/lib/data";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Tư vấn dịch vụ tăng followers",
    message: "",
    company: "", // honeypot
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.company) return; // honeypot

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setStatusMsg(data.message || "Gửi yêu cầu thành công!");
        setForm({
          name: "",
          email: "",
          subject: "Tư vấn dịch vụ tăng followers",
          message: "",
          company: "",
        });
      } else {
        setStatus("error");
        setStatusMsg(data.error || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
      }
    } catch {
      setStatus("error");
      setStatusMsg("Lỗi kết nối máy chủ. Bạn có thể nhắn tin trực tiếp qua Zalo để được hỗ trợ tức thì.");
    } finally {
      setLoading(false);
    }
  };

  const contactChannels = [
    {
      title: "Zalo Hỗ Trợ Nhanh",
      value: BRAND.zalo,
      desc: "Phản hồi trong 1-5 phút (24/7)",
      href: `https://zalo.me/${BRAND.zalo}`,
      badge: "Khuyên Dùng",
      icon: MessageCircle,
      color: "#0068FF",
      cta: "Chat Zalo Ngay",
    },
    {
      title: "Hotline Trực Tiếp",
      value: BRAND.phone,
      desc: "Hỗ trợ kỹ thuật & xử lý đơn gấp",
      href: `tel:${BRAND.phone.replace(/\s+/g, "")}`,
      badge: "24/7",
      icon: Phone,
      color: "#10B981",
      cta: "Gọi Trực Tiếp",
    },
    {
      title: "Email Doanh Nghiệp",
      value: BRAND.email,
      desc: "Báo giá hợp đồng & hóa đơn VAT",
      href: `mailto:${BRAND.email}`,
      badge: "B2B / Hợp Đồng",
      icon: Mail,
      color: "#8B5CF6",
      cta: "Gửi Email",
    },
  ];

  return (
    <div className="mesh-bg" style={{ paddingTop: "98px", minHeight: "100vh" }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: "2rem" }}>
        <div className="container-xl" style={{ textAlign: "center" }}>
          <span className="section-label">Liên Hệ & Tư Vấn</span>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}>
            Kết Nối Với Chúng Tôi
          </h1>
          <p className="section-sub" style={{ margin: "0 auto" }}>
            Đội ngũ tư vấn viên luôn sẵn sàng giải đáp thắc mắc, phân tích kênh và tư vấn gói tối ưu
            nhất cho mục tiêu tăng trưởng của bạn.
          </p>
        </div>
      </section>

      {/* ── Contact Channels Grid ──────────────────────────────── */}
      <section style={{ paddingBottom: "3rem" }}>
        <div className="container-xl">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "1.5rem" }}>
            {contactChannels.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="card"
                  style={{
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    background: "#FFFFFF",
                    border: "1px solid #D7EAE1",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "12px",
                          background: "#E8F8F1",
                          color: "#237A60",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #B9DCCD",
                        }}
                      >
                        <Icon size={24} />
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.6rem",
                          borderRadius: 20,
                          background: "#D7F3E8",
                          color: "#183B32",
                          border: "1px solid #B9DCCD",
                        }}
                      >
                        {c.badge}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.25rem", color: "#183B32" }}>{c.title}</h3>
                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#237A60", marginBottom: "0.4rem" }}>
                      {c.value}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "#71877E" }}>{c.desc}</p>
                  </div>
                  <div style={{ marginTop: "1.5rem" }}>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        padding: "0.65rem 1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      {c.cta} <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Contact Form & Office Info ─────────────────────────── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="container-xl">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "2rem" }}>
            
            {/* Form */}
            <div className="card" style={{ padding: "clamp(1.25rem, 4vw, 2.5rem)", background: "#FFFFFF", border: "1px solid #D7EAE1" }}>
              <div style={{ marginBottom: "1.75rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem", color: "#183B32" }}>
                  Gửi Yêu Cầu Báo Giá
                </h2>
                <p style={{ color: "#48665B", fontSize: "0.9rem" }}>
                  Để lại thông tin và nhu cầu, chúng tôi sẽ liên hệ lại ngay trong vòng 15 phút.
                </p>
              </div>

              {status === "success" && (
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: "12px",
                    background: "#E8F8F1",
                    border: "1px solid #B9DCCD",
                    color: "#237A60",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <CheckCircle2 size={20} />
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{statusMsg}</span>
                </div>
              )}

              {status === "error" && (
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: "12px",
                    background: "#FEECEB",
                    border: "1px solid #FCA5A5",
                    color: "#B42318",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <AlertCircle size={20} />
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{statusMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Honeypot anti-bot */}
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "#183B32" }}>
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#FFFFFF",
                        border: "1px solid #D7EAE1",
                        color: "#183B32",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "#183B32" }}>
                      Email liên hệ *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#FFFFFF",
                        border: "1px solid #D7EAE1",
                        color: "#183B32",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "#183B32" }}>
                    Dịch vụ quan tâm *
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      background: "#FFFFFF",
                      border: "1px solid #D7EAE1",
                      color: "#183B32",
                    }}
                  >
                    <option value="Tăng Followers Facebook">Tăng Followers Facebook</option>
                    <option value="Tăng Like / Tương tác Fanpage Facebook">Tăng Like / Tương tác Fanpage Facebook</option>
                    <option value="Tăng Followers TikTok">Tăng Followers TikTok</option>
                    <option value="Tăng View / Like TikTok">Tăng View / Like TikTok</option>
                    <option value="Tăng Followers Instagram">Tăng Followers Instagram</option>
                    <option value="Mua Tài Khoản BM / Ads / Via">Mua Tài Khoản BM / Ads / Via</option>
                    <option value="Gói Hợp Tác Doanh Nghiệp">Gói Hợp Tác Doanh Nghiệp / KOL</option>
                    <option value="Yêu cầu khác">Yêu cầu khác</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem", color: "#183B32" }}>
                    Nội dung yêu cầu / Link kênh (tùy chọn) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Mô tả số lượng cần tăng, link kênh Facebook/TikTok/Instagram hoặc bất kỳ thắc mắc nào..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: "100%",
                      background: "#FFFFFF",
                      border: "1px solid #D7EAE1",
                      color: "#183B32",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "0.85rem",
                    fontSize: "1rem",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Đang gửi yêu cầu...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Gửi Yêu Cầu Báo Giá
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Office Info & Commitment */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="card" style={{ padding: "clamp(1.25rem, 3.5vw, 2rem)", background: "#FFFFFF", border: "1px solid #D7EAE1" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem", color: "#183B32" }}>
                  Thông Tin Trụ Sở
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <MapPin size={20} style={{ color: "#237A60", flexShrink: 0, marginTop: "0.2rem" }} />
                    <div>
                      <div style={{ fontWeight: 600, color: "#183B32", fontSize: "0.95rem" }}>Địa chỉ văn phòng</div>
                      <div style={{ color: "#48665B", fontSize: "0.88rem" }}>{BRAND.address}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <Clock size={20} style={{ color: "#237A60", flexShrink: 0, marginTop: "0.2rem" }} />
                    <div>
                      <div style={{ fontWeight: 600, color: "#183B32", fontSize: "0.95rem" }}>Thời gian làm việc</div>
                      <div style={{ color: "#48665B", fontSize: "0.88rem" }}>Thứ 2 – Chủ Nhật: 08:00 – 23:00 (Hệ thống chạy 24/7)</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <ShieldCheck size={20} style={{ color: "#237A60", flexShrink: 0, marginTop: "0.2rem" }} />
                    <div>
                      <div style={{ fontWeight: 600, color: "#183B32", fontSize: "0.95rem" }}>Cam kết bảo mật</div>
                      <div style={{ color: "#48665B", fontSize: "0.88rem" }}>
                        Tuyệt đối không yêu cầu mật khẩu. Thông tin khách hàng được mã hóa 100%.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Zalo Card Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, #D7F3E8 0%, #E8F8F1 100%)",
                  border: "1px solid #B9DCCD",
                  borderRadius: "16px",
                  padding: "clamp(1.25rem, 3.5vw, 2rem)",
                  boxShadow: "0 8px 30px rgba(24, 59, 50, 0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <Zap size={20} style={{ color: "#237A60" }} />
                  <span style={{ fontWeight: 700, color: "#183B32", fontSize: "1.05rem" }}>Cần báo giá ngay tức khắc?</span>
                </div>
                <p style={{ color: "#48665B", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                  Nhấp để mở Zalo trực tiếp với kỹ thuật viên trực tổng đài. Chúng tôi báo giá và triển khai đơn hàng chỉ sau 3 phút trao đổi!
                </p>
                <a
                  href={`https://zalo.me/${BRAND.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <MessageCircle size={18} /> Mở Chat Zalo ({BRAND.zalo})
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
