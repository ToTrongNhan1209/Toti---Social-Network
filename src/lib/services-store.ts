/**
 * lib/services-store.ts
 * Server-side persistent file storage for Services CRUD
 * Stored in src/data/services.json with memory caching & atomic file writes
 */

import fs from "fs";
import path from "path";
import { services as defaultServices, type Service, type Platform, type ServiceCategory } from "./data";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");

// In-memory cache for ultra-fast access
let cachedServices: Service[] | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Get all services (from cache, file, or default catalog)
 */
export function getAllServices(): Service[] {
  if (cachedServices) {
    return cachedServices;
  }

  try {
    ensureDataDirectory();
    if (fs.existsSync(SERVICES_FILE)) {
      const data = fs.readFileSync(SERVICES_FILE, "utf-8");
      const parsed = JSON.parse(data) as Service[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedServices = parsed;
        return cachedServices;
      }
    }
  } catch (err) {
    console.error("Error reading services.json, falling back to default services:", err);
  }

  // Seed default services if file does not exist or is empty
  cachedServices = [...defaultServices];
  saveServicesToFile(cachedServices);
  return cachedServices;
}

/**
 * Atomic write to services.json
 */
function saveServicesToFile(services: Service[]): boolean {
  cachedServices = services;
  try {
    ensureDataDirectory();
    const tempFile = `${SERVICES_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(services, null, 2), "utf-8");
    fs.renameSync(tempFile, SERVICES_FILE);
    return true;
  } catch {
    try {
      fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2), "utf-8");
      return true;
    } catch (fallbackErr) {
      console.error("Failed to save services to file:", fallbackErr);
      return false;
    }
  }
}

/**
 * Get single service by ID
 */
export function getServiceById(id: string): Service | undefined {
  const all = getAllServices();
  return all.find((s) => s.id === id);
}

/**
 * Platform color helper
 */
export function getPlatformColor(platform: Platform): string {
  switch (platform) {
    case "facebook":
      return "#1877F2";
    case "tiktok":
      return "#FF0050";
    case "instagram":
      return "#E1306C";
    case "youtube":
      return "#FF0000";
    case "threads":
      return "#000000";
    case "telegram":
      return "#229ED9";
    default:
      return "#237A60";
  }
}

/**
 * Create a new service
 */
export function createService(newServiceData: Partial<Service>): Service {
  const current = getAllServices();

  const platform = (newServiceData.platform || "facebook") as Platform;
  const category = (newServiceData.category || "growth") as ServiceCategory;
  const platformColor = getPlatformColor(platform);

  // Generate ID if not provided
  let id = newServiceData.id?.trim();
  if (!id) {
    const slugPrefix = platform.slice(0, 2);
    id = `${slugPrefix}-${Date.now().toString(36)}`;
  } else {
    // If id already exists, append unique suffix
    if (current.some((s) => s.id === id)) {
      id = `${id}-${Date.now().toString(36)}`;
    }
  }

  const newService: Service = {
    id,
    platform,
    category,
    title: newServiceData.title || "Dịch vụ mạng xã hội mới",
    description: newServiceData.description || "Mô tả chi tiết dịch vụ đang được cập nhật...",
    icon: newServiceData.icon || "⚡",
    color: newServiceData.color || platformColor,
    gradient: newServiceData.gradient || "from-emerald-600 to-teal-800",
    features: Array.isArray(newServiceData.features) && newServiceData.features.length > 0
      ? newServiceData.features
      : ["Cam kết chất lượng 100%", "Bảo hành 30 ngày bù tụt", "Hỗ trợ kỹ thuật 24/7"],
    startingPrice: Number(newServiceData.startingPrice) || 20000,
    unit: newServiceData.unit || "1.000 lượt",
    popular: Boolean(newServiceData.popular),
  };

  const updated = [newService, ...current];
  saveServicesToFile(updated);
  return newService;
}

/**
 * Update an existing service
 */
export function updateService(id: string, updates: Partial<Service>): Service | null {
  const current = getAllServices();
  const index = current.findIndex((s) => s.id === id);

  if (index === -1) {
    return null;
  }

  const existing = current[index];
  const platform = (updates.platform || existing.platform) as Platform;
  const platformColor = updates.color || getPlatformColor(platform);

  const updatedService: Service = {
    ...existing,
    ...updates,
    id: existing.id, // Preserve ID
    platform,
    color: platformColor,
    startingPrice: updates.startingPrice !== undefined ? Number(updates.startingPrice) : existing.startingPrice,
    popular: updates.popular !== undefined ? Boolean(updates.popular) : existing.popular,
  };

  current[index] = updatedService;
  saveServicesToFile([...current]);
  return updatedService;
}

/**
 * Delete a service
 */
export function deleteService(id: string): boolean {
  const current = getAllServices();
  const initialLength = current.length;
  const filtered = current.filter((s) => s.id !== id);

  if (filtered.length === initialLength) {
    return false;
  }

  saveServicesToFile(filtered);
  return true;
}

/**
 * Reset all services back to default catalog
 */
export function resetServicesToDefault(): Service[] {
  const resetList = [...defaultServices];
  saveServicesToFile(resetList);
  return resetList;
}
