"use client";

/**
 * components/admin/AdminServicesManager.tsx
 * Full CRUD management for social media services in the Admin CMS.
 * Supports Facebook, TikTok, Instagram, YouTube, Threads, Telegram with instant filtering.
 */

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Star,
  AlertCircle,
  RotateCcw,
  Zap,
  Tag,
  Layers,
  X,
  Sparkles,
  BarChart3,
} from "lucide-react";
import type { Service, Platform, ServiceCategory } from "@/lib/data";
import SocialPlatformLogo from "@/components/ui/SocialPlatformLogo";

const PLATFORM_OPTIONS: { id: Platform; name: string; color: string; icon: string }[] = [
  { id: "facebook",  name: "Facebook",  color: "#1877F2", icon: "🔵" },
  { id: "tiktok",    name: "TikTok",    color: "#FF0050", icon: "🎵" },
  { id: "instagram", name: "Instagram", color: "#E1306C", icon: "📸" },
  { id: "youtube",   name: "YouTube",   color: "#FF0000", icon: "▶️" },
  { id: "threads",   name: "Threads",   color: "#000000", icon: "🧵" },
  { id: "telegram",  name: "Telegram",  color: "#229ED9", icon: "📢" },
];

const CATEGORY_OPTIONS: { id: ServiceCategory; name: string; badgeColor: string }[] = [
  { id: "growth",      name: "Tăng trưởng (Follow/Sub)", badgeColor: "#237A60" },
  { id: "interaction", name: "Tương tác (Like/Tim/Cmt)", badgeColor: "#D97706" },
  { id: "reach",       name: "Tiếp cận (View/Share)",   badgeColor: "#2563EB" },
  { id: "live_vip",    name: "Live & Gói VIP Tháng",     badgeColor: "#7C3AED" },
];

const QUICK_EMOJIS = [
  "👥", "👍", "❤️", "💬", "🚀", "🎬", "👁️", "🏰", "⭐", "🔐",
  "🎵", "🔥", "💗", "🔖", "🎙️", "📸", "💜", "✨", "⭕", "▶️",
  "🎥", "⏱️", "⚡", "🧵", "🖤", "📢", "👀", "💎", "🎯", "🏆",
];

export default function AdminServicesManager({
  onToast,
  onSwitchTab,
}: {
  onToast: (msg: string, type?: "success" | "error") => void;
  onSwitchTab?: (tab: "services" | "blog" | "overview" | "profile") => void;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | "all">("all");
  const [popularFilter, setPopularFilter] = useState<"all" | "popular" | "standard">("all");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteConfirmService, setDeleteConfirmService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    id: "",
    platform: "facebook" as Platform,
    category: "growth" as ServiceCategory,
    icon: "👥",
    startingPrice: 45000,
    unit: "1.000 follow",
    popular: false,
    description: "",
    featuresText: "Followers thật 100%\nTăng tự nhiên không tụt\nKhông cần mật khẩu\nBảo hành 30 ngày bù tự động",
  });

  // Fetch Services from API
  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServices(data.services);
      }
    } catch {
      onToast("Không thể tải danh sách dịch vụ", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.services)) {
          setServices(data.services);
        }
      })
      .catch(() => {
        if (isMounted) onToast("Không thể tải danh sách dịch vụ", "error");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [onToast]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.unit.toLowerCase().includes(search.toLowerCase());

      const matchPlatform = platformFilter === "all" || s.platform === platformFilter;
      const matchCategory = categoryFilter === "all" || s.category === categoryFilter;
      const matchPopular =
        popularFilter === "all" ||
        (popularFilter === "popular" && s.popular) ||
        (popularFilter === "standard" && !s.popular);

      return matchSearch && matchPlatform && matchCategory && matchPopular;
    });
  }, [services, search, platformFilter, categoryFilter, popularFilter]);

  // Stats calculation
  const totalServices = services.length;
  const popularCount = useMemo(() => services.filter((s) => s.popular).length, [services]);
  const minPrice = useMemo(() => {
    if (services.length === 0) return 0;
    return Math.min(...services.map((s) => s.startingPrice));
  }, [services]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: "",
      id: "",
      platform: platformFilter !== "all" ? platformFilter : "facebook",
      category: categoryFilter !== "all" ? categoryFilter : "growth",
      icon: "⚡",
      startingPrice: 30000,
      unit: "1.000 lượt",
      popular: false,
      description: "Dịch vụ chất lượng cao, người dùng thực, kích hoạt nhanh và bảo hành uy tín.",
      featuresText: "100% người dùng thật\nTốc độ tăng tự nhiên\nKhông yêu cầu mật khẩu\nBảo hành 30 ngày bù tụt",
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setFormData({
      title: s.title,
      id: s.id,
      platform: s.platform,
      category: s.category,
      icon: s.icon || "⚡",
      startingPrice: s.startingPrice,
      unit: s.unit,
      popular: Boolean(s.popular),
      description: s.description,
      featuresText: s.features ? s.features.join("\n") : "",
    });
    setIsModalOpen(true);
  };

  // Auto-generate service ID on title change if creating new
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      let slug = prev.id;
      if (!editingService) {
        const prefix = prev.platform.slice(0, 2);
        const clean = val
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
        slug = clean ? `${prefix}-${clean}` : "";
      }
      return { ...prev, title: val, id: slug };
    });
  };

  // Save Service (Create or Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      onToast("Vui lòng nhập tên dịch vụ", "error");
      return;
    }

    const parsedFeatures = formData.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      id: formData.id.trim(),
      platform: formData.platform,
      category: formData.category,
      icon: formData.icon.trim() || "⚡",
      startingPrice: Number(formData.startingPrice) || 10000,
      unit: formData.unit.trim() || "1.000 lượt",
      popular: formData.popular,
      description: formData.description.trim(),
      features: parsedFeatures.length > 0 ? parsedFeatures : ["Cam kết chất lượng 100%"],
    };

    setSubmitting(true);
    try {
      if (editingService) {
        // Update
        const res = await fetch(`/api/admin/services/${editingService.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          onToast("Đã cập nhật dịch vụ thành công!");
          setIsModalOpen(false);
          fetchServices();
        } else {
          onToast(data.message || "Cập nhật dịch vụ thất bại", "error");
        }
      } else {
        // Create
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          onToast("Đã tạo dịch vụ mới thành công!");
          setIsModalOpen(false);
          fetchServices();
        } else {
          onToast(data.message || "Tạo dịch vụ thất bại", "error");
        }
      }
    } catch {
      onToast("Lỗi kết nối máy chủ khi lưu dịch vụ", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Toggle Popular directly from table
  const handleTogglePopular = async (s: Service) => {
    try {
      const newStatus = !s.popular;
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ popular: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) =>
          prev.map((item) => (item.id === s.id ? { ...item, popular: newStatus } : item))
        );
        onToast(
          newStatus
            ? `Đã ghim "${s.title}" lên danh sách Phổ biến!`
            : `Đã bỏ ghim "${s.title}" khỏi mục Phổ biến.`
        );
      }
    } catch {
      onToast("Không thể thay đổi trạng thái nổi bật", "error");
    }
  };

  // Delete Service
  const handleConfirmDelete = async () => {
    if (!deleteConfirmService) return;
    try {
      const res = await fetch(`/api/admin/services/${deleteConfirmService.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onToast(`Đã xóa dịch vụ "${deleteConfirmService.title}" thành công!`);
        setDeleteConfirmService(null);
        fetchServices();
      } else {
        onToast(data.message || "Xóa thất bại", "error");
      }
    } catch {
      onToast("Lỗi máy chủ khi xóa dịch vụ", "error");
    }
  };

  // Reset to default services catalog
  const handleResetDefaults = async () => {
    if (!confirm("Bạn có chắc chắn muốn khôi phục lại toàn bộ danh mục dịch vụ gốc ban đầu?")) return;
    try {
      const res = await fetch("/api/admin/services/reset", { method: "POST" });
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServices(data.services);
        onToast("Đã khôi phục toàn bộ 28 dịch vụ mặc định!");
      }
    } catch {
      onToast("Không thể khôi phục dịch vụ mặc định", "error");
    }
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
              <Zap size={13} /> Dịch Vụ Mạng Xã Hội
            </span>
            <span style={{ fontSize: "0.85rem", color: "#607F74" }}>
              • Quản lý danh mục &amp; bảng giá thực tế
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
            Quản Lý Dịch Vụ &amp; Bảng Giá
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
            title="Khôi phục danh sách dịch vụ mặc định"
          >
            <RotateCcw size={15} /> Khôi phục mẫu
          </button>

          {onSwitchTab && (
            <button
              type="button"
              onClick={() => onSwitchTab("overview")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.65rem 1.15rem",
                borderRadius: "10px",
                border: "1.5px solid #237A60",
                background: "#E8F8F1",
                color: "#237A60",
                fontSize: "0.88rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              title="Chuyển đến màn hình Dashboard & Biểu Đồ"
            >
              <BarChart3 size={16} /> Dashboard &amp; Biểu Đồ
            </button>
          )}

          <Link
            href="/services"
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
            <ExternalLink size={15} /> Xem Trang Dịch Vụ
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
            <Plus size={18} /> Thêm Dịch Vụ Mới
          </button>
        </div>
      </div>

      {/* ── Stat Metric Cards ────────────────────────────────────────── */}
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
              fontSize: "1.4rem",
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#607F74", fontWeight: 600 }}>Tổng số dịch vụ</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#183B32" }}>{totalServices}</div>
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
            <div style={{ fontSize: "0.8rem", color: "#607F74", fontWeight: 600 }}>Dịch vụ Phổ biến (Hot)</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#183B32" }}>{popularCount}</div>
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
              background: "#EFF6FF",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#607F74", fontWeight: 600 }}>Số nền tảng MXH</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#183B32" }}>6 Nền tảng</div>
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
            <Tag size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "#607F74", fontWeight: 600 }}>Giá khởi điểm từ</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#237A60" }}>
              {minPrice.toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ─────────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #B9DCCD",
          borderRadius: "16px",
          padding: "1.25rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
        }}
      >
        {/* Search & Main Controls */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          {/* Search Bar */}
          <div style={{ position: "relative", flex: "1 1 300px", minWidth: 260 }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#607F74",
              }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ theo tên, mã ID, đơn vị tính..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.6rem",
                borderRadius: "10px",
                border: "1.5px solid #B9DCCD",
                background: "#F4FBF8",
                fontSize: "0.92rem",
                color: "#183B32",
                outline: "none",
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#607F74" }}>Phân loại:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ServiceCategory | "all")}
              style={{
                padding: "0.65rem 0.9rem",
                borderRadius: "10px",
                border: "1.5px solid #B9DCCD",
                background: "#F4FBF8",
                fontSize: "0.88rem",
                color: "#183B32",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">Tất cả danh mục</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Popular Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#607F74" }}>Nổi bật:</span>
            <select
              value={popularFilter}
              onChange={(e) => setPopularFilter(e.target.value as "all" | "popular" | "standard")}
              style={{
                padding: "0.65rem 0.9rem",
                borderRadius: "10px",
                border: "1.5px solid #B9DCCD",
                background: "#F4FBF8",
                fontSize: "0.88rem",
                color: "#183B32",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all">Tất cả</option>
              <option value="popular">⭐ Chỉ Dịch Vụ Hot</option>
              <option value="standard">Tiêu chuẩn</option>
            </select>
          </div>
        </div>

        {/* Platform Filter Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#607F74", marginRight: "0.25rem" }}>
            Nền tảng:
          </span>
          <button
            type="button"
            onClick={() => setPlatformFilter("all")}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "999px",
              border: platformFilter === "all" ? "1.5px solid #237A60" : "1px solid #B9DCCD",
              background: platformFilter === "all" ? "#237A60" : "#FFFFFF",
              color: platformFilter === "all" ? "#FFFFFF" : "#183B32",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            🌐 Tất Cả ({services.length})
          </button>
          {PLATFORM_OPTIONS.map((p) => {
            const count = services.filter((s) => s.platform === p.id).length;
            const active = platformFilter === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatformFilter(p.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "999px",
                  border: active ? `1.5px solid ${p.color}` : "1px solid #B9DCCD",
                  background: active ? p.color : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#183B32",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <SocialPlatformLogo platform={p.id} size={16} />
                <span>{p.name}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    opacity: active ? 0.9 : 0.6,
                    padding: "0 0.2rem",
                  }}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Services Table ─────────────────────────────────────────── */}
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
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⚡</div>
            <div style={{ fontWeight: 600 }}>Đang tải danh sách dịch vụ...</div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#607F74" }}>
            <AlertCircle size={44} style={{ color: "#8EABA1", margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#183B32", marginBottom: "0.3rem" }}>
              Không tìm thấy dịch vụ nào phù hợp
            </h3>
            <p style={{ fontSize: "0.88rem", margin: 0, marginBottom: "1.25rem" }}>
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPlatformFilter("all");
                setCategoryFilter("all");
                setPopularFilter("all");
              }}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid #B9DCCD",
                background: "#E8F8F1",
                color: "#237A60",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Đặt lại bộ lọc
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
                  <th style={{ padding: "1rem 1.25rem", fontWeight: 800 }}>Dịch Vụ &amp; Mã</th>
                  <th style={{ padding: "1rem", fontWeight: 800 }}>Nền Tảng</th>
                  <th style={{ padding: "1rem", fontWeight: 800 }}>Phân Loại</th>
                  <th style={{ padding: "1rem", fontWeight: 800 }}>Giá Khởi Điểm</th>
                  <th style={{ padding: "1rem", fontWeight: 800 }}>Đơn Vị</th>
                  <th style={{ padding: "1rem", fontWeight: 800 }}>Hot / Ghim</th>
                  <th style={{ padding: "1rem 1.25rem", textAlign: "right", fontWeight: 800 }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, idx) => {
                  const platMeta = PLATFORM_OPTIONS.find((p) => p.id === service.platform);
                  const catMeta = CATEGORY_OPTIONS.find((c) => c.id === service.category);
                  const isEven = idx % 2 === 0;

                  return (
                    <tr
                      key={service.id}
                      style={{
                        background: isEven ? "#FFFFFF" : "#FAFCFB",
                        borderBottom: "1px solid #E5EFEA",
                        transition: "background 0.15s ease",
                      }}
                      className="hover:bg-[#E8F8F1]/40"
                    >
                      {/* Service Info */}
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ flexShrink: 0 }}>
                            <SocialPlatformLogo platform={service.platform} size={36} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#183B32", fontSize: "0.95rem" }}>
                              {service.title}
                            </div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "#607F74",
                                fontFamily: "monospace",
                                marginTop: "2px",
                              }}
                            >
                              ID: {service.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Platform */}
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            padding: "0.25rem 0.65rem",
                            borderRadius: "999px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            background: `${platMeta?.color || "#237A60"}15`,
                            color: platMeta?.color || "#237A60",
                            border: `1px solid ${platMeta?.color || "#237A60"}40`,
                          }}
                        >
                          <SocialPlatformLogo platform={service.platform} size={15} />
                          <span>{platMeta?.name || service.platform}</span>
                        </span>
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
                            background: "#F4FBF8",
                            color: catMeta?.badgeColor || "#183B32",
                            border: "1px solid #D7EAE1",
                          }}
                        >
                          {catMeta?.name.split(" ")[0]}
                        </span>
                      </td>

                      {/* Starting Price */}
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: 800, color: "#237A60", fontSize: "0.95rem" }}>
                          {service.startingPrice.toLocaleString("vi-VN")} đ
                        </div>
                      </td>

                      {/* Unit */}
                      <td style={{ padding: "1rem", color: "#607F74", fontSize: "0.85rem" }}>
                        {service.unit}
                      </td>

                      {/* Hot / Popular Toggle */}
                      <td style={{ padding: "1rem" }}>
                        <button
                          type="button"
                          onClick={() => handleTogglePopular(service)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.3rem 0.65rem",
                            borderRadius: "999px",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            border: service.popular ? "1px solid #F59E0B" : "1px solid #D7EAE1",
                            background: service.popular ? "#FEF3C7" : "#F4FBF8",
                            color: service.popular ? "#D97706" : "#8EABA1",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          title="Bấm để bật/tắt hiển thị nổi bật ở trang chủ"
                        >
                          <Star size={13} fill={service.popular ? "#D97706" : "none"} />
                          {service.popular ? "Phổ biến" : "Thường"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(service)}
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
                            title="Chỉnh sửa dịch vụ"
                          >
                            <Edit3 size={14} /> Sửa
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmService(service)}
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
                            title="Xóa dịch vụ"
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

      {/* ── Modal Add / Edit Service ─────────────────────────────────── */}
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
              maxWidth: 680,
              maxHeight: "90vh",
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
                  {editingService ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}
                </h3>
                <p style={{ color: "#607F74", fontSize: "0.85rem", margin: 0, marginTop: "0.2rem" }}>
                  {editingService ? `Cập nhật thông tin mã [${editingService.id}]` : "Điền thông tin dịch vụ vào danh mục hệ thống"}
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                {/* Platform */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#183B32" }}>
                      Nền tảng mạng xã hội *
                    </label>
                    <SocialPlatformLogo platform={formData.platform} size={20} />
                  </div>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value as Platform })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#F4FBF8",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#183B32",
                      outline: "none",
                    }}
                  >
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.icon} {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                    Nhóm dịch vụ (Category) *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#F4FBF8",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#183B32",
                      outline: "none",
                    }}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Tên dịch vụ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tăng Followers TikTok Chuẩn FYP"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.92rem",
                    color: "#183B32",
                    fontWeight: 600,
                    outline: "none",
                  }}
                />
              </div>

              {/* Service ID (Slug) */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Mã định danh ID (Slug hệ thống)
                </label>
                <input
                  type="text"
                  disabled={Boolean(editingService)}
                  placeholder="Ví dụ: tt-followers-fyp"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid #B9DCCD",
                    background: editingService ? "#EBF3F0" : "#F4FBF8",
                    fontSize: "0.88rem",
                    fontFamily: "monospace",
                    color: "#183B32",
                    outline: "none",
                    cursor: editingService ? "not-allowed" : "text",
                  }}
                />
                <span style={{ fontSize: "0.75rem", color: "#607F74" }}>
                  {editingService ? "Mã ID không thể thay đổi sau khi tạo để tránh lỗi liên kết" : "Để trống hệ thống sẽ tự sinh theo tên"}
                </span>
              </div>

              {/* Icon & Quick Picker */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Biểu tượng Icon (Emoji)
                </label>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    style={{
                      width: 60,
                      textAlign: "center",
                      fontSize: "1.3rem",
                      padding: "0.5rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#F4FBF8",
                      outline: "none",
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", flex: 1 }}>
                    {QUICK_EMOJIS.slice(0, 14).map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: em })}
                        style={{
                          fontSize: "1rem",
                          padding: "0.3rem 0.5rem",
                          borderRadius: "6px",
                          border: formData.icon === em ? "1.5px solid #237A60" : "1px solid #D7EAE1",
                          background: formData.icon === em ? "#E8F8F1" : "#FFFFFF",
                          cursor: "pointer",
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Unit */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                    Giá khởi điểm (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#F4FBF8",
                      fontSize: "0.92rem",
                      color: "#183B32",
                      fontWeight: 700,
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                    Đơn vị tính *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 1.000 follow / 100 tim"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 1rem",
                      borderRadius: "10px",
                      border: "1.5px solid #B9DCCD",
                      background: "#F4FBF8",
                      fontSize: "0.92rem",
                      color: "#183B32",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Popular Checkbox */}
              <div
                style={{
                  background: "#F4FBF8",
                  border: "1px solid #B9DCCD",
                  borderRadius: "12px",
                  padding: "0.85rem 1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                }}
                onClick={() => setFormData({ ...formData, popular: !formData.popular })}
              >
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: "#237A60", cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: "#183B32", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Sparkles size={15} style={{ color: "#D97706" }} /> Đánh dấu dịch vụ Phổ Biến (Hot)
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#607F74" }}>
                    Hiển thị nổi bật với huy hiệu &ldquo;Phổ biến&rdquo; trên trang chủ và danh sách dịch vụ
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Mô tả chi tiết dịch vụ
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả lợi ích, chất lượng tài khoản và tác dụng đối với khách hàng..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.9rem",
                    color: "#183B32",
                    outline: "none",
                    resize: "vertical",
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Features List (1 per line) */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Điểm nổi bật / Tính năng (mỗi dòng 1 tính năng)
                </label>
                <textarea
                  rows={4}
                  placeholder="Tăng người dùng thật 100%&#10;Bảo hành 30 ngày bù tụt&#10;Kích hoạt sau 10 phút&#10;Không yêu cầu mật khẩu"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.88rem",
                    color: "#183B32",
                    outline: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                  }}
                />
                <span style={{ fontSize: "0.75rem", color: "#607F74" }}>
                  Nhấn Enter để xuống dòng tạo thêm một tính năng nổi bật mới.
                </span>
              </div>

              {/* Submit Buttons */}
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
                  disabled={submitting}
                  style={{
                    padding: "0.75rem 1.6rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #237A60 0%, #183B32 100%)",
                    color: "#FFFFFF",
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 14px rgba(35, 122, 96, 0.25)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  {submitting ? "Đang lưu..." : editingService ? "Lưu Thay Đổi" : "Tạo Dịch Vụ Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Confirm Delete ─────────────────────────────────────── */}
      {deleteConfirmService && (
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
            if (e.target === e.currentTarget) setDeleteConfirmService(null);
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
              Xác Nhận Xóa Dịch Vụ
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#607F74", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              Bạn có chắc chắn muốn xóa dịch vụ{" "}
              <strong style={{ color: "#183B32" }}>&ldquo;{deleteConfirmService.title}&rdquo;</strong>{" "}
              (Mã: <code>{deleteConfirmService.id}</code>)? Hành động này không thể hoàn tác.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmService(null)}
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
