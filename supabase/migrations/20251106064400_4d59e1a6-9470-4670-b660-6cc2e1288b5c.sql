-- Table pour stocker les identifiants admin générés automatiquement
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  generated_email text UNIQUE NOT NULL,
  generated_password_hash text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  UNIQUE(user_id)
);

-- Table pour les demandes de connexion admin à valider
CREATE TABLE IF NOT EXISTS public.admin_login_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_used text NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  validated_by uuid REFERENCES auth.users(id),
  validated_at timestamp with time zone
);

-- Table pour tracker les sessions invités avec timer
CREATE TABLE IF NOT EXISTS public.guest_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  first_visit timestamp with time zone DEFAULT now() NOT NULL,
  last_visit timestamp with time zone DEFAULT now() NOT NULL,
  time_remaining_seconds integer DEFAULT 240 NOT NULL,
  blocked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_login_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;

-- Policies pour admin_credentials
CREATE POLICY "Super admins can manage admin credentials"
  ON public.admin_credentials
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies pour admin_login_requests
CREATE POLICY "Admins can view login requests"
  ON public.admin_login_requests
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can create login requests"
  ON public.admin_login_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update login requests"
  ON public.admin_login_requests
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies pour guest_sessions
CREATE POLICY "Anyone can manage their own guest session"
  ON public.guest_sessions
  FOR ALL
  USING (true);