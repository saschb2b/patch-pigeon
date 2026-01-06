-- Products table: stores product information
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Changelog entries table
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('feature', 'improvement', 'fix', 'breaking')),
  version TEXT,
  published BOOLEAN DEFAULT FALSE,
  publish_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, slug)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_product_id ON entries(product_id);
CREATE INDEX IF NOT EXISTS idx_entries_slug ON entries(slug);
CREATE INDEX IF NOT EXISTS idx_entries_published ON entries(published);
CREATE INDEX IF NOT EXISTS idx_entries_publish_date ON entries(publish_date DESC);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
-- Users can only view their own products (admin access)
CREATE POLICY "Users can view own products" ON products 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products" ON products 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON products 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products" ON products 
  FOR DELETE USING (auth.uid() = user_id);

-- Public can view products by slug (for public changelog pages)
CREATE POLICY "Public can view products by slug" ON products 
  FOR SELECT USING (true);

-- RLS Policies for entries
-- Users can manage entries for their own products
CREATE POLICY "Users can view own entries" ON entries 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = entries.product_id AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own entries" ON entries 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = entries.product_id AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own entries" ON entries 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = entries.product_id AND products.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own entries" ON entries 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = entries.product_id AND products.user_id = auth.uid()
    )
  );

-- Public can view published entries
CREATE POLICY "Public can view published entries" ON entries 
  FOR SELECT USING (published = true);
