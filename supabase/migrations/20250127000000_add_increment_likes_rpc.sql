-- Function to safely increment/decrement article likes
CREATE OR REPLACE FUNCTION public.increment_likes(
  article_id UUID,
  increment_value INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.articles
  SET like_count = GREATEST(0, COALESCE(like_count, 0) + increment_value)
  WHERE id = article_id;
END;
$$;

