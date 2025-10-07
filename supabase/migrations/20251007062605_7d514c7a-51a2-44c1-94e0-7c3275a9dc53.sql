-- Fix the relationship between articles and profiles
ALTER TABLE public.articles
DROP CONSTRAINT IF EXISTS articles_author_id_fkey;

ALTER TABLE public.articles
ADD CONSTRAINT articles_author_id_fkey 
FOREIGN KEY (author_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Add content_blocks column to store structured block content
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS content_blocks jsonb DEFAULT '[]'::jsonb;

-- Add scheduled_publish_at for content scheduling
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS scheduled_publish_at timestamp with time zone;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_publish 
ON public.articles(scheduled_publish_at) 
WHERE scheduled_publish_at IS NOT NULL AND published = false;