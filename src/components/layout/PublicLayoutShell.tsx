"use client";

/**
 * components/layout/PublicLayoutShell.tsx
 * Controls rendering of public client chrome (Navbar, Footer, FloatingActions, FloatingParticles).
 * Completely omits client header & footer on all /admin routes so Admin/CMS is a standalone dashboard.
 */

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/ui/FloatingActions";
import FloatingParticles from "@/components/ui/FloatingParticles";
import AiChatbot from "@/components/ui/AiChatbot";

export default function PublicLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="admin-isolated-shell min-h-screen w-full bg-[#F4FBF8]">
        {children}
      </div>
    );
  }

  return (
    <>
      <FloatingParticles fixed={true} count={15} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <FloatingActions />
      <AiChatbot />
      <Footer />
    </>
  );
}
