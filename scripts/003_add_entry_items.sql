-- Entry Items table: structured changes within each version entry
-- This replaces free-form markdown with structured, typed entries

-- Add new change types
CREATE TYPE change_type AS ENUM (
  'FEATURE',
  'FIX',
  'IMPROVEMENT',
  'KNOWNISSUE',
  'BREAKING',
  'REMOVED',
  'NOTE'
);

-- Entry Items table
CREATE TABLE IF NOT EXISTS entry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  type change_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  area TEXT, -- Optional: tag like "Editor", "API", "Mobile"
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_entry_items_entry_id ON entry_items(entry_id);
CREATE INDEX IF NOT EXISTS idx_entry_items_sort_order ON entry_items(sort_order);

-- Enable Row Level Security
ALTER TABLE entry_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for entry_items
-- Users can manage items for entries they own
CREATE POLICY "Users can view own entry items" ON entry_items 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM entries e 
      JOIN products p ON p.id = e.product_id 
      WHERE e.id = entry_items.entry_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own entry items" ON entry_items 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM entries e 
      JOIN products p ON p.id = e.product_id 
      WHERE e.id = entry_items.entry_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own entry items" ON entry_items 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM entries e 
      JOIN products p ON p.id = e.product_id 
      WHERE e.id = entry_items.entry_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own entry items" ON entry_items 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM entries e 
      JOIN products p ON p.id = e.product_id 
      WHERE e.id = entry_items.entry_id AND p.user_id = auth.uid()
    )
  );

-- Public can view items for published entries
CREATE POLICY "Public can view published entry items" ON entry_items 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM entries WHERE entries.id = entry_items.entry_id AND entries.published = true
    )
  );

-- Drop the old type constraint on entries (we'll keep the column for backwards compatibility but make it optional)
ALTER TABLE entries ALTER COLUMN type DROP NOT NULL;
ALTER TABLE entries ALTER COLUMN content DROP NOT NULL;

-- Add a summary field for version-level description (optional)
ALTER TABLE entries ADD COLUMN IF NOT EXISTS summary TEXT;
