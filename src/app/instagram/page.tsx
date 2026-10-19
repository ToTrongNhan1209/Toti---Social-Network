import { Metadata } from "next";
import PlatformPageTemplate from "@/components/platform/PlatformPageTemplate";

export const metadata: Metadata = {
  title: "Dịch Vụ Instagram – Tăng Follow, Like, View Reels Khám Phá | Tô Trọng Nhân",
  description: "Dịch vụ tăng follow Instagram người dùng thật có avatar, like bài viết, view Reels vào tab Explore khám phá từ Tô Trọng Nhân.",
};

export default function InstagramPage() {
  return <PlatformPageTemplate platformKey="instagram" />;
}
