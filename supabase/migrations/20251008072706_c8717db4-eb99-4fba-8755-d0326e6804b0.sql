-- Create view_tracking table for detailed view analytics
CREATE TABLE IF NOT EXISTS public.view_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  view_date DATE NOT NULL DEFAULT CURRENT_DATE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  views_generated INTEGER NOT NULL DEFAULT 1,
  last_view_increment TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id, view_date)
);

-- Enable RLS
ALTER TABLE public.view_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can track their own views"
  ON public.view_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tracking"
  ON public.view_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracking"
  ON public.view_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_article', 'comment_reply', 'comment_like', 'article_like')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  related_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  related_article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  related_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_view_tracking_article_user ON public.view_tracking(article_id, user_id);

-- Function to increment views gradually
CREATE OR REPLACE FUNCTION public.increment_article_view()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE id = NEW.article_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to increment views
CREATE TRIGGER on_view_tracking_insert
  AFTER INSERT ON public.view_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_article_view();

-- Add media_type to articles for new formats
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'article' CHECK (media_type IN ('article', 'video', 'audio'));

-- Add audio_url for podcast format
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS audio_url TEXT;