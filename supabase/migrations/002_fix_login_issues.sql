-- Migration: 002_fix_login_issues.sql
-- Fix login and profile access issues

-- ============================================
-- 1) Ensure users table exists with correct structure
-- ============================================

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('graduates', 'mentor', 'company')),
  bio TEXT,
  phone TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2) Enable RLS on users table
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3) Drop existing policies if they exist
-- ============================================

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Public can view mentor profiles" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;

-- ============================================
-- 4) Create comprehensive RLS policies
-- ============================================

-- Allow users to read their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup)
CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to view mentor and company profiles
CREATE POLICY "Authenticated users can view mentor and company profiles"
  ON public.users FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND (user_type = 'mentor' OR user_type = 'company')
  );

-- ============================================
-- 5) Create function to handle new user creation
-- ============================================

-- Drop function if exists
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, user_type, verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'graduates'),
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6) Create trigger for automatic profile creation
-- ============================================

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7) Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_verified ON public.users(verified);

-- ============================================
-- 8) Grant necessary permissions
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant permissions on users table
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- ============================================
-- End of migration
-- ============================================