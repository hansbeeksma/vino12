-- Ideas Pipeline: WhatsApp → AI Analyse → Dashboard
-- Stores incoming ideas and their AI analyses

-- ─── Ideas inbox ───────────────────────────────────────────────
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_sender TEXT NOT NULL,
  sender_name TEXT,
  raw_message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text'
    CHECK (message_type IN ('text', 'voice', 'image')),
  media_url TEXT,
  transcription TEXT,
  status TEXT DEFAULT 'received'
    CHECK (status IN ('received', 'analyzing', 'analyzed', 'actioned', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── AI analyses ───────────────────────────────────────────────
CREATE TABLE public.idea_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  category TEXT
    CHECK (category IN ('product', 'marketing', 'operations', 'tech', 'content', 'design', 'other')),
  urgency TEXT DEFAULT 'medium'
    CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
  complexity TEXT DEFAULT 'medium'
    CHECK (complexity IN ('simple', 'medium', 'complex')),
  feasibility_score INTEGER CHECK (feasibility_score BETWEEN 1 AND 10),
  swot JSONB,
  research_findings JSONB,
  action_plan JSONB,
  estimated_effort TEXT
    CHECK (estimated_effort IN ('XS', 'S', 'M', 'L', 'XL')),
  ai_model TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ───────────────────────────────────────────────────
CREATE INDEX idx_ideas_status ON public.ideas(status);
CREATE INDEX idx_ideas_created_at ON public.ideas(created_at DESC);
CREATE INDEX idx_idea_analyses_idea_id ON public.idea_analyses(idea_id);

-- ─── Updated_at trigger ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_ideas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ideas_updated_at
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_ideas_updated_at();

-- ─── RLS policies ──────────────────────────────────────────────
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_ideas" ON public.ideas
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_analyses" ON public.idea_analyses
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "admin_read_ideas" ON public.ideas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_read_analyses" ON public.idea_analyses
  FOR SELECT USING (auth.role() = 'authenticated');

-- ─── Realtime ──────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.idea_analyses;
