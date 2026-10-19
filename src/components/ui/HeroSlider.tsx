"use client";

/**
 * components/ui/HeroSlider.tsx
 * Auto-advancing hero slider for featured posts
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, Eye } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatCount } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  posts: Post[];
}

export default function HeroSlider({ posts }: Props) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const next = useCallback(() =>
    setCurrent((i) => (i + 1) % posts.length), [posts.length]);
  const prev = useCallback(() =>
    setCurrent((i) => (i - 1 + posts.length) % posts.length), [posts.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [isPlaying, next]);

  const post = posts[current];

  return (
    <section
      className="relative overflow-hidden rounded-2xl"
      aria-label="Featured articles slider"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background Image */}
      <div className="relative h-[420px] sm:h-[520px] lg:h-[580px]">
        {posts.map((p, i) => (
          <div
            key={p.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              i === current ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={p.coverImage}
              alt={p.title}
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 hero-overlay" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge bg-[#237A60] text-white border-0 shadow-sm">
                ⭐ Nổi Bật
              </span>
              <span className="badge bg-[#D7F3E8] text-[#183B32] border border-[#B9DCCD]">
                {post.category.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-3 leading-tight">
              {post.title}
            </h1>
            <p className="text-white/90 text-base sm:text-lg mb-6 line-clamp-2">
              {post.excerpt}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href={`/blog/${post.slug}`}
                className="btn-primary bg-[#A6E4D1] text-[#183B32] hover:bg-[#8DD9C1]"
              >
                Đọc Ngay →
              </Link>
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="rounded-full border border-white/30"
                  />
                  {post.author.name}
                </span>
                <span className="flex items-center gap-1"><Clock size={13} />{post.readingTime} phút</span>
                <span className="flex items-center gap-1"><Eye size={13} />{formatCount(post.views)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === current
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
