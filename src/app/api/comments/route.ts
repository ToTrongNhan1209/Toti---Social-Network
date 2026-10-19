/**
 * app/api/comments/route.ts
 * Comment submission endpoint
 * Security: Input validation, XSS sanitization (Rule #15),
 * honeypot, minimal response, moderation queue
 */

import { NextRequest, NextResponse } from "next/server";
import { CommentSchema } from "@/lib/validation";

// ── Simulate DB with an in-memory store ─────────────────────────────────
const commentQueue: Array<{
  id:        string;
  postId:    string;
  author:    string;
  email:     string;   // Never exposed in public response
  content:   string;
  createdAt: string;
  approved:  false;    // All go to moderation
}> = [];

/** Simple HTML escaping – use `sanitize-html` or DOMPurify server-side in production */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── 1. Honeypot check (Rule #13) ─────────────────────────────────
    if (body.website) {
      return NextResponse.json({ success: true }); // silently drop bots
    }

    // ── 2. Input validation with Zod (Rule #7) ───────────────────────
    const result = CommentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { postId, author, email, content } = result.data;

    // ── 3. XSS Prevention – escape all user content (Rule #15) ───────
    const safeAuthor  = escapeHtml(author);
    const safeContent = escapeHtml(content);

    // ── 4. Store in moderation queue ─────────────────────────────────
    const comment = {
      id:        crypto.randomUUID(),
      postId,
      author:    safeAuthor,
      email,               // stored internally, never returned
      content:   safeContent,
      createdAt: new Date().toISOString(),
      approved:  false as const,
    };
    commentQueue.push(comment);

    // ── 5. Minimal response – strip email (Rule #17) ──────────────────
    const publicComment = {
      id: comment.id,
      postId: comment.postId,
      author: comment.author,
      content: comment.content,
      createdAt: comment.createdAt,
      approved: comment.approved,
    };

    return NextResponse.json(
      { success: true, comment: publicComment },
      { status: 201 }
    );

  } catch (err) {
    console.error("[comments] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ success: false, error: "postId is required" }, { status: 400 });
  }

  // Only return approved comments, strip emails (Rule #17)
  const approved = commentQueue
    .filter((c) => c.postId === postId && c.approved)
    .map((c) => ({
      id: c.id,
      postId: c.postId,
      author: c.author,
      content: c.content,
      createdAt: c.createdAt,
      approved: c.approved,
    }));

  return NextResponse.json({ success: true, comments: approved });
}
