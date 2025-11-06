-- Créer la table pour les réactions emoji sur les commentaires
CREATE TABLE public.comment_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL CHECK (emoji IN ('👍', '❤️', '😂', '😮', '😢', '🙏')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id, emoji)
);

-- Créer la table pour les signalements de commentaires
CREATE TABLE public.comment_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  UNIQUE(comment_id, reporter_id)
);

-- Créer la table pour masquer les commentaires
CREATE TABLE public.hidden_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable RLS
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_comments ENABLE ROW LEVEL SECURITY;

-- Policies pour comment_reactions
CREATE POLICY "Reactions are viewable by everyone"
  ON public.comment_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add reactions"
  ON public.comment_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions"
  ON public.comment_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour comment_reports
CREATE POLICY "Users can view their own reports"
  ON public.comment_reports FOR SELECT
  USING (auth.uid() = reporter_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can report comments"
  ON public.comment_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can manage reports"
  ON public.comment_reports FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies pour hidden_comments
CREATE POLICY "Users can view their hidden comments"
  ON public.hidden_comments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can hide comments"
  ON public.hidden_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unhide comments"
  ON public.hidden_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Créer des index pour améliorer les performances
CREATE INDEX idx_comment_reactions_comment_id ON public.comment_reactions(comment_id);
CREATE INDEX idx_comment_reactions_user_id ON public.comment_reactions(user_id);
CREATE INDEX idx_comment_reports_comment_id ON public.comment_reports(comment_id);
CREATE INDEX idx_comment_reports_status ON public.comment_reports(status);
CREATE INDEX idx_hidden_comments_user_id ON public.hidden_comments(user_id);
CREATE INDEX idx_hidden_comments_comment_id ON public.hidden_comments(comment_id);