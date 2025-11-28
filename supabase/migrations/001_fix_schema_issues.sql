-- Migration: 001_fix_schema_issues.sql
-- Fix critical schema issues identified in the codebase

-- ============================================
-- 1) Add missing columns to mentors table
-- ============================================

-- Add vetting_status column (referenced in MentorsPage.tsx)
ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS vetting_status VARCHAR(20) DEFAULT 'pending' 
CHECK (vetting_status IN ('pending', 'approved', 'rejected'));

-- Add vetting_score for AI vetting system
ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS vetting_score DECIMAL(5, 2);

-- Add vetting_test_results to store AI test results
ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS vetting_test_results JSONB;

-- Add mentor_type for near-peer vs professional distinction
ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS mentor_type VARCHAR(20) DEFAULT 'professional' 
CHECK (mentor_type IN ('near-peer', 'professional'));

-- Add vetting_completed_at timestamp
ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS vetting_completed_at TIMESTAMP;

-- ============================================
-- 2) Add payment-related columns to mentoring_sessions
-- ============================================

-- Add payment fields to track payment status
ALTER TABLE public.mentoring_sessions 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending' 
CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'));

ALTER TABLE public.mentoring_sessions 
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10, 2);

ALTER TABLE public.mentoring_sessions 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);

ALTER TABLE public.mentoring_sessions 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

ALTER TABLE public.mentoring_sessions 
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);

ALTER TABLE public.mentoring_sessions 
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255);

-- ============================================
-- 3) Create payments table for transaction records
-- ============================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  session_id UUID REFERENCES public.mentoring_sessions ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 4) Create ai_roadmaps table for AI-generated roadmaps
-- ============================================

CREATE TABLE IF NOT EXISTS public.ai_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessments ON DELETE SET NULL,
  roadmap_data JSONB NOT NULL,
  career_goal VARCHAR(255),
  current_skills TEXT[],
  target_skills TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.ai_roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roadmaps"
  ON public.ai_roadmaps FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create roadmaps"
  ON public.ai_roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 5) Create mentor_vetting_tests table
-- ============================================

CREATE TABLE IF NOT EXISTS public.mentor_vetting_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors ON DELETE CASCADE,
  test_type VARCHAR(50) NOT NULL,
  questions JSONB NOT NULL,
  answers JSONB,
  score DECIMAL(5, 2),
  passed BOOLEAN DEFAULT FALSE,
  ai_evaluation JSONB,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.mentor_vetting_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can view their own tests"
  ON public.mentor_vetting_tests FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid())
  );

-- ============================================
-- 6) Add company-related fields to jobs table
-- ============================================

ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS company_user_id UUID REFERENCES public.users ON DELETE CASCADE;

ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' 
CHECK (status IN ('draft', 'active', 'closed', 'archived'));

ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS applications_count INTEGER DEFAULT 0;

-- ============================================
-- 7) Update RLS policies for new columns
-- ============================================

-- Allow companies to manage their own jobs
CREATE POLICY "Companies can insert jobs" 
  ON public.jobs FOR INSERT 
  WITH CHECK (auth.uid() = company_user_id);

CREATE POLICY "Companies can update their jobs" 
  ON public.jobs FOR UPDATE 
  USING (auth.uid() = company_user_id);

CREATE POLICY "Companies can delete their jobs" 
  ON public.jobs FOR DELETE 
  USING (auth.uid() = company_user_id);

-- ============================================
-- 8) Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_mentors_vetting_status ON public.mentors(vetting_status);
CREATE INDEX IF NOT EXISTS idx_mentors_mentor_type ON public.mentors(mentor_type);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_session_id ON public.payments(session_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_user_id ON public.jobs(company_user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);

-- ============================================
-- End of migration
-- ============================================