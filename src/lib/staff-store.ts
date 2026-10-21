/**
 * lib/staff-store.ts
 * Staff Members & Roles Management Store
 * Supports atomic disk persistence with memory fallback for Cloudflare Workers / Edge runtime.
 */

export type PermissionKey =
  | "manage_staff"       // Quản lý nhân viên & Phân quyền
  | "manage_services"    // Quản lý dịch vụ MXH & Bảng giá
  | "manage_blog"        // Quản lý bài viết blog
  | "manage_comments"    // Quản lý và duyệt bình luận
  | "view_analytics"     // Xem doanh thu, biểu đồ & thống kê
  | "manage_contacts"    // Xem và xử lý yêu cầu liên hệ / tư vấn
  | "manage_settings";   // Cài đặt website, thông tin & hồ sơ admin

export interface AdminRole {
  id: string;               // e.g. "super_admin", "content_manager", "role-xxx"
  name: string;             // e.g. "Super Administrator", "Quản Lý Nội Dung"
  description: string;
  color: string;            // hex color for badge (e.g. "#237A60", "#2563EB")
  isSystem?: boolean;       // If true, cannot be deleted (e.g. super_admin)
  permissions: PermissionKey[];
  createdAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;            // Google email used for login
  phone?: string;
  avatar?: string;
  roleId: string;           // Refers to AdminRole.id
  status: "active" | "locked";
  isPermanent?: boolean;    // Tô Trọng Nhân (totrongnhan1209@gmail.com) is true -> cannot delete or lock
  notes?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export const AVAILABLE_PERMISSIONS: { key: PermissionKey; label: string; desc: string }[] = [
  {
    key: "manage_staff",
    label: "Quản lý nhân sự & Phân quyền",
    desc: "Thêm nhân viên mới, phân vai trò, cấp quyền và khóa tài khoản",
  },
  {
    key: "manage_services",
    label: "Quản lý dịch vụ MXH",
    desc: "Chỉnh sửa, tạo mới và xóa dịch vụ, các gói bảng giá",
  },
  {
    key: "manage_blog",
    label: "Quản lý bài viết Blog",
    desc: "Soạn thảo bài viết, đăng tải tin tức và chỉnh sửa SEO",
  },
  {
    key: "manage_comments",
    label: "Kiểm duyệt bình luận",
    desc: "Xem và phê duyệt hoặc gỡ bỏ bình luận của độc giả",
  },
  {
    key: "view_analytics",
    label: "Xem biểu đồ & Thống kê",
    desc: "Xem doanh thu, tăng trưởng và biểu đồ lưu lượng truy cập",
  },
  {
    key: "manage_contacts",
    label: "Quản lý yêu cầu tư vấn",
    desc: "Xem danh sách khách hàng gửi yêu cầu hỗ trợ & liên hệ",
  },
  {
    key: "manage_settings",
    label: "Cấu hình website & Admin",
    desc: "Chỉnh sửa hồ sơ admin Tô Trọng Nhân, hotline, Zalo và giao diện",
  },
];

const DEFAULT_ROLES: AdminRole[] = [
  {
    id: "super_admin",
    name: "Super Administrator",
    description: "Toàn quyền quản trị cao nhất hệ thống, xem và thay đổi toàn bộ chức năng",
    color: "#237A60",
    isSystem: true,
    permissions: [
      "manage_staff",
      "manage_services",
      "manage_blog",
      "manage_comments",
      "view_analytics",
      "manage_contacts",
      "manage_settings",
    ],
    createdAt: "2026-01-01",
  },
  {
    id: "service_manager",
    name: "Quản Lý Dịch Vụ & Bảng Giá",
    description: "Quản lý bảng giá dịch vụ mạng xã hội, xử lý đơn hàng và xem thống kê",
    color: "#D97706",
    isSystem: true,
    permissions: ["manage_services", "view_analytics", "manage_contacts"],
    createdAt: "2026-01-01",
  },
  {
    id: "content_manager",
    name: "Quản Lý Nội Dung & Blog",
    description: "Soạn thảo bài viết mới, chỉnh sửa nội dung bài đăng và duyệt bình luận",
    color: "#2563EB",
    isSystem: true,
    permissions: ["manage_blog", "manage_comments"],
    createdAt: "2026-01-01",
  },
  {
    id: "support_staff",
    name: "Nhân Viên Hỗ Trợ & CSKH",
    description: "Xem danh sách khách hàng liên hệ và hỗ trợ giải đáp thắc mắc",
    color: "#7C3AED",
    isSystem: true,
    permissions: ["manage_contacts", "manage_comments"],
    createdAt: "2026-01-01",
  },
];

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: "staff-totrongnhan",
    name: "Tô Trọng Nhân",
    email: "totrongnhan1209@gmail.com",
    phone: "0971.234.567",
    avatar: "/logo/final-avatar.png",
    roleId: "super_admin",
    status: "active",
    isPermanent: true,
    notes: "Nhà sáng lập, Trưởng ban quản trị cao nhất website ToTrongNhan.",
    createdAt: "2026-01-01",
    lastLoginAt: "Vừa truy cập",
  },
  {
    id: "staff-quan-ly-dich-vu",
    name: "Quản Trị Viên Dịch Vụ",
    email: "totrongnhan.vn@gmail.com",
    phone: "0988.765.432",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    roleId: "service_manager",
    status: "active",
    isPermanent: false,
    notes: "Phụ trách điều phối các gói dịch vụ MXH Facebook, TikTok & Instagram.",
    createdAt: "2026-02-15",
    lastLoginAt: "Hôm nay lúc 09:15",
  },
  {
    id: "staff-bien-tap-vien",
    name: "Biên Tập Viên Tin Tức",
    email: "totro@gmail.com",
    phone: "0912.333.888",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    roleId: "content_manager",
    status: "active",
    isPermanent: false,
    notes: "Phụ trách viết bài chia sẻ mẹo công nghệ & tối ưu SEO website.",
    createdAt: "2026-03-01",
    lastLoginAt: "Hôm qua lúc 16:40",
  },
];

// In-memory cache
let cachedRoles: AdminRole[] | null = null;
let cachedStaff: StaffMember[] | null = null;

function getNodeEnv() {
  try {
    if (typeof process !== "undefined" && process.versions && process.versions.node) {
      // Dynamic evaluation prevents Next.js edge packager from bundling Node modules
      const req = new Function("m", "return require(m)");
      const fs = req("fs");
      const path = req("path");
      const dataDir = path.join(process.cwd(), "src", "data");
      const rolesFile = path.join(dataDir, "roles.json");
      const staffFile = path.join(dataDir, "staff.json");
      return { fs, dataDir, rolesFile, staffFile };
    }
  } catch {
    // Edge or serverless runtime without node:fs
  }
  return null;
}

// ── ROLES METHODS ──────────────────────────────────────────────────────────

export function getAllRoles(): AdminRole[] {
  if (cachedRoles) return cachedRoles;

  const nodeEnv = getNodeEnv();
  if (nodeEnv) {
    try {
      if (nodeEnv.fs.existsSync(nodeEnv.rolesFile)) {
        const content = nodeEnv.fs.readFileSync(nodeEnv.rolesFile, "utf-8");
        const parsed = JSON.parse(content) as AdminRole[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedRoles = parsed;
          return cachedRoles;
        }
      }
    } catch {
      // Fallback
    }
  }

  cachedRoles = [...DEFAULT_ROLES];
  saveRolesToFile(cachedRoles);
  return cachedRoles;
}

export function getRoleById(id: string): AdminRole | undefined {
  return getAllRoles().find((r) => r.id === id);
}

function saveRolesToFile(roles: AdminRole[]): boolean {
  cachedRoles = roles;
  const nodeEnv = getNodeEnv();
  if (nodeEnv) {
    try {
      if (!nodeEnv.fs.existsSync(nodeEnv.dataDir)) {
        nodeEnv.fs.mkdirSync(nodeEnv.dataDir, { recursive: true });
      }
      const tempFile = `${nodeEnv.rolesFile}.tmp`;
      nodeEnv.fs.writeFileSync(tempFile, JSON.stringify(roles, null, 2), "utf-8");
      nodeEnv.fs.renameSync(tempFile, nodeEnv.rolesFile);
      return true;
    } catch {
      // Ignore
    }
  }
  return false;
}

export function addRole(roleData: Omit<AdminRole, "id" | "createdAt">): AdminRole {
  const roles = getAllRoles();
  const slug = roleData.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  
  const id = `role_${slug}_${Date.now().toString(36)}`;

  const newRole: AdminRole = {
    ...roleData,
    id,
    isSystem: false,
    createdAt: new Date().toISOString().split("T")[0],
  };

  roles.push(newRole);
  saveRolesToFile(roles);
  return newRole;
}

export function updateRole(
  id: string,
  updates: Partial<Omit<AdminRole, "id" | "isSystem" | "createdAt">>
): AdminRole | null {
  const roles = getAllRoles();
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) return null;

  roles[index] = {
    ...roles[index],
    ...updates,
  };

  saveRolesToFile(roles);
  return roles[index];
}

export function deleteRole(id: string): { success: boolean; message?: string } {
  const roles = getAllRoles();
  const target = roles.find((r) => r.id === id);

  if (!target) {
    return { success: false, message: "Không tìm thấy vai trò cần xóa" };
  }

  if (target.isSystem || target.id === "super_admin") {
    return { success: false, message: "Không thể xóa vai trò mặc định của hệ thống" };
  }

  // Check if any staff is using this role
  const staff = getAllStaff();
  const staffUsing = staff.filter((s) => s.roleId === id);
  if (staffUsing.length > 0) {
    return {
      success: false,
      message: `Không thể xóa vì đang có ${staffUsing.length} nhân sự thuộc vai trò này. Vui lòng chuyển vai trò của họ trước.`,
    };
  }

  const filtered = roles.filter((r) => r.id !== id);
  saveRolesToFile(filtered);
  return { success: true };
}

// ── STAFF METHODS ──────────────────────────────────────────────────────────

export function getAllStaff(): StaffMember[] {
  if (cachedStaff) return cachedStaff;

  const nodeEnv = getNodeEnv();
  if (nodeEnv) {
    try {
      if (nodeEnv.fs.existsSync(nodeEnv.staffFile)) {
        const content = nodeEnv.fs.readFileSync(nodeEnv.staffFile, "utf-8");
        const parsed = JSON.parse(content) as StaffMember[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedStaff = parsed;
          return cachedStaff;
        }
      }
    } catch {
      // Fallback
    }
  }

  cachedStaff = [...DEFAULT_STAFF];
  saveStaffToFile(cachedStaff);
  return cachedStaff;
}

export function getStaffById(id: string): StaffMember | undefined {
  return getAllStaff().find((s) => s.id === id);
}

export function getStaffByEmail(email: string): StaffMember | undefined {
  const clean = email.trim().toLowerCase();
  return getAllStaff().find((s) => s.email.trim().toLowerCase() === clean);
}

function saveStaffToFile(staff: StaffMember[]): boolean {
  cachedStaff = staff;
  const nodeEnv = getNodeEnv();
  if (nodeEnv) {
    try {
      if (!nodeEnv.fs.existsSync(nodeEnv.dataDir)) {
        nodeEnv.fs.mkdirSync(nodeEnv.dataDir, { recursive: true });
      }
      const tempFile = `${nodeEnv.staffFile}.tmp`;
      nodeEnv.fs.writeFileSync(tempFile, JSON.stringify(staff, null, 2), "utf-8");
      nodeEnv.fs.renameSync(tempFile, nodeEnv.staffFile);
      return true;
    } catch {
      // Edge fallback
    }
  }
  return false;
}

export function addStaff(
  staffData: Omit<StaffMember, "id" | "createdAt">
): StaffMember {
  const staffList = getAllStaff();
  const cleanEmail = staffData.email.trim().toLowerCase();

  const existing = staffList.find((s) => s.email.trim().toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error(`Email "${cleanEmail}" đã tồn tại trong danh sách nhân viên.`);
  }

  const id = `staff_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

  const newStaff: StaffMember = {
    ...staffData,
    id,
    email: cleanEmail,
    createdAt: new Date().toISOString().split("T")[0],
    lastLoginAt: "Chưa đăng nhập",
    avatar:
      staffData.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        staffData.name
      )}&background=237A60&color=fff&size=150`,
  };

  staffList.push(newStaff);
  saveStaffToFile(staffList);
  return newStaff;
}

export function updateStaff(
  id: string,
  updates: Partial<Omit<StaffMember, "id" | "createdAt">>
): StaffMember | null {
  const staffList = getAllStaff();
  const index = staffList.findIndex((s) => s.id === id);
  if (index === -1) return null;

  // Protect Tô Trọng Nhân (isPermanent)
  if (staffList[index].isPermanent) {
    if (updates.status === "locked") {
      throw new Error("Không thể khóa tài khoản của Super Admin sáng lập Tô Trọng Nhân.");
    }
    if (updates.roleId && updates.roleId !== "super_admin") {
      throw new Error("Không thể hạ quyền Super Admin của Tô Trọng Nhân.");
    }
  }

  staffList[index] = {
    ...staffList[index],
    ...updates,
    ...(updates.email ? { email: updates.email.trim().toLowerCase() } : {}),
  };

  saveStaffToFile(staffList);
  return staffList[index];
}

export function deleteStaff(id: string): { success: boolean; message?: string } {
  const staffList = getAllStaff();
  const target = staffList.find((s) => s.id === id);

  if (!target) {
    return { success: false, message: "Không tìm thấy nhân viên cần xóa" };
  }

  if (target.isPermanent || target.email.toLowerCase() === "totrongnhan1209@gmail.com") {
    return {
      success: false,
      message: "Không thể xóa Super Admin sáng lập viên Tô Trọng Nhân.",
    };
  }

  const filtered = staffList.filter((s) => s.id !== id);
  saveStaffToFile(filtered);
  return { success: true };
}

/**
 * Check if an email is authorized and has an active status in Staff Store
 */
export function isAuthorizedStaffEmail(email: string): boolean {
  const staff = getStaffByEmail(email);
  if (staff) {
    return staff.status === "active";
  }
  return false;
}
