import { Metadata } from "next";
import PlatformPageTemplate from "@/components/platform/PlatformPageTemplate";

export const metadata: Metadata = {
  title: "Dịch Vụ YouTube – Tăng Sub, View, 4.000 Giờ Xem Bật Kiếm Tiền | Tô Trọng Nhân",
  description: "Dịch vụ tăng subscriber YouTube thật, tăng view video giữ chân cao, trọn gói 4.000 giờ xem đạt chuẩn bật kiếm tiền YouTube Partner Program.",
};

export default function YouTubePage() {
  return <PlatformPageTemplate platformKey="youtube" />;
}
