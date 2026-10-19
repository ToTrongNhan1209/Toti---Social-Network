/**
 * lib/profile-store.ts
 * Server-side persistent storage for Admin Profile
 * File-backed at src/data/admin-profile.json with in-memory caching
 */

import fs from "fs";
import path from "path";

export interface AdminProfile {
  name: string;
  nickname: string;
  title: string;
  email: string;
  phone: string;
  zalo: string;
  role: string;
  avatar: string;
  coverImage: string;
  bio: string;
  address: string;
  social: {
    facebook: string;
    tiktok: string;
    instagram: string;
    youtube: string;
    telegram: string;
  };
  security: {
    twoFactorEnabled: boolean;
    authProvider: string;
    lastLoginAt: string;
    ipAddress?: string;
  };
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const PROFILE_FILE = path.join(DATA_DIR, "admin-profile.json");

let cachedProfile: AdminProfile | null = null;

const DEFAULT_PROFILE: AdminProfile = {
  name: "Tô Trọng Nhân",
  nickname: "Toti",
  title: "Founder & Head of Social Strategy",
  email: "totrongnhan1209@gmail.com",
  phone: "0981 587 469",
  zalo: "0981587469",
  role: "Quản trị viên cấp cao (Super Admin)",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop",
  bio: "Chuyên gia phát triển tương tác và chiến lược mạng xã hội đa nền tảng với hơn 5 năm kinh nghiệm. Phụ trách quản lý trực tiếp hệ sinh thái ToTrongNhan và giải pháp tăng trưởng thương hiệu cho hàng chục nghìn nhà sáng tạo nội dung, doanh nghiệp và KOLs.",
  address: "TP. Hồ Chí Minh, Việt Nam",
  social: {
    facebook: "https://facebook.com/totrongnhan",
    tiktok: "https://tiktok.com/@totrongnhan",
    instagram: "https://instagram.com/totrongnhan",
    youtube: "https://youtube.com/@totrongnhan",
    telegram: "https://t.me/totrongnhan",
  },
  security: {
    twoFactorEnabled: true,
    authProvider: "Google OAuth 2.0 (Verified)",
    lastLoginAt: new Date().toISOString(),
  },
  updatedAt: new Date().toISOString(),
};

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Get the current admin profile
 */
export function getAdminProfile(): AdminProfile {
  if (cachedProfile) {
    return cachedProfile;
  }

  try {
    ensureDataDirectory();
    if (fs.existsSync(PROFILE_FILE)) {
      const data = fs.readFileSync(PROFILE_FILE, "utf-8");
      const parsed = JSON.parse(data) as AdminProfile;
      if (parsed && parsed.email) {
        cachedProfile = parsed;
        return cachedProfile;
      }
    }
  } catch (err) {
    console.error("Error reading admin-profile.json:", err);
  }

  // Fallback to default
  cachedProfile = { ...DEFAULT_PROFILE };
  saveAdminProfileToFile(cachedProfile);
  return cachedProfile;
}

/**
 * Save profile to disk atomically
 */
function saveAdminProfileToFile(profile: AdminProfile): boolean {
  cachedProfile = profile;
  try {
    ensureDataDirectory();
    const tempFile = `${PROFILE_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(profile, null, 2), "utf-8");
    fs.renameSync(tempFile, PROFILE_FILE);
    return true;
  } catch {
    try {
      fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2), "utf-8");
      return true;
    } catch (fallbackErr) {
      console.error("Failed to save admin profile:", fallbackErr);
      return false;
    }
  }
}

/**
 * Update admin profile with partial fields
 */
export function updateAdminProfile(updates: Partial<AdminProfile>): AdminProfile {
  const current = getAdminProfile();
  const updated: AdminProfile = {
    ...current,
    ...updates,
    social: {
      ...current.social,
      ...(updates.social || {}),
    },
    security: {
      ...current.security,
      ...(updates.security || {}),
    },
    updatedAt: new Date().toISOString(),
  };

  saveAdminProfileToFile(updated);
  return updated;
}
