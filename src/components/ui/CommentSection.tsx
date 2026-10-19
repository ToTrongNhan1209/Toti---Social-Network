"use client";

/**
 * components/ui/CommentSection.tsx
 * Comment form + comment list with Zod validation and honeypot anti-bot
 */

import { useState } from "react";
import { MessageCircle, Send, Loader2, CheckCircle } from "lucide-react";
import { CommentSchema, type CommentInput } from "@/lib/validation";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/types";

// Mock approved comments
const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    postId: "1",
    author: "Minh Tuấn",
    email: "minh@example.com",
    content: "Bài viết rất hay! Tôi đã áp dụng quy tắc 1/3 và thấy ảnh đẹp hơn hẳn. Cảm ơn bạn nhiều!",
    createdAt: "2024-09-16T10:00:00Z",
    approved: true,
  },
  {
    id: "c2",
    postId: "1",
    author: "Hương Giang",
    email: "huong@example.com",
    content: "Phần về ánh sáng vàng giờ rất bổ ích. Mình sẽ dậy sớm hơn để thử chụp!",
    createdAt: "2024-09-17T08:30:00Z",
    approved: true,
  },
];

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>(
    MOCK_COMMENTS.filter((c) => c.postId === postId && c.approved)
  );
  const [form, setForm] = useState<Partial<CommentInput>>({});
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (field: keyof CommentInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-bot honeypot
    if (website) return;

    const result = CommentSchema.safeParse({ ...form, postId });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0]);
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setForm({});
        if (data.comment) {
          setComments((prev) => [data.comment, ...prev]);
        }
      } else {
        throw new Error(data.error);
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (field: string) =>
    cn(
      "w-full px-4 py-2.5 rounded-xl border text-sm font-sans outline-none transition-all",
      "bg-white text-[#183B32] placeholder:text-[#71877E]",
      errors[field]
        ? "border-[#B42318] focus:ring-2 focus:ring-[#FEECEB]"
        : "border-[#D7EAE1] focus:border-[#237A60] focus:ring-2 focus:ring-[#D7F3E8]"
    );

  return (
    <section className="mt-14" aria-label="Bình luận">
      <h2 className="text-2xl font-heading font-bold text-[#183B32] flex items-center gap-2 mb-8">
        <MessageCircle size={22} className="text-[#237A60]" />
        Bình Luận ({comments.length})
      </h2>

      {/* ── Comment List ─────────────────────────────────────── */}
      {comments.length > 0 ? (
        <div className="space-y-6 mb-10">
          {comments.map((comment) => (
            <div key={comment.id} className="card bg-white rounded-2xl p-5 border border-[#D7EAE1] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#237A60] flex items-center justify-center text-white font-bold text-sm">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#183B32]">{comment.author}</p>
                    <p className="text-xs text-[#71877E]">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#48665B] leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#71877E] text-sm mb-8">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
      )}

      {/* ── Comment Form ──────────────────────────────────────── */}
      {status === "success" ? (
        <div className="card bg-[#E8F8F1] border border-[#B9DCCD] rounded-2xl p-6 flex items-center gap-3 text-[#237A60]">
          <CheckCircle size={20} />
          <p className="font-semibold text-sm">
            Cảm ơn bạn! Bình luận của bạn đang chờ duyệt và sẽ xuất hiện sớm.
          </p>
        </div>
      ) : (
        <div className="card bg-white rounded-2xl p-6 border border-[#D7EAE1] shadow-sm">
          <h3 className="font-heading font-semibold text-[#183B32] mb-5">Để Lại Bình Luận</h3>

          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="comment-author" className="block text-xs font-semibold text-[#183B32] mb-1.5">
                  Họ và Tên *
                </label>
                <input
                  id="comment-author"
                  type="text"
                  value={form.author ?? ""}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={inputClass("author")}
                  required
                />
                {errors.author && <p className="text-xs text-[#B42318] mt-1">{errors.author}</p>}
              </div>
              <div>
                <label htmlFor="comment-email" className="block text-xs font-semibold text-[#183B32] mb-1.5">
                  Email * (không hiển thị công khai)
                </label>
                <input
                  id="comment-email"
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                  className={inputClass("email")}
                  required
                />
                {errors.email && <p className="text-xs text-[#B42318] mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="comment-content" className="block text-xs font-semibold text-[#183B32] mb-1.5">
                Bình Luận *
              </label>
              <textarea
                id="comment-content"
                rows={4}
                value={form.content ?? ""}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="Chia sẻ suy nghĩ của bạn về bài viết này…"
                className={cn(inputClass("content"), "resize-none")}
                required
              />
              {errors.content && <p className="text-xs text-[#B42318] mt-1">{errors.content}</p>}
              <p className="text-xs text-[#71877E] mt-1 text-right">
                {(form.content ?? "").length}/2000
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary"
            >
              {status === "loading"
                ? <><Loader2 size={16} className="animate-spin" /> Đang gửi…</>
                : <><Send size={16} /> Gửi Bình Luận</>
              }
            </button>

            {status === "error" && (
              <p className="text-xs text-[#B42318] mt-3">Đã xảy ra lỗi. Vui lòng thử lại.</p>
            )}
          </form>
        </div>
      )}
    </section>
  );
}
