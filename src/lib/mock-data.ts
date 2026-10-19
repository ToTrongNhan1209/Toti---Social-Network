/**
 * lib/mock-data.ts
 * Shared blog posts, authors, categories, and tags
 */

import type { Author, Category, Post, Tag } from "./types";

export const authors: Author[] = [
  {
    id: "1",
    name: "Tô Trọng Nhân",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
    bio: "Chuyên gia Digital Marketing & Social Media Growth Hacking với hơn 5 năm kinh nghiệm tối ưu hóa kênh Facebook, TikTok và Instagram.",
    role: "Founder & Head of Strategy",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      website: "https://totrongnhan.vn",
    },
  },
  {
    id: "2",
    name: "Nguyễn Thị Lan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
    bio: "Content Creator và chuyên gia phân tích thuật toán video ngắn TikTok & Reels.",
    role: "Senior Content Specialist",
    social: {
      twitter: "https://twitter.com",
    },
  },
];

export const categories: Category[] = [
  { id: "1", name: "Facebook",      slug: "facebook",      color: "#1877F2" },
  { id: "2", name: "TikTok",        slug: "tiktok",        color: "#FF0050" },
  { id: "3", name: "Instagram",     slug: "instagram",     color: "#E1306C" },
  { id: "4", name: "Marketing",     slug: "marketing",     color: "#7C3AED" },
  { id: "5", name: "Tư Vấn & Tips", slug: "tu-van",        color: "#06B6D4" },
  { id: "6", name: "Tất Cả",        slug: "tat-ca",        color: "#7C3AED" },
];

export const tags: Tag[] = [
  { id: "1", name: "Facebook Ads",  slug: "facebook-ads",  count: 18 },
  { id: "2", name: "Followers",     slug: "followers",     count: 32 },
  { id: "3", name: "TikTok Viral",  slug: "tiktok-viral",  count: 24 },
  { id: "4", name: "Reels",         slug: "reels",         count: 15 },
  { id: "5", name: "Thuật Toán",    slug: "thuat-toan",    count: 20 },
  { id: "6", name: "Kinh Doanh Online", slug: "kinh-doanh-online", count: 28 },
  { id: "7", name: "Branding",      slug: "branding",      count: 12 },
  { id: "8", name: "Bảo Mật",       slug: "bao-mat",       count: 9  },
];

export const posts: Post[] = [
  {
    id: "1",
    slug: "cach-tang-followers-facebook-hieu-qua",
    title: "5 Cách Tăng Followers Facebook Hiệu Quả Và An Toàn Năm 2025",
    excerpt: "Khám phá những chiến lược tăng followers Facebook tự nhiên và bền vững nhất hiện nay, kết hợp với dịch vụ hỗ trợ chuyên nghiệp để bứt phá kênh.",
    content: `
      <h2>1. Tối ưu hóa trang cá nhân và Fanpage chuẩn SEO</h2>
      <p>Một trang cá nhân hoặc Fanpage chuyên nghiệp là yếu tố tiên quyết để giữ chân người xem khi họ ghé thăm. Hãy đảm bảo ảnh đại diện sắc nét, ảnh bìa thể hiện rõ giá trị bạn mang lại, và phần tiểu sử (Bio) có đầy đủ liên kết và từ khóa liên quan.</p>
      <blockquote>Ấn tượng đầu tiên chỉ mất 3 giây. Nếu trang của bạn không đủ chuyên nghiệp và rõ ràng, 80% người xem sẽ rời đi mà không nhấn Follow.</blockquote>

      <h2>2. Xây dựng lịch đăng bài đều đặn với định dạng Reel</h2>
      <p>Thuật toán Facebook hiện nay ưu tiên phân phối cực mạnh cho Facebook Reels. Các video ngắn từ 15–45 giây mang tính giải trí, chia sẻ giá trị thực tiễn hoặc hậu trường kinh doanh có tỷ lệ tiếp cận tự nhiên (Organic Reach) cao gấp 5 đến 10 lần so với bài viết dạng ảnh tĩnh.</p>

      <h2>3. Tương tác tích cực trong các cộng đồng cùng ngách</h2>
      <p>Tham gia vào 5–10 nhóm Facebook chất lượng liên quan đến lĩnh vực của bạn. Hãy để lại những bình luận chuyên môn, đóng góp giá trị thay vì spam link bán hàng. Người dùng sẽ tò mò bấm vào trang cá nhân của bạn và ấn theo dõi.</p>

      <h2>4. Ứng dụng dịch vụ tăng trưởng Social Media uy tín</h2>
      <p>Nếu bạn là một trang mới bắt đầu hoặc một thương hiệu cần xây dựng độ tin cậy nhanh chóng (Social Proof), việc có sẵn một lượng followers ban đầu từ 3.000 đến 10.000 người sẽ giúp tỉ lệ chuyển đổi đơn hàng tăng vọt. Dịch vụ tăng followers tại ToTrongNhan đảm bảo 100% người dùng thực, tốc độ tự nhiên và bảo hành 30 ngày.</p>

      <h2>5. Tổ chức Minigame và Give Away tương tác</h2>
      <p>Một minigame đơn giản với thể lệ: 'Like trang + Share bài viết + Tag 2 người bạn' vẫn là công cụ kinh điển giúp lan tỏa thương hiệu nhanh chóng với chi phí cực kỳ tiết kiệm.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
    publishedAt: "2025-09-15T08:00:00Z",
    readingTime: 6,
    author: authors[0],
    category: categories[0],
    tags: [tags[0], tags[1], tags[4]],
    featured: true,
    views: 8940,
    likes: 642,
  },
  {
    id: "2",
    slug: "bi-quyet-viral-tiktok",
    title: "Bí Quyết Viral TikTok: Từ 0 Lên 100K Followers Trong 30 Ngày",
    excerpt: "Những tips và chiến lược đã được kiểm chứng giúp video TikTok của bạn chạm mốc hàng triệu view và chuyển hóa thành lượng người theo dõi trung thành.",
    content: `
      <h2>1. Nắm bắt cấu trúc '3 Giây Vàng Đầu Tiên' (The Hook)</h2>
      <p>Trên TikTok, người dùng đưa ra quyết định lướt qua hay ở lại xem trong chưa đầy 3 giây đầu tiên. Mở đầu bằng một câu hỏi gây sốc, một chuyển động bất ngờ hoặc một hình ảnh gợi mở tò mò để giữ chân khán giả ngay tức khắc.</p>
      <blockquote>Nếu bạn không thể giữ chân người xem trong 3 giây đầu, thuật toán sẽ đánh giá video của bạn là kém hấp dẫn và lập tức ngừng phân phối lên For You Page (FYP).</blockquote>

      <h2>2. Tận dụng âm thanh xu hướng (Trending Sounds)</h2>
      <p>Âm nhạc và âm thanh là linh hồn của nền tảng TikTok. Thường xuyên kiểm tra danh sách bài hát đang lên xu hướng trong mục 'Âm nhạc' và lồng ghép khéo léo vào nội dung của bạn với mức âm lượng nền (5–10%) nếu là video nói chuyện.</p>

      <h2>3. Tần suất và khung giờ vàng đăng bài</h2>
      <p>Đối với kênh mới, hãy duy trì đăng 1–2 video mỗi ngày vào các khung giờ người dùng rảnh rỗi: 11h30 - 13h00 trưa và 19h30 - 22h00 tối. Sự đều đặn sẽ giúp tài khoản của bạn được đánh giá là kênh hoạt động tích cực.</p>

      <h2>4. Tối ưu thời lượng giữ chân (Retention Rate)</h2>
      <p>TikTok ưu tiên các video có tỉ lệ xem hết (Completion Rate) cao. Hãy giữ nhịp điệu cắt dựng nhanh, loại bỏ các đoạn chết và sử dụng phụ đề tự động (Auto Captions) để người xem có thể theo dõi kể cả khi tắt tiếng.</p>

      <h2>5. Đẩy tương tác ban đầu với dịch vụ chuyên nghiệp</h2>
      <p>Khi video vừa xuất bản trong 1 giờ đầu, thuật toán sẽ phân phối thử nghiệm cho 200–500 người. Kích hoạt dịch vụ tăng view & like thật của ToTrongNhan sẽ tạo tín hiệu tích cực mạnh mẽ, giúp video dễ dàng phá ngưỡng và bay thẳng lên đề xuất triệu view.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=450&fit=crop",
    publishedAt: "2025-09-20T10:00:00Z",
    readingTime: 7,
    author: authors[1],
    category: categories[1],
    tags: [tags[2], tags[4], tags[5]],
    featured: true,
    views: 12450,
    likes: 980,
  },
  {
    id: "3",
    slug: "instagram-reels-2025",
    title: "Instagram Reels 2025: Cách Tối Ưu Thuật Toán Để Vào Khám Phá (Explore)",
    excerpt: "Tìm hiểu bí quyết thuật toán Instagram Reels mới nhất và cách thiết lập thẩm mỹ nội dung để tiếp cận hàng triệu người dùng tiềm năng.",
    content: `
      <h2>1. Định vị phong cách thẩm mỹ đồng nhất (Visual Aesthetic)</h2>
      <p>Instagram là mạng xã hội chú trọng thị giác nhất. Đảm bảo ánh sáng quay video rõ nét, gam màu hài hòa và ảnh bìa Reel ăn khớp với bảng màu chung của toàn bộ Profile.</p>
      <blockquote>Người dùng Instagram có xu hướng nhấn xem Profile sau khi xem 1 Reel hay. Một bảng lưới gọn gàng, tone màu sang trọng sẽ biến 40% người xem vãng lai thành Follower trung thành.</blockquote>

      <h2>2. Tận dụng tính năng Collab (Đồng tác giả)</h2>
      <p>Tính năng Cộng tác viên cho phép bạn hiển thị bài viết trên cả 2 trang cá nhân. Hãy liên kết với các tài khoản cùng ngành hoặc các bạn sáng tạo nội dung khác để nhân đôi lượng tiếp cận ngay lập tức.</p>

      <h2>3. Sử dụng Hashtags thông minh</h2>
      <p>Thời điểm hiện tại, Instagram khuyến nghị chỉ nên dùng từ 3 đến 5 hashtags chính xác nhất với chủ đề video, thay vì spam 30 hashtags như trước đây. Kết hợp 1 hashtag ngách, 2 hashtag chủ đề và 1 hashtag thương hiệu.</p>

      <h2>4. Kích thích lưu trữ (Saves) và chia sẻ (Shares)</h2>
      <p>Thuật toán Instagram 2025 đánh giá lượt 'Chia sẻ vào tin nhắn' và lượt 'Lưu bài viết' cao gấp 3 lần so với một lượt Tim thông thường. Hãy tạo nội dung dạng checklist, mẹo vặt hữu ích hoặc danh sách công cụ mà người xem muốn lưu lại để xem sau.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800&h=450&fit=crop",
    publishedAt: "2025-09-25T14:00:00Z",
    readingTime: 6,
    author: authors[0],
    category: categories[2],
    tags: [tags[1], tags[3], tags[6]],
    featured: true,
    views: 7120,
    likes: 510,
  },
  {
    id: "4",
    slug: "tai-khoan-quang-cao-facebook",
    title: "Tài Khoản Quảng Cáo Facebook: Mọi Thứ Bạn Cần Biết Để Tránh Bị Khóa",
    excerpt: "Cẩm nang toàn diện về tài khoản Facebook Via, BM (Business Manager), tài khoản quảng cáo hạn mức cao và cách ngâm tài khoản an toàn.",
    content: `
      <h2>1. Phân biệt VIA, CLONE và BM (Business Manager)</h2>
      <p>Hiểu rõ các loại tài khoản là chìa khóa giúp bạn xây dựng dàn tài khoản quảng cáo vững chắc không lo bị gián đoạn công việc kinh doanh.</p>
      <ul>
        <li><strong>Via (Verified Information Account):</strong> Tài khoản người dùng thật có tương tác lịch sử lâu đời, độ trust cực cao khi dùng để lên chiến dịch quảng cáo.</li>
        <li><strong>BM (Business Manager):</strong> Trình quản lý doanh nghiệp giúp bạn gom nhóm nhiều fanpage, tài khoản quảng cáo và phân quyền nhân viên bài bản.</li>
        <li><strong>TKQC Kháng / Hạn mức cao:</strong> Tài khoản đã được xử lý qua các bước xác minh danh tính, sẵn sàng chi tiêu ngân sách lớn.</li>
      </ul>

      <h2>2. Quy tắc ngâm tài khoản và đổi thông tin an toàn</h2>
      <p>Khi mua tài khoản mới về, tuyệt đối không lên cam (campaign) ngay lập tức. Hãy đăng nhập trên trình duyệt sạch, ngâm 24-48 giờ với các hành động lướt Newfeed nhẹ nhàng trước khi gắn thẻ thanh toán.</p>

      <h2>3. Giải pháp cung cấp tài khoản trọn gói từ ToTrongNhan</h2>
      <p>Chúng tôi cung cấp hệ thống Via ngoại, BM xác minh doanh nghiệp chuẩn và hỗ trợ bảo hành 1 đổi 1 nếu phát sinh lỗi đăng nhập ban đầu.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=450&fit=crop",
    publishedAt: "2025-10-01T09:00:00Z",
    readingTime: 8,
    author: authors[0],
    category: categories[0],
    tags: [tags[0], tags[5], tags[7]],
    featured: false,
    views: 6540,
    likes: 420,
  },
  {
    id: "5",
    slug: "xay-dung-thuong-hieu-mang-xa-hoi",
    title: "Xây Dựng Thương Hiệu Cá Nhân Trên Mạng Xã Hội Cho Người Khởi Nghiệp",
    excerpt: "Chiến lược từ A-Z giúp chuyên gia, nhà sáng lập và người bán hàng xây dựng thương hiệu uy tín, thu hút khách hàng tự nhiên.",
    content: `
      <h2>1. Xác định giá trị cốt lõi và thông điệp duy nhất</h2>
      <p>Bạn muốn người khác nhớ đến bạn như thế nào? Chuyên gia về ẩm thực, người chia sẻ kiến thức kinh doanh, hay nhà sáng tạo phong cách sống? Hãy tập trung vào một ngách cụ thể trước khi mở rộng.</p>

      <h2>2. Đa kênh nhưng có một kênh chủ lực</h2>
      <p>Tận dụng hệ sinh thái đa kênh: Dùng TikTok và Reels để hút lưu lượng mới (Top of Funnel), dẫn dắt họ về Facebook và Zalo để chăm sóc sâu và chuyển đổi thành khách hàng trung thành.</p>

      <h2>3. Xây dựng uy tín bằng Social Proof</h2>
      <p>Lượng tương tác và số người theo dõi là thước đo mức độ tín nhiệm đầu tiên. Một trang có vài nghìn người theo dõi và phản hồi tích cực luôn tạo cảm giác an tâm hơn gấp nhiều lần so với một trang trống trơn.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1553895501-af9e282e7fc1?w=800&h=450&fit=crop",
    publishedAt: "2025-10-03T11:00:00Z",
    readingTime: 9,
    author: authors[1],
    category: categories[3],
    tags: [tags[1], tags[5], tags[6]],
    featured: false,
    views: 5200,
    likes: 380,
  },
  {
    id: "6",
    slug: "mua-followers-co-tot-khong",
    title: "Mua Followers Có Tốt Không? Phân Tích Khách Quan Ưu & Nhược Điểm",
    excerpt: "Phân tích thẳng thắn về việc sử dụng dịch vụ hỗ trợ tăng trưởng followers: Khi nào nên sử dụng và những lưu ý sống còn để tài khoản luôn an toàn.",
    content: `
      <h2>1. Ưu điểm thực tế của việc tăng Followers</h2>
      <p>Lợi ích lớn nhất là hiệu ứng đám đông (Social Proof). Tâm lý con người luôn tò mò và tin tưởng những trang đã có sẵn cộng đồng đông đảo. Nó giúp trang mới vượt qua giai đoạn khởi đầu khó khăn ('The Cold Start Problem').</p>

      <h2>2. Những rủi ro cần tránh khi chọn sai nhà cung cấp</h2>
      <p>Nhiều nơi sử dụng bot ảo kém chất lượng khiến số lượng tụt dốc không phanh chỉ sau vài ngày hoặc tệ hơn là vi phạm điều khoản của nền tảng. Đó là lý do bạn cần chọn dịch vụ uy tín cam kết người dùng thật và bảo hành dài hạn.</p>

      <h2>3. Lời khuyên kết hợp dịch vụ và sáng tạo nội dung</h2>
      <p>Followers là đòn bẩy ban đầu, nhưng nội dung chất lượng mới là thứ giữ chân khách hàng lâu dài. Hãy kết hợp gói tăng trưởng của ToTrongNhan với việc sản xuất video đều đặn để đạt hiệu quả cao nhất!</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    publishedAt: "2025-10-04T15:00:00Z",
    readingTime: 7,
    author: authors[0],
    category: categories[4],
    tags: [tags[1], tags[4], tags[7]],
    featured: false,
    views: 9400,
    likes: 720,
  },
];

export const featuredPosts = posts.filter((p) => p.featured);
export const recentPosts = [...posts].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);
