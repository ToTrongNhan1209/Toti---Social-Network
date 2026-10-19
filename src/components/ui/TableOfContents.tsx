"use client";

/**
 * components/ui/TableOfContents.tsx
 * Sticky sidebar TOC – parses H2/H3 from HTML content, highlights active heading
 */

import { useEffect, useState, useMemo } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

interface Heading {
  id:    string;
  text:  string;
  level: 2 | 3;
}

interface Props {
  content: string;
}

function extractHeadings(html: string): Heading[] {
  // Parse headings safely without DOM access on server
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  const result: Heading[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]) as 2 | 3;
    const text  = match[2].replace(/<[^>]+>/g, "");
    const id    = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    result.push({ id, text, level });
  }
  return result;
}

export default function TableOfContents({ content }: Props) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className="card rounded-2xl p-5 sticky top-20 border border-[#D7EAE1] bg-white shadow-sm">
      <h4 className="font-heading font-bold text-sm text-[#183B32] flex items-center gap-2 mb-4">
        <List size={16} className="text-[#237A60]" />
        Mục Lục
      </h4>
      <nav aria-label="Table of contents">
        <ul className="space-y-0.5">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={cn(
                  "toc-link",
                  h.level === 3 && "pl-5 text-xs",
                  active === h.id && "active"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                  setActive(h.id);
                }}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
