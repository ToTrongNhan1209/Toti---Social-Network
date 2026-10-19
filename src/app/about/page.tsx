/**
 * app/about/page.tsx – Về chúng tôi
 */

import type { Metadata } from "next";
import Link from "next/link";
import { testimonials, stats, BRAND } from "@/lib/data";
import { Star, MessageCircle, Phone, Target, Eye, Heart, Award } from "lucide-react";
import TypewriterText from "@/components/ui/TypewriterText";

export const metadata: Metadata = {
  title: "Về Chúng Tôi",
  description: "ToTrongNhan – Đơn vị cung cấp dịch vụ mạng xã hội uy tín. Tìm hiểu câu chuyện, giá trị và cam kết của chúng tôi.",
};

const values = [
  { icon: Target, title: "Chuyên nghiệp",  desc: "5+ năm kinh nghiệm trong lĩnh vực dịch vụ mạng xã hội, đội ngũ chuyên sâu và tận tâm." },
  { icon: Eye,    title: "Minh bạch",      desc: "Công khai quy trình, giá cả và cam kết. Không ẩn phí, không gian lận khách hàng." },
  { icon: Heart,  title: "Tận tâm",        desc: "Hỗ trợ 24/7, luôn đặt lợi ích khách hàng lên hàng đầu trong mọi quyết định." },
  { icon: Award,  title: "Uy tín",         desc: "Hơn 10.000 khách hàng hài lòng là minh chứng tốt nhất cho chất lượng dịch vụ." },
];

const teamMembers = [
  {
    name: "Tô Trọng Nhân",
    role: "Founder & CEO",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    desc: "5+ năm kinh nghiệm digital marketing và social media growth hacking.",
  },
  {
    name: "Nguyễn Thị Lan",
    role: "Head of Operations",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    desc: "Quản lý vận hành và đảm bảo chất lượng dịch vụ cho toàn bộ đơn hàng.",
  },
  {
    name: "Trần Văn Đức",
    role: "Technical Lead",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    desc: "Phụ trách hệ thống kỹ thuật và tối ưu hóa quy trình xử lý đơn hàng.",
  },
];

export default function AboutPage() {
  return (
    <div className="mesh-bg" style={{ paddingTop: "98px" }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-xl">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "center" }}>
            <div>
              <span className="section-label">Về Chúng Tôi</span>
              <h1 className="section-title" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "#183B32", marginBottom: "0.75rem" }}>
                Chúng Tôi Là Ai?
              </h1>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.4rem 1rem",
                  borderRadius: "999px",
                  background: "#E8F8F1",
                  border: "1px solid #B9DCCD",
                  marginBottom: "1.5rem",
                  maxWidth: "100%",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#237A60", flexShrink: 0 }}>
                  💡 Định vị:
                </span>
                <TypewriterText
                  texts={[
                    "Chuyên gia đồng hành cùng 10.000+ cá nhân & doanh nghiệp Việt Nam.",
                    "Chiến lược tăng trưởng mạng xã hội thực chiến, an toàn và bền vững.",
                    "Cam kết tương tác thật 100% – Bảo hành uy tín cùng Tô Trọng Nhân.",
                  ]}
                  typingSpeed={40}
                  deletingSpeed={20}
                  pauseDuration={2500}
                  cursorColor="#237A60"
                  style={{ fontSize: "0.88rem", fontWeight: 700, color: "#183B32" }}
                />
              </div>
              <p style={{ color: "#48665B", lineHeight: 1.9, marginBottom: "1.5rem", fontSize: "1rem" }}>
                <strong style={{ color: "#183B32" }}>ToTrongNhan</strong> là đơn vị chuyên cung cấp dịch vụ hỗ trợ mạng xã hội
                hàng đầu tại Việt Nam. Chúng tôi chuyên về tăng trưởng tài khoản Facebook, TikTok
                và Instagram cho cá nhân, doanh nghiệp và influencer.
              </p>
              <p style={{ color: "#48665B", lineHeight: 1.9, marginBottom: "2rem", fontSize: "1rem" }}>
                Thành lập từ năm 2019, chúng tôi đã phục vụ hơn <strong style={{ color: "#237A60" }}>10.000+ khách hàng</strong> và
                hoàn thành <strong style={{ color: "#237A60" }}>50.000+ đơn hàng</strong> với tỷ lệ hài lòng 98%.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/services" className="btn-primary">Xem Dịch Vụ</Link>
                <a href={`https://zalo.me/${BRAND.zalo}`} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <MessageCircle size={16} /> Liên hệ Zalo
                </a>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {stats.map((s) => (
                <div key={s.label} className="card" style={{ padding: "1.75rem", textAlign: "center", background: "#FFFFFF", border: "1px solid #D7EAE1" }}>
                  <div style={{ fontSize: "2.25rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "#237A60", marginBottom: "0.3rem" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#71877E" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Giá trị cốt lõi</span>
            <h2 className="section-title">Điều Làm Chúng Tôi Khác Biệt</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1.5rem" }}>
            {values.map((v) => (
              <div key={v.title} className="card" style={{ padding: "2rem", textAlign: "center", background: "#FFFFFF", border: "1px solid #D7EAE1" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: "#E8F8F1",
                  border: "1px solid #B9DCCD",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  color: "#237A60",
                }}>
                  <v.icon size={28} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", color: "#183B32" }}>{v.title}</h3>
                <p style={{ color: "#48665B", fontSize: "0.875rem", lineHeight: 1.8 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Đội ngũ</span>
            <h2 className="section-title">Con Người Đứng Sau ToTrongNhan</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "1.5rem" }}>
            {teamMembers.map((member) => (
              <div key={member.name} className="card" style={{ padding: "2rem", textAlign: "center", background: "#FFFFFF", border: "1px solid #D7EAE1" }}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{
                    width: 100, height: 100, borderRadius: "50%",
                    objectFit: "cover", margin: "0 auto 1.25rem",
                    border: "3px solid #D7EAE1",
                    display: "block",
                  }}
                />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.3rem", color: "#183B32" }}>{member.name}</h3>
                <div style={{
                  display: "inline-block", padding: "0.2rem 0.75rem",
                  background: "#D7F3E8", border: "1px solid #B9DCCD",
                  color: "#183B32", borderRadius: 50, fontSize: "0.75rem", fontWeight: 600,
                  marginBottom: "0.9rem",
                }}>
                  {member.role}
                </div>
                <p style={{ color: "#48665B", fontSize: "0.875rem", lineHeight: 1.7 }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="section" id="testimonials">
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Phản hồi khách hàng</span>
            <h2 className="section-title">Khách Hàng Nói Gì Về Chúng Tôi</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1.25rem" }}>
            {testimonials.map((t) => (
              <div key={t.id} className="card" style={{ padding: "1.75rem", background: "#FFFFFF", border: "1px solid #D7EAE1" }}>
                <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1rem" }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={15} style={{ color: "#237A60", fill: "#237A60" }} />
                  ))}
                </div>
                <p style={{ color: "#48665B", fontSize: "0.875rem", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                  &ldquo;{t.content}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid #D7EAE1" }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#183B32" }}>{t.name}</div>
                    <div style={{ color: "#71877E", fontSize: "0.78rem" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container-xl">
          <div style={{
            borderRadius: 24,
            background: "linear-gradient(135deg, #D7F3E8 0%, #E8F8F1 100%)",
            border: "1px solid #B9DCCD",
            padding: "clamp(1.5rem, 5vw, 3rem)", textAlign: "center",
            boxShadow: "0 8px 30px rgba(24, 59, 50, 0.04)",
          }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, marginBottom: "1rem", color: "#183B32" }}>
              Sẵn sàng bắt đầu? 🚀
            </h2>
            <p style={{ color: "#48665B", marginBottom: "2rem" }}>
              Liên hệ ngay để được tư vấn miễn phí và đặt dịch vụ
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-primary">Liên Hệ Ngay</Link>
              <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="btn-outline">
                <Phone size={16} /> {BRAND.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
