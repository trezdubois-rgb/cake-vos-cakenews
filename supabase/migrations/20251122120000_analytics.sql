-- Create daily_stats table for historical analytics
CREATE TABLE IF NOT EXISTS public.daily_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    views INTEGER NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(date, article_id)
);

-- Enable RLS
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Policies
-- Admins can view all stats
CREATE POLICY "Admins can view all daily stats"
    ON public.daily_stats FOR SELECT
    USING (
        public.has_role(auth.uid(), 'admin'::app_role)
    );

-- Function to increment views in daily_stats
CREATE OR REPLACE FUNCTION public.increment_daily_views()
RETURNS TRIGGER AS $$
BEGIN
    -- We only care about updates where view_count changed
    IF OLD.view_count < NEW.view_count THEN
        INSERT INTO public.daily_stats (date, article_id, views)
        VALUES (CURRENT_DATE, NEW.id, 1)
        ON CONFLICT (date, article_id)
        DO UPDATE SET views = daily_stats.views + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for views
DROP TRIGGER IF EXISTS on_article_view_increment ON public.articles;
CREATE TRIGGER on_article_view_increment
    AFTER UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_daily_views();

-- Function to increment likes in daily_stats
CREATE OR REPLACE FUNCTION public.increment_daily_likes()
RETURNS TRIGGER AS $$
BEGIN
    -- We only care about updates where like_count changed
    IF OLD.like_count < NEW.like_count THEN
        INSERT INTO public.daily_stats (date, article_id, likes)
        VALUES (CURRENT_DATE, NEW.id, 1)
        ON CONFLICT (date, article_id)
        DO UPDATE SET likes = daily_stats.likes + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for likes
DROP TRIGGER IF EXISTS on_article_like_increment ON public.articles;
CREATE TRIGGER on_article_like_increment
    AFTER UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_daily_likes();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON public.daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_daily_stats_article_id ON public.daily_stats(article_id);
