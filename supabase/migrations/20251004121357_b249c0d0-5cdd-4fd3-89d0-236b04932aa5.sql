-- Make category optional since we're using category_id now
ALTER TABLE public.articles 
ALTER COLUMN category DROP NOT NULL;