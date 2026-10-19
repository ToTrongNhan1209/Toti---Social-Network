import { Metadata } from "next";
import PlatformPageTemplate from "@/components/platform/PlatformPageTemplate";

export const metadata: Metadata = {
  title: "Dịch Vụ Facebook – Tăng Like, Follow, View Reels, Livestream | Tô Trọng Nhân",
  description: "Dịch vụ tăng like Facebook, follow trang cá nhân, like Fanpage, mắt livestream, đánh giá 5 sao uy tín, bảo hành 30 ngày bù tụt từ Tô Trọng Nhân (Toti).",
};

export default function FacebookPage() {
  return <PlatformPageTemplate platformKey="facebook" />;
}
