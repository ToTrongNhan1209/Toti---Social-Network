import { Metadata } from "next";
import PlatformPageTemplate from "@/components/platform/PlatformPageTemplate";

export const metadata: Metadata = {
  title: "Dịch Vụ Telegram – Tăng Member Channel, Group, View & Reaction | Tô Trọng Nhân",
  description: "Dịch vụ tăng thành viên kênh Telegram Channel, nhóm Group, view bài đăng và cảm xúc reaction Telegram uy tín, an toàn 100% từ Tô Trọng Nhân.",
};

export default function TelegramPage() {
  return <PlatformPageTemplate platformKey="telegram" />;
}
