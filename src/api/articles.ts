/**
 * Articles API
 * Handles CRUD operations for articles with Gutenberg content
 */

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
}

/**
 * Create a new article
 */
export const createArticle = async (data: ArticlePayload): Promise<Article> => {
  const response = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create article');
  }

  return response.json();
};

/**
 * Update an existing article
 */
export const updateArticle = async (
  id: string,
  data: ArticlePayload
): Promise<Article> => {
  const response = await fetch(`/api/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update article');
  }

  return response.json();
};

/**
 * Get a single article by ID
 */
export const getArticle = async (id: string): Promise<Article> => {
  const response = await fetch(`/api/articles/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }

  return response.json();
};

/**
 * Get all articles
 */
export const getArticles = async (): Promise<Article[]> => {
  const response = await fetch('/api/articles');

  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }

  return response.json();
};

/**
 * Delete an article
 */
export const deleteArticle = async (id: string): Promise<void> => {
  const response = await fetch(`/api/articles/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete article');
  }
};

/**
 * Search articles by title or content
 */
export const searchArticles = async (query: string): Promise<Article[]> => {
  const response = await fetch(`/api/articles/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error('Failed to search articles');
  }

  return response.json();
};

/**
 * Get articles by category
 */
export const getArticlesByCategory = async (
  category: string
): Promise<Article[]> => {
  const response = await fetch(
    `/api/articles/category/${encodeURIComponent(category)}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch articles by category');
  }

  return response.json();
};

/**
 * Get articles by tag
 */
export const getArticlesByTag = async (tag: string): Promise<Article[]> => {
  const response = await fetch(`/api/articles/tag/${encodeURIComponent(tag)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch articles by tag');
  }

  return response.json();
};