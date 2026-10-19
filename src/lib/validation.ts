/**
 * lib/validation.ts
 * Zod schemas for input validation (Rule #7 – Input Validation)
 * All API inputs must be validated through these schemas before processing.
 */

import { z } from "zod";

// ── Comment form ────────────────────────────────────────────────────────────
export const CommentSchema = z.object({
  postId:  z.string().min(1, "Post ID không hợp lệ"),
  author:  z.string().min(2, "Tên quá ngắn").max(60, "Tên quá dài").trim(),
  email:   z.string().email("Email không hợp lệ").toLowerCase().trim(),
  content: z
    .string()
    .min(10, "Bình luận phải có ít nhất 10 ký tự")
    .max(2000, "Bình luận tối đa 2000 ký tự")
    .trim(),
  // Honeypot – must be empty
  website: z.literal("").optional(),
});

export type CommentInput = z.infer<typeof CommentSchema>;

// ── Newsletter subscription ─────────────────────────────────────────────────
export const NewsletterSchema = z.object({
  email: z.string().email("Email không hợp lệ").toLowerCase().trim(),
  // Honeypot
  phone: z.literal("").optional(),
});

export type NewsletterInput = z.infer<typeof NewsletterSchema>;

// ── Contact form ────────────────────────────────────────────────────────────
export const ContactSchema = z.object({
  name:    z.string().min(2).max(100).trim(),
  email:   z.string().email().toLowerCase().trim(),
  subject: z.string().min(5).max(200).trim(),
  message: z.string().min(20).max(5000).trim(),
  // Honeypot
  company: z.literal("").optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;

// ── Search query ────────────────────────────────────────────────────────────
export const SearchSchema = z.object({
  q:        z.string().max(100).trim(),
  category: z.string().max(50).optional(),
  page:     z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

export type SearchInput = z.infer<typeof SearchSchema>;
