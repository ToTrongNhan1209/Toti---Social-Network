"use client";

/**
 * app/blog/page.tsx
 * Blog listing page with search, category filtering, stats, and glassmorphic UI
 */

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, SlidersHorizontal, BookOpen, Settings } from "lucide-react";
import PostCard from "@/components/ui/PostCard";
import { posts as initialPosts, categories } from "@/lib/mock-data";

const PAGE_SIZE = 6;

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("tat-ca");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          setAllPosts(data.posts);
        }
      })
      .catch((err) => console.error("Error fetching live posts:", err));
  }, []);

  const filtered = useMemo(() => {
    return allPosts.filter((p) => {
      const matchCat = category === "tat-ca" || p.category.slug === category;
      const matchSearch =
        !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allPosts, search, category]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategoryChange = (slug: string) => {
    setCategory(slug);
    setPage(1);
  };

  return (
    <div className="mesh-bg" style={{ paddingTop: "98px", minHeight: "100vh" }}>
      <div className="container-xl" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="section-label">
            <BookOpen size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            Kiến Thức & Kinh Nghiệm
          </span>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}>
            Blog Tăng Trưởng MXH
          </h1>
          <p className="section-sub" style={{ margin: "0 auto" }}>
            Khám phá {allPosts.length} bài viết chuyên sâu về chiến lược tăng tương tác Facebook, bí quyết
            viral video TikTok, thuật toán Instagram và cẩm nang kinh doanh online.
          </p>
          <div style={{ marginTop: "1.25rem" }}>
            <Link
              href="/admin"
              className="card-glow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.45rem 1.1rem",
                borderRadius: "999px",
                border: "1px solid #B9DCCD",
                background: "#FFFFFF",
                color: "#237A60",
                fontSize: "0.85rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(35, 122, 96, 0.08)",
              }}
            >
              <Settings size={14} /> Quản Trị Blog (CRUD Admin)
            </Link>
          </div>
        </div>

        {/* ── Filters Bar ─────────────────────────────────────────── */}
        <div
          className="card"
          style={{
            padding: "1.25rem",
            marginBottom: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            background: "#FFFFFF",
            border: "1px solid #D7EAE1",
          }}
        >
          {/* Top row: search + category count */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1", minWidth: "260px" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#71877E",
                }}
              />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm kiếm bài viết, thủ thuật Facebook, TikTok..."
                style={{
                  paddingLeft: "2.75rem",
                  borderRadius: "12px",
                  background: "#FFFFFF",
                  border: "1px solid #D7EAE1",
                  color: "#183B32",
                }}
                aria-label="Tìm kiếm bài viết"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="scroll-touch" style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
            <SlidersHorizontal size={16} style={{ color: "#71877E", flexShrink: 0, marginRight: "0.25rem" }} />
            {categories.map((cat) => {
              const active = category === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  style={{
                    padding: "0.45rem 1rem",
                    borderRadius: "50px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    border: `1px solid ${active ? "#237A60" : "#D7EAE1"}`,
                    background: active ? "#D7F3E8" : "#F4FBF8",
                    color: active ? "#183B32" : "#48665B",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Results count ─────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.75rem", color: "#71877E", fontSize: "0.9rem" }}>
          <Filter size={15} />
          <span>
            Hiển thị <strong style={{ color: "#183B32" }}>{filtered.length}</strong> bài viết
            {category !== "tat-ca" && (
              <> trong chuyên mục <strong style={{ color: "#237A60" }}>{categories.find((c) => c.slug === category)?.name}</strong></>
            )}
            {search && <> cho từ khóa &quot;<strong style={{ color: "#183B32" }}>{search}</strong>&quot;</>}
          </span>
        </div>

        {/* ── Post Grid ─────────────────────────────────────────────── */}
        {paginated.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1.75rem", marginBottom: "3rem" }}>
            {paginated.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div
            className="card"
            style={{ textAlign: "center", padding: "4rem 2rem", margin: "2rem 0", background: "#FFFFFF", border: "1px solid #D7EAE1" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem", color: "#183B32" }}>Không tìm thấy bài viết</h3>
            <p style={{ color: "#48665B", fontSize: "0.95rem", maxWidth: 420, margin: "0 auto 1.5rem" }}>
              Không có kết quả nào phù hợp với từ khóa &quot;{search}&quot;. Hãy thử từ khóa khác hoặc xóa bộ lọc.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("tat-ca");
              }}
              className="btn-outline"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}

        {/* ── Pagination ────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isCurrent = p === page;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    border: `1px solid ${isCurrent ? "#237A60" : "#D7EAE1"}`,
                    background: isCurrent ? "#237A60" : "#FFFFFF",
                    color: isCurrent ? "#FFFFFF" : "#48665B",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
