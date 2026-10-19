/**
 * lib/ddos-shield.ts
 * Anti-DDoS, Rate Limiting & Bot Traffic Defense System
 */

interface RateLimitRecord {
  count: number;
  firstRequestAt: number;
  resetAt: number;
  violations: number;
  blockedUntil?: number;
}

// In-memory sliding window rate-limit map
const ipMap = new Map<string, RateLimitRecord>();

// List of suspicious or malicious bots / scrapers
const SUSPICIOUS_USER_AGENTS = [
  "sqlmap",
  "nikto",
  "havij",
  "acunetix",
  "masscan",
  "zgrab",
  "nmap",
];

export interface ShieldConfig {
  windowMs: number;
  maxRequests: number;
  blockDurationMs: number;
}

const DEFAULT_CONFIGS: Record<string, ShieldConfig> = {
  // General website traffic: 120 req / minute
  public: {
    windowMs: 60_000,
    maxRequests: 120,
    blockDurationMs: 5 * 60_000, // 5 min ban
  },
  // Sensitive APIs & Forms: 15 req / minute
  sensitiveApi: {
    windowMs: 60_000,
    maxRequests: 15,
    blockDurationMs: 10 * 60_000, // 10 min ban
  },
  // Admin Login: 6 attempts / 5 minutes
  adminAuth: {
    windowMs: 300_000,
    maxRequests: 6,
    blockDurationMs: 15 * 60_000, // 15 min ban
  },
};

/**
 * Check if the request is from a known malicious scanner or empty bot
 */
export function isMaliciousBot(userAgent: string | null): boolean {
  if (!userAgent || userAgent.trim().length === 0) {
    return false; // some mobile apps have empty UA, avoid false positive unless flooded
  }
  const uaLower = userAgent.toLowerCase();
  return SUSPICIOUS_USER_AGENTS.some((bad) => uaLower.includes(bad));
}

/**
 * Check if query string is abnormally long (URL flood attack)
 */
export function isQueryFlood(url: string): boolean {
  return url.length > 2048;
}

/**
 * Core rate limit and DDoS evaluation for an IP address
 */
export function checkRateLimit(
  ip: string,
  category: "public" | "sensitiveApi" | "adminAuth" = "public"
): {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  isBlocked: boolean;
  blockedUntilSeconds?: number;
} {
  const config = DEFAULT_CONFIGS[category];
  const now = Date.now();
  const key = `${category}:${ip}`;

  // Allow localhost during local development
  if (
    (ip === "127.0.0.1" || ip === "::1" || ip === "localhost") &&
    process.env.NODE_ENV !== "production"
  ) {
    return {
      allowed: true,
      remaining: 999,
      resetSeconds: 60,
      isBlocked: false,
    };
  }

  let record = ipMap.get(key);

  // Check if currently banned
  if (record?.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.ceil((record.resetAt - now) / 1000),
      isBlocked: true,
      blockedUntilSeconds: Math.ceil((record.blockedUntil - now) / 1000),
    };
  }

  // Create new window or reset expired window
  if (!record || now > record.resetAt) {
    record = {
      count: 1,
      firstRequestAt: now,
      resetAt: now + config.windowMs,
      violations: record ? record.violations : 0,
    };
    ipMap.set(key, record);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetSeconds: Math.ceil(config.windowMs / 1000),
      isBlocked: false,
    };
  }

  // Increment request count
  record.count += 1;
  const remaining = Math.max(0, config.maxRequests - record.count);
  const resetSeconds = Math.ceil((record.resetAt - now) / 1000);

  // Exceeded rate limit
  if (record.count > config.maxRequests) {
    record.violations += 1;

    // Auto-ban if violation is repeated or extreme flood (> 2.5x max)
    if (record.violations >= 2 || record.count > config.maxRequests * 2.5) {
      record.blockedUntil = now + config.blockDurationMs;
      return {
        allowed: false,
        remaining: 0,
        resetSeconds,
        isBlocked: true,
        blockedUntilSeconds: Math.ceil(config.blockDurationMs / 1000),
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
      isBlocked: false,
    };
  }

  return {
    allowed: true,
    remaining,
    resetSeconds,
    isBlocked: false,
  };
}

/**
 * Periodically purge old records from memory to prevent memory leaks
 */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipMap.entries()) {
      if (now > record.resetAt && (!record.blockedUntil || now > record.blockedUntil)) {
        ipMap.delete(key);
      }
    }
  }, 120_000); // Clean every 2 minutes
}
