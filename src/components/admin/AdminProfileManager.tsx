"use client";

/**
 * components/admin/AdminProfileManager.tsx
 * Admin Profile Management System for ToTrongNhan CMS.
 * View & update personal profile, Google account details, avatar, and security settings.
 */

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Camera,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Lock,
  Globe,
  Sparkles,
} from "lucide-react";
import type { AdminProfile } from "@/lib/profile-store";

const AVATAR_PRESETS = [
  {
    label: "Doanh nhân lịch lãm",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    label: "Avatar thương hiệu Toti",
    url: "/logo/final-avatar.png",
  },
  {
    label: "Chuyên gia công nghệ",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  },
  {
    label: "Sáng tạo & Hiện đại",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
];

export default function AdminProfileManager({
  onToast,
  onProfileUpdated,
}: {
  onToast: (msg: string, type?: "success" | "error") => void;
  onProfileUpdated?: (profile: AdminProfile) => void;
}) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    title: "",
    email: "",
    phone: "",
    zalo: "",
    avatar: "",
    coverImage: "",
    bio: "",
    address: "",
    facebook: "",
    tiktok: "",
    instagram: "",
    youtube: "",
    telegram: "",
  });

  // Fetch current profile from API
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.profile) {
          const p = data.profile as AdminProfile;
          setProfile(p);
          setFormData({
            name: p.name,
            nickname: p.nickname || "",
            title: p.title || "",
            email: p.email,
            phone: p.phone || "",
            zalo: p.zalo || "",
            avatar: p.avatar,
            coverImage: p.coverImage,
            bio: p.bio,
            address: p.address,
            facebook: p.social?.facebook || "",
            tiktok: p.social?.tiktok || "",
            instagram: p.social?.instagram || "",
            youtube: p.social?.youtube || "",
            telegram: p.social?.telegram || "",
          });
        }
      })
      .catch(() => {
        if (isMounted) onToast("Không thể tải thông tin hồ sơ", "error");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [onToast]);

  // Handle Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      onToast("Họ tên không được để trống", "error");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<AdminProfile> = {
        name: formData.name.trim(),
        nickname: formData.nickname.trim(),
        title: formData.title.trim(),
        phone: formData.phone.trim(),
        zalo: formData.zalo.trim(),
        avatar: formData.avatar.trim(),
        coverImage: formData.coverImage.trim(),
        bio: formData.bio.trim(),
        address: formData.address.trim(),
        social: {
          facebook: formData.facebook.trim(),
          tiktok: formData.tiktok.trim(),
          instagram: formData.instagram.trim(),
          youtube: formData.youtube.trim(),
          telegram: formData.telegram.trim(),
        },
      };

      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.profile) {
        setProfile(data.profile);
        onToast("Đã lưu cập nhật hồ sơ quản trị thành công!");
        if (onProfileUpdated) {
          onProfileUpdated(data.profile);
        }
      } else {
        onToast(data.message || "Cập nhật hồ sơ thất bại", "error");
      }
    } catch {
      onToast("Lỗi kết nối khi lưu hồ sơ", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#607F74" }}>
        <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>👤</div>
        <div style={{ fontWeight: 600 }}>Đang tải thông tin hồ sơ quản trị viên...</div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Profile Hero Header Card ───────────────────────────────── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1.5px solid #B9DCCD",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(24, 59, 50, 0.05)",
          marginBottom: "2rem",
          position: "relative",
        }}
      >
        {/* Cover Image Banner */}
        <div
          style={{
            height: "180px",
            background: "linear-gradient(135deg, #183B32 0%, #237A60 60%, #A6E4D1 100%)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.3rem 0.8rem",
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(6px)",
              color: "#FFFFFF",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={14} /> Hồ Sơ Quản Trị Hệ Thống
          </div>
        </div>

        {/* Profile Content Container */}
        <div style={{ padding: "0 2rem 2rem", position: "relative" }}>
          {/* Avatar & Badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "-55px",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1.25rem" }}>
              <div style={{ position: "relative" }}>
                <img
                  src={formData.avatar || "/logo/final-avatar.png"}
                  alt={formData.name}
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #FFFFFF",
                    boxShadow: "0 8px 24px rgba(24, 59, 50, 0.15)",
                    background: "#F4FBF8",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo/final-avatar.png";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#237A60",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #FFFFFF",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                  }}
                  title="Tài khoản Google đã xác thực"
                >
                  <CheckCircle2 size={16} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#183B32", margin: 0 }}>
                    {profile?.name || formData.name}
                  </h2>
                  {profile?.nickname && (
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        background: "#E8F8F1",
                        color: "#237A60",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        border: "1px solid #B9DCCD",
                      }}
                    >
                      ({profile.nickname})
                    </span>
                  )}
                  <span
                    style={{
                      padding: "0.2rem 0.65rem",
                      borderRadius: "999px",
                      background: "#FEF3C7",
                      color: "#D97706",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      border: "1px solid #FDE68A",
                    }}
                  >
                    👑 Super Admin
                  </span>
                </div>
                <div style={{ color: "#607F74", fontSize: "0.9rem", marginTop: "3px" }}>
                  {profile?.title || formData.title}
                </div>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <div
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "10px",
                  background: "#F4FBF8",
                  border: "1px solid #D7EAE1",
                  fontSize: "0.8rem",
                  color: "#183B32",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <Mail size={14} style={{ color: "#237A60" }} /> {profile?.email}
              </div>
              <div
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "10px",
                  background: "#F4FBF8",
                  border: "1px solid #D7EAE1",
                  fontSize: "0.8rem",
                  color: "#183B32",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <Phone size={14} style={{ color: "#237A60" }} /> {profile?.phone}
              </div>
              <div
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "10px",
                  background: "#F4FBF8",
                  border: "1px solid #D7EAE1",
                  fontSize: "0.8rem",
                  color: "#183B32",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <MapPin size={14} style={{ color: "#237A60" }} /> {profile?.address}
              </div>
            </div>
          </div>

          {/* Bio Preview */}
          <div
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "14px",
              background: "#F4FBF8",
              border: "1px solid #D7EAE1",
              color: "#48665B",
              fontSize: "0.88rem",
              lineHeight: 1.6,
            }}
          >
            {profile?.bio || formData.bio}
          </div>
        </div>
      </div>

      {/* ── Edit Profile & Security Grid ────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.75rem",
          alignItems: "start",
        }}
      >
        {/* Left Form: Edit Personal Info */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #B9DCCD",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "#E8F8F1",
                color: "#237A60",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Save size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#183B32", margin: 0 }}>
                Chỉnh Sửa Hồ Sơ Cá Nhân
              </h3>
              <p style={{ fontSize: "0.82rem", color: "#607F74", margin: 0 }}>
                Cập nhật thông tin hiển thị trên trang quản trị và bài viết
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            {/* Full Name & Nickname */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    color: "#183B32",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Biệt danh
                </label>
                <input
                  type="text"
                  placeholder="Toti"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
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

            {/* Title / Headline */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                Chức danh / Tiêu đề hồ sơ
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  borderRadius: "10px",
                  border: "1.5px solid #B9DCCD",
                  background: "#F4FBF8",
                  fontSize: "0.9rem",
                  color: "#183B32",
                  outline: "none",
                }}
              />
            </div>

            {/* Avatar URL & Preset Selector */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                <Camera size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                Đường dẫn ảnh đại diện (Avatar URL)
              </label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
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
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.75rem", color: "#607F74", alignSelf: "center" }}>Chọn ảnh mẫu:</span>
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: preset.url })}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "6px",
                      border: formData.avatar === preset.url ? "1.5px solid #237A60" : "1px solid #D7EAE1",
                      background: formData.avatar === preset.url ? "#E8F8F1" : "#FFFFFF",
                      color: formData.avatar === preset.url ? "#237A60" : "#607F74",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone & Zalo */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.9rem",
                    color: "#183B32",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                  Số Zalo tư vấn
                </label>
                <input
                  type="text"
                  value={formData.zalo}
                  onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.9rem",
                    color: "#183B32",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                Địa chỉ khu vực
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  borderRadius: "10px",
                  border: "1.5px solid #B9DCCD",
                  background: "#F4FBF8",
                  fontSize: "0.9rem",
                  color: "#183B32",
                  outline: "none",
                }}
              />
            </div>

            {/* Bio */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#183B32", marginBottom: "0.35rem" }}>
                Tiểu sử &amp; Giới thiệu bản thân
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1.5px solid #B9DCCD",
                  background: "#F4FBF8",
                  fontSize: "0.88rem",
                  color: "#183B32",
                  outline: "none",
                  lineHeight: 1.6,
                  resize: "vertical",
                }}
              />
            </div>

            {/* Social Links Sub-section */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, color: "#183B32", marginBottom: "0.5rem" }}>
                <Globe size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                Liên kết mạng xã hội cá nhân
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <input
                  type="text"
                  placeholder="Facebook URL"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="TikTok URL"
                  value={formData.tiktok}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Telegram URL"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Instagram URL"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  style={{
                    padding: "0.6rem 0.85rem",
                    borderRadius: "8px",
                    border: "1px solid #B9DCCD",
                    background: "#F4FBF8",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              style={{
                width: "100%",
                padding: "0.85rem 1.4rem",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #237A60 0%, #183B32 100%)",
                color: "#FFFFFF",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(35, 122, 96, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Save size={18} />
              {saving ? "Đang lưu thay đổi..." : "Lưu Thay Đổi Hồ Sơ"}
            </button>
          </form>
        </div>

        {/* Right Column: Account Security & Google Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Security Card */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #B9DCCD",
              borderRadius: "20px",
              padding: "1.75rem",
              boxShadow: "0 2px 10px rgba(24, 59, 50, 0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "#E8F8F1",
                  color: "#237A60",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lock size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#183B32", margin: 0 }}>
                  Bảo Mật Tài Khoản Google
                </h3>
                <p style={{ fontSize: "0.8rem", color: "#607F74", margin: 0 }}>
                  Thông tin xác thực &amp; quyền hạn quản trị
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: "#F4FBF8",
                  border: "1px solid #D7EAE1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#607F74" }}>Email Google ủy quyền</div>
                  <div style={{ fontWeight: 700, color: "#183B32", fontSize: "0.9rem" }}>{profile?.email}</div>
                </div>
                <span
                  style={{
                    padding: "0.2rem 0.55rem",
                    borderRadius: "999px",
                    background: "#E8F8F1",
                    color: "#237A60",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  Xác thực
                </span>
              </div>

              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: "#F4FBF8",
                  border: "1px solid #D7EAE1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#607F74" }}>Cấp bậc phân quyền</div>
                  <div style={{ fontWeight: 700, color: "#183B32", fontSize: "0.9rem" }}>
                    {profile?.role || "Super Administrator"}
                  </div>
                </div>
                <Sparkles size={16} style={{ color: "#D97706" }} />
              </div>

              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: "#F4FBF8",
                  border: "1px solid #D7EAE1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#607F74" }}>Phương thức xác thực</div>
                  <div style={{ fontWeight: 700, color: "#183B32", fontSize: "0.9rem" }}>
                    Google OAuth 2.0 (HMAC SHA-256)
                  </div>
                </div>
                <ShieldCheck size={16} style={{ color: "#237A60" }} />
              </div>

              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  background: "#F4FBF8",
                  border: "1px solid #D7EAE1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#607F74" }}>Lần đăng nhập gần nhất</div>
                  <div style={{ fontWeight: 600, color: "#183B32", fontSize: "0.85rem" }}>
                    {profile?.security?.lastLoginAt
                      ? new Date(profile.security.lastLoginAt).toLocaleString("vi-VN")
                      : "Vừa mới đăng nhập"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
