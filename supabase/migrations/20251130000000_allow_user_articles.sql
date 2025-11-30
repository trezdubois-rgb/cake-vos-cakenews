-- Temporarily allow authenticated users to create articles (for testing)
-- This replaces the admin-only policy with a more permissive one

DROP POLICY IF EXISTS "Admins can insert articles" ON public.articles;

CREATE POLICY "Authenticated users can insert articles"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);
