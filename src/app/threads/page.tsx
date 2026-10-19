import { Metadata } from "next";
import PlatformPageTemplate from "@/components/platform/PlatformPageTemplate";

export const metadata: Metadata = {
  title: "Dịch Vụ Threads Meta – Tăng Follow, Like, Bình Luận & Repost | Tô Trọng Nhân",
  description: "Dịch vụ tăng follow Threads Meta, like bài viết, bình luận và chia sẻ viral trên mạng xã hội Threads mới nhất từ Tô Trọng Nhân.",
};

export default function ThreadsPage() {
  return <PlatformPageTemplate platformKey="threads" />;
}
