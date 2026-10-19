/**
 * app/page.tsx – Homepage ToTrongNhan
 */

import Link from "next/link";
import Image from "next/image";
import { testimonials, BRAND, PLATFORMS_CATALOG } from "@/lib/data";
import { getAllServices } from "@/lib/services-store";
import { posts } from "@/lib/mock-data";
import PricingCalculator from "@/components/ui/PricingCalculator";
import SystemStatusBanner from "@/components/ui/SystemStatusBanner";
import FaqAccordion from "@/components/ui/FaqAccordion";
import TypewriterText from "@/components/ui/TypewriterText";
import { MessageCircle, Star, ArrowRight, CheckCircle2, Zap, Shield, Clock, TrendingUp, ChevronRight, Phone } from "lucide-react";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";

// ── Feature list ─────────────────────────────────────────────────────────────

const features = [
  { icon: Shield,     title: "An Toàn 100%",       desc: "Không cần mật khẩu, không vi phạm chính sách nền tảng." },
  { icon: Clock,      title: "Giao Hàng Nhanh",     desc: "Xử lý đơn trong vòng 1-24h, cam kết đúng tiến độ." },
  { icon: TrendingUp, title: "Tăng Tự Nhiên",       desc: "Tăng dần từng bước, thuật toán không phát hiện." },
  { icon: CheckCircle2,title:"Bảo Hành 30 Ngày",   desc: "Followers giảm trong 30 ngày, chúng tôi bù miễn phí." },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const allServices = getAllServices();
  const featuredServices = allServices.filter((s) => s.popular);
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="mesh-bg" style={{ paddingTop: "clamp(96px, 12vw, 112px)" }}>
      <SystemStatusBanner />

      {/* ══════════════ HERO ═════════════════════════════════════════════ */}
      <section className="section" style={{ paddingTop: "3.5rem", paddingBottom: "5rem", overflow: "hidden", position: "relative" }}>
        {/* Decorative subtle ambient mint orbs */}
        <div
          className="float-orb-slow"
          style={{
            position: "absolute", top: "10%", left: "5%",
            width: 420, height: 420, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(166, 228, 209, 0.35) 0%, transparent 70%)",
            filter: "blur(50px)", pointerEvents: "none", zIndex: 0,
          }}
        />
        <div
          className="float-orb-reverse"
          style={{
            position: "absolute", top: "20%", right: "5%",
            width: 380, height: 380, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(215, 243, 232, 0.45) 0%, transparent 70%)",
            filter: "blur(50px)", pointerEvents: "none", zIndex: 0,
          }}
        />

        <div className="container-xl" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            {/* Badge */}
            <div className="animate-slide-up" style={{ marginBottom: "1.5rem" }}>
              <span className="section-label animate-float" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#237A60", display: "inline-block", boxShadow: "0 0 6px #237A60" }} />
                ⚡ Dịch vụ MXH chuyên nghiệp Việt Nam • Tô Trọng Nhân
              </span>
            </div>

            {/* Headline */}
            <h1
              className="animate-slide-up delay-100"
              style={{
                fontSize: "clamp(2.2rem, 6vw, 4.2rem)",
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: "1.5rem",
                color: "#183B32",
                letterSpacing: "-0.02em",
              }}
            >
              Tăng trưởng{" "}
              <span className="animate-gradient-text" style={{ fontWeight: 900 }}>
                Facebook, TikTok
              </span>
              <br />& <span className="animate-gradient-text" style={{ fontWeight: 900 }}>Instagram</span>{" "}
              <span>siêu tốc</span>
            </h1>

            {/* Description */}
            <p
              className="animate-slide-up delay-200"
              style={{
                color: "#48665B",
                fontSize: "clamp(1.05rem, 2.5vw, 1.22rem)",
                lineHeight: 1.8,
                marginBottom: "1.5rem",
                maxWidth: 640,
                margin: "0 auto 1.5rem",
              }}
            >
              Chuyên cung cấp dịch vụ tăng followers, like, view, tương tác chất lượng cao.
              An toàn 100% không cần mật khẩu, bảo hành 30 ngày bù tụt, hỗ trợ 24/7 trực tiếp cùng Tô Trọng Nhân (Toti).
            </p>

            {/* Dynamic Typewriter Badge Banner */}
            <div
              className="animate-slide-up delay-200"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.45rem 1.15rem",
                borderRadius: "999px",
                background: "rgba(232, 248, 241, 0.95)",
                border: "1.5px solid #B9DCCD",
                boxShadow: "0 2px 12px rgba(24, 59, 50, 0.06)",
                marginBottom: "2rem",
                maxWidth: "100%",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "0.86rem", fontWeight: 800, color: "#237A60", flexShrink: 0 }}>
                ⚡ Dịch vụ trọng tâm:
              </span>
              <TypewriterText
                texts={[
                  "Tăng Follow Facebook thật bảo hành 30 ngày bù tụt",
                  "Đẩy Clip TikTok lên xu hướng triệu view thần tốc",
                  "Tăng tương tác Instagram Reels, Like & Bình luận thật",
                  "Xây dựng thương hiệu cá nhân uy tín cùng Tô Trọng Nhân (Toti)",
                  "Bảo mật 100% – Tuyệt đối không cần mật khẩu tài khoản",
                ]}
                typingSpeed={40}
                deletingSpeed={20}
                pauseDuration={2400}
                cursorColor="#237A60"
                style={{ fontSize: "0.88rem", fontWeight: 700, color: "#183B32" }}
              />
            </div>


            {/* CTAs */}
            <div
              className="animate-slide-up delay-300"
              style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}
            >
              <Link href="/services" className="btn-primary btn-shimmer" style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}>
                Xem Bảng Giá Dịch Vụ <ArrowRight size={18} />
              </Link>
              <a
                href={`https://zalo.me/${BRAND.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline card-glow"
                style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
              >
                <MessageCircle size={18} /> Chat Zalo Toti
              </a>
            </div>

            {/* Trust Pills */}
            <div
              className="animate-slide-up delay-400"
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.82rem", fontWeight: 600, color: "#237A60",
                background: "rgba(166, 228, 209, 0.35)", padding: "0.35rem 0.8rem",
                borderRadius: "999px", border: "1px solid #B9DCCD",
              }}>
                <Shield size={14} /> Không cần mật khẩu
              </span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.82rem", fontWeight: 600, color: "#237A60",
                background: "rgba(166, 228, 209, 0.35)", padding: "0.35rem 0.8rem",
                borderRadius: "999px", border: "1px solid #B9DCCD",
              }}>
                <Zap size={14} /> Kích hoạt sau 15 phút
              </span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.82rem", fontWeight: 600, color: "#237A60",
                background: "rgba(166, 228, 209, 0.35)", padding: "0.35rem 0.8rem",
                borderRadius: "999px", border: "1px solid #B9DCCD",
              }}>
                <CheckCircle2 size={14} /> Bảo hành 30 ngày
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Dock Bar (SocialBoost Style) ────────────────────────── */}
      <nav
        style={{
          borderTop: "1px solid #B9DCCD",
          borderBottom: "1px solid #B9DCCD",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(14px)",
          padding: "0.85rem 0",
          position: "sticky",
          top: "98px",
          zIndex: 99,
          boxShadow: "0 4px 20px rgba(24, 59, 50, 0.04)",
        }}
        aria-label="Chọn nền tảng dịch vụ"
      >
        <div className="container-xl">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              overflowX: "auto",
              paddingBottom: "0.2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#183B32", textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span>🌐</span> 6 Nền Tảng:
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
              {PLATFORMS_CATALOG.map((p) => (
                <Link
                  key={p.id}
                  href={`/${p.slug}`}
                  className="card-glow"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.42rem 0.9rem",
                    borderRadius: "999px",
                    background: "#FFFFFF",
                    border: "1px solid #B9DCCD",
                    color: "#183B32",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <SocialPlatformLogo platform={p.id} size={18} />
                  <span>{p.name}</span>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: p.color,
                      background: p.bgLight,
                      padding: "0.1rem 0.45rem",
                      borderRadius: "999px",
                    }}
                  >
                    {p.serviceCount}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════════ GOAL-BASED SERVICES (SocialBoost Inspired) ════════ */}
      <section className="section" style={{ paddingBottom: "3rem" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Lựa chọn theo mục tiêu</span>
            <h2 className="section-title">Bạn Muốn Tăng Trưởng Mục Tiêu Gì?</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Hệ thống dịch vụ phân loại thông minh giúp bạn chọn đúng giải pháp theo từng giai đoạn phát triển
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Goal 1: Interaction */}
            <div
              className="card card-glow"
              style={{
                padding: "2rem",
                borderRadius: "22px",
                background: "#FFFFFF",
                border: "1.5px solid #B9DCCD",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: 54, height: 54, borderRadius: 16,
                    background: "rgba(255, 0, 80, 0.08)",
                    border: "1px solid rgba(255, 0, 80, 0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.6rem", marginBottom: "1.25rem",
                  }}
                >
                  ❤️
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#183B32", marginBottom: "0.6rem" }}>
                  Tăng Tương Tác Bài Viết
                </h3>
                <p style={{ color: "#48665B", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  Tối ưu lượt thích, tim, cảm xúc, bình luận seeding và chia sẻ bài đăng giúp bài viết nổi bật trên news feed.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>Like / Tim</span>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>Bình luận seeding</span>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>Chia sẻ viral</span>
                </div>
              </div>
              <Link href="/services" style={{ color: "#237A60", fontWeight: 700, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Xem dịch vụ tương tác <ChevronRight size={16} />
              </Link>
            </div>

            {/* Goal 2: Growth */}
            <div
              className="card card-glow"
              style={{
                padding: "2rem",
                borderRadius: "22px",
                background: "#FFFFFF",
                border: "1.5px solid #B9DCCD",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: 54, height: 54, borderRadius: 16,
                    background: "rgba(24, 119, 242, 0.08)",
                    border: "1px solid rgba(24, 119, 242, 0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.6rem", marginBottom: "1.25rem",
                  }}
                >
                  👥
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#183B32", marginBottom: "0.6rem" }}>
                  Tăng Trưởng Follow &amp; Sub
                </h3>
                <p style={{ color: "#48665B", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  Xây dựng tệp người theo dõi trang cá nhân, Fanpage, Subscriber YouTube và Member Telegram chuẩn uy tín.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>Follow Facebook</span>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>TikTok 1K mở live</span>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>YouTube Sub</span>
                </div>
              </div>
              <Link href="/services" style={{ color: "#237A60", fontWeight: 700, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Xem dịch vụ follow <ChevronRight size={16} />
              </Link>
            </div>

            {/* Goal 3: Reach Video */}
            <div
              className="card card-glow"
              style={{
                padding: "2rem",
                borderRadius: "22px",
                background: "#FFFFFF",
                border: "1.5px solid #B9DCCD",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: 54, height: 54, borderRadius: 16,
                    background: "rgba(225, 48, 108, 0.08)",
                    border: "1px solid rgba(225, 48, 108, 0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.6rem", marginBottom: "1.25rem",
                  }}
                >
                  🔥
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#183B32", marginBottom: "0.6rem" }}>
                  Tăng View Video &amp; Reels
                </h3>
                <p style={{ color: "#48665B", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  Tăng lượt xem video dài, Reels, Shorts và video TikTok để kích hoạt thuật toán đề xuất xu hướng FYP và Explore.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>View FYP TikTok</span>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>Instagram Reels</span>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>YouTube Shorts</span>
                </div>
              </div>
              <Link href="/services" style={{ color: "#237A60", fontWeight: 700, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Xem dịch vụ view <ChevronRight size={16} />
              </Link>
            </div>

            {/* Goal 4: Live & VIP */}
            <div
              className="card card-glow"
              style={{
                padding: "2rem",
                borderRadius: "22px",
                background: "#FFFFFF",
                border: "1.5px solid #B9DCCD",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: 54, height: 54, borderRadius: 16,
                    background: "rgba(35, 122, 96, 0.1)",
                    border: "1px solid rgba(35, 122, 96, 0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.6rem", marginBottom: "1.25rem",
                  }}
                >
                  👁️
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#183B32", marginBottom: "0.6rem" }}>
                  Mắt Livestream &amp; VIP Tháng
                </h3>
                <p style={{ color: "#48665B", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  Tăng mắt xem trực tiếp cho các buổi phát sóng bán hàng, PK TikTok và gói VIP Like tự động theo tháng.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>Mắt live FB/TikTok</span>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>VIP like tháng</span>
                  <span style={{ fontSize: "0.74rem", background: "#E8F8F1", color: "#237A60", padding: "0.2rem 0.55rem", borderRadius: "6px", fontWeight: 700 }}>VIA / BM Agency</span>
                </div>
              </div>
              <Link href="/services" style={{ color: "#237A60", fontWeight: 700, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Xem dịch vụ Livestream <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ══════════════ 6 DEDICATED PLATFORMS ═════════════════════════════ */}
      <section className="section">
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Đa nền tảng hỗ trợ</span>
            <h2 className="section-title">6 Kênh Mạng Xã Hội Chuyên Sâu</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Chọn nền tảng bạn muốn phát triển để xem bảng giá và gói dịch vụ tối ưu
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "1.5rem",
            }}
          >
            {PLATFORMS_CATALOG.map((p) => (
              <Link key={p.id} href={`/${p.slug}`} style={{ textDecoration: "none" }}>
                <div
                  className="card card-glow"
                  style={{
                    padding: "2rem",
                    borderRadius: "22px",
                    background: "#FFFFFF",
                    border: "1.5px solid #B9DCCD",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          background: p.bgLight,
                          border: `1px solid ${p.borderLight}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SocialPlatformLogo platform={p.id} size={38} />
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: p.color,
                          background: p.bgLight,
                          padding: "0.25rem 0.75rem",
                          borderRadius: "999px",
                          border: `1px solid ${p.borderLight}`,
                        }}
                      >
                        {p.serviceCount} Dịch vụ
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem", color: "#183B32" }}>
                      {p.name}
                    </h3>
                    <p style={{ color: "#48665B", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                      {p.tagline}.
                    </p>
                  </div>

                  <div
                    style={{
                      paddingTop: "1.25rem",
                      borderTop: "1px solid #E5F0EA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: p.color,
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>Khám phá trang {p.name}</span>
                    <ChevronRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ══════════════ FEATURED SERVICES ════════════════════════════════ */}
      <section className="section">
        <div className="container-xl">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="section-label">Dịch vụ nổi bật</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Được Chọn Nhiều Nhất</h2>
            </div>
            <Link href="/services" style={{ color: "#237A60", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.3rem", textDecoration: "none" }}>
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1.25rem" }}>
            {featuredServices.map((svc) => {
              return (
                <div key={svc.id} className="card" style={{ padding: "1.75rem", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  {/* Top Row: Icon on left, Popular badge on right */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1.2rem",
                    gap: "0.75rem",
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: "#FFFFFF",
                      border: "1.5px solid #D7EAE1",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(24, 59, 50, 0.05)",
                    }}>
                      <SocialPlatformLogo platform={svc.platform} size={36} />
                    </div>

                      {/* Popular badge */}
                      <span style={{
                        background: "linear-gradient(135deg, #183B32 0%, #237A60 100%)",
                        color: "#A6E4D1",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "0.28rem 0.7rem",
                        borderRadius: "999px",
                        letterSpacing: "0.04em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        boxShadow: "0 2px 8px rgba(24, 59, 50, 0.12)",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}>
                        HOT 🔥
                      </span>
                    </div>

                    <h3 style={{ fontSize: "clamp(1.1rem, 2vw, 1.2rem)", fontWeight: 700, lineHeight: 1.38, marginBottom: "0.6rem", color: "#183B32" }}>{svc.title}</h3>
                    <p style={{ color: "#48665B", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>{svc.description}</p>
                  </div>

                  {/* Features */}
                  <ul style={{ listStyle: "none", margin: "0 0 1.5rem", padding: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {svc.features.slice(0, 3).map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#48665B", fontSize: "0.82rem" }}>
                        <CheckCircle2 size={14} style={{ color: "#237A60", flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ color: "#71877E", fontSize: "0.75rem" }}>Từ </span>
                      <span style={{ color: "#237A60", fontWeight: 700, fontSize: "1.1rem" }}>
                        {svc.startingPrice.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <Link href={`/services#${svc.id}`} className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}>
                      Đặt ngay
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ══════════════ PRICING CALCULATOR (NEW INTERACTIVE TOOL) ═════ */}
      <section className="section" id="calculator" style={{ position: "relative" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="section-label">⚡ Tính giá tự động</span>
            <h2 className="section-title">Báo Giá & Chiết Khấu Trực Tuyến</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Kéo thanh trượt để chọn số lượng mong muốn và nhận báo giá ưu đãi tức thì
            </p>
          </div>
          <PricingCalculator />
        </div>
      </section>

      <hr className="divider" />

      {/* ══════════════ WHY US ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: "#E8F8F1" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Tại sao chọn chúng tôi</span>
            <h2 className="section-title">Cam Kết Chất Lượng</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Chúng tôi không chỉ bán dịch vụ, chúng tôi đồng hành cùng sự phát triển của bạn
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1.5rem" }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: "1.75rem", textAlign: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: "#D7F3E8",
                  border: "1px solid #B9DCCD",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  color: "#237A60",
                }}>
                  <f.icon size={24} />
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.6rem", color: "#183B32" }}>{f.title}</h3>
                <p style={{ color: "#48665B", fontSize: "0.875rem", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ══════════════ TESTIMONIALS ══════════════════════════════════════ */}
      <section className="section">
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Khách hàng nói gì</span>
            <h2 className="section-title">Đánh Giá Thực Tế</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1.25rem" }}>
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.id} className="card" style={{ padding: "1.75rem" }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1rem" }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={15} style={{ color: "#237A60", fill: "#237A60" }} />
                  ))}
                </div>
                <p style={{ color: "#48665B", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "1.25rem" }}>
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
                    <div style={{ color: "#71877E", fontSize: "0.8rem" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/about#testimonials" style={{ color: "#237A60", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.3rem", textDecoration: "none" }}>
              Xem thêm đánh giá <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ══════════════ BLOG ══════════════════════════════════════════════ */}
      <section className="section">
        <div className="container-xl">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="section-label">Kiến thức MXH</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Bài Viết Mới Nhất</h2>
            </div>
            <Link href="/blog" style={{ color: "#237A60", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.3rem", textDecoration: "none" }}>
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1.25rem" }}>
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", width: "100%", height: 200 }}>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", alignItems: "center" }}>
                        <span style={{
                          display: "inline-block", padding: "0.2rem 0.75rem",
                          background: "#D7F3E8",
                          border: "1px solid #B9DCCD",
                          color: "#183B32",
                          borderRadius: 50, fontSize: "0.75rem", fontWeight: 600,
                        }}>
                          {post.category.name}
                        </span>
                        <span style={{ color: "#71877E", fontSize: "0.75rem" }}>{post.readingTime} phút đọc</span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.5, marginBottom: "0.6rem", color: "#183B32" }}>{post.title}</h3>
                      <p style={{ color: "#48665B", fontSize: "0.85rem", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {post.excerpt}
                      </p>
                    </div>
                    <div style={{ marginTop: "1rem", color: "#237A60", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      Đọc tiếp <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ══════════════ FAQ ACCORDION ═════════════════════════════════════ */}
      <section className="section" style={{ background: "#EDF8F3" }}>
        <div className="container-xl">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Giải đáp thắc mắc</span>
            <h2 className="section-title">Câu Hỏi Thường Gặp (FAQ)</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              Tất cả những gì bạn cần biết về chính sách bảo hành, độ an toàn và quy trình thực hiện
            </p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <hr className="divider" />

      {/* ══════════════ CTA BANNER ════════════════════════════════════════ */}
      <section className="section">
        <div className="container-xl">
          <div style={{
            borderRadius: 24,
            background: "linear-gradient(135deg, #D7F3E8 0%, #E8F8F1 100%)",
            border: "1px solid #B9DCCD",
            padding: "clamp(2rem, 5vw, 4rem)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(24, 59, 50, 0.04)",
          }}>
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "1rem", color: "#183B32" }}>
                Sẵn sàng phát triển kênh của bạn? 🚀
              </h2>
              <p style={{ color: "#48665B", fontSize: "1.05rem", marginBottom: "2rem", maxWidth: 500, margin: "0 auto 2rem" }}>
                Liên hệ ngay để được tư vấn miễn phí và nhận ưu đãi đặc biệt cho đơn đầu tiên!
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/contact" className="btn-primary" style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}>
                  Liên Hệ Ngay <ArrowRight size={18} />
                </Link>
                <a
                  href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                  className="btn-outline"
                  style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
                >
                  <Phone size={18} /> {BRAND.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
