-- Table pour les restrictions de contenu par utilisateur
CREATE TABLE public.user_content_restrictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  restriction_type TEXT NOT NULL CHECK (restriction_type IN ('category', 'tag', 'keyword')),
  restriction_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID NOT NULL,
  reason TEXT,
  UNIQUE(user_id, restriction_type, restriction_value)
);

-- Enable RLS
ALTER TABLE public.user_content_restrictions ENABLE ROW LEVEL SECURITY;

-- Policies for admins only
CREATE POLICY "Admins can manage content restrictions"
ON public.user_content_restrictions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own restrictions
CREATE POLICY "Users can view their restrictions"
ON public.user_content_restrictions
FOR SELECT
USING (auth.uid() = user_id);

-- Table pour les suspensions/bans temporaires
CREATE TABLE public.user_suspensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  suspended_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  suspended_until TIMESTAMP WITH TIME ZONE,
  reason TEXT NOT NULL,
  created_by UUID NOT NULL,
  is_permanent BOOLEAN DEFAULT false,
  lifted_at TIMESTAMP WITH TIME ZONE,
  lifted_by UUID
);

-- Enable RLS
ALTER TABLE public.user_suspensions ENABLE ROW LEVEL SECURITY;

-- Policies for admins only
CREATE POLICY "Admins can manage suspensions"
ON public.user_suspensions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own suspensions
CREATE POLICY "Users can view their suspensions"
ON public.user_suspensions
FOR SELECT
USING (auth.uid() = user_id);