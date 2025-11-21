import { Comment } from "@/components/article/CommentSection";

export interface FlatComment {
  id: string;
  user_id: string;
  content: string;
  like_count: number;
  created_at: string;
  parent_id: string | null;
  profiles: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const buildCommentTree = (flatComments: FlatComment[]): Comment[] => {
  // Map to Comment interface
  const allComments = flatComments.map((comment) => ({
    id: comment.id,
    author: {
      id: comment.user_id,
      name: comment.profiles?.display_name || "Utilisateur",
      avatar: comment.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`,
    },
    content: comment.content,
    likes: comment.like_count || 0,
    isLiked: false,
    createdAt: comment.created_at,
    parentId: comment.parent_id,
    replies: [],
  }));

  // Build tree structure in memory
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: Initialize map
  allComments.forEach((comment) => {
    commentMap.set(comment.id, comment);
  });

  // Second pass: Link children to parents
  allComments.forEach((comment) => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(comment);
      } else {
        // Orphaned comment (parent deleted?), treat as root
        rootComments.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  // Sort root comments by newest first
  rootComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Sort replies by oldest first (conversation flow)
  const sortReplies = (comments: Comment[]) => {
    comments.forEach(comment => {
      if (comment.replies.length > 0) {
        comment.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        sortReplies(comment.replies);
      }
    });
  };
  
  sortReplies(rootComments);

  return rootComments;
};
