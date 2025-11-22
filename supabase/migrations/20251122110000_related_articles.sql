-- Function to get related articles based on tags and category
CREATE OR REPLACE FUNCTION public.get_related_articles(
  p_article_id UUID,
  p_limit INTEGER DEFAULT 3
)
RETURNS SETOF public.articles
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_tags TEXT[];
  v_category TEXT;
BEGIN
  -- Get tags and category of the current article
  SELECT tags, category INTO v_tags, v_category
  FROM public.articles
  WHERE id = p_article_id;

  RETURN QUERY
  SELECT *
  FROM public.articles
  WHERE id != p_article_id -- Exclude current article
  AND published = true
  AND (
    -- Match by tags (overlap)
    tags && v_tags
    OR
    -- Match by category
    category = v_category
  )
  ORDER BY
    -- Prioritize tag matches (more specific)
    (CASE WHEN tags && v_tags THEN 1 ELSE 0 END) DESC,
    -- Then category matches
    (CASE WHEN category = v_category THEN 1 ELSE 0 END) DESC,
    -- Then recency
    published_at DESC
  LIMIT p_limit;
END;
$$;
