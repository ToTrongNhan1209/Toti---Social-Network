/**
 * components/ui/PostCard.tsx
 * Reusable article card with glassmorphism, glow effects, badges, reading time
 */

import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Heart } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate, formatCount } from "@/lib/utils";

interface Props {
  post: Post;
  variant?: "default" | "featured" | "compact";
}

export default function PostCard({ post, variant = "default" }: Props) {
  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex gap-3 items-start p-3 rounded-xl bg-white hover:bg-[#E8F8F1]/60 border border-[#D7EAE1] hover:border-[#B9DCCD] transition-all duration-200 shadow-sm"
      >
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-semibold text-[#237A60] uppercase tracking-wide">
            {post.category.name}
          </span>
          <h3 className="text-sm font-semibold text-[#183B32] group-hover:text-[#237A60] transition-colors line-clamp-2 mt-0.5">
            {post.title}
          </h3>
          <p className="text-xs text-[#71877E] mt-1 flex items-center gap-1">
            <Clock size={11} />{post.readingTime} phút đọc
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative overflow-hidden rounded-2xl block h-full border border-[#D7EAE1] hover:border-[#237A60] shadow-md hover:shadow-lg transition-all duration-300 bg-white"
      >
        <div className="relative h-80 sm:h-96 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#183B32] via-[#183B32]/70 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#237A60] text-white shadow-sm flex items-center gap-1">
                ⭐ Nổi Bật
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20">
                {post.category.name}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#A6E4D1] transition-colors">
              {post.title}
            </h2>
            <p className="text-[#D7F3E8] text-sm line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <div className="flex items-center gap-2.5">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={28}
                  height={28}
                  className="rounded-full border border-white/30"
                />
                <span className="text-white text-xs font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-3 text-[#C4DED3] text-xs">
                <span className="flex items-center gap-1"><Clock size={12} />{post.readingTime} phút</span>
                <span className="flex items-center gap-1"><Eye size={12} />{formatCount(post.views)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <article className="bg-white rounded-2xl border border-[#D7EAE1] hover:border-[#B9DCCD] shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col overflow-hidden h-full">
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden w-full">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm border border-[#D7EAE1] bg-[#D7F3E8]/90 text-[#183B32]"
            >
              {post.category.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-lg text-[#183B32] group-hover:text-[#237A60] transition-colors line-clamp-2 mb-2">
              {post.title}
            </h2>
            <p className="text-[#48665B] text-sm line-clamp-2 mb-4 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.id}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EDF8F3] text-[#48665B] border border-[#D7EAE1]"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E5F0EA] mt-2">
            <div className="flex items-center gap-2">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full border border-[#D7EAE1]"
              />
              <div>
                <p className="text-xs font-semibold text-[#183B32]">{post.author.name}</p>
                <p className="text-[11px] text-[#71877E]">{formatDate(post.publishedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#71877E] text-xs">
              <span className="flex items-center gap-1">
                <Clock size={12} />{post.readingTime}m
              </span>
              <span className="flex items-center gap-1">
                <Heart size={12} />{formatCount(post.likes)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
