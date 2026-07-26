-- Supabase Schema for Nimo Sync
-- This schema mirrors the local Drizzle SQLite schema for the 'journal' and 'moment' tables.

-- We use auth.uid() to scope data to the authenticated user.

CREATE TABLE public.journal (
  sync_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_id INTEGER, -- The original local SQLite ID (for reference, though sync_id is primary)
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.moment (
  sync_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_id INTEGER,
  journal_sync_id TEXT NOT NULL REFERENCES public.journal(sync_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  emotion TEXT,
  title TEXT,
  media_uri TEXT,
  media_type TEXT,
  is_draft BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moment ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can manage their own journals" ON public.journal
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own moments" ON public.moment
  FOR ALL USING (auth.uid() = user_id);

-- Create updated_at trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_journal_updated_at
  BEFORE UPDATE ON public.journal
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_moment_updated_at
  BEFORE UPDATE ON public.moment
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
