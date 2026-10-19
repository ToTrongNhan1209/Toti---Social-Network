import { Metadata } from "next";
import PlatformPageTemplate from "@/components/platform/PlatformPageTemplate";

export const metadata: Metadata = {
  title: "Dịch Vụ TikTok – Tăng Follow, Tim, View FYP, Mắt Live PK | Tô Trọng Nhân",
  description: "Dịch vụ tăng follow TikTok đạt 1.000 Follow mở livestream, tăng tim video, tăng view đẩy FYP đề xuất, uy tín, an toàn 100% từ Tô Trọng Nhân.",
};

export default function TikTokPage() {
  return <PlatformPageTemplate platformKey="tiktok" />;
}
