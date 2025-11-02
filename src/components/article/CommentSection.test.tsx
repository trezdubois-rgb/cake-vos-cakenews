import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { CommentSection, Comment } from './CommentSection';

describe('CommentSection', () => {
  const mockComments: Comment[] = [
    {
      id: '1',
      author: {
        id: 'author-1',
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
      },
      content: 'Great article!',
      likes: 5,
      isLiked: false,
      createdAt: '2024-01-01T00:00:00Z',
      replies: [],
    },
  ];

  const mockHandlers = {
    onAddComment: vi.fn(),
    onLikeComment: vi.fn(),
  };

  it('renders comments list', () => {
    render(
      <CommentSection
        articleId="article-1"
        comments={mockComments}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Great article!')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('allows adding new comment', () => {
    render(
      <CommentSection
        articleId="article-1"
        comments={[]}
        {...mockHandlers}
      />
    );

    const input = screen.getByPlaceholderText(/commentaire/i);
    const button = screen.getByRole('button', { name: /ajouter/i });

    fireEvent.change(input, { target: { value: 'New comment' } });
    fireEvent.click(button);

    expect(mockHandlers.onAddComment).toHaveBeenCalledWith('New comment');
  });

  it('handles comment like', () => {
    render(
      <CommentSection
        articleId="article-1"
        comments={mockComments}
        {...mockHandlers}
      />
    );

    const likeButton = screen.getByLabelText(/liker/i);
    fireEvent.click(likeButton);

    expect(mockHandlers.onLikeComment).toHaveBeenCalledWith('1');
  });

  it('displays comment count', () => {
    render(
      <CommentSection
        articleId="article-1"
        comments={mockComments}
        {...mockHandlers}
      />
    );

    expect(screen.getByText(/1 commentaire/i)).toBeInTheDocument();
  });
});

