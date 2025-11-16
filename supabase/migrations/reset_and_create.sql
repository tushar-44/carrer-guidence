-- Migration: reset_and_create.sql
-- WARNING: Destructive. Back up data before running.

-- Ensure pgcrypto for gen_random_uuid is available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1) DROP policies (if exist) and tables
--    Use DROP POLICY IF EXISTS <name> ON <table>
-- ============================================
-- NOTE: Dropping policies on non-existent tables causes errors like
-- "relation \"public.foo\" does not exist" in Postgres. We rely on
-- DROP TABLE IF EXISTS ... CASCADE below to remove any attached
-- policies. If you prefer to explicitly drop policies, we must first
-- check that the table exists before issuing DROP POLICY statements.

-- Drop tables (reverse dependency order)
DROP TABLE IF EXISTS public.case_studies CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.career_paths CASCADE;
DROP TABLE IF EXISTS public.mentoring_sessions CASCADE;
DROP TABLE IF EXISTS public.assessment_results CASCADE;
DROP TABLE IF EXISTS public.assessment_questions CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.mentor_availability CASCADE;
DROP TABLE IF EXISTS public.mentors CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================
-- 2) CREATE tables + RLS policies
-- ============================================

-- Users table
CREATE TABLE public.users (
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

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view mentor profiles"
  ON public.users FOR SELECT 
  USING (user_type = 'mentor' OR auth.uid() = id);

-- Mentors
CREATE TABLE public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  expertise TEXT[] NOT NULL,
  experience_years INTEGER NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  bio TEXT,
  languages TEXT[] DEFAULT ARRAY[]::TEXT[],
  education TEXT,
  company VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  response_time VARCHAR(50),
  specializations TEXT[] DEFAULT ARRAY[]::TEXT[],
  achievements TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors are viewable by everyone"
  ON public.mentors FOR SELECT USING (TRUE);

CREATE POLICY "Mentors can update their own profile"
  ON public.mentors FOR UPDATE USING (auth.uid() = user_id);

-- Mentor availability
CREATE TABLE public.mentor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors ON DELETE CASCADE,
  day_of_week VARCHAR(10) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Availability is viewable by everyone"
  ON public.mentor_availability FOR SELECT USING (TRUE);

CREATE POLICY "Mentors can manage their availability"
  ON public.mentor_availability FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );

-- Jobs
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'internship', 'contract')),
  salary_range VARCHAR(100),
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  responsibilities TEXT[] DEFAULT ARRAY[]::TEXT[],
  skills_required TEXT[] DEFAULT ARRAY[]::TEXT[],
  domain VARCHAR(100),
  experience_level VARCHAR(50),
  posted_date TIMESTAMP DEFAULT NOW(),
  application_deadline TIMESTAMP,
  company_logo_url TEXT,
  benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_remote BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone"
  ON public.jobs FOR SELECT USING (TRUE);

-- Job applications
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'rejected', 'accepted')),
  cover_letter TEXT,
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
  ON public.job_applications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
  ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Assessments
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  total_questions INTEGER NOT NULL,
  passing_score DECIMAL(5, 2),
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assessments are viewable by everyone"
  ON public.assessments FOR SELECT USING (TRUE);

-- Assessment questions
CREATE TABLE public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('single', 'multiple', 'scale')),
  options JSONB NOT NULL,
  correct_answer VARCHAR(255),
  points INTEGER DEFAULT 1,
  order_number INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are viewable by everyone"
  ON public.assessment_questions FOR SELECT USING (TRUE);

-- Assessment results
CREATE TABLE public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.assessments ON DELETE CASCADE,
  score DECIMAL(5, 2) NOT NULL,
  total_points INTEGER NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  time_taken_minutes INTEGER,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  answers JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own results"
  ON public.assessment_results FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create results"
  ON public.assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mentoring sessions
CREATE TABLE public.mentoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentors ON DELETE CASCADE,
  session_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  meeting_link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.mentoring_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their sessions"
  ON public.mentoring_sessions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM public.mentors WHERE id = mentor_id
  ));

-- Career paths
CREATE TABLE public.career_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  recommended_careers TEXT[] NOT NULL,
  matching_jobs UUID[] DEFAULT ARRAY[]::UUID[],
  recommended_mentors UUID[] DEFAULT ARRAY[]::UUID[],
  assessment_score DECIMAL(5, 2),
  generated_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their career path"
  ON public.career_paths FOR SELECT USING (auth.uid() = user_id);

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES public.mentors ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials are viewable by everyone"
  ON public.testimonials FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Users can create testimonials"
  ON public.testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Case studies
CREATE TABLE public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  category VARCHAR(100),
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Case studies are viewable by everyone"
  ON public.case_studies FOR SELECT USING (TRUE);

-- ============================================
-- 3) Create recommended indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_jobs_domain ON public.jobs(domain);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON public.jobs(posted_date);
CREATE INDEX IF NOT EXISTS idx_mentors_rating ON public.mentors(rating);
CREATE INDEX IF NOT EXISTS idx_assessments_category ON public.assessments(category);

-- ============================================
-- End of migration
-- ============================================
