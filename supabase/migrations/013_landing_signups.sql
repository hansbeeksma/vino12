-- Landing page A/B test signups (VINO-137)
CREATE TABLE public.landing_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  variant CHAR(1) NOT NULL CHECK (variant IN ('a', 'b', 'c')),
  source TEXT,
  medium TEXT,
  campaign TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_landing_signups_email ON public.landing_signups(email);

ALTER TABLE public.landing_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role insert" ON public.landing_signups
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role select" ON public.landing_signups
  FOR SELECT TO service_role USING (true);
