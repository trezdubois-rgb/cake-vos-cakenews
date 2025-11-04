export interface FeedItem {
  id: string;
  type: 'article' | 'video' | 'ad';
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  heroSrc: string;
  heroLqip: string;
  videoHls?: string;
  videoDuration?: number;
  publishedAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  category: string;
  engagement: {
    likes: number;
    views: number;
    shares: number;
  };
}

export interface UserInteraction {
  itemId: string;
  seen: boolean;
  liked: boolean;
  favorited: boolean;
  timeSpentSec: number;
  lastSeenAt: string;
}

// Mock data removed - using real database data only
export const mockFeedItems: FeedItem[] = [];

// Mock data removed - using real database data only
export const mockUserInteractions: Record<string, UserInteraction> = {};

export const getUserInteraction = (itemId: string): UserInteraction => {
  return mockUserInteractions[itemId] || {
    itemId,
    seen: false,
    liked: false,
    favorited: false,
    timeSpentSec: 0,
    lastSeenAt: new Date().toISOString()
  };
};