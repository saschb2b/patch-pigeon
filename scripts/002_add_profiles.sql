-- Profiles table: stores user profile with unique owner slug
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_slug TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for owner_slug lookups
CREATE INDEX IF NOT EXISTS idx_profiles_owner_slug ON profiles(owner_slug);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Public can view profiles (for public changelog pages)
CREATE POLICY "Public can view profiles" ON profiles 
  FOR SELECT USING (true);

-- Remove unique constraint on products.slug (now scoped per user)
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_slug_key;

-- Add unique constraint on (user_id, slug) instead
ALTER TABLE products ADD CONSTRAINT products_user_slug_unique UNIQUE (user_id, slug);
