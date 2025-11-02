import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as useAuthModule from '@/hooks/useAuth';

import { ArticleActions } from './ArticleActions';

vi.mock('@/hooks/useAuth');
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn(() => Promise.resolve({ data: null })),
        upsert: vi.fn(() => Promise.resolve({ error: null })),
        delete: vi.fn(() => Promise.resolve({ error: null })),
        update: vi.fn(() => Promise.resolve({ error: null })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
    rpc: vi.fn(() => Promise.resolve({ error: null })),
  },
}));
vi.mock('sonner', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ArticleActions', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const defaultProps = {
    articleId: 'article-123',
    authorId: 'author-123',
    authorName: 'Test Author',
    category: 'Tech',
    tags: ['test', 'article'],
    initialLikeCount: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      isAdmin: false,
      signOut: vi.fn(),
    });
  });

  it('renders like, favorite and share buttons', () => {
    render(<ArticleActions {...defaultProps} />);

    expect(screen.getByLabelText(/liker/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/favoris/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/partager/i)).toBeInTheDocument();
  });

  it('shows initial like count', () => {
    render(<ArticleActions {...defaultProps} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('requires authentication for like', async () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: null,
      loading: false,
      isAdmin: false,
      signOut: vi.fn(),
    });

    const { toast } = await import('sonner');
    render(<ArticleActions {...defaultProps} />);

    const likeButton = screen.getByLabelText(/liker/i);
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Connectez-vous'));
    });
  });

  it('handles like toggle for authenticated user', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      rpc: vi.fn().mockResolvedValue({ error: null }),
    };

    vi.mocked(supabaseModule.supabase).mockReturnValue(mockSupabase as any);

    render(<ArticleActions {...defaultProps} />);

    const likeButton = screen.getByLabelText(/liker/i);
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('user_interactions');
    });
  });

  it('handles favorite toggle', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn().mockResolvedValue({ error: null }),
    };

    vi.mocked(supabaseModule.supabase).mockReturnValue(mockSupabase as any);

    render(<ArticleActions {...defaultProps} />);

    const favoriteButton = screen.getByLabelText(/favoris/i);
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('user_favorites');
    });
  });

  it('handles share with Web Share API', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { share: mockShare });

    render(<ArticleActions {...defaultProps} />);

    const shareButton = screen.getByLabelText(/partager/i);
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalled();
    });
  });
});

