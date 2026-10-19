import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, RefreshCw, Lock, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "Chính Sách & Bảo Hành Dịch Vụ",
  description:
    "Chính sách bảo hành 30 ngày, bảo mật thông tin và hoàn tiền 100% tại ToTrongNhan Social Media Services.",
};

export default function PrivacyPage() {
  const policies = [
    {
      icon: RefreshCw,
      color: "#10B981",
      title: "Chính Sách Bảo Hành 30 Ngày",
      desc: "Cam kết bảo hành bù tụt 100% miễn phí trong 30 ngày kể từ khi hoàn tất đơn hàng.",
      points: [
        "Áp dụng cho toàn bộ dịch vụ tăng followers Facebook, TikTok, Instagram chính hãng.",
        "Nếu số lượng followers bị tụt quá 5% trong vòng 30 ngày, hệ thống sẽ tự động quét và bù lại đầy đủ mà không thu thêm bất kỳ phụ phí nào.",
        "Khách hàng chỉ cần gửi link kênh hoặc mã đơn hàng cho đội ngũ hỗ trợ qua Zalo để kích hoạt bảo hành.",
        "Không bảo hành trong trường hợp khách hàng tự ý đổi link/username trong lúc đơn đang chạy hoặc sử dụng đồng thời dịch vụ kém chất lượng từ bên thứ ba.",
      ],
    },
    {
      icon: Lock,
      color: "#7C3AED",
      title: "Chính Sách Bảo Mật Quyền Riêng Tư",
      desc: "An toàn tuyệt đối 100% cho tài khoản và thông tin cá nhân của bạn.",
      points: [
        "TUYỆT ĐỐI KHÔNG YÊU CẦU MẬT KHẨU (PASSWORD) hay quyền quản trị trang của khách hàng.",
        "Chúng tôi chỉ cần đường dẫn công khai (Link URL) hoặc @username để tiến hành dịch vụ.",
        "Dữ liệu đơn hàng và thông tin liên hệ được mã hóa, không bao giờ chia sẻ hay bán cho bất kỳ bên thứ ba nào.",
        "Hệ thống tăng trưởng dựa trên người dùng thực và thuật toán phân phối tự nhiên, tuân thủ tiêu chuẩn an toàn của các nền tảng MXH.",
      ],
    },
    {
      icon: ShieldCheck,
      color: "#06B6D4",
      title: "Chính Sách Hoàn Tiền 100%",
      desc: "Bảo vệ quyền lợi tối đa cho khách hàng khi có sự cố phát sinh.",
      points: [
        "Hoàn tiền 100% nếu chúng tôi không thể bắt đầu thực hiện đơn hàng sau 24h kể từ khi nhận thanh toán.",
        "Hoàn tiền theo tỷ lệ phần trăm tương ứng nếu đơn hàng không thể hoàn thành đủ số lượng theo cam kết do lỗi từ phía hệ thống.",
        "Quy trình hoàn tiền được xử lý nhanh gọn qua số tài khoản ngân hàng hoặc ví điện tử (Momo, ZaloPay) của quý khách trong vòng 30 phút.",
      ],
    },
    {
      icon: HelpCircle,
      color: "#EC4899",
      title: "Quy Trình & Hỗ Trợ Khách Hàng",
      desc: "Minh bạch trong từng bước thực hiện và chăm sóc sau bán hàng.",
      points: [
        "Bước 1: Tiếp nhận yêu cầu, tư vấn gói phù hợp và báo giá chi tiết.",
        "Bước 2: Khách hàng xác nhận và cung cấp link trang/bài viết cần tăng.",
        "Bước 3: Kích hoạt đơn hàng trên hệ thống, bắt đầu tăng dần theo tốc độ an toàn.",
        "Bước 4: Nghiệm thu kết quả, cấp mã bảo hành 30 ngày và hỗ trợ kỹ thuật liên tục.",
      ],
    },
  ];

  return (
    <div className="mesh-bg" style={{ paddingTop: "98px", minHeight: "100vh" }}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="section" style={{ paddingBottom: "3rem" }}>
        <div className="container-xl" style={{ textAlign: "center" }}>
          <span className="section-label">Minh Bạch & Uy Tín</span>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}>
            Chính Sách & Điều Khoản Dịch Vụ
          </h1>
          <p className="section-sub" style={{ margin: "0 auto" }}>
            Chúng tôi cam kết minh bạch về chính sách bảo hành, cam kết bảo mật và quyền lợi khách hàng.
            Sự an tâm của bạn là ưu tiên số 1 của ToTrongNhan.
          </p>
        </div>
      </section>

      {/* ── Policies Content ─────────────────────────────────── */}
      <section style={{ paddingBottom: "6rem" }}>
        <div className="container-xl" style={{ maxWidth: 960 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {policies.map((pol) => {
              const Icon = pol.icon;
              return (
                <div
                  key={pol.title}
                  className="card"
                  style={{
                    padding: "2.25rem",
                    background: "#FFFFFF",
                    border: "1px solid #D7EAE1",
                    borderLeft: "4px solid #237A60",
                    boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: "#E8F8F1",
                        color: "#237A60",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: "1px solid #B9DCCD",
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "#183B32" }}>
                        {pol.title}
                      </h2>
                      <p style={{ color: "#48665B", fontSize: "0.9rem", margin: 0 }}>
                        {pol.desc}
                      </p>
                    </div>
                  </div>

                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid #E5F0EA",
                      margin: "1.25rem 0",
                    }}
                  />

                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {pol.points.map((pt, i) => (
                      <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.95rem", lineHeight: 1.7, color: "#183B32" }}>
                        <CheckCircle2 size={18} style={{ color: "#237A60", flexShrink: 0, marginTop: "0.3rem" }} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Bottom Support Callout */}
            <div
              className="card"
              style={{
                padding: "2.5rem",
                textAlign: "center",
                background: "linear-gradient(135deg, #D7F3E8 0%, #E8F8F1 100%)",
                border: "1px solid #B9DCCD",
                boxShadow: "0 8px 30px rgba(24, 59, 50, 0.04)",
              }}
            >
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem", color: "#183B32" }}>
                Có câu hỏi hoặc cần yêu cầu bảo hành đơn hàng?
              </h3>
              <p style={{ color: "#48665B", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                Đội ngũ chăm sóc khách hàng hỗ trợ giải quyết thắc mắc và kích hoạt bảo hành 24/7.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={`https://zalo.me/${BRAND.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Liên Hệ Kỹ Thuật Viên Zalo <ArrowRight size={16} />
                </a>
                <Link href="/contact" className="btn-outline">
                  Xem Trang Liên Hệ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
