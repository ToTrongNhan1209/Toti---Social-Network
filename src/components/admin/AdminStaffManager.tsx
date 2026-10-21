"use client";

/**
 * components/admin/AdminStaffManager.tsx
 * Management of Staff Members, Website Managers, Roles & Permissions
 * Supports:
 * - View staff list, add staff with Google OAuth email
 * - Assign / change roles
 * - Lock / unlock staff access
 * - Create new custom roles with granular permission checkboxes
 * - Protect Super Admin Tô Trọng Nhân from deletion / lockout
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Search,
  KeyRound,
  Mail,
  Phone,
  Sparkles,
  X,
  Crown,
  Check,
  Info,
  Clock,
  RotateCcw,
} from "lucide-react";
import type {
  StaffMember,
  AdminRole,
  PermissionKey,
} from "@/lib/staff-store";

interface AdminStaffManagerProps {
  onToast: (msg: string, type?: "success" | "error") => void;
  currentAdminEmail?: string;
}

const COLOR_PRESETS = [
  { name: "Mint Emerald", value: "#237A60" },
  { name: "Ocean Blue", value: "#2563EB" },
  { name: "Amber Orange", value: "#D97706" },
  { name: "Royal Purple", value: "#7C3AED" },
  { name: "Crimson Rose", value: "#E11D48" },
  { name: "Dark Slate", value: "#334155" },
  { name: "Teal Cyan", value: "#0D9488" },
];

export default function AdminStaffManager({
  onToast,
  currentAdminEmail,
}: AdminStaffManagerProps) {
  const [subTab, setSubTab] = useState<"staff" | "roles">("staff");
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [rolesList, setRolesList] = useState<AdminRole[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<
    { key: PermissionKey; label: string; desc: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);

  // Form states for Staff
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    phone: "",
    roleId: "service_manager",
    notes: "",
  });

  // Form states for Role
  const [roleForm, setRoleForm] = useState<{
    name: string;
    description: string;
    color: string;
    permissions: PermissionKey[];
  }>({
    name: "",
    description: "",
    color: "#237A60",
    permissions: ["manage_blog", "manage_comments"],
  });

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffRes, rolesRes] = await Promise.all([
        fetch("/api/admin/staff"),
        fetch("/api/admin/roles"),
      ]);

      const staffData = await staffRes.json();
      const rolesData = await rolesRes.json();

      if (staffData.success) {
        setStaffList(staffData.staff || []);
      }
      if (rolesData.success) {
        setRolesList(rolesData.roles || []);
        if (rolesData.availablePermissions) {
          setAvailablePermissions(rolesData.availablePermissions);
        }
      }
    } catch (err) {
      console.error("Error loading staff/roles:", err);
      onToast("Không thể tải danh sách nhân sự", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered staff members
  const filteredStaff = useMemo(() => {
    return staffList.filter((member) => {
      const matchSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone && member.phone.includes(searchTerm));

      const matchRole =
        roleFilter === "all" || member.roleId === roleFilter;

      const matchStatus =
        statusFilter === "all" || member.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [staffList, searchTerm, roleFilter, statusFilter]);

  // Handle Add Staff
  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name.trim() || !staffForm.email.trim()) {
      onToast("Vui lòng điền họ tên và email Google", "error");
      return;
    }

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffForm),
      });
      const data = await res.json();

      if (data.success) {
        onToast(data.message || "Thêm nhân viên mới thành công!", "success");
        setIsAddStaffOpen(false);
        setStaffForm({
          name: "",
          email: "",
          phone: "",
          roleId: rolesList[0]?.id || "service_manager",
          notes: "",
        });
        fetchData();
      } else {
        onToast(data.message || "Lỗi khi thêm nhân viên", "error");
      }
    } catch {
      onToast("Lỗi hệ thống khi kết nối máy chủ", "error");
    }
  };

  // Handle Edit Staff
  const handleEditStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    try {
      const res = await fetch("/api/admin/staff", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingStaff.id,
          name: editingStaff.name,
          phone: editingStaff.phone,
          roleId: editingStaff.roleId,
          status: editingStaff.status,
          notes: editingStaff.notes,
        }),
      });
      const data = await res.json();

      if (data.success) {
        onToast("Cập nhật thông tin nhân viên thành công", "success");
        setIsEditStaffOpen(false);
        setEditingStaff(null);
        fetchData();
      } else {
        onToast(data.message || "Lỗi cập nhật", "error");
      }
    } catch {
      onToast("Lỗi hệ thống khi cập nhật", "error");
    }
  };

  // Handle Lock/Unlock Staff
  const handleToggleStaffStatus = async (member: StaffMember) => {
    if (member.isPermanent) {
      onToast("Không thể khóa tài khoản Super Admin sáng lập", "error");
      return;
    }

    const nextStatus = member.status === "active" ? "locked" : "active";
    const confirmMsg =
      nextStatus === "locked"
        ? `Bạn có chắc chắn muốn TẠM KHÓA quyền truy cập của nhân viên "${member.name}"? Họ sẽ không thể đăng nhập vào CMS.`
        : `Mở khóa quyền truy cập cho nhân viên "${member.name}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/admin/staff", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: member.id,
          status: nextStatus,
        }),
      });
      const data = await res.json();

      if (data.success) {
        onToast(
          nextStatus === "locked"
            ? `Đã tạm khóa nhân viên "${member.name}"`
            : `Đã mở khóa nhân viên "${member.name}"`,
          "success"
        );
        fetchData();
      } else {
        onToast(data.message || "Lỗi cập nhật trạng thái", "error");
      }
    } catch {
      onToast("Lỗi kết nối máy chủ", "error");
    }
  };

  // Handle Delete Staff
  const handleDeleteStaff = async (member: StaffMember) => {
    if (member.isPermanent) {
      onToast("Không thể xóa Super Admin Tô Trọng Nhân", "error");
      return;
    }

    if (
      !window.confirm(
        `Bạn có chắc chắn muốn XÓA nhân viên "${member.name}" (${member.email}) khỏi hệ thống? Thao tác này không thể hoàn tác.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/staff?id=${member.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        onToast("Đã xóa nhân viên thành công", "success");
        fetchData();
      } else {
        onToast(data.message || "Lỗi khi xóa nhân viên", "error");
      }
    } catch {
      onToast("Lỗi kết nối máy chủ", "error");
    }
  };

  // Handle Role Create / Edit Submit
  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name.trim()) {
      onToast("Vui lòng nhập tên vai trò", "error");
      return;
    }
    if (roleForm.permissions.length === 0) {
      onToast("Vui lòng chọn ít nhất một quyền hạn cho vai trò này", "error");
      return;
    }

    try {
      if (editingRole) {
        // Update existing role
        const res = await fetch("/api/admin/roles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingRole.id,
            name: roleForm.name,
            description: roleForm.description,
            color: roleForm.color,
            permissions: roleForm.permissions,
          }),
        });
        const data = await res.json();
        if (data.success) {
          onToast("Cập nhật vai trò thành công!", "success");
          setIsRoleModalOpen(false);
          setEditingRole(null);
          fetchData();
        } else {
          onToast(data.message || "Lỗi cập nhật vai trò", "error");
        }
      } else {
        // Create new role
        const res = await fetch("/api/admin/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roleForm),
        });
        const data = await res.json();
        if (data.success) {
          onToast(`Đã tạo vai trò "${roleForm.name}" thành công!`, "success");
          setIsRoleModalOpen(false);
          setRoleForm({
            name: "",
            description: "",
            color: "#237A60",
            permissions: ["manage_blog", "manage_comments"],
          });
          fetchData();
        } else {
          onToast(data.message || "Lỗi tạo vai trò", "error");
        }
      }
    } catch {
      onToast("Lỗi kết nối máy chủ", "error");
    }
  };

  // Handle Delete Role
  const handleDeleteRole = async (role: AdminRole) => {
    if (role.isSystem) {
      onToast("Không thể xóa vai trò mặc định của hệ thống", "error");
      return;
    }

    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa vai trò "${role.name}"? Lưu ý: Không thể xóa nếu đang có nhân viên giữ vai trò này.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/roles?id=${role.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        onToast("Đã xóa vai trò thành công", "success");
        fetchData();
      } else {
        onToast(data.message || "Lỗi khi xóa vai trò", "error");
      }
    } catch {
      onToast("Lỗi kết nối máy chủ", "error");
    }
  };

  // Toggle permission checkbox in role form
  const togglePermission = (permKey: PermissionKey) => {
    setRoleForm((prev) => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permKey)
          : [...prev.permissions, permKey],
      };
    });
  };

  const getRoleBadge = (roleId: string) => {
    const role = rolesList.find((r) => r.id === roleId);
    if (!role) {
      return (
        <span
          style={{
            padding: "0.2rem 0.55rem",
            borderRadius: "6px",
            background: "#F1F5F9",
            color: "#475569",
            fontSize: "0.76rem",
            fontWeight: 700,
          }}
        >
          {roleId}
        </span>
      );
    }
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.22rem 0.65rem",
          borderRadius: "6px",
          background: `${role.color}15`,
          color: role.color,
          border: `1px solid ${role.color}35`,
          fontSize: "0.78rem",
          fontWeight: 700,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: role.color,
          }}
        />
        {role.name}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* ── Top Header Banner & Stats ───────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Stat 1: Total Staff */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            padding: "1.15rem 1.25rem",
            border: "1.5px solid #D7EAE1",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.03)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "12px",
              background: "#E8F8F1",
              color: "#237A60",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "#607F74", fontWeight: 600 }}>
              Tổng Nhân Sự &amp; Quản Lý
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#183B32",
                lineHeight: 1.15,
              }}
            >
              {staffList.length}
            </div>
          </div>
        </div>

        {/* Stat 2: Super Admin */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            padding: "1.15rem 1.25rem",
            border: "1.5px solid #D7EAE1",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.03)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "12px",
              background: "#FFFBEB",
              color: "#D97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Crown size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "#607F74", fontWeight: 600 }}>
              Super Administrator
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#183B32",
                lineHeight: 1.15,
              }}
            >
              {staffList.filter((s) => s.roleId === "super_admin").length}
            </div>
          </div>
        </div>

        {/* Stat 3: Active Staff */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            padding: "1.15rem 1.25rem",
            border: "1.5px solid #D7EAE1",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.03)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "12px",
              background: "#F0FDF4",
              color: "#16A34A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "#607F74", fontWeight: 600 }}>
              Đang Hoạt Động
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#183B32",
                lineHeight: 1.15,
              }}
            >
              {staffList.filter((s) => s.status === "active").length}
            </div>
          </div>
        </div>

        {/* Stat 4: Roles Defined */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            padding: "1.15rem 1.25rem",
            border: "1.5px solid #D7EAE1",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.03)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "12px",
              background: "#EEF2FF",
              color: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <KeyRound size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "#607F74", fontWeight: 600 }}>
              Vai Trò &amp; Cấp Quyền
            </div>
            <div
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#183B32",
                lineHeight: 1.15,
              }}
            >
              {rolesList.length}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub-tabs Navigation & Actions ───────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          background: "#FFFFFF",
          padding: "0.85rem 1.15rem",
          borderRadius: "14px",
          border: "1.5px solid #D7EAE1",
        }}
      >
        {/* Tab switch pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setSubTab("staff")}
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: "9px",
              border: "none",
              background: subTab === "staff" ? "#237A60" : "transparent",
              color: subTab === "staff" ? "#FFFFFF" : "#183B32",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.15s ease",
            }}
          >
            <Users size={16} />
            <span>Danh Sách Nhân Sự ({staffList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("roles")}
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: "9px",
              border: "none",
              background: subTab === "roles" ? "#237A60" : "transparent",
              color: subTab === "roles" ? "#FFFFFF" : "#183B32",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.15s ease",
            }}
          >
            <Shield size={16} />
            <span>Vai Trò &amp; Phân Quyền ({rolesList.length})</span>
          </button>
        </div>

        {/* Action button corresponding to subTab */}
        <div>
          {subTab === "staff" ? (
            <button
              type="button"
              onClick={() => {
                setStaffForm({
                  name: "",
                  email: "",
                  phone: "",
                  roleId: rolesList[0]?.id || "service_manager",
                  notes: "",
                });
                setIsAddStaffOpen(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.55rem 1.15rem",
                borderRadius: "9px",
                background: "#237A60",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(35, 122, 96, 0.25)",
                transition: "all 0.15s ease",
              }}
            >
              <UserPlus size={16} />
              <span>Thêm Nhân Viên Mới</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingRole(null);
                setRoleForm({
                  name: "",
                  description: "",
                  color: "#237A60",
                  permissions: ["manage_blog", "manage_comments"],
                });
                setIsRoleModalOpen(true);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.55rem 1.15rem",
                borderRadius: "9px",
                background: "#237A60",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(35, 122, 96, 0.25)",
                transition: "all 0.15s ease",
              }}
            >
              <KeyRound size={16} />
              <span>Tạo Vai Trò Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Sub-Tab 1: Staff Members Table ─────────────────────────────────── */}
      {subTab === "staff" && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1.5px solid #D7EAE1",
            boxShadow: "0 2px 10px rgba(24, 59, 50, 0.03)",
            overflow: "hidden",
          }}
        >
          {/* Search & Filter Bar */}
          <div
            style={{
              padding: "1rem 1.25rem",
              borderBottom: "1.5px solid #E5F0EA",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.85rem",
            }}
          >
            {/* Search Input */}
            <div
              style={{
                position: "relative",
                flex: "1 1 260px",
                maxWidth: 400,
              }}
            >
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#607F74",
                }}
              />
              <input
                type="text"
                placeholder="Tìm theo tên, email Google, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.85rem 0.55rem 2.4rem",
                  borderRadius: "9px",
                  border: "1.5px solid #D7EAE1",
                  background: "#F4FBF8",
                  fontSize: "0.86rem",
                  color: "#183B32",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Role Filter & Status Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  padding: "0.55rem 0.85rem",
                  borderRadius: "9px",
                  border: "1.5px solid #D7EAE1",
                  background: "#F4FBF8",
                  fontSize: "0.86rem",
                  color: "#183B32",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="all">Tất cả vai trò</option>
                {rolesList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "0.55rem 0.85rem",
                  borderRadius: "9px",
                  border: "1.5px solid #D7EAE1",
                  background: "#F4FBF8",
                  fontSize: "0.86rem",
                  color: "#183B32",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="locked">Đã bị khóa</option>
              </select>

              {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("all");
                    setStatusFilter("all");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.55rem 0.85rem",
                    borderRadius: "9px",
                    border: "1px solid #D7EAE1",
                    background: "#FFFFFF",
                    color: "#607F74",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Xóa lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Staff Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr
                  style={{
                    background: "#F8FCFA",
                    borderBottom: "1.5px solid #E5F0EA",
                    color: "#607F74",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                  }}
                >
                  <th style={{ padding: "0.85rem 1.25rem" }}>Nhân Viên</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Tài Khoản Google (Đăng Nhập)</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Vai Trò Quản Trị</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Trạng Thái</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Đăng Nhập Gần Nhất</th>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "3rem 1rem",
                        textAlign: "center",
                        color: "#607F74",
                        fontSize: "0.9rem",
                      }}
                    >
                      <Users size={32} style={{ margin: "0 auto 0.65rem", color: "#B9DCCD" }} />
                      <div>Không tìm thấy nhân viên nào phù hợp với bộ lọc.</div>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((member) => {
                    const isSuper = member.roleId === "super_admin";
                    const isLocked = member.status === "locked";

                    return (
                      <tr
                        key={member.id}
                        style={{
                          borderBottom: "1px solid #E5F0EA",
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#F9FDFB";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        {/* Member Info */}
                        <td style={{ padding: "1rem 1.25rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ position: "relative" }}>
                              <img
                                src={member.avatar || "/logo/final-avatar.png"}
                                alt={member.name}
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: isSuper ? "2px solid #D97706" : "1.5px solid #D7EAE1",
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/logo/final-avatar.png";
                                }}
                              />
                              <span
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  right: 0,
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  background: isLocked ? "#EF4444" : "#16A34A",
                                  border: "2px solid #FFFFFF",
                                }}
                              />
                            </div>
                            <div>
                              <div
                                style={{
                                  fontWeight: 700,
                                  color: "#183B32",
                                  fontSize: "0.92rem",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.35rem",
                                }}
                              >
                                <span>{member.name}</span>
                                {member.isPermanent && (
                                  <span
                                    title="Super Admin Sáng Lập (Vĩnh viễn)"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      color: "#D97706",
                                    }}
                                  >
                                    <Crown size={15} />
                                  </span>
                                )}
                              </div>
                              {member.phone && (
                                <div
                                  style={{
                                    fontSize: "0.78rem",
                                    color: "#607F74",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                    marginTop: "2px",
                                  }}
                                >
                                  <Phone size={12} />
                                  <span>{member.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Google Email */}
                        <td style={{ padding: "1rem 1rem" }}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.45rem",
                              padding: "0.25rem 0.6rem",
                              borderRadius: "6px",
                              background: "#F4FBF8",
                              border: "1px solid #D7EAE1",
                              fontSize: "0.82rem",
                              color: "#183B32",
                              fontWeight: 600,
                            }}
                          >
                            <Mail size={13} style={{ color: "#237A60" }} />
                            <span>{member.email}</span>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td style={{ padding: "1rem 1rem" }}>
                          {getRoleBadge(member.roleId)}
                        </td>

                        {/* Status */}
                        <td style={{ padding: "1rem 1rem" }}>
                          {member.status === "active" ? (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                padding: "0.22rem 0.65rem",
                                borderRadius: "999px",
                                background: "#DCFCE7",
                                color: "#15803D",
                                fontSize: "0.76rem",
                                fontWeight: 700,
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "#16A34A",
                                }}
                              />
                              Hoạt Động
                            </span>
                          ) : (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                padding: "0.22rem 0.65rem",
                                borderRadius: "999px",
                                background: "#FEE2E2",
                                color: "#B91C1C",
                                fontSize: "0.76rem",
                                fontWeight: 700,
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "#DC2626",
                                }}
                              />
                              Đã Bị Khóa
                            </span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td style={{ padding: "1rem 1rem" }}>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "#607F74",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.35rem",
                            }}
                          >
                            <Clock size={13} />
                            <span>{member.lastLoginAt || "Chưa đăng nhập"}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingStaff(member);
                                setIsEditStaffOpen(true);
                              }}
                              title="Chỉnh sửa vai trò & thông tin"
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                                border: "1px solid #B9DCCD",
                                background: "#F4FBF8",
                                color: "#237A60",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                            >
                              <Edit3 size={15} />
                            </button>

                            {/* Lock/Unlock Toggle Button (Disabled for Permanent) */}
                            {!member.isPermanent && (
                              <button
                                type="button"
                                onClick={() => handleToggleStaffStatus(member)}
                                title={isLocked ? "Mở khóa truy cập" : "Tạm khóa truy cập"}
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "8px",
                                  border: `1px solid ${isLocked ? "#FCA5A5" : "#D1D5DB"}`,
                                  background: isLocked ? "#FEF2F2" : "#F9FAFB",
                                  color: isLocked ? "#DC2626" : "#4B5563",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                              >
                                {isLocked ? <Unlock size={15} /> : <Lock size={15} />}
                              </button>
                            )}

                            {/* Delete Button (Disabled for Permanent) */}
                            {!member.isPermanent && (
                              <button
                                type="button"
                                onClick={() => handleDeleteStaff(member)}
                                title="Xóa nhân viên khỏi hệ thống"
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: "8px",
                                  border: "1px solid #FECACA",
                                  background: "#FEF2F2",
                                  color: "#DC2626",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Sub-Tab 2: Roles & Permissions Grid ────────────────────────────── */}
      {subTab === "roles" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Information Notice */}
          <div
            style={{
              padding: "0.95rem 1.25rem",
              borderRadius: "12px",
              background: "#F4FBF8",
              border: "1.5px solid #B9DCCD",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              color: "#183B32",
              fontSize: "0.86rem",
            }}
          >
            <Info size={20} style={{ color: "#237A60", flexShrink: 0 }} />
            <div>
              <strong>Ma trận phân quyền (Role-Based Access Control):</strong> Bạn có thể
              tạo các vai trò mới (ví dụ: Trưởng nhóm Marketing, Kế toán, Chăm sóc khách
              hàng) và cấp các quyền hạn chi tiết tương ứng. Khi nhân viên đăng nhập bằng
              Google, hệ thống sẽ áp dụng đúng danh sách quyền đã cấp.
            </div>
          </div>

          {/* Roles Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {rolesList.map((role) => {
              const assignedMembersCount = staffList.filter(
                (s) => s.roleId === role.id
              ).length;

              return (
                <div
                  key={role.id}
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    border: "1.5px solid #D7EAE1",
                    padding: "1.35rem 1.45rem",
                    boxShadow: "0 2px 10px rgba(24, 59, 50, 0.03)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Role Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.45rem",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "8px",
                            background: `${role.color}15`,
                            color: role.color,
                            border: `1.5px solid ${role.color}35`,
                            fontSize: "0.9rem",
                            fontWeight: 800,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: role.color,
                            }}
                          />
                          {role.name}
                        </div>
                        {role.isSystem && (
                          <span
                            style={{
                              marginLeft: "0.5rem",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "0.15rem 0.45rem",
                              borderRadius: "4px",
                              background: "#F1F5F9",
                              color: "#64748B",
                            }}
                          >
                            Hệ Thống
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "#607F74",
                          fontWeight: 600,
                        }}
                      >
                        {assignedMembersCount} nhân sự
                      </div>
                    </div>

                    {/* Role Description */}
                    <p
                      style={{
                        fontSize: "0.84rem",
                        color: "#607F74",
                        lineHeight: 1.45,
                        margin: "0 0 1.1rem 0",
                      }}
                    >
                      {role.description}
                    </p>

                    {/* Permissions list */}
                    <div style={{ marginBottom: "1.25rem" }}>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: "#183B32",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.55rem",
                        }}
                      >
                        Quyền Hạn Được Cấp ({role.permissions.length}/
                        {availablePermissions.length}):
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.35rem",
                        }}
                      >
                        {availablePermissions.map((perm) => {
                          const hasPerm = role.permissions.includes(perm.key);
                          return (
                            <div
                              key={perm.key}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontSize: "0.8rem",
                                color: hasPerm ? "#183B32" : "#94A3B8",
                                fontWeight: hasPerm ? 600 : 400,
                              }}
                            >
                              <div
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "4px",
                                  background: hasPerm ? "#E8F8F1" : "#F1F5F9",
                                  color: hasPerm ? "#237A60" : "#CBD5E1",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                {hasPerm ? <Check size={12} strokeWidth={3} /> : <X size={12} />}
                              </div>
                              <span style={{ textDecoration: hasPerm ? "none" : "line-through" }}>
                                {perm.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Role Card Actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "0.5rem",
                      borderTop: "1px solid #E5F0EA",
                      paddingTop: "0.85rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRole(role);
                        setRoleForm({
                          name: role.name,
                          description: role.description,
                          color: role.color,
                          permissions: role.permissions,
                        });
                        setIsRoleModalOpen(true);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.45rem 0.85rem",
                        borderRadius: "8px",
                        border: "1px solid #B9DCCD",
                        background: "#F4FBF8",
                        color: "#237A60",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <Edit3 size={14} />
                      <span>Chỉnh Sửa</span>
                    </button>

                    {!role.isSystem && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRole(role)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.45rem 0.85rem",
                          borderRadius: "8px",
                          border: "1px solid #FECACA",
                          background: "#FEF2F2",
                          color: "#DC2626",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Modal: Thêm Nhân Viên Mới ───────────────────────────────────────── */}
      {isAddStaffOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddStaffOpen(false);
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "18px",
              width: "100%",
              maxWidth: 540,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              border: "1.5px solid #D7EAE1",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1.5px solid #E5F0EA",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#F4FBF8",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    background: "#E8F8F1",
                    color: "#237A60",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#183B32" }}>
                    Thêm Quản Lý / Nhân Viên Mới
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#607F74" }}>
                    Cấp quyền đăng nhập Google OAuth vào website
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  border: "1px solid #D7EAE1",
                  background: "#FFFFFF",
                  color: "#607F74",
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
            <form onSubmit={handleAddStaffSubmit} style={{ padding: "1.5rem" }}>
              {/* Important Google Account Tip */}
              <div
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "10px",
                  background: "#E8F8F1",
                  border: "1px solid #B9DCCD",
                  color: "#183B32",
                  fontSize: "0.82rem",
                  lineHeight: 1.45,
                  marginBottom: "1.25rem",
                }}
              >
                <strong>💡 Lưu ý quan trọng:</strong> Hệ thống sử dụng cơ chế đăng nhập bảo mật qua <strong>Google OAuth 2.0</strong>. Vui lòng nhập đúng <strong>địa chỉ email Google / Gmail</strong> mà nhân viên sẽ sử dụng để đăng nhập vào trang CMS.
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Full Name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      color: "#183B32",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Họ và tên nhân sự <span style={{ color: "#E11D48" }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={staffForm.name}
                    onChange={(e) =>
                      setStaffForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "9px",
                      border: "1.5px solid #D7EAE1",
                      fontSize: "0.88rem",
                      color: "#183B32",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Google Email */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      color: "#183B32",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Email Google (Tài khoản đăng nhập) <span style={{ color: "#E11D48" }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="VD: nguyenvana@gmail.com"
                    value={staffForm.email}
                    onChange={(e) =>
                      setStaffForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "9px",
                      border: "1.5px solid #D7EAE1",
                      fontSize: "0.88rem",
                      color: "#183B32",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Phone & Role Select row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        color: "#183B32",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Số điện thoại / Zalo
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 0988.xxx.xxx"
                      value={staffForm.phone}
                      onChange={(e) =>
                        setStaffForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "9px",
                        border: "1.5px solid #D7EAE1",
                        fontSize: "0.88rem",
                        color: "#183B32",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        color: "#183B32",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Chọn Vai Trò Quản Trị <span style={{ color: "#E11D48" }}>*</span>
                    </label>
                    <select
                      value={staffForm.roleId}
                      onChange={(e) =>
                        setStaffForm((prev) => ({ ...prev, roleId: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "9px",
                        border: "1.5px solid #D7EAE1",
                        fontSize: "0.88rem",
                        color: "#183B32",
                        outline: "none",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        background: "#FFFFFF",
                      }}
                    >
                      {rolesList.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      color: "#183B32",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Ghi chú nhiệm vụ
                  </label>
                  <textarea
                    rows={2}
                    placeholder="VD: Phụ trách hỗ trợ khách hàng và kiểm duyệt nội dung..."
                    value={staffForm.notes}
                    onChange={(e) =>
                      setStaffForm((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "9px",
                      border: "1.5px solid #D7EAE1",
                      fontSize: "0.88rem",
                      color: "#183B32",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "9px",
                    border: "1px solid #D7EAE1",
                    background: "#FFFFFF",
                    color: "#607F74",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1.35rem",
                    borderRadius: "9px",
                    border: "none",
                    background: "#237A60",
                    color: "#FFFFFF",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(35, 122, 96, 0.25)",
                  }}
                >
                  Thêm Nhân Viên Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Chỉnh Sửa Nhân Viên ─────────────────────────────────────── */}
      {isEditStaffOpen && editingStaff && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditStaffOpen(false);
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "18px",
              width: "100%",
              maxWidth: 520,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              border: "1.5px solid #D7EAE1",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1.5px solid #E5F0EA",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#F4FBF8",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    background: "#E8F8F1",
                    color: "#237A60",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#183B32" }}>
                    Chỉnh Sửa Vai Trò &amp; Thông Tin
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#607F74" }}>
                    {editingStaff.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditStaffOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  border: "1px solid #D7EAE1",
                  background: "#FFFFFF",
                  color: "#607F74",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditStaffSubmit} style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Full name */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      color: "#183B32",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={editingStaff.name}
                    onChange={(e) =>
                      setEditingStaff((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "9px",
                      border: "1.5px solid #D7EAE1",
                      fontSize: "0.88rem",
                      color: "#183B32",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Phone & Role */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        color: "#183B32",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={editingStaff.phone || ""}
                      onChange={(e) =>
                        setEditingStaff((prev) =>
                          prev ? { ...prev, phone: e.target.value } : null
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "9px",
                        border: "1.5px solid #D7EAE1",
                        fontSize: "0.88rem",
                        color: "#183B32",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        color: "#183B32",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Vai Trò Cấp Quyền
                    </label>
                    <select
                      disabled={editingStaff.isPermanent}
                      value={editingStaff.roleId}
                      onChange={(e) =>
                        setEditingStaff((prev) =>
                          prev ? { ...prev, roleId: e.target.value } : null
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "9px",
                        border: "1.5px solid #D7EAE1",
                        fontSize: "0.88rem",
                        color: "#183B32",
                        outline: "none",
                        boxSizing: "border-box",
                        cursor: editingStaff.isPermanent ? "not-allowed" : "pointer",
                        background: editingStaff.isPermanent ? "#F1F5F9" : "#FFFFFF",
                      }}
                    >
                      {rolesList.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Toggle */}
                {!editingStaff.isPermanent && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        color: "#183B32",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Trạng thái tài khoản
                    </label>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          cursor: "pointer",
                          fontSize: "0.86rem",
                        }}
                      >
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={editingStaff.status === "active"}
                          onChange={() =>
                            setEditingStaff((prev) =>
                              prev ? { ...prev, status: "active" } : null
                            )
                          }
                        />
                        <span>Đang hoạt động (Cho phép đăng nhập)</span>
                      </label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          cursor: "pointer",
                          fontSize: "0.86rem",
                          color: "#DC2626",
                        }}
                      >
                        <input
                          type="radio"
                          name="status"
                          value="locked"
                          checked={editingStaff.status === "locked"}
                          onChange={() =>
                            setEditingStaff((prev) =>
                              prev ? { ...prev, status: "locked" } : null
                            )
                          }
                        />
                        <span>Tạm khóa truy cập</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      color: "#183B32",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Ghi chú
                  </label>
                  <textarea
                    rows={2}
                    value={editingStaff.notes || ""}
                    onChange={(e) =>
                      setEditingStaff((prev) =>
                        prev ? { ...prev, notes: e.target.value } : null
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "9px",
                      border: "1.5px solid #D7EAE1",
                      fontSize: "0.88rem",
                      color: "#183B32",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsEditStaffOpen(false)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "9px",
                    border: "1px solid #D7EAE1",
                    background: "#FFFFFF",
                    color: "#607F74",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1.35rem",
                    borderRadius: "9px",
                    border: "none",
                    background: "#237A60",
                    color: "#FFFFFF",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(35, 122, 96, 0.25)",
                  }}
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Tạo / Chỉnh Sửa Vai Trò ─────────────────────────────────── */}
      {isRoleModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsRoleModalOpen(false);
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "18px",
              width: "100%",
              maxWidth: 620,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              border: "1.5px solid #D7EAE1",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1.5px solid #E5F0EA",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#F4FBF8",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    background: "#E8F8F1",
                    color: "#237A60",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#183B32" }}>
                    {editingRole ? "Chỉnh Sửa Vai Trò Quản Trị" : "Tạo Vai Trò Mới"}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#607F74" }}>
                    Định nghĩa tên vai trò và lựa chọn quyền hạn được cấp
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  border: "1px solid #D7EAE1",
                  background: "#FFFFFF",
                  color: "#607F74",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form
              onSubmit={handleRoleSubmit}
              style={{
                padding: "1.5rem",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Role Name */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    color: "#183B32",
                    marginBottom: "0.4rem",
                  }}
                >
                  Tên vai trò <span style={{ color: "#E11D48" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trưởng Nhóm Marketing, Kế Toán Bán Hàng..."
                  value={roleForm.name}
                  onChange={(e) =>
                    setRoleForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "9px",
                    border: "1.5px solid #D7EAE1",
                    fontSize: "0.88rem",
                    color: "#183B32",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    color: "#183B32",
                    marginBottom: "0.4rem",
                  }}
                >
                  Mô tả trách nhiệm vai trò
                </label>
                <input
                  type="text"
                  placeholder="VD: Phụ trách quản lý chiến dịch bài viết và tối ưu sản phẩm..."
                  value={roleForm.description}
                  onChange={(e) =>
                    setRoleForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "9px",
                    border: "1.5px solid #D7EAE1",
                    fontSize: "0.88rem",
                    color: "#183B32",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Color Presets */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    color: "#183B32",
                    marginBottom: "0.45rem",
                  }}
                >
                  Màu sắc thẻ nhận diện
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = roleForm.color === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() =>
                          setRoleForm((prev) => ({ ...prev, color: preset.value }))
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          padding: "0.35rem 0.75rem",
                          borderRadius: "8px",
                          border: isSelected
                            ? `2px solid ${preset.value}`
                            : "1px solid #E2E8F0",
                          background: isSelected ? `${preset.value}15` : "#FFFFFF",
                          color: isSelected ? preset.value : "#475569",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: preset.value,
                          }}
                        />
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Permissions Checklist */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.84rem",
                    fontWeight: 700,
                    color: "#183B32",
                    marginBottom: "0.55rem",
                  }}
                >
                  Danh sách quyền hạn được cấp <span style={{ color: "#E11D48" }}>*</span>
                </label>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.55rem",
                    background: "#F9FDFB",
                    padding: "0.85rem",
                    borderRadius: "12px",
                    border: "1.5px solid #D7EAE1",
                  }}
                >
                  {availablePermissions.map((perm) => {
                    const isChecked = roleForm.permissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.65rem",
                          padding: "0.6rem 0.75rem",
                          borderRadius: "8px",
                          background: isChecked ? "#E8F8F1" : "#FFFFFF",
                          border: isChecked ? "1px solid #B9DCCD" : "1px solid #E5F0EA",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm.key)}
                          style={{
                            marginTop: "3px",
                            accentColor: "#237A60",
                            cursor: "pointer",
                          }}
                        />
                        <div style={{ lineHeight: 1.3 }}>
                          <div
                            style={{
                              fontSize: "0.86rem",
                              fontWeight: 700,
                              color: isChecked ? "#183B32" : "#334155",
                            }}
                          >
                            {perm.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: isChecked ? "#237A60" : "#64748B",
                              marginTop: "2px",
                            }}
                          >
                            {perm.desc}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  paddingTop: "0.75rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "9px",
                    border: "1px solid #D7EAE1",
                    background: "#FFFFFF",
                    color: "#607F74",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1.35rem",
                    borderRadius: "9px",
                    border: "none",
                    background: "#237A60",
                    color: "#FFFFFF",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(35, 122, 96, 0.25)",
                  }}
                >
                  {editingRole ? "Cập Nhật Vai Trò" : "Tạo Vai Trò Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
