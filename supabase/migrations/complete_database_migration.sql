-- ============================================
-- CareerPath Platform - Complete Database Migration
-- ============================================
-- This file contains ALL database changes from scratch
-- Safe to run multiple times (idempotent)
-- Will only create missing tables/columns/indexes
-- ============================================
-- Created: January 2025
-- Version: 1.0 Complete
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set search path
SET search_path TO public;

-- ============================================
-- SECTION 1: CORE TABLES
-- ============================================

-- Users table (if not exists)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  bio TEXT,
  skills TEXT[],
  interests TEXT[],
  education JSONB,
  experience JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.users 
    ADD COLUMN role VARCHAR(50) DEFAULT 'student';
  END IF;
END $$;

-- Mentors table (if not exists)
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  expertise TEXT[],
  hourly_rate DECIMAL(10,2),
  availability JSONB,
  rating DECIMAL(3,2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mentoring Sessions table (if not exists)
CREATE TABLE IF NOT EXISTS public.mentoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  topic VARCHAR(255),
  notes TEXT,
  meeting_link VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments table (if not exists)
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  questions JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table (if not exists)
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  requirements TEXT[],
  salary_range VARCHAR(100),
  job_type VARCHAR(50),
  domain VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 2: ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================

-- Add vetting columns to mentors table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentors' AND column_name = 'vetting_status'
  ) THEN
    ALTER TABLE public.mentors 
    ADD COLUMN vetting_status VARCHAR(20) DEFAULT 'pending' 
    CHECK (vetting_status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentors' AND column_name = 'vetting_score'
  ) THEN
    ALTER TABLE public.mentors ADD COLUMN vetting_score DECIMAL(5, 2);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentors' AND column_name = 'vetting_test_results'
  ) THEN
    ALTER TABLE public.mentors ADD COLUMN vetting_test_results JSONB;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentors' AND column_name = 'mentor_type'
  ) THEN
    ALTER TABLE public.mentors 
    ADD COLUMN mentor_type VARCHAR(20) DEFAULT 'professional' 
    CHECK (mentor_type IN ('near-peer', 'professional'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentors' AND column_name = 'vetting_completed_at'
  ) THEN
    ALTER TABLE public.mentors ADD COLUMN vetting_completed_at TIMESTAMPTZ;
  END IF;
END $$;

-- Add payment columns to mentoring_sessions table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentoring_sessions' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.mentoring_sessions 
    ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentoring_sessions' AND column_name = 'payment_amount'
  ) THEN
    ALTER TABLE public.mentoring_sessions ADD COLUMN payment_amount DECIMAL(10, 2);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentoring_sessions' AND column_name = 'payment_id'
  ) THEN
    ALTER TABLE public.mentoring_sessions ADD COLUMN payment_id VARCHAR(255);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentoring_sessions' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE public.mentoring_sessions ADD COLUMN payment_method VARCHAR(50);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentoring_sessions' AND column_name = 'razorpay_order_id'
  ) THEN
    ALTER TABLE public.mentoring_sessions ADD COLUMN razorpay_order_id VARCHAR(255);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mentoring_sessions' AND column_name = 'razorpay_payment_id'
  ) THEN
    ALTER TABLE public.mentoring_sessions ADD COLUMN razorpay_payment_id VARCHAR(255);
  END IF;
END $$;

-- Add company columns to jobs table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'company_user_id'
  ) THEN
    ALTER TABLE public.jobs 
    ADD COLUMN company_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.jobs 
    ADD COLUMN status VARCHAR(20) DEFAULT 'active' 
    CHECK (status IN ('draft', 'active', 'closed', 'archived'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'views_count'
  ) THEN
    ALTER TABLE public.jobs ADD COLUMN views_count INTEGER DEFAULT 0;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'applications_count'
  ) THEN
    ALTER TABLE public.jobs ADD COLUMN applications_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================
-- SECTION 3: NEW TABLES
-- ============================================

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  metadata JSONB,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Roadmaps table
CREATE TABLE IF NOT EXISTS public.ai_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assessment_id UUID,
  roadmap_data JSONB NOT NULL,
  career_goal VARCHAR(255),
  current_skills TEXT[],
  target_skills TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mentor Vetting Tests table
CREATE TABLE IF NOT EXISTS public.mentor_vetting_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  test_type VARCHAR(50) NOT NULL,
  questions JSONB NOT NULL,
  answers JSONB,
  score DECIMAL(5, 2),
  passed BOOLEAN DEFAULT FALSE,
  ai_evaluation JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment Results table
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  skills JSONB NOT NULL DEFAULT '{}',
  interests JSONB NOT NULL DEFAULT '{}',
  personality_traits JSONB DEFAULT '{}',
  career_recommendations JSONB DEFAULT '[]',
  skill_gaps JSONB DEFAULT '[]',
  ai_analysis TEXT,
  answers JSONB NOT NULL DEFAULT '[]',
  score INTEGER CHECK (score >= 0 AND score <= 100),
  total_points INTEGER DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Career Roadmaps table
CREATE TABLE IF NOT EXISTS public.career_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessment_results(id) ON DELETE SET NULL,
  career_path VARCHAR(255) NOT NULL,
  milestones JSONB NOT NULL DEFAULT '[]',
  resources JSONB DEFAULT '[]',
  timeline_months INTEGER,
  current_step INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  ai_generated BOOLEAN DEFAULT TRUE,
  ai_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Actions Log table
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  target_id UUID,
  target_type VARCHAR(50),
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  topic VARCHAR(255),
  notes TEXT,
  meeting_link VARCHAR(500),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 4: INDEXES FOR PERFORMANCE
-- ============================================

-- Mentors indexes
CREATE INDEX IF NOT EXISTS idx_mentors_user_id ON public.mentors(user_id);
CREATE INDEX IF NOT EXISTS idx_mentors_vetting_status ON public.mentors(vetting_status);
CREATE INDEX IF NOT EXISTS idx_mentors_mentor_type ON public.mentors(mentor_type);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order ON public.payments(razorpay_order_id);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_company_user_id ON public.jobs(company_user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_domain ON public.jobs(domain);

-- Assessment Results indexes
CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_completed ON public.assessment_results(completed_at DESC);

-- Career Roadmaps indexes
CREATE INDEX IF NOT EXISTS idx_roadmap_user ON public.career_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_assessment ON public.career_roadmaps(assessment_id);

-- Admin Actions indexes
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_type ON public.admin_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created ON public.admin_actions(created_at DESC);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor ON public.bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled ON public.bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- Mentoring Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.mentoring_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_mentor ON public.mentoring_sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.mentoring_sessions(status);

-- ============================================
-- SECTION 5: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentoring_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_vetting_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Mentors policies
DROP POLICY IF EXISTS "Anyone can view approved mentors" ON public.mentors;
CREATE POLICY "Anyone can view approved mentors"
  ON public.mentors FOR SELECT
  USING (vetting_status = 'approved' OR user_id = auth.uid());

DROP POLICY IF EXISTS "Mentors can update own profile" ON public.mentors;
CREATE POLICY "Mentors can update own profile"
  ON public.mentors FOR UPDATE
  USING (user_id = auth.uid());

-- Payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
CREATE POLICY "Users can insert own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- AI Roadmaps policies
DROP POLICY IF EXISTS "Users can view own roadmaps" ON public.ai_roadmaps;
CREATE POLICY "Users can view own roadmaps"
  ON public.ai_roadmaps FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create roadmaps" ON public.ai_roadmaps;
CREATE POLICY "Users can create roadmaps"
  ON public.ai_roadmaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Mentor Vetting Tests policies
DROP POLICY IF EXISTS "Mentors can view own tests" ON public.mentor_vetting_tests;
CREATE POLICY "Mentors can view own tests"
  ON public.mentor_vetting_tests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );

-- Jobs policies
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (status = 'active' OR company_user_id = auth.uid());

DROP POLICY IF EXISTS "Companies can insert jobs" ON public.jobs;
CREATE POLICY "Companies can insert jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = company_user_id);

DROP POLICY IF EXISTS "Companies can update their jobs" ON public.jobs;
CREATE POLICY "Companies can update their jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = company_user_id);

DROP POLICY IF EXISTS "Companies can delete their jobs" ON public.jobs;
CREATE POLICY "Companies can delete their jobs"
  ON public.jobs FOR DELETE
  USING (auth.uid() = company_user_id);

-- Assessment Results policies
DROP POLICY IF EXISTS "Users can view own assessments" ON public.assessment_results;
CREATE POLICY "Users can view own assessments"
  ON public.assessment_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own assessments" ON public.assessment_results;
CREATE POLICY "Users can insert own assessments"
  ON public.assessment_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own assessments" ON public.assessment_results;
CREATE POLICY "Users can update own assessments"
  ON public.assessment_results FOR UPDATE
  USING (auth.uid() = user_id);

-- Career Roadmaps policies
DROP POLICY IF EXISTS "Users can view own career roadmaps" ON public.career_roadmaps;
CREATE POLICY "Users can view own career roadmaps"
  ON public.career_roadmaps FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own career roadmaps" ON public.career_roadmaps;
CREATE POLICY "Users can insert own career roadmaps"
  ON public.career_roadmaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own career roadmaps" ON public.career_roadmaps;
CREATE POLICY "Users can update own career roadmaps"
  ON public.career_roadmaps FOR UPDATE
  USING (auth.uid() = user_id);

-- Bookings policies
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Mentors can view their bookings" ON public.bookings;
CREATE POLICY "Mentors can view their bookings"
  ON public.bookings FOR SELECT
  USING (
    mentor_id IN (
      SELECT id FROM public.mentors WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
CREATE POLICY "Users can insert own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin Actions policies
DROP POLICY IF EXISTS "Admins can view all actions" ON public.admin_actions;
CREATE POLICY "Admins can view all actions"
  ON public.admin_actions FOR SELECT
  USING (auth.uid() = admin_id);

DROP POLICY IF EXISTS "Admins can insert actions" ON public.admin_actions;
CREATE POLICY "Admins can insert actions"
  ON public.admin_actions FOR INSERT
  WITH CHECK (auth.uid() = admin_id);

-- Mentoring Sessions policies
DROP POLICY IF EXISTS "Users can view own sessions" ON public.mentoring_sessions;
CREATE POLICY "Users can view own sessions"
  ON public.mentoring_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Mentors can view their sessions" ON public.mentoring_sessions;
CREATE POLICY "Mentors can view their sessions"
  ON public.mentoring_sessions FOR SELECT
  USING (
    mentor_id IN (
      SELECT id FROM public.mentors WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own sessions" ON public.mentoring_sessions;
CREATE POLICY "Users can insert own sessions"
  ON public.mentoring_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Assessments policies
DROP POLICY IF EXISTS "Anyone can view assessments" ON public.assessments;
CREATE POLICY "Anyone can view assessments"
  ON public.assessments FOR SELECT
  USING (TRUE);

-- ============================================
-- SECTION 6: FUNCTIONS & TRIGGERS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mentors_updated_at ON public.mentors;
CREATE TRIGGER update_mentors_updated_at
  BEFORE UPDATE ON public.mentors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.mentoring_sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.mentoring_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessment_results_updated_at ON public.assessment_results;
CREATE TRIGGER update_assessment_results_updated_at
  BEFORE UPDATE ON public.assessment_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_career_roadmaps_updated_at ON public.career_roadmaps;
CREATE TRIGGER update_career_roadmaps_updated_at
  BEFORE UPDATE ON public.career_roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_roadmaps_updated_at ON public.ai_roadmaps;
CREATE TRIGGER update_ai_roadmaps_updated_at
  BEFORE UPDATE ON public.ai_roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SECTION 7: GRANT PERMISSIONS
-- ============================================

GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.mentors TO authenticated;
GRANT ALL ON public.mentoring_sessions TO authenticated;
GRANT ALL ON public.assessments TO authenticated;
GRANT ALL ON public.jobs TO authenticated;
GRANT ALL ON public.payments TO authenticated;
GRANT ALL ON public.ai_roadmaps TO authenticated;
GRANT ALL ON public.mentor_vetting_tests TO authenticated;
GRANT ALL ON public.assessment_results TO authenticated;
GRANT ALL ON public.career_roadmaps TO authenticated;
GRANT ALL ON public.admin_actions TO authenticated;
GRANT ALL ON public.bookings TO authenticated;

-- ============================================
-- SECTION 8: VERIFICATION QUERIES
-- ============================================
-- Run these queries after migration to verify success
-- ============================================

-- Check all tables exist
SELECT 
  'Tables Created' as check_type,
  COUNT(*) as count,
  'Expected: 12+' as expected
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';

-- Check mentors table has all columns
SELECT 
  'Mentors Columns' as check_type,
  COUNT(*) as count,
  'Expected: 5' as expected
FROM information_schema.columns
WHERE table_name = 'mentors'
  AND column_name IN ('vetting_status', 'vetting_score', 'vetting_test_results', 'mentor_type', 'vetting_completed_at');

-- Check mentoring_sessions has payment columns
SELECT 
  'Sessions Payment Columns' as check_type,
  COUNT(*) as count,
  'Expected: 6' as expected
FROM information_schema.columns
WHERE table_name = 'mentoring_sessions'
  AND column_name IN ('payment_status', 'payment_amount', 'payment_id', 'payment_method', 'razorpay_order_id', 'razorpay_payment_id');

-- Check new tables exist
SELECT 
  'New Tables' as check_type,
  COUNT(*) as count,
  'Expected: 7' as expected
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('payments', 'ai_roadmaps', 'mentor_vetting_tests', 'assessment_results', 'career_roadmaps', 'admin_actions', 'bookings');

-- Check indexes created
SELECT 
  'Indexes Created' as check_type,
  COUNT(*) as count,
  'Expected: 20+' as expected
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%';

-- Check RLS enabled on all tables
SELECT 
  'RLS Enabled Tables' as check_type,
  COUNT(*) as count,
  'Expected: 12+' as expected
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true;

-- Check RLS policies created
SELECT 
  'RLS Policies' as check_type,
  COUNT(*) as count,
  'Expected: 25+' as expected
FROM pg_policies
WHERE schemaname = 'public';

-- ============================================
-- MIGRATION COMPLETE! ✅
-- ============================================
-- All tables, columns, indexes, and policies created
-- Safe to run multiple times
-- Check verification queries above for confirmation
-- ============================================