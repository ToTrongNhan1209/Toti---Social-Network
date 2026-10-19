import Link from "next/link";
import { Home, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="mesh-bg"
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div className="container-xl" style={{ maxWidth: 640 }}>
        <div
          style={{
            fontSize: "clamp(5rem, 15vw, 8rem)",
            fontWeight: 900,
            fontFamily: "var(--font-heading)",
            lineHeight: 1,
            marginBottom: "1rem",
            userSelect: "none",
            color: "#237A60",
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, marginBottom: "0.75rem", color: "#183B32" }}>
          Trang Không Tồn Tại
        </h1>
        <p style={{ color: "#48665B", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          Đường dẫn bạn yêu cầu có thể đã thay đổi hoặc không còn khả dụng.
          Hãy kiểm tra lại URL hoặc khám phá các dịch vụ thịnh hành bên dưới.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
          <Link href="/" className="btn-primary">
            <Home size={16} /> Quay Về Trang Chủ
          </Link>
          <Link href="/services" className="btn-outline">
            <Zap size={16} /> Xem Dịch Vụ MXH
          </Link>
        </div>

        {/* Quick Links */}
        <div
          className="card"
          style={{
            padding: "1.25rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            fontSize: "0.88rem",
            color: "#48665B",
            background: "#FFFFFF",
            border: "1px solid #D7EAE1",
          }}
        >
          <Link href="/pricing" style={{ color: "#237A60", fontWeight: 600 }}>
            Bảng Giá Dịch Vụ
          </Link>
          <span style={{ color: "#D7EAE1" }}>•</span>
          <Link href="/blog" style={{ color: "#237A60", fontWeight: 600 }}>
            Blog Tăng Trưởng
          </Link>
          <span style={{ color: "#D7EAE1" }}>•</span>
          <Link href="/contact" style={{ color: "#237A60", fontWeight: 600 }}>
            Liên Hệ Tư Vấn
          </Link>
          <span style={{ color: "#D7EAE1" }}>•</span>
          <Link href="/privacy" style={{ color: "#237A60", fontWeight: 600 }}>
            Chính Sách Bảo Hành
          </Link>
        </div>
      </div>
    </div>
  );
}
