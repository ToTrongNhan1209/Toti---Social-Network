/**
 * lib/types.ts
 * Shared TypeScript interfaces for the blog platform
 */

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string (server-sanitized)
  coverImage: string;
  publishedAt: string; // ISO date string
  updatedAt?: string;
  readingTime: number; // minutes
  author: Author;
  category: Category;
  tags: Tag[];
  featured: boolean;
  views: number;
  likes: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface NewsletterSubscriber {
  email: string;
}

// API response wrappers
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Pagination
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
