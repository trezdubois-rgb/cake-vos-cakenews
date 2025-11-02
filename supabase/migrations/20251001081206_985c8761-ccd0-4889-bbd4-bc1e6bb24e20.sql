-- Add foreign key relationship from comments to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'comments_user_id_fkey'
  ) THEN
    ALTER TABLE public.comments
    ADD CONSTRAINT comments_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create functions to increment/decrement comment likes
CREATE OR REPLACE FUNCTION public.increment_comment_likes(comment_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.comments
  SET like_count = COALESCE(like_count, 0) + 1
  WHERE id = comment_id;
$$;

CREATE OR REPLACE FUNCTION public.decrement_comment_likes(comment_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.comments
  SET like_count = GREATEST(COALESCE(like_count, 0) - 1, 0)
  WHERE id = comment_id;
$$;