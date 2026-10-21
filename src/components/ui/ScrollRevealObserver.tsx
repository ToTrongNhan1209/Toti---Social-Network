"use client";

/**
 * components/ui/ScrollRevealObserver.tsx
 * Bidirectional Scroll-Reveal Engine:
 * - Lướt xuống: các component cuộn vào tầm nhìn sẽ trượt lên và hiện ra mượt mà.
 * - Lướt lên lại: các component trôi ra ngoài tầm nhìn sẽ ẩn theo, sẵn sàng hiển thị lại khi cuộn xuống.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
        } else {
          // Khi lướt lên lại hoặc rời khỏi tầm nhìn, component sẽ tự ẩn theo
          entry.target.classList.remove("is-revealed");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.05,
    });

    const setupObserver = () => {
      // 1. Elements explicitly tagged with reveal classes
      const taggedElements = document.querySelectorAll(
        ".reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right"
      );
      taggedElements.forEach((el) => {
        observer.observe(el);
      });

      // 2. Automatically enhance key content cards & sections across all pages
      const autoTargets = document.querySelectorAll(
        "main section > div, .card, .pricing-card, .service-card, .feature-card, .post-card, .testimonial-card, .faq-item"
      );

      autoTargets.forEach((el, index) => {
        // Skip elements inside header or admin
        if (el.closest("header") || el.closest(".admin-isolated-shell")) return;

        if (
          !el.classList.contains("reveal-on-scroll") &&
          !el.classList.contains("reveal-scale") &&
          !el.classList.contains("reveal-left") &&
          !el.classList.contains("reveal-right")
        ) {
          el.classList.add("reveal-on-scroll");
          // Stagger cards in a grid
          const stagger = (index % 4) * 100;
          if (stagger > 0) {
            el.classList.add(`delay-${stagger}`);
          }
          observer.observe(el);
        }
      });
    };

    // Initial setup with a slight delay to allow DOM hydration
    const timer = setTimeout(setupObserver, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
