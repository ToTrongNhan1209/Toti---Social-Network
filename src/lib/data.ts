/**
 * lib/data.ts
 * Dữ liệu tĩnh hoàn chỉnh cho ToTrongNhan – Dịch vụ hỗ trợ mạng xã hội đa nền tảng
 * Hệ thống dịch vụ chuẩn hóa lấy cảm hứng từ SocialBoost với đầy đủ 6 nền tảng lớn
 */

export const BRAND = {
  name: "ToTrongNhan",
  fullName: "Tô Trọng Nhân (Toti)",
  tagline: "Dịch vụ tăng tương tác & hỗ trợ mạng xã hội chuyên nghiệp",
  description:
    "Chuyên cung cấp dịch vụ tăng like, follow, view và tương tác đa nền tảng cho Facebook, TikTok, Instagram, YouTube, Threads và Telegram – uy tín, bảo hành 30 ngày bù tụt, hỗ trợ trực tiếp 24/7.",
  phone: "0981 587 469",
  email: "totrongnhan1209@gmail.com",
  zalo: "0981587469",
  address: "TP. Hồ Chí Minh, Việt Nam",
  fanpage: "https://facebook.com",
  tiktok: "https://tiktok.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
};

// ── Service platforms ────────────────────────────────────────────────────────

export type Platform =
  | "facebook"
  | "tiktok"
  | "instagram"
  | "youtube"
  | "threads"
  | "telegram"
  | "all";

export type ServiceCategory = "interaction" | "growth" | "reach" | "live_vip";

export type Service = {
  id: string;
  platform: Platform;
  category: ServiceCategory;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  features: string[];
  startingPrice: number;
  unit: string;
  popular?: boolean;
};

// ── Platform Details Metadata ────────────────────────────────────────────────

export type PlatformDetail = {
  id: Platform;
  name: string;
  slug: string;
  badge: string;
  tagline: string;
  description: string;
  color: string;
  bgLight: string;
  borderLight: string;
  iconSvgName: string;
  serviceCount: number;
  statHighlights: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
};

export const PLATFORMS_CATALOG: PlatformDetail[] = [
  {
    id: "facebook",
    name: "Facebook",
    slug: "facebook",
    badge: "Phổ biến nhất",
    tagline: "Tăng like, follow, view Reels, mắt livestream và đánh giá Fanpage",
    description: "Giải pháp toàn diện tăng uy tín cá nhân, bán hàng và xây dựng cộng đồng Fanpage vững mạnh.",
    color: "#1877F2",
    bgLight: "rgba(24, 119, 242, 0.08)",
    borderLight: "rgba(24, 119, 242, 0.25)",
    iconSvgName: "facebook",
    serviceCount: 14,
    statHighlights: [
      { label: "Đơn Facebook thành công", value: "35.000+" },
      { label: "Tỉ lệ hoàn thành đúng hẹn", value: "99.8%" },
      { label: "Bảo hành bù tụt", value: "30 ngày" },
      { label: "Tốc độ xử lý trung bình", value: "15 phút" },
    ],
    faqs: [
      {
        q: "Tăng like bài viết và follow Facebook có cần mật khẩu không?",
        a: "Tuyệt đối không! Bạn chỉ cần cung cấp link bài viết hoặc link trang cá nhân/Fanpage ở chế độ công khai.",
      },
      {
        q: "Like và follow Facebook có bị tụt sau khi hoàn thành không?",
        a: "Chúng tôi sử dụng tài khoản người dùng thực chất lượng cao. Nếu có hao hụt tự nhiên trong 30 ngày, hệ thống sẽ tự động bù đủ miễn phí.",
      },
      {
        q: "Thời gian chạy tăng mắt livestream Facebook mất bao lâu để lên?",
        a: "Mắt livestream kích hoạt ngay sau 2-5 phút kể từ khi gửi link livestream đang phát sóng.",
      },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    slug: "tiktok",
    badge: "Xu hướng bùng nổ",
    tagline: "Tăng follow, tim video, view FYP, chia sẻ và mắt xem livestream PK",
    description: "Đẩy video lên đề xuất For You Page (FYP), mở khóa tính năng Livestream và kích hoạt TikTok Shop nhanh chóng.",
    color: "#FF0050",
    bgLight: "rgba(255, 0, 80, 0.08)",
    borderLight: "rgba(255, 0, 80, 0.25)",
    iconSvgName: "tiktok",
    serviceCount: 10,
    statHighlights: [
      { label: "Kênh đã đạt 10K Follow", value: "1.200+" },
      { label: "Video được lên FYP", value: "85%" },
      { label: "Thời gian bắt đầu", value: "30 phút" },
      { label: "Bảo hành chất lượng", value: "100%" },
    ],
    faqs: [
      {
        q: "Bao nhiêu follow thì tài khoản TikTok được bật tính năng Livestream?",
        a: "Tài khoản TikTok cần đạt tối thiểu 1.000 followers để mở tính năng Livestream và gắn link TikTok Shop. Các gói follow của Toti giúp bạn đạt mốc này trong vòng 24h.",
      },
      {
        q: "Tăng view TikTok có giúp video ăn đề xuất FYP không?",
        a: "Có! View và lượt lưu (Save), tim ban đầu kích hoạt tín hiệu tương tác cao trong 2 giờ đầu, giúp thuật toán TikTok phân phối video đến người dùng mới trên tab For You.",
      },
      {
        q: "Dịch vụ TikTok có an toàn cho kênh không?",
        a: "Hoàn toàn an toàn. Tốc độ tăng được điều tiết tự nhiên theo nhịp thuật toán, không vi phạm chính sách cộng đồng.",
      },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    slug: "instagram",
    badge: "Thương hiệu & KOLs",
    tagline: "Tăng follow profile đẹp, like ảnh, view Reels vào mục Khám Phá và Story",
    description: "Xây dựng hình ảnh cá nhân và thương hiệu thời trang, mỹ phẩm, KOLs chuyên nghiệp, thu hút tệp khách hàng tiềm năng.",
    color: "#E1306C",
    bgLight: "rgba(225, 48, 108, 0.08)",
    borderLight: "rgba(225, 48, 108, 0.25)",
    iconSvgName: "instagram",
    serviceCount: 9,
    statHighlights: [
      { label: "Profile đã tối ưu uy tín", value: "8.500+" },
      { label: "Tỉ lệ tài khoản có avatar", value: "100%" },
      { label: "Hỗ trợ khách hàng", value: "24/7" },
      { label: "Cam kết giữ số lượng", value: "30 ngày" },
    ],
    faqs: [
      {
        q: "Follow Instagram là tài khoản Việt Nam hay Quốc tế?",
        a: "Chúng tôi cung cấp cả hai lựa chọn: Follow người dùng Việt Nam chất lượng cao và Follow Global quốc tế tùy theo định hướng thương hiệu của bạn.",
      },
      {
        q: "Tài khoản Instagram có cần mở chế độ Công Khai không?",
        a: "Có. Tài khoản cần đặt ở chế độ Công Khai (Public) trong suốt quá trình chạy dịch vụ.",
      },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    slug: "youtube",
    badge: "Bật kiếm tiền",
    tagline: "Tăng view video, subscriber thật, like Shorts và trọn gói 4.000 giờ xem",
    description: "Đạt điều kiện Bật Kiếm Tiền YouTube Partner Program nhanh chóng, an toàn, chuẩn nguồn xem tự nhiên.",
    color: "#FF0000",
    bgLight: "rgba(255, 0, 0, 0.08)",
    borderLight: "rgba(255, 0, 0, 0.25)",
    iconSvgName: "youtube",
    serviceCount: 8,
    statHighlights: [
      { label: "Kênh đã Bật Kiếm Tiền", value: "480+" },
      { label: "Thời gian giữ chân cao", value: "3-5 phút" },
      { label: "Nguồn xem an toàn", value: "100%" },
      { label: "Hỗ trợ duyệt đơn YPP", value: "Tận tình" },
    ],
    faqs: [
      {
        q: "Gói 4.000 giờ xem và 1.000 sub có giúp bật kiếm tiền YouTube không?",
        a: "Chắc chắn! Đây là gói chuyên dụng đạt đúng tiêu chí xét duyệt của YouTube Partner Program, nguồn xem trải đều từ tìm kiếm và đề xuất.",
      },
      {
        q: "View YouTube có bị quét giảm không?",
        a: "Hệ thống sử dụng view tương tác giữ chân thực tế (High Retention), hạn chế tối đa việc trừ view từ thuật toán.",
      },
    ],
  },
  {
    id: "threads",
    name: "Threads",
    slug: "threads",
    badge: "Kênh mới nổi",
    tagline: "Tăng follow Threads, like bài viết, bình luận và chia sẻ repost",
    description: "Chiếm lĩnh nền tảng văn bản mới nhất của Meta, dẫn đầu xu hướng tương tác viral cho nhà sáng tạo nội dung.",
    color: "#000000",
    bgLight: "rgba(0, 0, 0, 0.05)",
    borderLight: "rgba(0, 0, 0, 0.18)",
    iconSvgName: "threads",
    serviceCount: 5,
    statHighlights: [
      { label: "Bài viết viral Threads", value: "2.400+" },
      { label: "Followers kết nối Meta", value: "Chuẩn xịn" },
      { label: "Bắt đầu nhanh", value: "15 phút" },
      { label: "Bảo hành dịch vụ", value: "30 ngày" },
    ],
    faqs: [
      {
        q: "Tăng follow Threads có ảnh hưởng tài khoản Instagram liên kết không?",
        a: "Không hề ảnh hưởng. Cả hai nền tảng hoạt động song song an toàn và tuân thủ chính sách bảo mật Meta.",
      },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    slug: "telegram",
    badge: "Cộng đồng & Crypto",
    tagline: "Tăng member kênh Channel, nhóm Group, view bài viết và reaction cảm xúc",
    description: "Xây dựng cộng đồng đầu tư, tài chính, game và bán hàng riêng tư với số lượng thành viên đông đảo.",
    color: "#229ED9",
    bgLight: "rgba(34, 158, 217, 0.08)",
    borderLight: "rgba(34, 158, 217, 0.25)",
    iconSvgName: "telegram",
    serviceCount: 5,
    statHighlights: [
      { label: "Nhóm Telegram đã hỗ trợ", value: "1.800+" },
      { label: "Tốc độ thêm thành viên", value: "Siêu tốc" },
      { label: "Hỗ trợ Channel & Group", value: "Toàn diện" },
      { label: "Không cần cấp quyền Admin", value: "100%" },
    ],
    faqs: [
      {
        q: "Thêm thành viên Telegram có cần cấp quyền Admin cho bên bạn không?",
        a: "Không cần cấp quyền Admin! Bạn chỉ cần gửi link mời (Invite Link) công khai của nhóm hoặc kênh là xong.",
      },
    ],
  },
];

// ── Master Services List (SocialBoost Inspired Full Catalog) ──────────────────

export const services: Service[] = [
  // ══════════════ FACEBOOK ═════════════════════════════════════════════════════
  {
    id: "fb-followers",
    platform: "facebook",
    category: "growth",
    title: "Tăng Followers Facebook Cá Nhân",
    description: "Tăng lượng người theo dõi trang cá nhân thực chất lượng cao, giúp tăng độ uy tín và thương hiệu bản thân.",
    icon: "👥",
    color: "#1877F2",
    gradient: "from-blue-600 to-blue-800",
    features: ["Followers thật 100%", "Tăng tự nhiên không tụt", "Không cần mật khẩu", "Bảo hành 30 ngày bù tự động"],
    startingPrice: 45000,
    unit: "1.000 follow",
    popular: true,
  },
  {
    id: "fb-likes-fanpage",
    platform: "facebook",
    category: "growth",
    title: "Tăng Like & Follow Fanpage",
    description: "Tăng đồng thời lượt Like và Follow cho Fanpage Facebook, chuẩn SEO và nâng cao tỷ lệ chốt đơn bán hàng.",
    icon: "👍",
    color: "#1877F2",
    gradient: "from-blue-500 to-blue-700",
    features: ["Like & Follow người dùng thật", "Tăng đề xuất trang", "Cải thiện uy tín thương hiệu", "Giao hàng đúng hẹn"],
    startingPrice: 55000,
    unit: "1.000 like",
    popular: true,
  },
  {
    id: "fb-post-likes",
    platform: "facebook",
    category: "interaction",
    title: "Tăng Like & Reaction Bài Viết",
    description: "Tăng cảm xúc (Thích, Yêu thích, Thương thương, Haha, Wow) cho bài viết cá nhân hoặc Fanpage.",
    icon: "❤️",
    color: "#1877F2",
    gradient: "from-blue-400 to-blue-600",
    features: ["Tùy chọn loại cảm xúc", "Tăng ngay sau 5-10 phút", "An toàn tuyệt đối", "Giúp bài viết lên top feed"],
    startingPrice: 15000,
    unit: "1.000 like",
  },
  {
    id: "fb-comments",
    platform: "facebook",
    category: "interaction",
    title: "Tăng Bình Luận (Seeding Comment)",
    description: "Tạo các bình luận khen ngợi, hỏi giá, phản hồi tích cực theo kịch bản tùy chỉnh để kích cầu khách hàng.",
    icon: "💬",
    color: "#1877F2",
    gradient: "from-blue-500 to-indigo-600",
    features: ["Nội dung tự soạn tùy ý", "Tài khoản avatar xịn", "Giãn cách thời gian tự nhiên", "Kích thích mua hàng"],
    startingPrice: 25000,
    unit: "100 bình luận",
  },
  {
    id: "fb-share",
    platform: "facebook",
    category: "reach",
    title: "Tăng Chia Sẻ (Share) Bài Viết",
    description: "Chia sẻ bài viết lên các trang cá nhân và hội nhóm lớn nhằm lan tỏa thông điệp viral mạnh mẽ.",
    icon: "🚀",
    color: "#1877F2",
    gradient: "from-indigo-600 to-blue-600",
    features: ["Share công khai", "Tăng reach tự nhiên", "Hỗ trợ bài minigame / event", "Tốc độ nhanh"],
    startingPrice: 30000,
    unit: "100 share",
  },
  {
    id: "fb-view-video",
    platform: "facebook",
    category: "reach",
    title: "Tăng View Video & Reels Facebook",
    description: "Tăng lượt xem video dài và video ngắn Reels trên Facebook giúp đẩy video vào tab Watch đề xuất.",
    icon: "🎬",
    color: "#1877F2",
    gradient: "from-blue-600 to-cyan-600",
    features: ["View giữ chân cao", "Đẩy video lên đề xuất", "Hỗ trợ video Reels & Story", "Tối ưu hóa kiếm tiền"],
    startingPrice: 20000,
    unit: "1.000 view",
  },
  {
    id: "fb-livestream",
    platform: "facebook",
    category: "live_vip",
    title: "Tăng Mắt Livestream Facebook",
    description: "Duy trì số lượng mắt xem trực tiếp ổn định từ 30 phút đến 4 giờ giúp livestream đông vui, tạo hiệu ứng đám đông.",
    icon: "👁️",
    color: "#1877F2",
    gradient: "from-blue-700 to-indigo-700",
    features: ["Mắt xem ổn định suốt live", "Lên mắt sau 2 phút", "Tự động thả like/tim", "Tăng chuyển đổi bán hàng"],
    startingPrice: 40000,
    unit: "100 mắt / 60p",
    popular: true,
  },
  {
    id: "fb-group-members",
    platform: "facebook",
    category: "growth",
    title: "Tăng Thành Viên Nhóm (Group)",
    description: "Tăng số lượng thành viên tham gia nhóm Facebook, xây dựng cộng đồng kinh doanh hoặc giải trí đông đúc.",
    icon: "🏰",
    color: "#1877F2",
    gradient: "from-blue-600 to-sky-600",
    features: ["Thành viên Việt Nam thật", "Không cần duyệt thủ công", "Bảo hành 30 ngày", "Tăng độ trust của nhóm"],
    startingPrice: 60000,
    unit: "1.000 thành viên",
  },
  {
    id: "fb-vip-like",
    platform: "facebook",
    category: "live_vip",
    title: "Gói VIP Like Tháng Tự Động",
    description: "Cài đặt một lần, mỗi khi bạn đăng bài viết mới hệ thống sẽ tự động tăng like ngay lập tức mà không cần đặt lại.",
    icon: "⭐",
    color: "#1877F2",
    gradient: "from-amber-500 to-blue-600",
    features: ["Tự động nhận diện bài mới", "Không giới hạn số bài/ngày", "Tiết kiệm 40% chi phí", "Dành cho người bận rộn"],
    startingPrice: 150000,
    unit: "1 tháng",
  },
  {
    id: "fb-account",
    platform: "facebook",
    category: "live_vip",
    title: "Tài Khoản VIA / BM Kháng Sẵn",
    description: "Cung cấp tài khoản VIA ngoại/Việt cổ, Fanpage tích xanh, BM Doanh nghiệp Agency sẵn ngưỡng chạy ads.",
    icon: "🔐",
    color: "#1877F2",
    gradient: "from-indigo-500 to-blue-600",
    features: ["VIA đã kháng 902/282", "BM Doanh nghiệp uy tín", "Hỗ trợ đăng nhập & bảo hành", "Phù hợp chạy ads sạch"],
    startingPrice: 120000,
    unit: "1 tài khoản",
  },

  // ══════════════ TIKTOK ═══════════════════════════════════════════════════════
  {
    id: "tt-followers",
    platform: "tiktok",
    category: "growth",
    title: "Tăng Followers TikTok Chuẩn",
    description: "Tăng người theo dõi TikTok thực, hỗ trợ kênh đạt mốc 1.000 Follow mở tính năng Livestream và gắn link Bio/TikTok Shop.",
    icon: "🎵",
    color: "#FF0050",
    gradient: "from-pink-500 to-red-600",
    features: ["Followers người dùng thật", "Đủ điều kiện mở Livestream", "Bảo hành 30 ngày bù tụt", "Tăng đều tự nhiên"],
    startingPrice: 65000,
    unit: "1.000 follow",
    popular: true,
  },
  {
    id: "tt-views",
    platform: "tiktok",
    category: "reach",
    title: "Tăng View TikTok Đẩy FYP",
    description: "Tăng lượt xem video TikTok siêu tốc, tạo tín hiệu tốt để thuật toán đẩy video lên tab Thịnh hành (For You Page).",
    icon: "🔥",
    color: "#FF0050",
    gradient: "from-red-500 to-pink-600",
    features: ["View bắt đầu sau 5 phút", "Kích hoạt đề xuất FYP", "Tăng độ viral cho video", "Chi phí siêu rẻ"],
    startingPrice: 10000,
    unit: "10.000 view",
    popular: true,
  },
  {
    id: "tt-likes",
    platform: "tiktok",
    category: "interaction",
    title: "Tăng Tim (Like) Video TikTok",
    description: "Tăng lượt thả tim cho video TikTok, cải thiện tỷ lệ tương tác (engagement rate) và giữ vị trí trên feed.",
    icon: "💗",
    color: "#FF0050",
    gradient: "from-pink-400 to-red-500",
    features: ["Tim người dùng thật", "Cải thiện tỷ lệ like/view", "Hỗ trợ kéo video viral", "Tốc độ nhanh"],
    startingPrice: 30000,
    unit: "1.000 tim",
  },
  {
    id: "tt-save",
    platform: "tiktok",
    category: "reach",
    title: "Tăng Lưu Video (Save / Bookmark)",
    description: "Thuật toán TikTok năm 2025 ưu tiên điểm Save cực cao. Tăng lượt lưu video giúp video đạt chỉ số nội dung giá trị.",
    icon: "🔖",
    color: "#FF0050",
    gradient: "from-purple-500 to-pink-500",
    features: ["Trọng số thuật toán cao nhất", "Tăng điểm phân phối FYP", "Người xem thực tế", "Giao hàng nhanh"],
    startingPrice: 25000,
    unit: "500 lượt lưu",
  },
  {
    id: "tt-livestream",
    platform: "tiktok",
    category: "live_vip",
    title: "Tăng Mắt Livestream TikTok PK",
    description: "Duy trì số lượng người xem trực tiếp trên livestream TikTok, tăng uy tín khi thi đấu PK hoặc bán hàng TikTok Shop.",
    icon: "🎙️",
    color: "#FF0050",
    gradient: "from-red-600 to-pink-600",
    features: ["Mắt xem ổn định suốt live", "Lên mắt chỉ sau 1-3 phút", "Hỗ trợ auto thả tim live", "Tăng tương tác phòng live"],
    startingPrice: 50000,
    unit: "100 mắt / 60p",
    popular: true,
  },

  // ══════════════ INSTAGRAM ════════════════════════════════════════════════════
  {
    id: "ig-followers",
    platform: "instagram",
    category: "growth",
    title: "Tăng Followers Instagram Xịn",
    description: "Tăng người theo dõi Instagram tài khoản có avatar, bài viết hoàn chỉnh, nâng tầm thẩm mỹ và uy tín thương hiệu.",
    icon: "📸",
    color: "#E1306C",
    gradient: "from-purple-500 via-pink-500 to-orange-400",
    features: ["Followers profile đẹp có avatar", "Lựa chọn VN hoặc Quốc tế", "Không tụt, bảo hành 30 ngày", "Phù hợp KOLs / Shop"],
    startingPrice: 75000,
    unit: "1.000 follow",
    popular: true,
  },
  {
    id: "ig-likes",
    platform: "instagram",
    category: "interaction",
    title: "Tăng Like Ảnh & Bài Viết Instagram",
    description: "Tăng lượt thích cho các bài post ảnh, carousel hoặc video trên Instagram, tạo ấn tượng chuyên nghiệp.",
    icon: "💜",
    color: "#E1306C",
    gradient: "from-pink-500 to-purple-600",
    features: ["Like chất lượng cao", "Tăng reach tài khoản", "Giao hàng sau 15 phút", "Không cần mật khẩu"],
    startingPrice: 20000,
    unit: "1.000 like",
  },
  {
    id: "ig-reels",
    platform: "instagram",
    category: "reach",
    title: "Tăng View Instagram Reels (Explore)",
    description: "Thúc đẩy lượt xem video Reels trên Instagram, giúp video được thuật toán đẩy vào mục Khám Phá (Explore tab).",
    icon: "✨",
    color: "#E1306C",
    gradient: "from-orange-400 via-pink-500 to-purple-500",
    features: ["Đưa video vào tab Explore", "View tự nhiên chuẩn quốc tế", "Tăng follow kèm theo", "Giao hàng tức thì"],
    startingPrice: 15000,
    unit: "5.000 view",
    popular: true,
  },
  {
    id: "ig-story",
    platform: "instagram",
    category: "reach",
    title: "Tăng View Instagram Story 24h",
    description: "Tăng người xem tin Story của bạn, chứng minh mức độ quan tâm của cộng đồng đối với cuộc sống và sản phẩm của bạn.",
    icon: "⭕",
    color: "#E1306C",
    gradient: "from-purple-600 to-pink-500",
    features: ["Tăng view Story sau 10p", "Người xem profile thật", "Hỗ trợ nhiều Story cùng lúc", "Chi phí tiết kiệm"],
    startingPrice: 20000,
    unit: "1.000 view",
  },

  // ══════════════ YOUTUBE ══════════════════════════════════════════════════════
  {
    id: "yt-subscribers",
    platform: "youtube",
    category: "growth",
    title: "Tăng Subscriber YouTube Thật",
    description: "Tăng lượng người đăng ký kênh YouTube thật, bền vững, hỗ trợ kênh đủ điều kiện 1.000 Sub Bật Kiếm Tiền (YPP).",
    icon: "▶️",
    color: "#FF0000",
    gradient: "from-red-600 to-rose-700",
    features: ["Sub thật không bị quét trừ", "Hỗ trợ đạt điều kiện Bật Kiếm Tiền", "Bảo hành trọn đời / 30 ngày", "Tăng đều mỗi ngày"],
    startingPrice: 180000,
    unit: "1.000 sub",
    popular: true,
  },
  {
    id: "yt-views",
    platform: "youtube",
    category: "reach",
    title: "Tăng View YouTube Chuẩn SEO",
    description: "Tăng lượt xem video YouTube từ nguồn tìm kiếm và video đề xuất, tỷ lệ giữ chân cao (High Retention 3-5 phút).",
    icon: "🎥",
    color: "#FF0000",
    gradient: "from-red-500 to-red-700",
    features: ["Thời gian xem giữ chân cao", "An toàn 100% cho kênh kiếm tiền", "Chuẩn thuật toán Google/YouTube", "Bắt đầu sau 1 giờ"],
    startingPrice: 40000,
    unit: "1.000 view",
  },
  {
    id: "yt-hours",
    platform: "youtube",
    category: "growth",
    title: "Trọn Gói 4.000 Giờ Xem Bật Kiếm Tiền",
    description: "Dịch vụ chuyên biệt giúp kênh của bạn đạt đủ 4.000 giờ xem hợp lệ trong 365 ngày để nộp đơn Bật Kiếm Tiền YouTube.",
    icon: "⏱️",
    color: "#FF0000",
    gradient: "from-amber-600 to-red-600",
    features: ["Đủ 4.000 giờ xem chuẩn YPP", "Tư vấn tối ưu kênh trước khi nộp đơn", "Bảo hành duyệt kiếm tiền", "Hỗ trợ kênh từ A-Z"],
    startingPrice: 450000,
    unit: "Gói trọn gói",
    popular: true,
  },
  {
    id: "yt-shorts",
    platform: "youtube",
    category: "reach",
    title: "Tăng View YouTube Shorts Lên Xu Hướng",
    description: "Tăng lượt xem cho video ngắn YouTube Shorts, tận dụng làn sóng đề xuất video ngắn của thuật toán YouTube.",
    icon: "⚡",
    color: "#FF0000",
    gradient: "from-red-600 to-orange-600",
    features: ["Đẩy Shorts lên feed đề xuất", "Tăng view siêu tốc", "Kéo sub tự nhiên cho kênh", "Giá cực tốt"],
    startingPrice: 20000,
    unit: "5.000 view",
  },

  // ══════════════ THREADS ══════════════════════════════════════════════════════
  {
    id: "th-followers",
    platform: "threads",
    category: "growth",
    title: "Tăng Followers Threads Meta",
    description: "Tăng người theo dõi trên nền tảng mạng xã hội Threads của Meta, khẳng định vị thế tiên phong trong cộng đồng.",
    icon: "🧵",
    color: "#000000",
    gradient: "from-gray-800 to-black",
    features: ["Followers thật từ Meta", "Tăng uy tín trang cá nhân", "Bảo hành 30 ngày", "Kích hoạt sau 15 phút"],
    startingPrice: 80000,
    unit: "1.000 follow",
    popular: true,
  },
  {
    id: "th-likes",
    platform: "threads",
    category: "interaction",
    title: "Tăng Like Bài Đăng Threads",
    description: "Tăng lượt thích cho bài viết trên Threads giúp bài đăng dễ dàng được đẩy lên tab Đề xuất của người dùng khác.",
    icon: "🖤",
    color: "#000000",
    gradient: "from-zinc-700 to-zinc-900",
    features: ["Like lên nhanh", "Tăng tỷ lệ viral nội dung", "An toàn tuyệt đối", "Không cần mật khẩu"],
    startingPrice: 35000,
    unit: "1.000 like",
  },

  // ══════════════ TELEGRAM ═════════════════════════════════════════════════════
  {
    id: "tg-channel-members",
    platform: "telegram",
    category: "growth",
    title: "Tăng Member Kênh (Channel) Telegram",
    description: "Tăng số lượng người đăng ký kênh Telegram Channel thông báo, tin tức, tín hiệu đầu tư và thương mại.",
    icon: "📢",
    color: "#229ED9",
    gradient: "from-sky-500 to-blue-600",
    features: ["Member chất lượng cao", "Tăng uy tín kênh thông tin", "Không cần quyền Admin", "Bảo hành 30 ngày"],
    startingPrice: 65000,
    unit: "1.000 member",
    popular: true,
  },
  {
    id: "tg-group-members",
    platform: "telegram",
    category: "growth",
    title: "Tăng Member Nhóm (Group) Telegram",
    description: "Thêm thành viên vào nhóm chat cộng đồng Telegram Group, tạo không khí sôi nổi và kích thích thảo luận.",
    icon: "💬",
    color: "#229ED9",
    gradient: "from-blue-500 to-cyan-600",
    features: ["Thêm nhanh không giới hạn", "Hỗ trợ nhóm public và private", "An toàn không sợ ban nhóm", "Hỗ trợ nhiệt tình"],
    startingPrice: 75000,
    unit: "1.000 member",
  },
  {
    id: "tg-post-views",
    platform: "telegram",
    category: "reach",
    title: "Tăng View Bài Đăng Telegram",
    description: "Tăng con mắt xem cho từng bài viết trong kênh Telegram Channel, chứng minh kênh có lượng độc giả theo dõi lớn.",
    icon: "👀",
    color: "#229ED9",
    gradient: "from-cyan-500 to-blue-500",
    features: ["View thật bắt mắt", "Tăng độ tin cậy cho bài viết", "Hỗ trợ gói tự động các bài mới", "Chi phí cực rẻ"],
    startingPrice: 10000,
    unit: "1.000 view",
  },
];

// ── Pricing packages ─────────────────────────────────────────────────────────

export type PricingTier = {
  id: string;
  serviceId: string;
  platform: Platform;
  name: string;
  quantity: string;
  price: number;
  deliveryTime: string;
  highlight?: boolean;
};

export const pricingTiers: PricingTier[] = [
  // Facebook Followers
  { id: "fb-f-1", serviceId: "fb-followers", platform: "facebook", name: "Starter", quantity: "1.000 Followers", price: 45000, deliveryTime: "1-2 ngày" },
  { id: "fb-f-2", serviceId: "fb-followers", platform: "facebook", name: "Pro", quantity: "3.000 Followers", price: 120000, deliveryTime: "2-3 ngày", highlight: true },
  { id: "fb-f-3", serviceId: "fb-followers", platform: "facebook", name: "VIP Growth", quantity: "10.000 Followers", price: 380000, deliveryTime: "3-5 ngày" },
  { id: "fb-f-4", serviceId: "fb-followers", platform: "facebook", name: "Enterprise", quantity: "50.000 Followers", price: 1800000, deliveryTime: "7-10 ngày" },

  // TikTok Followers
  { id: "tt-f-1", serviceId: "tt-followers", platform: "tiktok", name: "Starter Live", quantity: "1.000 Followers (Mở Live)", price: 65000, deliveryTime: "1-2 ngày", highlight: true },
  { id: "tt-f-2", serviceId: "tt-followers", platform: "tiktok", name: "Pro Kênh", quantity: "5.000 Followers", price: 290000, deliveryTime: "2-4 ngày" },
  { id: "tt-f-3", serviceId: "tt-followers", platform: "tiktok", name: "KOL 10K", quantity: "10.000 Followers", price: 550000, deliveryTime: "3-5 ngày" },

  // Instagram Followers
  { id: "ig-f-1", serviceId: "ig-followers", platform: "instagram", name: "Profile Basic", quantity: "1.000 Followers", price: 75000, deliveryTime: "1-2 ngày" },
  { id: "ig-f-2", serviceId: "ig-followers", platform: "instagram", name: "Fashion Brand", quantity: "5.000 Followers", price: 340000, deliveryTime: "2-4 ngày", highlight: true },
  { id: "ig-f-3", serviceId: "ig-followers", platform: "instagram", name: "VIP Influencer", quantity: "10.000 Followers", price: 650000, deliveryTime: "4-6 ngày" },

  // YouTube Subs
  { id: "yt-f-1", serviceId: "yt-subscribers", platform: "youtube", name: "Chuẩn Bị Kiếm Tiền", quantity: "1.000 Subscribers", price: 180000, deliveryTime: "2-3 ngày", highlight: true },
  { id: "yt-f-2", serviceId: "yt-hours", platform: "youtube", name: "Trọn Gói YPP", quantity: "4.000 Giờ Xem + 1K Sub", price: 450000, deliveryTime: "5-7 ngày", highlight: true },

  // Threads Followers
  { id: "th-f-1", serviceId: "th-followers", platform: "threads", name: "Threads Basic", quantity: "1.000 Followers", price: 80000, deliveryTime: "1-2 ngày" },
  { id: "th-f-2", serviceId: "th-followers", platform: "threads", name: "Threads Viral", quantity: "5.000 Followers", price: 360000, deliveryTime: "2-4 ngày", highlight: true },

  // Telegram Members
  { id: "tg-f-1", serviceId: "tg-channel-members", platform: "telegram", name: "Channel Boost", quantity: "1.000 Members", price: 65000, deliveryTime: "1 ngày", highlight: true },
  { id: "tg-f-2", serviceId: "tg-group-members", platform: "telegram", name: "Group Active", quantity: "5.000 Members", price: 320000, deliveryTime: "2-3 ngày" },
];

// ── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials = [
  {
    id: "1",
    name: "Trần Mai Anh",
    role: "Chủ shop thời trang online",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    content: "Nhờ dịch vụ của Tô Trọng Nhân (Toti), kênh TikTok của mình tăng từ 200 lên 15K follow trong chưa đầy 1 tuần. Livestream bán hàng đông khách hơn hẳn!",
    rating: 5,
    platform: "tiktok" as Platform,
    service: "Tăng Followers TikTok",
  },
  {
    id: "2",
    name: "Nguyễn Tuấn Kiệt",
    role: "KOL / Content Creator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    content: "Fanpage của mình tăng like tự nhiên và không hề bị giảm một lượt nào sau 6 tháng. Tư vấn qua Zalo nhiệt tình, có tâm và đúng giờ.",
    rating: 5,
    platform: "facebook" as Platform,
    service: "Tăng Like Fanpage",
  },
  {
    id: "3",
    name: "Lê Hoàng Phúc",
    role: "Agency Quảng Cáo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    content: "Đã đặt hơn 50 đơn cho khách hàng qua Toti. Uy tín, an toàn và chính sách bảo hành 30 ngày bù tụt rõ ràng là điều mình yên tâm nhất.",
    rating: 5,
    platform: "instagram" as Platform,
    service: "Tăng Followers Instagram",
  },
  {
    id: "4",
    name: "Đặng Minh Tâm",
    role: "Chủ kênh YouTube review",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    content: "Gói 4.000 giờ xem và 1.000 sub YouTube đã giúp kênh của mình được duyệt Bật Kiếm Tiền chỉ sau 5 ngày nộp đơn. Rất cảm ơn anh Nhân!",
    rating: 5,
    platform: "youtube" as Platform,
    service: "Trọn Gói 4.000 Giờ Xem",
  },
];

// ── Stats ────────────────────────────────────────────────────────────────────

export const stats = [
  { label: "Khách hàng tin tưởng", value: "15.000+", icon: "😊" },
  { label: "Đơn hàng hoàn thành", value: "85.000+", icon: "✅" },
  { label: "Nền tảng hỗ trợ", value: "6 Nền tảng", icon: "🌐" },
  { label: "Tỉ lệ hài lòng", value: "99.8%", icon: "⭐" },
];

// ── Blog Posts ───────────────────────────────────────────────────────────────

export const blogPosts = [
  {
    id: "1",
    slug: "cach-tang-follow-facebook-nhanh-nhat-2025",
    title: "Cách Tăng Follow Facebook Nhanh Nhất 2025: Bí Quyết Đạt 10K Follow",
    excerpt: "Tổng hợp các phương pháp tăng follow Facebook an toàn, hiệu quả và không vi phạm chính sách mới nhất của Meta.",
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=450&fit=crop",
    category: "Facebook",
    author: "ToTrongNhan",
    publishedAt: "2025-09-15",
    readTime: 5,
    tags: ["facebook", "followers", "tips"],
  },
  {
    id: "2",
    slug: "bi-quyet-viral-tiktok-tu-0-len-100k-followers",
    title: "Bí Quyết Viral TikTok: Từ 0 Lên 100K Followers Cùng Thuật Toán Mới",
    excerpt: "Những tips và chiến lược đã được kiểm chứng giúp video của bạn liên tục vào For You Page (FYP).",
    thumbnail: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=450&fit=crop",
    category: "TikTok",
    author: "ToTrongNhan",
    publishedAt: "2025-09-20",
    readTime: 7,
    tags: ["tiktok", "viral", "content"],
  },
  {
    id: "3",
    slug: "instagram-reels-2025",
    title: "Instagram Reels 2025: Cách Tối Ưu Điểm Đề Xuất Khám Phá",
    excerpt: "Tìm hiểu thuật toán Instagram Reels và cách tối ưu âm thanh, hashtag để tiếp cận hàng triệu người dùng mới.",
    thumbnail: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800&h=450&fit=crop",
    category: "Instagram",
    author: "ToTrongNhan",
    publishedAt: "2025-09-25",
    readTime: 6,
    tags: ["instagram", "reels", "algorithm"],
  },
];

// ── FAQs ─────────────────────────────────────────────────────────────────────

export const faqs = [
  {
    q: "Dịch vụ tăng tương tác có an toàn cho tài khoản không?",
    a: "Hoàn toàn an toàn 100%! Chúng tôi chỉ cần đường link công khai (URL) hoặc Username, tuyệt đối không yêu cầu mật khẩu hay quyền truy cập quản trị. Tốc độ tăng được điều tiết tự nhiên theo thuật toán của từng mạng xã hội.",
  },
  {
    q: "Thời gian xử lý và hoàn thành đơn hàng là bao lâu?",
    a: "Hệ thống tự động kích hoạt xử lý đơn hàng trong vòng 15-30 phút sau khi xác nhận. Thời gian hoàn thành từ vài giờ đến 2-3 ngày tùy theo số lượng đặt để đảm bảo tăng trưởng tự nhiên nhất.",
  },
  {
    q: "Chính sách bảo hành bù tụt 30 ngày hoạt động thế nào?",
    a: "Tất cả các dịch vụ tăng follow, like, sub đều được bảo hành 30 ngày. Nếu số lượng bị hao hụt tự nhiên trong thời gian bảo hành, Tô Trọng Nhân cam kết bù đủ số lượng hoàn toàn miễn phí.",
  },
  {
    q: "Tôi có thể thanh toán bằng những phương thức nào?",
    a: "Hỗ trợ linh hoạt qua Chuyển khoản ngân hàng (QR Code 24/7), Momo, ZaloPay. Sau khi thanh toán, đơn hàng sẽ được kích hoạt tức thì.",
  },
  {
    q: "Tôi có được tư vấn trực tiếp trước khi đặt dịch vụ không?",
    a: "Có! Bạn có thể nhắn tin Zalo (0981587469) hoặc gọi Hotline (0981 587 469) để được Tô Trọng Nhân tư vấn gói dịch vụ phù hợp nhất với kênh của bạn.",
  },
];
