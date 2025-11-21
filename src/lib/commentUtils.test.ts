import { buildCommentTree, FlatComment } from './commentUtils';

describe('buildCommentTree', () => {
  const mockProfile = {
    display_name: 'Test User',
    avatar_url: 'http://example.com/avatar.jpg',
  };

  it('should handle empty input', () => {
    expect(buildCommentTree([])).toEqual([]);
  });

  it('should convert flat comments to tree structure', () => {
    const flatComments: FlatComment[] = [
      {
        id: '1',
        user_id: 'user1',
        content: 'Root comment 1',
        like_count: 0,
        created_at: '2023-01-01T10:00:00Z',
        parent_id: null,
        profiles: mockProfile,
      },
      {
        id: '2',
        user_id: 'user2',
        content: 'Reply to 1',
        like_count: 0,
        created_at: '2023-01-01T10:05:00Z',
        parent_id: '1',
        profiles: mockProfile,
      },
      {
        id: '3',
        user_id: 'user3',
        content: 'Root comment 2',
        like_count: 0,
        created_at: '2023-01-01T11:00:00Z',
        parent_id: null,
        profiles: mockProfile,
      },
    ];

    const tree = buildCommentTree(flatComments);

    expect(tree).toHaveLength(2);
    // Root comment 2 is newer, so it should be first
    expect(tree[0].id).toBe('3');
    expect(tree[1].id).toBe('1');
    
    // Check replies
    expect(tree[1].replies).toHaveLength(1);
    expect(tree[1].replies[0].id).toBe('2');
  });

  it('should handle orphaned comments as roots', () => {
    const flatComments: FlatComment[] = [
      {
        id: '2',
        user_id: 'user2',
        content: 'Reply to missing parent',
        like_count: 0,
        created_at: '2023-01-01T10:05:00Z',
        parent_id: 'missing',
        profiles: mockProfile,
      },
    ];

    const tree = buildCommentTree(flatComments);
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('2');
  });

  it('should sort replies chronologically (oldest first)', () => {
    const flatComments: FlatComment[] = [
      {
        id: '1',
        user_id: 'user1',
        content: 'Root',
        like_count: 0,
        created_at: '2023-01-01T10:00:00Z',
        parent_id: null,
        profiles: mockProfile,
      },
      {
        id: '2',
        user_id: 'user2',
        content: 'Reply 2 (Newer)',
        like_count: 0,
        created_at: '2023-01-01T10:10:00Z',
        parent_id: '1',
        profiles: mockProfile,
      },
      {
        id: '3',
        user_id: 'user3',
        content: 'Reply 1 (Older)',
        like_count: 0,
        created_at: '2023-01-01T10:05:00Z',
        parent_id: '1',
        profiles: mockProfile,
      },
    ];

    const tree = buildCommentTree(flatComments);
    const replies = tree[0].replies;
    
    expect(replies).toHaveLength(2);
    expect(replies[0].id).toBe('3'); // Older first
    expect(replies[1].id).toBe('2'); // Newer second
  });
});
