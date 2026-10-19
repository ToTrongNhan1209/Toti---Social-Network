/**
 * app/layout.tsx – Root layout ToTrongNhan
 */

import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Space_Grotesk } from "next/font/google";
import "./globals.css";
import PublicLayoutShell from "@/components/layout/PublicLayoutShell";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ToTrongNhan – Dịch Vụ Hỗ Trợ Mạng Xã Hội Chuyên Nghiệp",
    template: "%s | ToTrongNhan",
  },
  description:
    "Chuyên cung cấp dịch vụ tăng followers, like, view cho Facebook, TikTok, Instagram. Dịch vụ uy tín, bảo hành 30 ngày, hỗ trợ 24/7.",
  keywords: [
    "dịch vụ mạng xã hội",
    "tăng followers facebook",
    "tăng followers tiktok",
    "tăng followers instagram",
    "mua followers",
    "dịch vụ tài khoản facebook",
    "tiktok business",
    "instagram marketing",
    "totrongnhan",
  ],
  authors: [{ name: "ToTrongNhan", url: "https://totrongnhan.vn" }],
  creator: "ToTrongNhan",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "ToTrongNhan",
    title: "ToTrongNhan – Dịch Vụ Hỗ Trợ Mạng Xã Hội",
    description:
      "Chuyên cung cấp dịch vụ tăng followers, like, view cho Facebook, TikTok, Instagram – uy tín, chất lượng, bảo hành.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ToTrongNhan" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@totrongnhan",
    creator: "@totrongnhan",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo/symbol-variants/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/logo/symbol-variants/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#237A60",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnamPro.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <PublicLayoutShell>{children}</PublicLayoutShell>
      </body>
    </html>
  );
}
