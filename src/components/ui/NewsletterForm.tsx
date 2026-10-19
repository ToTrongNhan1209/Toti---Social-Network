"use client";

/**
 * components/ui/NewsletterForm.tsx
 * Newsletter signup with validation, honeypot, and feedback states
 */

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { NewsletterSchema } from "@/lib/validation";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "default" | "footer";
}

export default function NewsletterForm({ variant = "default" }: Props) {
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState(""); // honeypot
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const isFooter = variant === "footer";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-bot honeypot check (client side)
    if (phone) return;

    const result = NewsletterSchema.safeParse({ email, phone });
    if (!result.success) {
      setStatus("error");
      setMessage(result.error.issues[0].message);
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage("Cảm ơn bạn! Kiểm tra email để xác nhận.");
        setEmail("");
      } else {
        throw new Error(data.error ?? "Đã xảy ra lỗi");
      }
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  if (status === "success") {
    return (
      <div className={cn(
        "flex items-center gap-3 rounded-xl p-4",
        isFooter ? "bg-[#237A60] text-white border border-[#35594D]" : "bg-[#E8F8F1] text-[#237A60] border border-[#B9DCCD]"
      )}>
        <CheckCircle size={22} className="flex-shrink-0" />
        <p className="font-medium text-sm">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot – hidden from humans */}
      <input
        type="text"
        name="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className={cn(
        "flex gap-0 max-w-md",
        isFooter ? "mx-auto" : ""
      )}>
        {!isFooter && (
          <div className="relative flex-1">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71877E]" />
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn…"
              required
              className="search-input rounded-r-none pl-9 border-r-0"
              aria-label="Email đăng ký newsletter"
            />
          </div>
        )}

        {isFooter && (
          <input
            id="newsletter-email-footer"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn…"
            required
            className="newsletter-input flex-1"
            aria-label="Email đăng ký newsletter"
          />
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 font-heading font-semibold text-sm transition-all duration-200",
            isFooter
              ? "bg-[#A6E4D1] text-[#183B32] rounded-r-lg hover:bg-[#8DD9C1] rounded-l-none"
              : "btn-primary rounded-l-none"
          )}
          aria-label="Đăng ký"
        >
          {status === "loading"
            ? <Loader2 size={16} className="animate-spin" />
            : <><span className="hidden sm:inline">Đăng Ký</span><ArrowRight size={16} /></>
          }
        </button>
      </div>

      {status === "error" && message && (
        <p className={cn(
          "mt-2 text-xs",
          isFooter ? "text-[#FEECEB] text-center" : "text-[#B42318]"
        )}>
          {message}
        </p>
      )}
    </form>
  );
}
