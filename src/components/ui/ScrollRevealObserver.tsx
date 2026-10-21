"use client";

/**
 * components/ui/ScrollRevealObserver.tsx
 * Global IntersectionObserver engine that triggers silky smooth entrance animations
 * as components scroll into the viewport.
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

    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          // Unobserve once revealed for optimal performance
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px -40px 0px", // Trigger slightly before it hits the bottom
      threshold: 0.08,
    });

    const setupObserver = () => {
      // 1. Elements explicitly tagged with reveal classes
      const taggedElements = document.querySelectorAll(
        ".reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right"
      );
      taggedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
          el.classList.add("is-revealed");
        } else {
          observer.observe(el);
        }
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
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
            el.classList.add("is-revealed");
          } else {
            observer.observe(el);
          }
        }
      });
    };

    // Initial setup with a slight delay to allow DOM hydration
    const timer = setTimeout(setupObserver, 120);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
