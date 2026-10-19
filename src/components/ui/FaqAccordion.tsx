"use client";

/**
 * components/ui/FaqAccordion.tsx
 * Interactive FAQ component with accordion toggles and search
 */

import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { faqs } from "@/lib/data";

interface FaqAccordionProps {
  items?: { q: string; a: string }[];
}

export default function FaqAccordion({ items }: FaqAccordionProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const dataList = items || faqs;

  const filteredFaqs = dataList.filter(
    (item) =>
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      {/* Search within FAQs */}
      <div style={{ position: "relative", marginBottom: "2rem" }}>
        <Search
          size={18}
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#71877E",
          }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm câu trả lời cho thắc mắc của bạn (bảo hành, thanh toán, mật khẩu...)..."
          style={{
            paddingLeft: "2.75rem",
            borderRadius: 12,
            background: "#FFFFFF",
            border: "1px solid #D7EAE1",
            color: "#183B32",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              style={{
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${isOpen ? "#B9DCCD" : "#D7EAE1"}`,
                background: isOpen ? "#E8F8F1" : "#FFFFFF",
                boxShadow: "0 2px 8px rgba(24, 59, 50, 0.04)",
                transition: "all 0.2s",
              }}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "1.25rem 1.5rem",
                  background: "transparent",
                  border: "none",
                  color: "#183B32",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  cursor: "pointer",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <HelpCircle
                    size={20}
                    style={{
                      color: isOpen ? "#237A60" : "#71877E",
                      flexShrink: 0,
                    }}
                  />
                  <span>{faq.q}</span>
                </div>
                <ChevronDown
                  size={18}
                  style={{
                    color: isOpen ? "#237A60" : "#71877E",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                    flexShrink: 0,
                  }}
                />
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: "0 1.5rem 1.25rem 3.25rem",
                    color: "#48665B",
                    fontSize: "0.95rem",
                    lineHeight: 1.8,
                    borderTop: "1px solid #D7EAE1",
                    paddingTop: "0.75rem",
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#71877E" }}>
            Không tìm thấy câu hỏi phù hợp. Hãy nhắn tin trực tiếp qua Zalo để được giải đáp 24/7!
          </div>
        )}
      </div>
    </div>
  );
}
