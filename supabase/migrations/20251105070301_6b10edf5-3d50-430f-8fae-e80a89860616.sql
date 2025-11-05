-- D'abord, mettre à jour tous les articles sans catégorie
UPDATE public.articles 
SET category = 'Actualité' 
WHERE category IS NULL OR category = '' OR category = 'Non catégorisé';

-- Ajouter les colonnes de préférences à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{"tags": [], "authors": [], "categories": [], "formats": []}'::jsonb;

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_preferences ON public.profiles USING GIN (preferences);

-- Fonction pour vérifier si un article correspond aux préférences
CREATE OR REPLACE FUNCTION public.article_matches_preferences(
  article_tags text[],
  article_author_id uuid,
  article_category text,
  user_preferences jsonb
)
RETURNS boolean
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  pref_tags jsonb;
  pref_authors jsonb;
  pref_categories jsonb;
BEGIN
  pref_tags := user_preferences->'tags';
  pref_authors := user_preferences->'authors';
  pref_categories := user_preferences->'categories';
  
  IF (pref_tags IS NULL OR jsonb_array_length(pref_tags) = 0) 
     AND (pref_authors IS NULL OR jsonb_array_length(pref_authors) = 0)
     AND (pref_categories IS NULL OR jsonb_array_length(pref_categories) = 0) THEN
    RETURN false;
  END IF;
  
  IF article_tags IS NOT NULL AND pref_tags IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM jsonb_array_elements_text(pref_tags) AS pref_tag
      WHERE pref_tag = ANY(article_tags)
    ) THEN
      RETURN true;
    END IF;
  END IF;
  
  IF pref_authors IS NOT NULL THEN
    IF pref_authors ? article_author_id::text THEN
      RETURN true;
    END IF;
  END IF;
  
  IF article_category IS NOT NULL AND pref_categories IS NOT NULL THEN
    IF pref_categories ? article_category THEN
      RETURN true;
    END IF;
  END IF;
  
  RETURN false;
END;
$$;

-- Maintenant appliquer la contrainte NOT NULL avec une valeur par défaut
ALTER TABLE public.articles 
ALTER COLUMN category SET DEFAULT 'Actualité',
ALTER COLUMN category SET NOT NULL;