import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Green Forest Editorial Palette ──────────────────────────────
      colors: {
        primary: {
          DEFAULT: "#1B4D3E",
          50:  "#E8F5E9",
          100: "#C8E6C9",
          200: "#A3C9A8",
          300: "#8FB996",
          400: "#66BB6A",
          500: "#4CAF50",
          600: "#43A047",
          700: "#388E3C",
          800: "#0D5C3A",
          900: "#1B4D3E",
          950: "#0A3628",
        },
        sage: {
          DEFAULT: "#8FB996",
          light: "#A3C9A8",
          pale:  "#E8F5E9",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          alt:     "#F4F7F4",
          dark:    "#0F1A15",
          "dark-alt": "#152219",
        },
        text: {
          DEFAULT: "#1E293B",
          muted:   "#64748B",
          inverse: "#F8FAFC",
        },
      },

      // ── Typography ───────────────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-plus-jakarta)", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },

      // ── Spacing / Sizing ─────────────────────────────────────────────
      maxWidth: {
        prose: "72ch",
        content: "1280px",
        article: "800px",
      },

      // ── Animation & Transitions ──────────────────────────────────────
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%":   { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(27,77,62,0.4)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(27,77,62,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in":    "fadeIn 0.5s ease forwards",
        "slide-down": "slideDown 0.3s ease forwards",
        shimmer:      "shimmer 2s linear infinite",
        "pulse-green":"pulseGreen 2s ease infinite",
        float:        "float 3s ease-in-out infinite",
      },

      // ── Box Shadows ──────────────────────────────────────────────────
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.08)",
        "card-hover": "0 4px 12px rgba(27,77,62,.15), 0 12px 40px rgba(27,77,62,.12)",
        nav:  "0 1px 0 rgba(0,0,0,.06)",
        toc:  "inset 3px 0 0 #1B4D3E",
      },

      // ── Border Radius ─────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
