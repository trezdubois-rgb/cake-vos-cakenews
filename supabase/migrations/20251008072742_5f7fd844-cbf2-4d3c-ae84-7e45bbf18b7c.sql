-- Drop trigger first, then function, then recreate both with correct security settings
DROP TRIGGER IF EXISTS on_view_tracking_insert ON public.view_tracking;
DROP FUNCTION IF EXISTS public.increment_article_view() CASCADE;

-- Recreate function with proper security
CREATE OR REPLACE FUNCTION public.increment_article_view()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE id = NEW.article_id;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_view_tracking_insert
  AFTER INSERT ON public.view_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_article_view();