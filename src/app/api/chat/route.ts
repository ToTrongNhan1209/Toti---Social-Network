import { NextRequest, NextResponse } from "next/server";
import { BRAND } from "@/lib/data";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Built-in intelligent knowledge base for ToTrongNhan social services
const KNOWLEDGE_REPLIES: {
  keywords: string[];
  reply: string;
  suggestedActions?: { label: string; action: string }[];
}[] = [
  {
    keywords: ["chào", "hi", "hello", "alo", "bắt đầu", "start"],
    reply: `Chào bạn! Mình là **Trợ lý AI của Tô Trọng Nhân (Toti)** 👋
Chuyên gia hỗ trợ & tăng trưởng mạng xã hội uy tín số 1 Việt Nam.

Mình có thể hỗ trợ bạn tìm hiểu:
- 📌 Bảng giá các dịch vụ **Facebook, TikTok, Instagram, YouTube**
- 🛡️ Chính sách **bảo hành tụt giảm & an toàn 100% không cần mật khẩu**
- 🚀 Quy trình triển khai nhanh từ 10 - 30 phút
- 💬 Kết nối trực tiếp với anh Tô Trọng Nhân qua **Zalo: ${BRAND.phone}**

Bạn đang quan tâm đến nền tảng mạng xã hội nào nhất?`,
    suggestedActions: [
      { label: "📌 Báo giá Facebook", action: "Báo giá dịch vụ Facebook" },
      { label: "🔥 Dịch vụ TikTok", action: "Báo giá dịch vụ TikTok" },
      { label: "📸 Tăng tương tác Instagram", action: "Báo giá dịch vụ Instagram" },
      { label: "💬 Nhắn Zalo tư vấn", action: "Cho tôi số Zalo tư vấn trực tiếp" },
    ],
  },
  {
    keywords: ["facebook", "fb", "phở bò", "fanpage", "tăng follow fb", "like bài viết", "mở khóa fb", "checkpoint"],
    reply: `Dịch vụ **Facebook Chuyên Nghiệp** tại Tô Trọng Nhân bao gồm:

1. **Tăng Follower / Người theo dõi:**
   - Người thật 100% người dùng Việt Nam đang hoạt động.
   - Tốc độ tự nhiên, an toàn cho tài khoản cá nhân & Fanpage.
   - Giá chỉ từ **65.000đ / 1.000 Follow** (Bảo hành 30 ngày bù tụt).

2. **Tăng Like / Tim / Thả cảm xúc:**
   - Đủ các cảm xúc (Thích, Yêu thích, Thương thương, Haha...).
   - Hỗ trợ gói **VIP Like tự động** theo tháng (đăng bài là tự lên like).
   - Giá từ **25.000đ / 1.000 Like**.

3. **Gói Seeding bình luận & Chia sẻ Group:**
   - Bình luận theo kịch bản tùy chỉnh giúp tăng uy tín bán hàng.
   - Chia sẻ vào các hội nhóm đúng tệp khách hàng tiềm năng.

4. **Hỗ trợ kỹ thuật Facebook:**
   - Mở khóa các dạng Checkpoint (956 két sắt, 282 hình ảnh, đổi mail/SĐT).
   - Lên tích xanh Meta Verified chính chủ cho cá nhân & doanh nghiệp.

🔒 **Cam kết:** Chỉ cần gửi link bài viết / trang cá nhân, **tuyệt đối KHÔNG cần cung cấp mật khẩu**!`,
    suggestedActions: [
      { label: "💳 Bảng giá chi tiết", action: "Xem bảng giá đầy đủ" },
      { label: "💬 Nhắn Zalo chốt đơn", action: "Tôi muốn đặt tăng follow Facebook" },
      { label: "🛡️ Chế độ bảo hành", action: "Chế độ bảo hành thế nào?" },
    ],
  },
  {
    keywords: ["tiktok", "tik tok", "tt", "xuhuong", "xu hướng", "fyp", "follow tiktok", "view tiktok", "tim tiktok", "livestream"],
    reply: `Dịch vụ **Tăng Trưởng Kênh TikTok** tại Tô Trọng Nhân:

1. **Tăng Follower TikTok Việt Nam:**
   - Giúp kênh đủ điều kiện **Bật Kiếm Tiền**, mở tính năng **TikTok Shop** & **Livestream** (chỉ cần đạt 1.000 follow).
   - Người dùng thật, bảo hành tụt trọn đời.
   - Giá từ **75.000đ / 1.000 Follow**.

2. **Tăng View & Đẩy Video Lên Xu Hướng (FYP):**
   - Đẩy chỉ số giữ chân xem video, kéo tương tác tự nhiên.
   - Gói View Việt từ **10.000đ / 10.000 View**.
   - Hỗ trợ đẩy view đề xuất thuật toán TikTok mới nhất 2026.

3. **Tăng Tim / Bình luận / Share:**
   - Đẩy tương tác chéo giúp video cắn đề xuất nhanh chóng.

4. **Tăng Mắt Livestream & PK:**
   - Duy trì mắt xem ổn định, kích thích người xem vào live chốt đơn hàng triệu đồng.

🚀 Triển khai ngay sau 5 - 15 phút, không lo bị bóp reach hay vi phạm tiêu chuẩn cộng đồng!`,
    suggestedActions: [
      { label: "🎯 Đủ điều kiện TikTok Shop", action: "Tôi cần 1000 follow để mở TikTok Shop" },
      { label: "🔥 Đẩy xu hướng video", action: "Gói đẩy video lên xu hướng" },
      { label: "💬 Chat Zalo tư vấn", action: "Tư vấn gói TikTok qua Zalo" },
    ],
  },
  {
    keywords: ["instagram", "ig", "insta", "follow insta", "reels", "story"],
    reply: `Dịch vụ **Instagram Marketing & Branding** tại Tô Trọng Nhân:

1. **Followers Instagram:**
   - Tùy chọn: Follow Việt chất lượng cao hoặc Follow Tây/Global cho tài khoản quốc tế.
   - Giá từ **55.000đ / 1.000 Follow** (Bảo hành chống tụt 60 ngày).

2. **Tăng Like & View Instagram Reels:**
   - Đẩy video Reels tiếp cận hàng chục ngàn người xem khám phá (Explore).
   - Tăng tương tác Story (bình chọn poll, thả tim, swipe-up).

3. **Hỗ trợ tích xanh Meta Verified Instagram:**
   - Hướng dẫn và kích hoạt tích xanh chính chủ an toàn, nhanh gọn.

Phù hợp nhất cho các shop thời trang, người mẫu, KOLs, nghệ sĩ và doanh nghiệp xây dựng hình ảnh sang trọng!`,
    suggestedActions: [
      { label: "📸 Tăng Follow IG", action: "Báo giá gói Follow Instagram" },
      { label: "🎬 Tăng View Reels", action: "Báo giá view Reels Instagram" },
    ],
  },
  {
    keywords: ["youtube", "ytb", "sub", "subscribe", "đăng ký", "4000 giờ", "bật kiếm tiền", "view youtube"],
    reply: `Dịch vụ **YouTube Chuẩn Thuật Toán Bật Kiếm Tiền**:

1. **Gói 1.000 Subscribers + 4.000 Giờ Xem Bật Kiếm Tiền:**
   - Đạt 100% điều kiện của YouTube Partner Program (YPP).
   - Nguồn xem chuẩn đề xuất, view chất lượng cao, giữ chân người xem tốt.
   - Hỗ trợ duyệt đơn BKT thành công từ 3 - 7 ngày.

2. **Tăng View YouTube 4K:**
   - View thật từ mạng xã hội và video đề xuất, an toàn cho kênh đang bật kiếm tiền.
   - Tăng Like, Comment thảo luận tích cực.

Đảm bảo an toàn tuyệt đối cho tài khoản Adsense và kênh YouTube của bạn!`,
    suggestedActions: [
      { label: "💰 Gói Bật Kiếm Tiền trọn gói", action: "Tư vấn gói 4000h và 1000 sub YouTube" },
      { label: "💬 Chat Zalo trực tiếp", action: "Nhắn Zalo tư vấn YouTube" },
    ],
  },
  {
    keywords: ["threads", "telegram", "tele", "kéo mem", "member", "nhóm"],
    reply: `Dịch vụ **Threads & Telegram Đột Phá 2026**:

- **Threads (Meta):** Tăng Followers Việt, Like & Repost bài viết trên mạng xã hội Threads đang hot nhất hiện nay.
- **Telegram:** Kéo Member người dùng thật vào nhóm/kênh Telegram (Crypto, Bán hàng, Tài chính, Cộng đồng), tăng View bài đăng Channel.

Tốc độ hoàn thành cực nhanh, chi phí tối ưu!`,
    suggestedActions: [
      { label: "💬 Báo giá Telegram", action: "Báo giá member Telegram" },
      { label: "🧵 Báo giá Threads", action: "Báo giá follow Threads" },
    ],
  },
  {
    keywords: ["giá", "bảng giá", "chi phí", "nhiêu", "tiền", "bao nhiêu", "báo giá", "cost"],
    reply: `Bảng giá tham khảo các dịch vụ phổ biến nhất tại **ToTrongNhan**:

| Dịch vụ | Đơn giá từ | Bảo hành |
|---|---|---|
| **Follow Facebook (Người Việt)** | 65.000đ / 1.000 follow | 30 ngày bù tụt |
| **Like / Tim Facebook** | 25.000đ / 1.000 like | Vĩnh viễn |
| **VIP Like theo tháng** | 120.000đ / tháng | Tự động lên like |
| **Follow TikTok Việt Nam** | 75.000đ / 1.000 follow | Bảo hành trọn đời |
| **View TikTok đề xuất** | 10.000đ / 10.000 view | Tốc độ cực nhanh |
| **Followers Instagram** | 55.000đ / 1.000 follow | 60 ngày |
| **Gói 1.000 Sub + 4.000h YouTube** | Trọn gói ưu đãi | Bao duyệt BKT |

*💡 Lưu ý: Khi mua số lượng lớn hoặc khách hàng thân thiết, bạn sẽ được chiết khấu thêm 10% - 25%!*

Bạn muốn nhận báo giá cụ thể cho số lượng bao nhiêu ạ?`,
    suggestedActions: [
      { label: "🎯 Đặt gói Facebook", action: "Báo giá dịch vụ Facebook" },
      { label: "🔥 Đặt gói TikTok", action: "Báo giá dịch vụ TikTok" },
      { label: "📞 Để lại SĐT tư vấn", action: "Tôi muốn để lại số điện thoại để tư vấn" },
    ],
  },
  {
    keywords: ["bảo hành", "tụt", "an toàn", "mật khẩu", "khóa nick", "bị khóa", "uy tín", "chính sách"],
    reply: `Chính sách **Bảo Hành & Cam Kết Vàng** của Tô Trọng Nhân:

1. **An toàn 100% cho tài khoản:**
   - **TUYỆT ĐỐI KHÔNG CẦN MẬT KHẨU!** Bạn chỉ cần cung cấp link bài viết hoặc đường link trang cá nhân/kênh công khai.
   - Quy trình tương tác tự nhiên, không vi phạm chính sách của Facebook, TikTok, Google.

2. **Chế độ bảo hành bù tụt:**
   - Hệ thống tự động quét và bảo hành bù số lượng thiếu hụt trong suốt thời gian bảo hành (từ 30 ngày đến vĩnh viễn tùy gói).

3. **Cam kết hoàn tiền:**
   - Nếu đơn hàng không hoàn thành đủ số lượng theo cam kết, hệ thống sẽ hoàn trả 100% chi phí.

4. **Bảo mật tuyệt đối:**
   - Mọi thông tin khách hàng, đơn hàng đều được mã hóa bí mật hoàn toàn.`,
    suggestedActions: [
      { label: "💬 Báo giá dịch vụ", action: "Xem bảng giá chi tiết" },
      { label: "📞 Chat Zalo", action: "Cho tôi số Zalo tư vấn trực tiếp" },
    ],
  },
  {
    keywords: ["liên hệ", "zalo", "sđt", "hotline", "gọi", "địa chỉ", "nhân", "toti", "ở đâu"],
    reply: `Thông tin liên hệ trực tiếp với **Tô Trọng Nhân (Toti)**:

- 📱 **Hotline / Zalo hỗ trợ 24/7:** **${BRAND.phone}**
- 💬 **Link Chat Zalo nhanh:** [Bấm vào đây để chat Zalo ngay](https://zalo.me/${BRAND.zalo})
- 📧 **Email:** ${BRAND.email}
- 🏢 **Địa chỉ văn phòng:** ${BRAND.address}
- ⏰ **Thời gian phục vụ:** 24/7 kể cả ban đêm, ngày lễ và Chủ Nhật.

Nếu bạn cần tư vấn khẩn cấp hoặc xử lý đơn hàng nhanh, hãy nhắn trực tiếp qua **Zalo ${BRAND.phone}** nhé!`,
    suggestedActions: [
      { label: "💬 Mở Chat Zalo ngay", action: "Mở Zalo" },
      { label: "📌 Xem các dịch vụ", action: "Xem bảng giá đầy đủ" },
    ],
  },
];

// Fallback response for unhandled questions
const DEFAULT_FALLBACK_REPLY = `Cảm ơn bạn đã nhắn tin cho Tô Trọng Nhân! 

Về câu hỏi này của bạn, để nhận được tư vấn chi tiết và giải pháp tối ưu nhất theo đúng kênh/tài khoản của bạn, bạn có thể:
1. 💬 **Nhắn tin trực tiếp qua Zalo:** **${BRAND.phone}** ([zalo.me/${BRAND.zalo}](https://zalo.me/${BRAND.zalo}))
2. 📞 **Để lại Số Điện Thoại / Zalo** ngay tại đây, mình sẽ lưu lại để anh Tô Trọng Nhân gọi điện tư vấn trực tiếp cho bạn!

Bạn đang quan tâm đến dịch vụ nào nhất ạ?`;

// Simple phone number extractor for auto-lead generation
function extractPhoneNumber(text: string): string | null {
  const match = text.match(/(0[3|5|7|8|9])[0-9]{8}\b/);
  return match ? match[0] : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Nội dung tin nhắn không được để trống" },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const userText = (lastMessage?.content || "").trim();
    const lowerText = userText.toLowerCase();

    // ── 1. Check for Lead / Phone Number capture ──────────────────────────
    const detectedPhone = extractPhoneNumber(userText);
    if (detectedPhone) {
      return NextResponse.json({
        reply: `🎉 **Đã ghi nhận thông tin thành công!**

Cảm ơn bạn đã cung cấp số điện thoại/Zalo: **${detectedPhone}**.
Hệ thống đã chuyển thông tin tới anh **Tô Trọng Nhân**. Đội ngũ tư vấn sẽ liên hệ qua Zalo/gọi lại cho bạn trong ít phút để hỗ trợ chi tiết và áp dụng ưu đãi giảm giá tốt nhất nhé! 🚀

Trong lúc này, bạn có câu hỏi nào cần giải đáp thêm về dịch vụ không?`,
        leadCaptured: true,
        phone: detectedPhone,
      });
    }

    // ── 2. Check Optional Google Gemini AI API if configured ──────────────
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const systemInstruction = `Bạn là Trợ lý AI chuyên nghiệp của website Tô Trọng Nhân (Toti) - chuyên gia dịch vụ tương tác mạng xã hội uy tín tại Việt Nam (Facebook, TikTok, Instagram, YouTube, Telegram, Threads).
Thông tin dịch vụ:
- Facebook: Tăng follow người thật Việt (65k/1k), like bài viết (25k/1k), VIP like theo tháng, seeding bình luận, mở khóa checkpoint 956/282.
- TikTok: Tăng follow chuẩn bật kiếm tiền & TikTok Shop (75k/1k), tăng view đẩy xu hướng (10k/10k view), mắt livestream PK.
- Instagram: Tăng follow Việt/Tây (55k/1k), view Reels, tích xanh Meta.
- YouTube: Gói 1000 sub + 4000h xem bật kiếm tiền, view 4K.
- Cam kết: Không cần mật khẩu, bảo hành tụt từ 30 ngày đến vĩnh viễn, hoàn tiền 100% nếu không đạt KPI.
- Hotline/Zalo: ${BRAND.phone} (zalo.me/${BRAND.zalo}).
Hãy trả lời lịch sự, thân thiện, súc tích bằng tiếng Việt, dùng markdown gạch đầu dòng rõ ràng. Nếu khách muốn đặt hoặc cần tư vấn sâu, hãy mời khách để lại SĐT hoặc nhắn Zalo ${BRAND.phone}.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `${systemInstruction}\n\nKhách hàng hỏi: "${userText}"\nHãy trả lời khách hàng:`,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const aiReply =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiReply) {
            return NextResponse.json({
              reply: aiReply,
              suggestedActions: [
                { label: "💬 Nhắn Zalo tư vấn", action: "Tôi muốn nhắn Zalo tư vấn" },
                { label: "📌 Xem bảng giá", action: "Xem bảng giá chi tiết" },
              ],
            });
          }
        }
      } catch {
        // Fallback to internal NLP engine on Gemini error
      }
    }

    // ── 3. Internal Semantic NLP Rules Engine (Instant & Deterministic) ───
    function matchesKeyword(text: string, kw: string): boolean {
      if (kw.length <= 3) {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(^|[\\s,?.!_])${escaped}([\\s,?.!_]|$)`, "i");
        return regex.test(text);
      }
      return text.includes(kw);
    }

    let bestMatch: (typeof KNOWLEDGE_REPLIES)[0] | null = null;
    let highestScore = 0;

    for (const item of KNOWLEDGE_REPLIES) {
      let score = 0;
      for (const kw of item.keywords) {
        if (matchesKeyword(lowerText, kw)) {
          // Longer keyword matches indicate higher specificity
          score += kw.length > 4 ? 3 : 1;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore > 0) {
      return NextResponse.json({
        reply: bestMatch.reply,
        suggestedActions: bestMatch.suggestedActions || [],
      });
    }

    // Default Fallback response with helpful suggestions
    return NextResponse.json({
      reply: DEFAULT_FALLBACK_REPLY,
      suggestedActions: [
        { label: "📌 Báo giá Facebook", action: "Báo giá dịch vụ Facebook" },
        { label: "🔥 Dịch vụ TikTok", action: "Báo giá dịch vụ TikTok" },
        { label: "💬 Zalo: " + BRAND.phone, action: "Cho tôi số Zalo tư vấn trực tiếp" },
        { label: "🛡️ Chính sách bảo hành", action: "Chế độ bảo hành thế nào?" },
      ],
    });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      {
        reply: `Xin lỗi bạn, kết nối đang bị gián đoạn. Bạn vui lòng nhắn tin trực tiếp qua **Zalo ${BRAND.phone}** để được anh Tô Trọng Nhân hỗ trợ ngay lập tức nhé!`,
      },
      { status: 500 }
    );
  }
}
