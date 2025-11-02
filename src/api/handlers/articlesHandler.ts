/**
 * Articles API Handler
 * Mock backend for article CRUD operations
 * In production, replace with actual backend API calls
 */

import { articles as initialArticles } from '@/data/articles';

// In-memory storage (replace with database in production)
const articlesStore = [...initialArticles];
let nextId = Math.max(...initialArticles.map((a) => parseInt(a.id))) + 1;

export interface ArticlePayload {
  id?: string;
  title: string;
  excerpt: string;
  category: string;
  contentHtml: string;
  slug: string;
  tags: string[];
  heroSrc?: string;
  blocks?: unknown[];
}

export interface Article extends ArticlePayload {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  engagement: {
    likes: number;
    views: number;
    shares: number;
  };
  publishedAt: string;
  type: string;
}

/**
 * Create a new article
 */
export const handleCreateArticle = (data: ArticlePayload): Article => {
  const newArticle: Article = {
    ...data,
    id: String(nextId++),
    type: 'article',
    author: {
      id: '1',
      name: 'Current User',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    engagement: {
      likes: 0,
      views: 0,
      shares: 0,
    },
    publishedAt: new Date().toISOString(),
  };

  articlesStore.splice(articlesStore.length, 0, newArticle);
  return newArticle;
};

/**
 * Update an existing article
 */
export const handleUpdateArticle = (
  id: string,
  data: ArticlePayload
): Article => {
  const articleToUpdate = articlesStore.find((a) => a.id === id);

  if (!articleToUpdate) {
    throw new Error('Article not found');
  }

  // Securely update properties, avoiding object spread on `data`
  articleToUpdate.title = data.title ?? articleToUpdate.title;
  articleToUpdate.excerpt = data.excerpt ?? articleToUpdate.excerpt;
  articleToUpdate.category = data.category ?? articleToUpdate.category;
  articleToUpdate.contentHtml = data.contentHtml ?? articleToUpdate.contentHtml;
  articleToUpdate.slug = data.slug ?? articleToUpdate.slug;
  articleToUpdate.tags = data.tags ?? articleToUpdate.tags;
  articleToUpdate.heroSrc = data.heroSrc ?? articleToUpdate.heroSrc;
  articleToUpdate.blocks = data.blocks ?? articleToUpdate.blocks;

  return articleToUpdate;
};

/**
 * Get a single article by ID
 */
export const handleGetArticle = (id: string): Article => {
  const article = articlesStore.find((a) => a.id === id);
  if (!article) {
    throw new Error('Article not found');
  }
  return article;
};

/**
 * Get all articles
 */
export const handleGetArticles = (): Article[] => {
  return articlesStore;
};

/**
 * Delete an article
 */
export const handleDeleteArticle = (id: string): void => {
  const index = articlesStore.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error('Article not found');
  }
  articlesStore.splice(index, 1);
};

/**
 * Search articles by title or content
 */
export const handleSearchArticles = (query: string): Article[] => {
  const lowerQuery = query.toLowerCase();
  return articlesStore.filter(
    (a) =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.excerpt.toLowerCase().includes(lowerQuery) ||
      a.contentHtml.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get articles by category
 */
export const handleGetArticlesByCategory = (category: string): Article[] => {
  return articlesStore.filter(
    (a) => a.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Get articles by tag
 */
export const handleGetArticlesByTag = (tag: string): Article[] => {
  return articlesStore.filter((a) =>
    a.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
};

/**
 * Get articles with pagination
 */
export const handleGetArticlesPaginated = (
  page = 1,
  limit = 10
): { articles: Article[]; total: number; page: number; pages: number } => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedArticles = articlesStore.slice(start, end);
  const total = articlesStore.length;
  const pages = Math.ceil(total / limit);

  return {
    articles: paginatedArticles,
    total,
    page,
    pages,
  };
};