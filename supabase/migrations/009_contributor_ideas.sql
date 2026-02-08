-- Contributor Ideas: Web/Voice input + Creative Boards
-- Extends ideas pipeline for direct web submissions

-- ─── Extend ideas table ──────────────────────────────────────
ALTER TABLE public.ideas
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'whatsapp'
    CHECK (source IN ('whatsapp', 'web', 'voice')),
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Make whatsapp_sender nullable (web ideas have no sender)
ALTER TABLE public.ideas
  ALTER COLUMN whatsapp_sender DROP NOT NULL;

-- ─── Creative boards ─────────────────────────────────────────
CREATE TABLE public.creative_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#722F37',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_archived BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Board-Ideas link (many-to-many) ─────────────────────────
CREATE TABLE public.board_ideas (
  board_id UUID NOT NULL REFERENCES public.creative_boards(id) ON DELETE CASCADE,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (board_id, idea_id)
);

-- ─── Creative notes ──────────────────────────────────────────
CREATE TABLE public.creative_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES public.creative_boards(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL DEFAULT '',
  note_type TEXT DEFAULT 'text'
    CHECK (note_type IN ('text', 'checklist', 'reference')),
  metadata JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_ideas_source ON public.ideas(source);
CREATE INDEX idx_ideas_created_by ON public.ideas(created_by);
CREATE INDEX idx_creative_boards_created_by ON public.creative_boards(created_by);
CREATE INDEX idx_creative_notes_board_id ON public.creative_notes(board_id);
CREATE INDEX idx_board_ideas_idea_id ON public.board_ideas(idea_id);

-- ─── Updated_at triggers ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_creative_boards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER creative_boards_updated_at
  BEFORE UPDATE ON public.creative_boards
  FOR EACH ROW
  EXECUTE FUNCTION update_creative_boards_updated_at();

CREATE OR REPLACE FUNCTION update_creative_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER creative_notes_updated_at
  BEFORE UPDATE ON public.creative_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_creative_notes_updated_at();

-- ─── RLS policies ────────────────────────────────────────────
ALTER TABLE public.creative_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_notes ENABLE ROW LEVEL SECURITY;

-- Service role: full access
CREATE POLICY "service_role_all_creative_boards" ON public.creative_boards
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_board_ideas" ON public.board_ideas
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_creative_notes" ON public.creative_notes
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated: CRUD own data
CREATE POLICY "users_select_boards" ON public.creative_boards
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "users_insert_boards" ON public.creative_boards
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "users_update_own_boards" ON public.creative_boards
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "users_delete_own_boards" ON public.creative_boards
  FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "users_select_board_ideas" ON public.board_ideas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "users_manage_board_ideas" ON public.board_ideas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.creative_boards
      WHERE id = board_ideas.board_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "users_select_notes" ON public.creative_notes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "users_insert_notes" ON public.creative_notes
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "users_update_own_notes" ON public.creative_notes
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "users_delete_own_notes" ON public.creative_notes
  FOR DELETE USING (auth.uid() = created_by);

-- Contributors can insert ideas
CREATE POLICY "contributors_insert_ideas" ON public.ideas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Contributors can update their own ideas
CREATE POLICY "contributors_update_own_ideas" ON public.ideas
  FOR UPDATE USING (auth.uid() = created_by);

-- ─── Realtime ────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.creative_boards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.creative_notes;
