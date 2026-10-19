"use client";

/**
 * components/admin/AdminWeatherWidget.tsx
 * Real-time Weather & Geolocation Widget for Admin CMS.
 * Uses browser GPS Geolocation, IP Auto-detection (Gia Lai / local ISP),
 * manual province switcher, and Open-Meteo + BigDataCloud APIs.
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  CloudSun,
  Wind,
  Droplets,
  MapPin,
  RotateCw,
  Thermometer,
  Compass,
  Navigation,
  Check,
  Search,
  X,
} from "lucide-react";

export interface WeatherData {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  weatherCode: number;
  conditionText: string;
  conditionEmoji: string;
  updatedAt: string;
  locationSource: "gps" | "ip" | "custom";
}

export interface LocationItem {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  badge?: string;
}

export const POPULAR_LOCATIONS: LocationItem[] = [
  {
    id: "gia-lai",
    name: "Gia Lai",
    region: "Tây Nguyên (TP. Pleiku)",
    latitude: 13.9833,
    longitude: 108.0,
    badge: "Khu vực của bạn",
  },
  {
    id: "binh-dinh",
    name: "Bình Định",
    region: "Duyên hải Nam Trung Bộ (Quy Nhơn)",
    latitude: 13.7833,
    longitude: 109.2167,
  },
  {
    id: "dak-lak",
    name: "Đắk Lắk",
    region: "Tây Nguyên (TP. Buôn Ma Thuột)",
    latitude: 12.6667,
    longitude: 108.05,
  },
  {
    id: "kon-tum",
    name: "Kon Tum",
    region: "Bắc Tây Nguyên",
    latitude: 14.35,
    longitude: 108.0,
  },
  {
    id: "lam-dong",
    name: "Lâm Đồng",
    region: "Tây Nguyên (TP. Đà Lạt)",
    latitude: 11.9404,
    longitude: 108.4583,
  },
  {
    id: "hcm",
    name: "TP. Hồ Chí Minh",
    region: "Đông Nam Bộ",
    latitude: 10.8231,
    longitude: 106.6297,
  },
  {
    id: "hanoi",
    name: "Hà Nội",
    region: "Thủ đô Hà Nội",
    latitude: 21.0285,
    longitude: 105.8542,
  },
  {
    id: "da-nang",
    name: "Đà Nẵng",
    region: "Miền Trung",
    latitude: 16.0544,
    longitude: 108.2022,
  },
  {
    id: "khanh-hoa",
    name: "Khánh Hòa",
    region: "TP. Nha Trang",
    latitude: 12.2388,
    longitude: 109.1967,
  },
  {
    id: "can-tho",
    name: "Cần Thơ",
    region: "Đồng bằng Sông Cửu Long",
    latitude: 10.0452,
    longitude: 105.7469,
  },
];

// Map WMO Weather Codes to Vietnamese Descriptions & Emojis
function getWeatherDetails(code: number, isDay: boolean): { text: string; emoji: string } {
  switch (code) {
    case 0:
      return {
        text: isDay ? "Trời quang đãng, nắng đẹp" : "Đêm quang đãng, không mây",
        emoji: isDay ? "☀️" : "🌙",
      };
    case 1:
      return {
        text: "Trời quang, nắng nhẹ",
        emoji: isDay ? "🌤️" : "✨",
      };
    case 2:
      return {
        text: "Mây rải rác, trời dịu",
        emoji: "⛅",
      };
    case 3:
      return {
        text: "Trời nhiều mây, âm u",
        emoji: "☁️",
      };
    case 45:
    case 48:
      return {
        text: "Có sương mù, tầm nhìn hạn chế",
        emoji: "🌫️",
      };
    case 51:
    case 53:
    case 55:
      return {
        text: "Mưa phùn bay nhẹ",
        emoji: "🌦️",
      };
    case 61:
    case 63:
    case 65:
      return {
        text: "Mưa rào diện rộng",
        emoji: "🌧️",
      };
    case 80:
    case 81:
    case 82:
      return {
        text: "Mưa rào nặng hạt từng cơn",
        emoji: "🌧️",
      };
    case 95:
    case 96:
    case 99:
      return {
        text: "Dông bão có sấm chớp giật",
        emoji: "⛈️",
      };
    default:
      return {
        text: "Thời tiết ổn định",
        emoji: "⛅",
      };
  }
}

export default function AdminWeatherWidget({
  variant = "compact",
}: {
  variant?: "compact" | "card";
}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch weather given latitude & longitude
  const fetchWeatherForCoords = useCallback(
    async (
      lat: number,
      lon: number,
      source: "gps" | "ip" | "custom",
      customName?: string,
      customRegion?: string
    ) => {
      try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m`;
        const weatherRes = await fetch(weatherUrl);
        const weatherJson = await weatherRes.json();

        if (!weatherJson.current) {
          throw new Error("Không nhận được dữ liệu thời tiết");
        }

        const curr = weatherJson.current;
        const details = getWeatherDetails(curr.weather_code, curr.is_day === 1);

        let locationName = customName || "Gia Lai";
        let regionName = customRegion || "Tây Nguyên (TP. Pleiku)";

        // Reverse geocode if not a custom fixed name
        if (!customName) {
          try {
            const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=vi`;
            const geoRes = await fetch(geoUrl);
            const geoJson = await geoRes.json();
            if (geoJson.city || geoJson.locality || geoJson.principalSubdivision) {
              locationName = geoJson.locality || geoJson.city || geoJson.principalSubdivision;
              regionName = geoJson.principalSubdivision || geoJson.countryName || "Việt Nam";
            }
          } catch {
            // Keep default
          }
        }

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        setError(null);
        setWeather({
          city: locationName,
          region: regionName,
          latitude: lat,
          longitude: lon,
          temperature: Math.round(curr.temperature_2m),
          apparentTemperature: Math.round(curr.apparent_temperature),
          humidity: Math.round(curr.relative_humidity_2m),
          windSpeed: Math.round(curr.wind_speed_10m),
          isDay: curr.is_day === 1,
          weatherCode: curr.weather_code,
          conditionText: details.text,
          conditionEmoji: details.emoji,
          updatedAt: timeStr,
          locationSource: source,
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Không thể tải thời tiết");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // Multi-tier location resolution: Saved -> GPS -> IP -> Default (Gia Lai)
  const resolveLocation = useCallback(
    async (isManual = false) => {
      if (isManual) {
        setRefreshing(true);
      }

      // Tier 1: Check user's explicitly saved custom location
      if (typeof window !== "undefined") {
        try {
          const savedStr = localStorage.getItem("totrongnhan_admin_weather_loc");
          if (savedStr) {
            const saved = JSON.parse(savedStr);
            if (saved.latitude && saved.longitude) {
              await fetchWeatherForCoords(
                saved.latitude,
                saved.longitude,
                "custom",
                saved.name,
                saved.region
              );
              return;
            }
          }
        } catch {
          // Ignore parse error
        }
      }

      // Tier 2: Try browser GPS Geolocation with high accuracy
      const getGps = (): Promise<{ lat: number; lon: number } | null> => {
        return new Promise((resolve) => {
          if (typeof navigator !== "undefined" && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
              () => resolve(null),
              { timeout: 5000, maximumAge: 60000, enableHighAccuracy: true }
            );
          } else {
            resolve(null);
          }
        });
      };

      const gpsCoords = await getGps();
      if (gpsCoords) {
        await fetchWeatherForCoords(gpsCoords.lat, gpsCoords.lon, "gps");
        return;
      }

      // Tier 3: If GPS is blocked or unavailable on PC, auto-detect via network IP
      try {
        const ipRes = await fetch("https://freeipapi.com/api/json");
        const ipJson = await ipRes.json();
        if (ipJson.latitude && ipJson.longitude) {
          const region = ipJson.regionName || ipJson.cityName || "Gia Lai";
          await fetchWeatherForCoords(
            ipJson.latitude,
            ipJson.longitude,
            "ip",
            region.includes("Gia Lai") ? "Gia Lai" : region,
            "Việt Nam"
          );
          return;
        }
      } catch {
        // Fallback to Tier 4
      }

      // Tier 4: Primary Default is Gia Lai (TP. Pleiku)
      const defaultLat = 13.9833;
      const defaultLon = 108.0;
      await fetchWeatherForCoords(
        defaultLat,
        defaultLon,
        "custom",
        "Gia Lai",
        "Tây Nguyên (TP. Pleiku)"
      );
    },
    [fetchWeatherForCoords]
  );

  // Initial load on mount
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (!cancelled) {
        resolveLocation(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [resolveLocation]);

  // Handle switching to a specific province
  const handleSelectLocation = (loc: LocationItem) => {
    try {
      localStorage.setItem("totrongnhan_admin_weather_loc", JSON.stringify(loc));
    } catch {
      // Ignore
    }
    setShowLocationModal(false);
    fetchWeatherForCoords(loc.latitude, loc.longitude, "custom", loc.name, loc.region);
  };

  // Reset to auto-detection (GPS / IP)
  const handleResetToAuto = () => {
    try {
      localStorage.removeItem("totrongnhan_admin_weather_loc");
    } catch {
      // Ignore
    }
    setShowLocationModal(false);
    resolveLocation(true);
  };

  // Filtered popular locations
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_LOCATIONS;
    const q = searchQuery.toLowerCase().trim();
    return POPULAR_LOCATIONS.filter(
      (loc) => loc.name.toLowerCase().includes(q) || loc.region.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // ── Variant A: Compact Topbar Badge ─────────────────────────────────────
  if (variant === "compact") {
    if (loading && !weather) {
      return (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.25rem 0.65rem",
            borderRadius: "999px",
            background: "#F4FBF8",
            border: "1px solid #D7EAE1",
            fontSize: "0.75rem",
            color: "#607F74",
          }}
        >
          <CloudSun size={13} style={{ color: "#237A60" }} />
          <span>Đang tải thời tiết...</span>
        </div>
      );
    }

    if (error && !weather) {
      return null;
    }

    if (!weather) return null;

    return (
      <>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.28rem 0.75rem",
            borderRadius: "999px",
            background: "#FFFFFF",
            border: "1px solid #B9DCCD",
            boxShadow: "0 1px 4px rgba(24, 59, 50, 0.04)",
            fontSize: "0.78rem",
            color: "#183B32",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onClick={() => setShowLocationModal(true)}
          title={`Vị trí: ${weather.city} (${weather.region}). Bấm để đổi tỉnh thành hoặc làm mới.`}
          className="hover:border-[#237A60] hover:bg-[#F4FBF8]"
        >
          <span style={{ fontSize: "1rem" }}>{weather.conditionEmoji}</span>
          <span style={{ fontWeight: 700, color: "#183B32" }}>{weather.city}</span>
          <span style={{ color: "#8EABA1" }}>•</span>
          <span style={{ fontWeight: 800, color: "#237A60" }}>{weather.temperature}°C</span>
          <RotateCw
            size={11}
            style={{
              color: "#607F74",
              marginLeft: "2px",
              animation: refreshing ? "spin 0.8s linear infinite" : "none",
            }}
          />
        </div>

        {/* Location Picker Modal */}
        {showLocationModal && (
          <LocationPickerModal
            locations={filteredLocations}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentCity={weather.city}
            onSelect={handleSelectLocation}
            onResetAuto={handleResetToAuto}
            onClose={() => setShowLocationModal(false)}
          />
        )}
      </>
    );
  }

  // ── Variant B: Detailed Card on Overview Tab ───────────────────────────
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FFFFFF 0%, #F4FBF8 100%)",
        border: "1.5px solid #B9DCCD",
        borderRadius: "20px",
        padding: "1.75rem",
        boxShadow: "0 4px 20px rgba(24, 59, 50, 0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Blob */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(166, 228, 209, 0.35) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.25rem",
          position: "relative",
          zIndex: 1,
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                background: "#E8F8F1",
                border: "1px solid #B9DCCD",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#237A60",
                textTransform: "uppercase",
              }}
            >
              <Compass size={12} /> Thời Tiết &amp; Vị Trí Hiện Tại
            </span>

            {weather?.locationSource === "gps" && (
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#237A60",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px",
                  background: "#E8F8F1",
                  border: "1px solid #B9DCCD",
                }}
              >
                ● GPS Trực Tiếp
              </span>
            )}

            {weather?.locationSource === "ip" && (
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#0284C7",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px",
                  background: "#E0F2FE",
                  border: "1px solid #BAE6FD",
                }}
              >
                ● Tự Động Qua IP (Gia Lai)
              </span>
            )}

            {weather?.locationSource === "custom" && (
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#237A60",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px",
                  background: "#E8F8F1",
                  border: "1px solid #B9DCCD",
                }}
              >
                ● Vị Trí Cố Định
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.35rem" }}>
            <MapPin size={20} style={{ color: "#237A60" }} />
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#183B32", margin: 0 }}>
              {weather ? `${weather.city}, ${weather.region}` : "Đang xác định vị trí Gia Lai..."}
            </h3>
          </div>
        </div>

        {/* Action Buttons: Switch Location + Refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "10px",
              border: "1.5px solid #237A60",
              background: "#E8F8F1",
              color: "#237A60",
              fontSize: "0.78rem",
              fontWeight: 800,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Navigation size={13} />
            <span>Đổi Vị Trí</span>
          </button>

          <button
            type="button"
            onClick={() => resolveLocation(true)}
            disabled={refreshing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "10px",
              border: "1px solid #B9DCCD",
              background: "#FFFFFF",
              color: "#237A60",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: refreshing ? "not-allowed" : "pointer",
              boxShadow: "0 2px 6px rgba(24, 59, 50, 0.04)",
            }}
            title="Làm mới lại dữ liệu thời tiết"
          >
            <RotateCw size={13} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }} />
            <span>{refreshing ? "Đang tải..." : "Làm mới"}</span>
          </button>
        </div>
      </div>

      {loading && !weather ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#607F74" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>⛅</div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Đang kết nối trạm thời tiết Gia Lai...</div>
        </div>
      ) : weather ? (
        <div>
          {/* Main Temp & Condition */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              paddingBottom: "1.25rem",
              borderBottom: "1px solid #D7EAE1",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  fontSize: "3rem",
                  width: 72,
                  height: 72,
                  borderRadius: "18px",
                  background: "#FFFFFF",
                  border: "1px solid #B9DCCD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(24, 59, 50, 0.05)",
                }}
              >
                {weather.conditionEmoji}
              </div>
              <div>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#183B32", lineHeight: 1 }}>
                  {weather.temperature}°C
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#237A60", marginTop: "4px" }}>
                  {weather.conditionText}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#607F74" }}>
                  Cảm giác thực tế: <strong>{weather.apparentTemperature}°C</strong>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right", fontSize: "0.78rem", color: "#607F74" }}>
              <div>
                Cập nhật: <strong style={{ color: "#183B32" }}>{weather.updatedAt}</strong>
              </div>
              <div style={{ marginTop: "2px", fontSize: "0.74rem" }}>
                {weather.latitude.toFixed(2)}°N, {weather.longitude.toFixed(2)}°E
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #D7EAE1",
                borderRadius: "12px",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <Droplets size={20} style={{ color: "#0EA5E9" }} />
              <div>
                <div style={{ fontSize: "0.72rem", color: "#607F74" }}>Độ ẩm</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#183B32" }}>
                  {weather.humidity}%
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #D7EAE1",
                borderRadius: "12px",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <Wind size={20} style={{ color: "#237A60" }} />
              <div>
                <div style={{ fontSize: "0.72rem", color: "#607F74" }}>Tốc độ gió</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#183B32" }}>
                  {weather.windSpeed} km/h
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #D7EAE1",
                borderRadius: "12px",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <Thermometer size={20} style={{ color: "#F59E0B" }} />
              <div>
                <div style={{ fontSize: "0.72rem", color: "#607F74" }}>Chỉ số nhiệt</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#183B32" }}>
                  {weather.apparentTemperature >= 35 ? "Nóng bức" : weather.apparentTemperature >= 28 ? "Ấm áp" : "Mát mẻ"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "1.5rem", color: "#DC3545", fontSize: "0.85rem" }}>
          {error || "Không thể tải thời tiết."}
        </div>
      )}

      {/* Location Picker Modal */}
      {showLocationModal && (
        <LocationPickerModal
          locations={filteredLocations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentCity={weather?.city}
          onSelect={handleSelectLocation}
          onResetAuto={handleResetToAuto}
          onClose={() => setShowLocationModal(false)}
        />
      )}
    </div>
  );
}

// ── Location Picker Modal Component ─────────────────────────────────────────
function LocationPickerModal({
  locations,
  searchQuery,
  setSearchQuery,
  currentCity,
  onSelect,
  onResetAuto,
  onClose,
}: {
  locations: LocationItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentCity?: string;
  onSelect: (loc: LocationItem) => void;
  onResetAuto: () => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(10, 25, 20, 0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          width: "100%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          border: "1.5px solid #B9DCCD",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #D7EAE1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#F4FBF8",
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#183B32" }}>
              Chọn Vị Trí Thời Tiết
            </h4>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#607F74", marginTop: "2px" }}>
              Tự động lưu vị trí được chọn cho các phiên làm việc sau
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              color: "#607F74",
              cursor: "pointer",
              padding: "0.3rem",
              borderRadius: "6px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Auto Detect Button */}
        <div style={{ padding: "1rem 1.5rem 0.5rem" }}>
          <button
            type="button"
            onClick={onResetAuto}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.75rem",
              borderRadius: "12px",
              border: "1.5px dashed #237A60",
              background: "#E8F8F1",
              color: "#237A60",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Navigation size={16} />
            <span>Tự Động Dò Tìm (GPS &amp; Mạng IP Gia Lai)</span>
          </button>
        </div>

        {/* Search Input */}
        <div style={{ padding: "0.75rem 1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.55rem 0.85rem",
              borderRadius: "10px",
              border: "1px solid #B9DCCD",
              background: "#F4FBF8",
            }}
          >
            <Search size={16} style={{ color: "#607F74" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tỉnh, thành phố (Gia Lai, Pleiku, HCM...)"
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "0.85rem",
                color: "#183B32",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* Location List */}
        <div
          style={{
            padding: "0.5rem 1.5rem 1.5rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {locations.map((loc) => {
            const isSelected = currentCity?.toLowerCase().includes(loc.name.toLowerCase());
            const isGiaLai = loc.id === "gia-lai";

            return (
              <div
                key={loc.id}
                onClick={() => onSelect(loc)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: isSelected
                    ? "2px solid #237A60"
                    : isGiaLai
                    ? "1.5px solid #B9DCCD"
                    : "1px solid #E5E7EB",
                  background: isSelected
                    ? "#E8F8F1"
                    : isGiaLai
                    ? "#F4FBF8"
                    : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontWeight: 800, color: "#183B32", fontSize: "0.92rem" }}>
                      {loc.name}
                    </span>
                    {loc.badge && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          padding: "0.1rem 0.45rem",
                          borderRadius: "4px",
                          background: "#237A60",
                          color: "#FFFFFF",
                        }}
                      >
                        {loc.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#607F74", marginTop: "2px" }}>
                    {loc.region}
                  </div>
                </div>

                {isSelected ? (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#237A60",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                    }}
                  >
                    <Check size={14} />
                  </div>
                ) : (
                  <span style={{ fontSize: "0.78rem", color: "#237A60", fontWeight: 700 }}>
                    Chọn
                  </span>
                )}
              </div>
            );
          })}

          {locations.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "#607F74", fontSize: "0.85rem" }}>
              Không tìm thấy tỉnh / thành phố phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
