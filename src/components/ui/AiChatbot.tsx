"use client";

/**
 * components/ui/AiChatbot.tsx
 * Floating AI Customer Support & Lead Generation Chatbot for ToTrongNhan
 * Built with rich Mint Green aesthetics, glassmorphism, quick suggestion chips and lead capture.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Phone,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { BRAND } from "@/lib/data";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedActions?: { label: string; action: string }[];
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content: `Xin chào bạn! Mình là **Trợ lý AI của Tô Trọng Nhân (Toti)** 🚀
Chuyên gia hỗ trợ & tăng tương tác mạng xã hội uy tín 24/7.

Bạn đang cần tư vấn bảng giá hoặc tăng trưởng kênh nào hôm nay?`,
    suggestedActions: [
      { label: "📌 Báo giá Facebook", action: "Báo giá dịch vụ Facebook" },
      { label: "🔥 Dịch vụ TikTok", action: "Báo giá dịch vụ TikTok" },
      { label: "📸 Tăng tương tác Instagram", action: "Báo giá dịch vụ Instagram" },
      { label: "🛡️ Chính sách bảo hành", action: "Chế độ bảo hành thế nào?" },
    ],
    timestamp: "Vừa xong",
  },
];

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, isMinimized, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content:
          data.reply ||
          `Cảm ơn bạn! Để được hỗ trợ nhanh nhất, bạn vui lòng nhắn tin trực tiếp qua Zalo ${BRAND.phone} nhé!`,
        suggestedActions: data.suggestedActions || [],
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: "assistant",
          content: `Kết nối tạm thời gián đoạn. Bạn vui lòng liên hệ trực tiếp hotline/Zalo: **${BRAND.phone}** để được tư vấn ngay nhé!`,
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  // Render text with simple bold and links formatting
  const renderMessageContent = (text: string) => {
    return text.split("\n").map((line, idx) => {
      // Bold rendering **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} style={{ margin: "0.25rem 0", lineHeight: 1.55 }}>
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} style={{ color: "#183B32", fontWeight: 700 }}>
                  {part.slice(2, -2)}
                </strong>
              );
            }
            // Check for links [text](url)
            const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
              const before = part.slice(0, linkMatch.index);
              const linkText = linkMatch[1];
              const linkHref = linkMatch[2];
              const after = part.slice(
                (linkMatch.index || 0) + linkMatch[0].length
              );
              return (
                <React.Fragment key={pIdx}>
                  {before}
                  <a
                    href={linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#237A60",
                      fontWeight: 700,
                      textDecoration: "underline",
                    }}
                  >
                    {linkText}
                  </a>
                  {after}
                </React.Fragment>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* ── Floating Chatbot Button (When closed) ── */}
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "clamp(1rem, 2.5vw, 1.75rem)",
            right: "clamp(1rem, 2.5vw, 1.75rem)",
            zIndex: 998,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {/* Unread Teaser Bubble */}
          {hasUnread && (
            <div
              onClick={() => setIsOpen(true)}
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                padding: "0.6rem 0.9rem",
                boxShadow: "0 8px 24px rgba(24, 59, 50, 0.12)",
                border: "1.5px solid #B9DCCD",
                fontSize: "0.82rem",
                color: "#183B32",
                fontWeight: 600,
                cursor: "pointer",
                maxWidth: 220,
                lineHeight: 1.4,
                animation: "floatSlow 3s ease-in-out infinite",
                display: "none",
              }}
              className="sm:flex sm:items-center sm:gap-2"
            >
              <Sparkles size={16} color="#237A60" style={{ flexShrink: 0 }} />
              <span>Cần báo giá dịch vụ MXH? Nhắn Toti ngay!</span>
            </div>
          )}

          {/* Main Bot Circular Trigger */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            aria-label="Mở khung chat tư vấn AI"
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #237A60 0%, #183B32 100%)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(35, 122, 96, 0.45)",
              border: "2.5px solid #A6E4D1",
              position: "relative",
              padding: 0,
              overflow: "hidden",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <img
              src="/chatbot-avatar.png"
              alt="Toti AI Mascot"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            {/* Green Online Dot */}
            <span
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#22C55E",
                border: "2px solid #FFFFFF",
                boxShadow: "0 0 8px #22C55E",
                zIndex: 2,
              }}
            />
          </button>
        </div>
      )}

      {/* ── Active Chat Window ── */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "clamp(1rem, 2.5vw, 1.75rem)",
            right: "clamp(1rem, 2.5vw, 1.75rem)",
            zIndex: 1000,
            width: "calc(100vw - 2rem)",
            maxWidth: 390,
            height: isMinimized ? 64 : "min(590px, calc(100vh - 3rem))",
            background: "#FFFFFF",
            borderRadius: "24px",
            border: "1.5px solid #B9DCCD",
            boxShadow: "0 20px 60px rgba(24, 59, 50, 0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "height 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "0.85rem 1rem",
              background: "linear-gradient(135deg, #237A60 0%, #183B32 100%)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div style={{ position: "relative" }}>
                <img
                  src="/chatbot-avatar.png"
                  alt="Tô Trọng Nhân (Toti AI)"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #A6E4D1",
                    background: "#E8F8F1",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://ui-avatars.com/api/?name=To+Trong+Nhan&background=237A60&color=fff";
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#22C55E",
                    border: "2px solid #183B32",
                    boxShadow: "0 0 6px #22C55E",
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  Tô Trọng Nhân (Toti AI)
                  <CheckCircle2 size={14} color="#A6E4D1" />
                </div>
                <div style={{ fontSize: "0.72rem", color: "#A6E4D1", fontWeight: 500 }}>
                  Trợ lý tư vấn dịch vụ MXH 24/7
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetChat();
                }}
                title="Làm mới cuộc trò chuyện"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ChevronDown
                  size={16}
                  style={{
                    transform: isMinimized ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                title="Đóng chat"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Body (Hidden when minimized) */}
          {!isMinimized && (
            <>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1rem",
                  background: "#F8FCFA",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {/* Zalo Fast Connect Banner */}
                <div
                  style={{
                    padding: "0.6rem 0.8rem",
                    borderRadius: "12px",
                    background: "#E8F8F1",
                    border: "1px dashed #237A60",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "0.78rem",
                    color: "#183B32",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Phone size={14} color="#237A60" />
                    <span>Zalo hỗ trợ trực tiếp: <strong>{BRAND.phone}</strong></span>
                  </div>
                  <a
                    href={`https://zalo.me/${BRAND.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#237A60",
                      color: "#FFFFFF",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                    }}
                  >
                    Mở Zalo
                  </a>
                </div>

                {/* Messages List */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "0.45rem",
                        maxWidth: "88%",
                      }}
                    >
                      {msg.role === "assistant" && (
                        <img
                          src="/chatbot-avatar.png"
                          alt="Toti AI"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1px solid #A6E4D1",
                            background: "#E8F8F1",
                            flexShrink: 0,
                            marginBottom: "2px",
                          }}
                        />
                      )}
                      <div
                        style={{
                          flex: 1,
                          padding: "0.75rem 0.95rem",
                          borderRadius:
                            msg.role === "user"
                              ? "18px 18px 4px 18px"
                              : "18px 18px 18px 4px",
                          background:
                            msg.role === "user" ? "#237A60" : "#FFFFFF",
                          color: msg.role === "user" ? "#FFFFFF" : "#183B32",
                          border:
                            msg.role === "user"
                              ? "none"
                              : "1px solid #D7EAE1",
                          boxShadow: "0 2px 8px rgba(24, 59, 50, 0.05)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {renderMessageContent(msg.content)}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "#8DA79E",
                        marginTop: "0.2rem",
                        padding: msg.role === "assistant" ? "0 0 0 2.2rem" : "0 0.3rem",
                      }}
                    >
                      {msg.timestamp}
                    </div>

                    {/* Suggested Action Buttons if present */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.4rem",
                          marginTop: "0.5rem",
                          paddingLeft: msg.role === "assistant" ? "2.2rem" : 0,
                        }}
                      >
                        {msg.suggestedActions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            type="button"
                            onClick={() => handleSendMessage(act.action)}
                            style={{
                              background: "#FFFFFF",
                              border: "1px solid #B9DCCD",
                              borderRadius: "999px",
                              padding: "0.35rem 0.75rem",
                              fontSize: "0.74rem",
                              fontWeight: 600,
                              color: "#237A60",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#E8F8F1";
                              e.currentTarget.style.borderColor = "#237A60";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#FFFFFF";
                              e.currentTarget.style.borderColor = "#B9DCCD";
                            }}
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {loading && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "0.45rem" }}>
                    <img
                      src="/chatbot-avatar.png"
                      alt="Toti AI"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #A6E4D1",
                        background: "#E8F8F1",
                        flexShrink: 0,
                        marginBottom: "2px",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "#FFFFFF",
                        padding: "0.6rem 0.9rem",
                        borderRadius: "18px 18px 18px 4px",
                        border: "1px solid #D7EAE1",
                        width: "fit-content",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#237A60",
                          animation: "bounce 1.2s infinite 0s",
                        }}
                      />
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#237A60",
                          animation: "bounce 1.2s infinite 0.2s",
                        }}
                      />
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#237A60",
                          animation: "bounce 1.2s infinite 0.4s",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div
                style={{
                  padding: "0.75rem 0.85rem",
                  background: "#FFFFFF",
                  borderTop: "1.5px solid #E5F0EA",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Nhập câu hỏi hoặc SĐT để tư vấn..."
                  style={{
                    flex: 1,
                    padding: "0.65rem 0.9rem",
                    borderRadius: "12px",
                    border: "1.5px solid #D7EAE1",
                    background: "#F8FCFA",
                    fontSize: "0.86rem",
                    color: "#183B32",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#237A60";
                    e.currentTarget.style.background = "#FFFFFF";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#D7EAE1";
                    e.currentTarget.style.background = "#F8FCFA";
                  }}
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  aria-label="Gửi tin nhắn"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    background:
                      input.trim() && !loading
                        ? "#237A60"
                        : "#D7EAE1",
                    color: "#FFFFFF",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor:
                      input.trim() && !loading
                        ? "pointer"
                        : "not-allowed",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
