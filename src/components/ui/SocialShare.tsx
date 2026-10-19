"use client";

/**
 * components/ui/SocialShare.tsx
 * Social sharing buttons for article pages
 */

import { Link2, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  slug: string;
}

function TwitterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.86 0 1.54-.68 1.54-1.54 0-.85-.7-1.54-1.54-1.54a1.54 1.54 0 0 0-1.55 1.54c0 .86.69 1.54 1.55 1.54m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

export default function SocialShare({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${siteUrl}/blog/${slug}`;
  const encoded = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      icon: TwitterIcon,
      label: "Twitter / X",
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encTitle}`,
      hoverColor: "hover:bg-sky-500/10 hover:text-sky-400 hover:border-sky-500/40",
    },
    {
      icon: FacebookIcon,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      hoverColor: "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/40",
    },
    {
      icon: LinkedinIcon,
      label: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${encTitle}`,
      hoverColor: "hover:bg-blue-600/10 hover:text-blue-300 hover:border-blue-600/40",
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#E5F0EA] flex-wrap">
      <span className="text-sm font-semibold text-[#48665B]">Chia sẻ bài viết:</span>
      <div className="flex items-center gap-2">
        {shareLinks.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chia sẻ lên ${label}`}
            className="w-10 h-10 rounded-xl border border-[#D7EAE1] flex items-center justify-center text-[#237A60] bg-white hover:bg-[#E8F8F1] hover:border-[#237A60] transition-all duration-200 shadow-sm"
          >
            <Icon size={16} />
          </a>
        ))}
        <button
          onClick={copyLink}
          aria-label="Sao chép liên kết"
          className={cn(
            "h-10 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 shadow-sm",
            copied
              ? "bg-[#E8F8F1] text-[#237A60] border-[#237A60]"
              : "border-[#D7EAE1] bg-white text-[#183B32] hover:bg-[#E8F8F1] hover:border-[#237A60]"
          )}
        >
          {copied ? (
            <>
              <Check size={14} className="text-[#237A60]" />
              <span>Đã sao chép!</span>
            </>
          ) : (
            <>
              <Link2 size={14} className="text-[#237A60]" />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
