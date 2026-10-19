/**
 * app/blog/[slug]/page.tsx
 * Single post view – prose reading, TOC, author bio, related posts, comments
 */

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock, Eye, Heart, Calendar, Tag, ArrowLeft } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/blog-store";
import { formatDate, formatCount } from "@/lib/utils";
import ReadingProgress from "@/components/ui/ReadingProgress";
import TableOfContents from "@/components/ui/TableOfContents";
import CommentSection from "@/components/ui/CommentSection";
import SocialShare from "@/components/ui/SocialShare";
import PostCard from "@/components/ui/PostCard";

export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Không tìm thấy bài viết | ToTrongNhan" };
  return {
    title: `${post.title} | ToTrongNhan`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.id !== post.id && p.category.id === post.category.id)
    .slice(0, 3);

  return (
    <div className="mesh-bg" style={{ paddingTop: "98px", minHeight: "100vh" }}>
      <ReadingProgress />

      <article aria-labelledby="post-main-title">
        {/* ── Cover Hero ────────────────────────────────────────── */}
        <div style={{ position: "relative", width: "100%", height: "clamp(340px, 45vh, 520px)" }}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, #183B32 15%, rgba(24,59,50,0.75) 60%, rgba(24,59,50,0.3) 100%)",
            }}
          />
          <div
            className="container-xl"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              paddingBottom: "3rem",
            }}
          >
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#C4DED3",
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              <Link href="/" style={{ color: "#D7F3E8" }}>
                Trang Chủ
              </Link>
              <span>/</span>
              <Link href="/blog" style={{ color: "#D7F3E8" }}>
                Blog
              </Link>
              <span>/</span>
              <span style={{ color: "#FFFFFF" }}>{post.category.name}</span>
            </nav>

            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.75rem",
                  borderRadius: "50px",
                  background: "#237A60",
                  color: "#FFFFFF",
                }}
              >
                {post.category.name}
              </span>
              {post.featured && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.75rem",
                    borderRadius: "50px",
                    background: "rgba(255,255,255,0.2)",
                    color: "#FFFFFF",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  ⭐ Nổi Bật
                </span>
              )}
            </div>

            <h1
              id="post-main-title"
              style={{
                fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1.25,
                maxWidth: "880px",
                margin: 0,
              }}
            >
              {post.title}
            </h1>
          </div>
        </div>

        {/* ── Content Layout ────────────────────────────────────── */}
        <div className="container-xl" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
            {/* Left Column: Post Body */}
            <div style={{ minWidth: 0, width: "100%" }}>
              {/* Meta Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                  paddingBottom: "1.5rem",
                  marginBottom: "2rem",
                  borderBottom: "1px solid #E5F0EA",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={44}
                    height={44}
                    style={{ borderRadius: "50%", border: "2px solid #D7EAE1" }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, color: "#183B32", fontSize: "0.95rem" }}>
                      {post.author.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#71877E" }}>{post.author.role}</div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    color: "#48665B",
                    fontSize: "0.85rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Calendar size={14} /> {formatDate(post.publishedAt)}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Clock size={14} /> {post.readingTime} phút đọc
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Eye size={14} /> {formatCount(post.views)} lượt xem
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Heart size={14} style={{ color: "#237A60" }} /> {formatCount(post.likes)}
                  </span>
                </div>
              </div>

              {/* Excerpt Lead */}
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderLeft: "4px solid #237A60",
                  background: "#E8F8F1",
                  borderRadius: "0 12px 12px 0",
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                  color: "#183B32",
                  marginBottom: "2rem",
                  fontStyle: "italic",
                }}
              >
                {post.excerpt}
              </div>

              {/* Article Content */}
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "2.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid #E5F0EA",
                  flexWrap: "wrap",
                }}
              >
                <Tag size={16} style={{ color: "#71877E" }} />
                {post.tags.map((tag) => (
                  <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "6px",
                        background: "#EDF8F3",
                        border: "1px solid #D7EAE1",
                        color: "#48665B",
                        cursor: "pointer",
                      }}
                    >
                      #{tag.name}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Social Share */}
              <SocialShare title={post.title} slug={post.slug} />

              {/* Author Bio Box */}
              <div
                className="card flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
                style={{
                  padding: "1.75rem",
                  marginTop: "2.5rem",
                  background: "#FFFFFF",
                  border: "1px solid #D7EAE1",
                }}
              >
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={68}
                  height={68}
                  style={{
                    borderRadius: "16px",
                    border: "2px solid #D7EAE1",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#237A60",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Về Tác Giả
                  </span>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0.2rem 0", color: "#183B32" }}>
                    {post.author.name}
                  </h3>
                  <div style={{ fontSize: "0.85rem", color: "#48665B", fontWeight: 600, marginBottom: "0.5rem" }}>
                    {post.author.role}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#48665B", margin: 0, lineHeight: 1.7 }}>
                    {post.author.bio}
                  </p>
                </div>
              </div>

              {/* Back to Blog */}
              <div style={{ marginTop: "2rem" }}>
                <Link
                  href="/blog"
                  className="btn-outline"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <ArrowLeft size={16} /> Quay lại danh sách Blog
                </Link>
              </div>

              {/* Comments Section */}
              <div style={{ marginTop: "3rem" }}>
                <CommentSection postId={post.id} />
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-[90px]">
              <div className="card" style={{ padding: "1.5rem", background: "#FFFFFF", border: "1px solid #D7EAE1" }}>
                <TableOfContents content={post.content} />
              </div>

              {/* Related Posts */}
              {related.length > 0 && (
                <div className="card" style={{ padding: "1.5rem", background: "#FFFFFF", border: "1px solid #D7EAE1" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1rem", color: "#183B32" }}>
                    Bài Viết Cùng Chủ Đề
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {related.map((p) => (
                      <PostCard key={p.id} post={p} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
}
