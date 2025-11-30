-- Fix RLS policies for articles table to allow authenticated users to create articles
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Admins and authors can update their articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.articles;

-- Create new policies that allow authenticated users to create articles
CREATE POLICY "Allow insert for admins or matching author"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR auth.uid() = author_id);

CREATE POLICY "Allow update for admins or authors"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = author_id);

CREATE POLICY "Allow delete for admins"
  ON public.articles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
