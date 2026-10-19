/**
 * lib/blog-store.ts
 * Server-side persistent file storage for blog posts
 */

import fs from "fs";
import path from "path";
import { posts as defaultPosts, authors, categories, tags } from "./mock-data";
import type { Post } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

// In-memory cache for fast access
let cachedPosts: Post[] | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getAllPosts(): Post[] {
  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    ensureDataDirectory();
    if (fs.existsSync(POSTS_FILE)) {
      const data = fs.readFileSync(POSTS_FILE, "utf-8");
      const parsed = JSON.parse(data) as Post[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedPosts = parsed;
        return cachedPosts;
      }
    }
  } catch (err) {
    console.error("Error reading posts.json, falling back to mock posts:", err);
  }

  // Seed default posts if file does not exist or is empty
  cachedPosts = [...defaultPosts];
  savePostsToFile(cachedPosts);
  return cachedPosts;
}

function savePostsToFile(posts: Post[]): boolean {
  cachedPosts = posts;
  try {
    ensureDataDirectory();
    const tempFile = `${POSTS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(posts, null, 2), "utf-8");
    fs.renameSync(tempFile, POSTS_FILE);
    return true;
  } catch {
    try {
      fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8");
      return true;
    } catch (fallbackErr) {
      console.error("Failed to save posts to file:", fallbackErr);
      return false;
    }
  }
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export function getPostById(id: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.id === id);
}

export function createPost(newPostData: Partial<Post>): Post {
  const posts = getAllPosts();
  const id = Date.now().toString();

  const author = newPostData.author || authors[0];
  const category = newPostData.category || categories[0];
  const postTags = newPostData.tags || [tags[0]];

  const post: Post = {
    id,
    slug: newPostData.slug || `bai-viet-${id}`,
    title: newPostData.title || "Bài viết mới",
    excerpt: newPostData.excerpt || "",
    content: newPostData.content || "<p>Nội dung bài viết đang được cập nhật...</p>",
    coverImage:
      newPostData.coverImage ||
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
    publishedAt: newPostData.publishedAt || new Date().toISOString(),
    readingTime: Number(newPostData.readingTime) || 5,
    author,
    category,
    tags: postTags,
    featured: Boolean(newPostData.featured),
    views: Number(newPostData.views) || 0,
    likes: Number(newPostData.likes) || 0,
  };

  const updated = [post, ...posts];
  savePostsToFile(updated);
  return post;
}

export function updatePost(id: string, updates: Partial<Post>): Post | null {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = posts[index];
  const updatedPost: Post = {
    ...existing,
    ...updates,
    id: existing.id, // prevent overwriting ID
    updatedAt: new Date().toISOString(),
  };

  const newPosts = [...posts];
  newPosts[index] = updatedPost;
  savePostsToFile(newPosts);
  return updatedPost;
}

export function deletePost(id: string): boolean {
  const posts = getAllPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;

  savePostsToFile(filtered);
  return true;
}

export function resetPostsToDefault(): Post[] {
  cachedPosts = [...defaultPosts];
  savePostsToFile(cachedPosts);
  return cachedPosts;
}
