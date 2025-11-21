-- Index pour la récupération du feed d'articles (filtrage par published et tri par date)
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON public.articles(published, published_at DESC);

-- Index pour la récupération des commentaires d'un article (filtrage par article_id et parent_id)
CREATE INDEX IF NOT EXISTS idx_comments_article_parent ON public.comments(article_id, parent_id);

-- Index pour récupérer les likes d'un commentaire par utilisateur (pour vérifier si liké)
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_user ON public.comment_likes(comment_id, user_id);

-- Index pour les clés étrangères (bonnes pratiques)
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
