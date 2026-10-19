"use client";

/**
 * components/admin/AdminBlogManager.tsx
 * Full CRUD management for Blog & Articles in Admin CMS.
 */

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Heart,
  RotateCcw,
  BookOpen,
  X,
  FileText,
  Star,
  Sparkles,
} from "lucide-react";
import type { Post } from "@/lib/types";
import { categories, authors, tags } from "@/lib/mock-data";

// Helper slug generator for Vietnamese
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Preset cover images for quick selection
const PRESET_COVERS = [
  {
    label: "Facebook Ads & Growth",
    url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
  },
  {
    label: "TikTok Viral & FYP",
    url: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=450&fit=crop",
  },
  {
    label: "Instagram Aesthetic",
    url: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800&h=450&fit=crop",
  },
  {
    label: "Digital Marketing & Analytics",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
  },
  {
    label: "Personal Branding",
    url: "https://images.unsplash.com/photo-1553895501-af9e282e7fc1?w=800&h=450&fit=crop",
  },
];

export default function AdminBlogManager({
  onToast,
}: {
  onToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "standard">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<Post | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: PRESET_COVERS[0].url,
    categoryId: "1",
    authorName: "Tô Trọng Nhân",
    authorRole: "Founder & Head of Strategy",
    readingTime: 5,
    featured: false,
    tagsString: "Facebook Ads, Followers",
  });
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch {
      onToast("Không thể tải danh sách bài viết", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch(() => {
        if (isMounted) onToast("Không thể tải danh sách bài viết", "error");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [onToast]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === "all" || p.category.slug === categoryFilter;

      const matchFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && p.featured) ||
        (featuredFilter === "standard" && !p.featured);

      return matchSearch && matchCategory && matchFeatured;
    });
  }, [posts, search, categoryFilter, featuredFilter]);

  // Stats calculation
  const totalViews = useMemo(() => posts.reduce((sum, p) => sum + (p.views || 0), 0), [posts]);
  const totalLikes = useMemo(() => posts.reduce((sum, p) => sum + (p.likes || 0), 0), [posts]);
  const featuredCount = useMemo(() => posts.filter((p) => p.featured).length, [posts]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: `<h2>1. Giới thiệu tổng quan</h2>\n<p>Nội dung chi tiết phân tích chiến lược mới...</p>\n<blockquote>Mẹo quan trọng: Luôn kiên trì và tối ưu liên tục!</blockquote>\n<h2>2. Các bước triển khai thực tế</h2>\n<p>Chi tiết các bước thực hiện mang lại kết quả cao...</p>`,
      coverImage: PRESET_COVERS[0].url,
      categoryId: "1",
      authorName: "Tô Trọng Nhân",
      authorRole: "Founder & Head of Strategy",
      readingTime: 5,
      featured: false,
      tagsString: "Facebook Ads, Tăng Trưởng",
    });
    setEditorTab("write");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      categoryId: post.category.id,
      authorName: post.author.name,
      authorRole: post.author.role,
      readingTime: post.readingTime,
      featured: post.featured,
      tagsString: post.tags ? post.tags.map((t) => t.name).join(", ") : "",
    });
    setEditorTab("write");
    setIsModalOpen(true);
  };

  // Handle Title Change (auto slug)
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !editingPost || prev.slug === generateSlug(prev.title) ? generateSlug(val) : prev.slug,
    }));
  };

  // Submit Form (Create or Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      onToast("Vui lòng nhập tiêu đề bài viết", "error");
      return;
    }

    const selectedCategory =
      categories.find((c) => c.id === formData.categoryId) || categories[0];

    const parsedTags = formData.tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((tagName, i) => ({
        id: `custom-tag-${i}`,
        name: tagName,
        slug: generateSlug(tagName),
        count: 1,
      }));

    const payload: Partial<Post> = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || generateSlug(formData.title),
      excerpt: formData.excerpt.trim(),
      content: formData.content,
      coverImage: formData.coverImage,
      category: selectedCategory,
      author: {
        id: "1",
        name: formData.authorName,
        avatar: authors[0].avatar,
        bio: authors[0].bio,
        role: formData.authorRole,
        social: authors[0].social,
      },
      readingTime: Number(formData.readingTime) || 5,
      featured: formData.featured,
      tags: parsedTags.length > 0 ? parsedTags : [tags[0]],
      views: editingPost ? editingPost.views : 100,
      likes: editingPost ? editingPost.likes : 15,
    };

    try {
      if (editingPost) {
        const res = await fetch(`/api/admin/blog/${editingPost.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          onToast("Đã cập nhật bài viết thành công!");
          setIsModalOpen(false);
          fetchPosts();
        } else {
          onToast(data.message || "Cập nhật thất bại", "error");
        }
      } else {
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          onToast("Đã tạo bài viết mới thành công!");
          setIsModalOpen(false);
          fetchPosts();
        } else {
          onToast(data.message || "Tạo bài viết thất bại", "error");
        }
      }
    } catch {
      onToast("Lỗi kết nối khi lưu bài viết", "error");
    }
  };

  // Toggle Featured directly from table
  const handleToggleFeatured = async (post: Post) => {
    try {
      const updatedStatus = !post.featured;
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, featured: updatedStatus } : p))
        );
        onToast(
          updatedStatus ? "Đã ghim bài viết lên mục nổi bật" : "Đã hủy ghim bài viết nổi bật"
        );
      }
    } catch {
      onToast("Không thể thay đổi trạng thái nổi bật", "error");
    }
  };

  // Delete Post
  const handleConfirmDelete = async () => {
    if (!deleteConfirmPost) return;

    try {
      const res = await fetch(`/api/admin/blog/${deleteConfirmPost.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onToast("Đã xóa bài viết thành công!");
        setDeleteConfirmPost(null);
        fetchPosts();
      } else {
        onToast(data.message || "Xóa thất bại", "error");
      }
    } catch {
      onToast("Lỗi khi xóa bài viết", "error");
    }
  };

  // Reset to default posts
  const handleResetDefaults = async () => {
    if (!confirm("Bạn có chắc chắn muốn khôi phục lại danh sách bài viết mẫu gốc?")) return;

    try {
      const res = await fetch("/api/admin/blog/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
        onToast("Đã khôi phục dữ liệu bài viết mặc định!");
      }
    } catch {
      onToast("Không thể khôi phục dữ liệu", "error");
    }
  };

  // Helper to insert quick HTML tags into editor
  const insertTag = (open: string, close: string = "") => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + `\n${open}Nội dung mới${close}\n`,
    }));
  };

  return (
    <div>
      {/* ── Top Header & Stats Row ──────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.2rem 0.65rem",
                borderRadius: "999px",
                background: "#E8F8F1",
                border: "1px solid #B9DCCD",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#237A60",
                textTransform: "uppercase",
              }}
            >
              <FileText size={13} /> Bài Viết &amp; Kiến Thức
            </span>
            <span style={{ fontSize: "0.85rem", color: "#607F74" }}>
              • Quản lý blog, SEO &amp; bài viết hướng dẫn
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 800,
              color: "#183B32",
              margin: 0,
            }}
          >
            Quản Lý Blog &amp; Bài Viết
          </h2>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleResetDefaults}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.65rem 1rem",
              borderRadius: "10px",
              border: "1px solid #B9DCCD",
              background: "#FFFFFF",
              color: "#48665B",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            title="Khôi phục các bài viết mẫu ban đầu"
          >
            <RotateCcw size={15} /> Khôi phục mẫu
          </button>

          <Link
            href="/blog"
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.65rem 1rem",
              borderRadius: "10px",
              border: "1px solid #B9DCCD",
              background: "#FFFFFF",
              color: "#183B32",
              fontSize: "0.88rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            <ExternalLink size={15} /> Xem Blog Website
          </Link>

          <button
            type="button"
            onClick={handleOpenCreate}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.4rem",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #237A60 0%, #183B32 100%)",
              color: "#FFFFFF",
              fontSize: "0.92rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(35, 122, 96, 0.25)",
              transition: "all 0.2s",
            }}
          >
            <Plus size={18} /> Viết Bài Mới
          </button>
        </div>
      </div>

      {/* ── Stats Summary Row ───────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1.25rem",
          marginBottom: "1.75rem",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "#E8F8F1",
              color: "#237A60",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#607F74", fontWeight: 600 }}>Tổng số bài viết</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#183B32" }}>{posts.length}</div>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "#E8F8F1",
              color: "#237A60",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Eye size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#607F74", fontWeight: 600 }}>Tổng lượt xem</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#183B32" }}>
              {totalViews.toLocaleString("vi-VN")}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "#E8F8F1",
              color: "#237A60",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#607F74", fontWeight: 600 }}>Tổng yêu thích</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#183B32" }}>
              {totalLikes.toLocaleString("vi-VN")}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #B9DCCD",
            borderRadius: "16px",
            padding: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "#FFFBEB",
              color: "#D97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Star size={24} fill="#D97706" />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#607F74", fontWeight: 600 }}>Bài viết nổi bật</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#183B32" }}>{featuredCount}</div>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ─────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #B9DCCD",
          borderRadius: "16px",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
        }}
      >
        {/* Search box */}
        <div style={{ position: "relative", minWidth: 280, flex: 1 }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8EABA1",
            }}
          />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết theo tiêu đề, slug, tóm tắt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.7rem 1rem 0.7rem 2.6rem",
              borderRadius: "10px",
              border: "1.5px solid #B9DCCD",
              background: "#F4FBF8",
              fontSize: "0.9rem",
              color: "#183B32",
              outline: "none",
            }}
          />
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.85rem", color: "#607F74", fontWeight: 600 }}>Chuyên mục:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "0.65rem 0.9rem",
              borderRadius: "10px",
              border: "1.5px solid #B9DCCD",
              background: "#F4FBF8",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "#183B32",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">Tất cả chuyên mục</option>
            {categories
              .filter((c) => c.slug !== "tat-ca")
              .map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
          </select>

          {/* Featured filter */}
          <select
            value={featuredFilter}
            onChange={(e) =>
              setFeaturedFilter(e.target.value as "all" | "featured" | "standard")
            }
            style={{
              padding: "0.65rem 0.9rem",
              borderRadius: "10px",
              border: "1.5px solid #B9DCCD",
              background: "#F4FBF8",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "#183B32",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="featured">⭐ Chỉ bài nổi bật</option>
            <option value="standard">Bài viết thường</option>
          </select>
        </div>
      </div>

      {/* ── Posts Table ────────────────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #B9DCCD",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(24, 59, 50, 0.05)",
        }}
      >
        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#607F74" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📝</div>
            <div style={{ fontWeight: 600 }}>Đang tải danh sách bài viết...</div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <BookOpen size={48} style={{ color: "#8EABA1", margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#183B32", marginBottom: "0.5rem" }}>
              Không tìm thấy bài viết nào
            </h3>
            <p style={{ color: "#607F74", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Thử thay đổi từ khóa tìm kiếm hoặc bấm nút bên dưới để viết bài mới.
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              style={{
                padding: "0.65rem 1.4rem",
                borderRadius: "10px",
                border: "none",
                background: "#237A60",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              + Viết Bài Viết Mới
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr
                  style={{
                    background: "#F4FBF8",
                    borderBottom: "1.5px solid #B9DCCD",
                    color: "#183B32",
                    fontSize: "0.82rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                >
                  <th style={{ padding: "1rem 1.25rem", fontWeight: 800 }}>Ảnh &amp; Bài Viết</th>
                  <th style={{ padding: "1rem", fontWeight: 800 }}>Chuyên Mục</th>
                  <th style={{ padding: "1rem", fontWeight: 800 }}>Tác Giả</th>
                  <th style={{ padding: "1rem", fontWeight: 800 }}>Lượt Xem / Thích</th>
                  <th style={{ padding: "1rem", fontWeight: 800 }}>Nổi Bật</th>
                  <th style={{ padding: "1rem 1.25rem", textAlign: "right", fontWeight: 800 }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={post.id}
                      style={{
                        background: isEven ? "#FFFFFF" : "#FAFCFB",
                        borderBottom: "1px solid #E5EFEA",
                        transition: "background 0.15s ease",
                      }}
                      className="hover:bg-[#E8F8F1]/40"
                    >
                      {/* Image & Title */}
                      <td style={{ padding: "1rem 1.25rem", maxWidth: 360 }}>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            style={{
                              width: 60,
                              height: 42,
                              borderRadius: "8px",
                              objectFit: "cover",
                              flexShrink: 0,
                              border: "1px solid #B9DCCD",
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: 700,
                                color: "#183B32",
                                fontSize: "0.92rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {post.title}
                            </div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "#607F74",
                                fontFamily: "monospace",
                                marginTop: "2px",
                              }}
                            >
                              slug: {post.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.25rem 0.65rem",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            background: "#E8F8F1",
                            color: "#237A60",
                            border: "1px solid #B9DCCD",
                          }}
                        >
                          {post.category.name}
                        </span>
                      </td>

                      {/* Author */}
                      <td style={{ padding: "1rem", color: "#607F74", fontSize: "0.85rem" }}>
                        <div style={{ fontWeight: 600, color: "#183B32" }}>{post.author.name}</div>
                        <div style={{ fontSize: "0.75rem" }}>{post.readingTime} phút đọc</div>
                      </td>

                      {/* Stats */}
                      <td style={{ padding: "1rem", color: "#607F74", fontSize: "0.85rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            <Eye size={14} /> {(post.views || 0).toLocaleString("vi-VN")}
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            <Heart size={14} /> {(post.likes || 0).toLocaleString("vi-VN")}
                          </span>
                        </div>
                      </td>

                      {/* Featured */}
                      <td style={{ padding: "1rem" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(post)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.3rem 0.65rem",
                            borderRadius: "999px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            border: post.featured ? "1px solid #F59E0B" : "1px solid #D7EAE1",
                            background: post.featured ? "#FEF3C7" : "#F4FBF8",
                            color: post.featured ? "#D97706" : "#8EABA1",
                            cursor: "pointer",
                          }}
                          title="Bấm để bật/tắt ghim nổi bật"
                        >
                          <Star size={13} fill={post.featured ? "#D97706" : "none"} />
                          {post.featured ? "Nổi bật" : "Thường"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            style={{
                              padding: "0.4rem 0.55rem",
                              borderRadius: "8px",
                              border: "1px solid #B9DCCD",
                              background: "#FFFFFF",
                              color: "#607F74",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                            title="Xem trên web"
                          >
                            <ExternalLink size={13} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(post)}
                            style={{
                              padding: "0.4rem 0.65rem",
                              borderRadius: "8px",
                              border: "1px solid #B9DCCD",
                              background: "#FFFFFF",
                              color: "#237A60",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                            title="Chỉnh sửa bài viết"
                          >
                            <Edit3 size={14} /> Sửa
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmPost(post)}
                            style={{
                              padding: "0.4rem 0.65rem",
                              borderRadius: "8px",
                              border: "1px solid #F8D7DA",
                              background: "#FFF8F8",
                              color: "#DC3545",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                            title="Xóa bài viết"
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Add / Edit Blog Post ───────────────────────────────── */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(24, 59, 50, 0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            overflowY: "auto",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 880,
              maxHeight: "92vh",
              overflowY: "auto",
              background: "#FFFFFF",
              borderRadius: "20px",
              border: "1.5px solid #B9DCCD",
              boxShadow: "0 24px 64px rgba(24, 59, 50, 0.2)",
              padding: "2rem",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid #D7EAE1",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#183B32", margin: 0 }}>
                  {editingPost ? "Chỉnh Sửa Bài Viết" : "Soạn Thảo Bài Viết Mới"}
                </h3>
                <p style={{ color: "#607F74", fontSize: "0.85rem", margin: 0, marginTop: "0.2rem" }}>
                  {editingPost ? `Cập nhật bài viết [${editingPost.slug}]` : "Viết nội dung chia sẻ kiến thức mạng xã hội"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  border: "none",
                  background: "#F4FBF8",
                  color: "#607F74",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm}>
              {/* Title & Slug */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chiến Lược Tăng 10.000 Follower TikTok Cho Tài Khoản Mới"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#183B32",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                    Đường dẫn tĩnh (Slug URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#F4FBF8",
                      fontSize: "0.88rem",
                      fontFamily: "monospace",
                      color: "#183B32",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                    Chuyên mục *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#F4FBF8",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: "#183B32",
                      outline: "none",
                    }}
                  >
                    {categories
                      .filter((c) => c.slug !== "tat-ca")
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Đoạn trích tóm tắt (Excerpt / Meta description)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt ngắn gọn nội dung bài viết trong 1-2 câu..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.9rem",
                    color: "#183B32",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Cover Image */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Ảnh bìa bài viết (URL hoặc chọn mẫu có sẵn)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.88rem",
                    color: "#183B32",
                    outline: "none",
                    marginBottom: "0.5rem",
                  }}
                />
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                      style={{
                        padding: "0.3rem 0.65rem",
                        borderRadius: "6px",
                        border: formData.coverImage === preset.url ? "1.5px solid #237A60" : "1px solid #D7EAE1",
                        background: formData.coverImage === preset.url ? "#E8F8F1" : "#FFFFFF",
                        color: formData.coverImage === preset.url ? "#237A60" : "#607F74",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Tabs */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#183B32" }}>
                    Nội dung bài viết (Hỗ trợ định dạng HTML)
                  </label>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      type="button"
                      onClick={() => setEditorTab("write")}
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: "6px",
                        border: editorTab === "write" ? "1px solid #237A60" : "1px solid #D7EAE1",
                        background: editorTab === "write" ? "#237A60" : "#FFFFFF",
                        color: editorTab === "write" ? "#FFFFFF" : "#183B32",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Soạn Thảo
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorTab("preview")}
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: "6px",
                        border: editorTab === "preview" ? "1px solid #237A60" : "1px solid #D7EAE1",
                        background: editorTab === "preview" ? "#237A60" : "#FFFFFF",
                        color: editorTab === "preview" ? "#FFFFFF" : "#183B32",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Xem Trước
                    </button>
                  </div>
                </div>

                {/* Quick HTML tags bar */}
                {editorTab === "write" && (
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => insertTag("<h2>", "</h2>")}
                      style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #B9DCCD", background: "#FFFFFF", fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      + Tiêu đề H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag("<p>", "</p>")}
                      style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #B9DCCD", background: "#FFFFFF", fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      + Đoạn văn P
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag("<blockquote>", "</blockquote>")}
                      style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #B9DCCD", background: "#FFFFFF", fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      + Trích dẫn Blockquote
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
                      style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #B9DCCD", background: "#FFFFFF", fontSize: "0.75rem", cursor: "pointer" }}
                    >
                      + Danh sách UL
                    </button>
                  </div>
                )}

                {editorTab === "write" ? (
                  <textarea
                    rows={12}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#F4FBF8",
                      fontSize: "0.88rem",
                      fontFamily: "monospace",
                      color: "#183B32",
                      outline: "none",
                      lineHeight: 1.6,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: "1.25rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#FFFFFF",
                      minHeight: 280,
                      maxHeight: 400,
                      overflowY: "auto",
                      lineHeight: 1.7,
                    }}
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                )}
              </div>

              {/* Tags, Reading time & Featured */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                    Thẻ Tags (cách nhau bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    placeholder="Facebook Ads, Tăng Follow, Thuật Toán"
                    value={formData.tagsString}
                    onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#F4FBF8",
                      fontSize: "0.88rem",
                      color: "#183B32",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                    Thời gian đọc (phút)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: Number(e.target.value) })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#F4FBF8",
                      fontSize: "0.88rem",
                      color: "#183B32",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div
                style={{
                  background: "#F4FBF8",
                  border: "1px solid #B9DCCD",
                  borderRadius: "12px",
                  padding: "0.85rem 1rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                }}
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
              >
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: "#237A60", cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: "#183B32", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Sparkles size={15} style={{ color: "#D97706" }} /> Đánh dấu bài viết Nổi Bật (Featured)
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#607F74" }}>
                    Ghim bài viết này lên banner đầu trang Blog và trang chủ
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderRadius: "10px",
                    border: "1px solid #B9DCCD",
                    background: "#FFFFFF",
                    color: "#607F74",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.6rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #237A60 0%, #183B32 100%)",
                    color: "#FFFFFF",
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(35, 122, 96, 0.25)",
                  }}
                >
                  {editingPost ? "Lưu Bài Viết" : "Xuất Bản Bài Viết Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Confirm Delete Post ────────────────────────────────── */}
      {deleteConfirmPost && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(24, 59, 50, 0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteConfirmPost(null);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#FFFFFF",
              borderRadius: "18px",
              border: "1.5px solid #F8D7DA",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
              padding: "1.75rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "#FFF2F2",
                color: "#DC3545",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <Trash2 size={26} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#183B32", marginBottom: "0.5rem" }}>
              Xác Nhận Xóa Bài Viết?
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#607F74", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              Bạn có chắc chắn muốn xóa bài viết{" "}
              <strong style={{ color: "#183B32" }}>&ldquo;{deleteConfirmPost.title}&rdquo;</strong>? Thao tác này không thể hoàn tác.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmPost(null)}
                style={{
                  padding: "0.7rem 1.25rem",
                  borderRadius: "10px",
                  border: "1px solid #B9DCCD",
                  background: "#FFFFFF",
                  color: "#607F74",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                style={{
                  padding: "0.7rem 1.4rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "#DC3545",
                  color: "#FFFFFF",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(220, 53, 69, 0.3)",
                }}
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
