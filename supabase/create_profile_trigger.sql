-- ============================================
-- AUTO-PROFILE CREATION TRIGGER
-- ============================================
-- This trigger automatically creates a user profile
-- when a new user signs up in auth.users
-- ============================================

-- First, add INSERT policy for users table (if not exists)
-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, user_type, verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN NEW.raw_user_meta_data->>'user_type' = 'mentor' THEN 'mentor'
      WHEN NEW.raw_user_meta_data->>'user_type' = 'company' THEN 'company'
      ELSE 'graduates'
    END,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION
-- ============================================
-- To verify this works:
-- 1. Sign up a new user
-- 2. Check if profile appears in public.users table
-- ============================================

