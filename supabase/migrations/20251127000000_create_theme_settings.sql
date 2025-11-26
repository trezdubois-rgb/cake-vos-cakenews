-- Create theme_settings table
CREATE TABLE IF NOT EXISTS public.theme_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Ensure singleton row
    primary_color TEXT NOT NULL DEFAULT '#3B82F6',
    secondary_color TEXT NOT NULL DEFAULT '#EC4899',
    font_heading TEXT NOT NULL DEFAULT 'Inter',
    font_body TEXT NOT NULL DEFAULT 'Inter',
    border_radius TEXT NOT NULL DEFAULT '0.5rem',
    theme_mode TEXT NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access for all users"
ON public.theme_settings FOR SELECT
USING (true);

CREATE POLICY "Allow update for admins only"
ON public.theme_settings FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    )
);

CREATE POLICY "Allow insert for admins only (if empty)"
ON public.theme_settings FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    )
);

-- Insert default row if not exists
INSERT INTO public.theme_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
