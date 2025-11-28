-- ============================================
-- COMPLETE DATABASE SCHEMA FOR CAREERPATH PLATFORM
-- ============================================
-- This file contains all tables, RLS policies, indexes, and triggers
-- Ready to execute in Supabase SQL Editor
-- 
-- Execution: Copy entire file and paste into Supabase SQL Editor
-- Time: ~2-3 minutes to execute all
-- ============================================

-- ============================================
-- 1. USERS TABLE
-- ============================================
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

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view mentor profiles"
  ON public.users FOR SELECT 
  USING (user_type = 'mentor' OR auth.uid() = id);

-- ============================================
-- 2. MENTORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.mentors (
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
  vetting_status VARCHAR(20) DEFAULT 'pending' CHECK (vetting_status IN ('pending', 'approved', 'rejected')),
  vetting_score DECIMAL(5, 2),
  vetting_test_results JSONB,
  mentor_type VARCHAR(20) DEFAULT 'professional' CHECK (mentor_type IN ('near-peer', 'professional')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors are viewable by everyone"
  ON public.mentors FOR SELECT USING (TRUE);

CREATE POLICY "Mentors can update their own profile"
  ON public.mentors FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Mentors can insert their own profile"
  ON public.mentors FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. MENTOR AVAILABILITY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.mentor_availability (
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

-- ============================================
-- 4. JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.jobs (
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

CREATE POLICY "Companies can create jobs"
  ON public.jobs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type = 'company')
  );

CREATE POLICY "Companies can update their jobs"
  ON public.jobs FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type = 'company')
  );

-- ============================================
-- 5. JOB APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.job_applications (
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

CREATE POLICY "Users can update their own applications"
  ON public.job_applications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Companies can view applications for their jobs"
  ON public.job_applications FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = job_applications.job_id 
      AND EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.user_type = 'company'
      )
    )
  );

-- ============================================
-- 6. ASSESSMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.assessments (
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

-- ============================================
-- 7. ASSESSMENT QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.assessment_questions (
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

-- ============================================
-- 8. ASSESSMENT RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.assessment_results (
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

CREATE POLICY "Users can update their own results"
  ON public.assessment_results FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 9. MENTORING SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.mentoring_sessions (
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

CREATE POLICY "Users can create sessions"
  ON public.mentoring_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their sessions"
  ON public.mentoring_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Mentors can update their sessions"
  ON public.mentoring_sessions FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.mentors WHERE id = mentor_id)
  );

-- ============================================
-- 10. CAREER PATHS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.career_paths (
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

CREATE POLICY "Users can create their career path"
  ON public.career_paths FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their career path"
  ON public.career_paths FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 11. TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES public.mentors ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Testimonials are viewable by everyone when approved"
  ON public.testimonials FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Users can create testimonials"
  ON public.testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own testimonials"
  ON public.testimonials FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 12. CASE STUDIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.case_studies (
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
-- 13. BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentors ON DELETE CASCADE,
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  topic TEXT,
  notes TEXT,
  meeting_link TEXT,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Mentors can view bookings for their sessions"
  ON public.bookings FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.mentors WHERE id = mentor_id
  ));

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their bookings"
  ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Mentors can update bookings for their sessions"
  ON public.bookings FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM public.mentors WHERE id = mentor_id
  ));

-- ============================================
-- 14. PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_method VARCHAR(50) DEFAULT 'razorpay',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments"
  ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON public.payments FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- ADD FOREIGN KEY CONSTRAINT FOR PAYMENTS -> BOOKINGS
-- ============================================
ALTER TABLE public.payments
ADD CONSTRAINT fk_payments_booking_id 
FOREIGN KEY (booking_id) 
REFERENCES public.bookings(id) 
ON DELETE SET NULL;

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Mentors indexes
CREATE INDEX IF NOT EXISTS idx_mentors_user_id ON public.mentors(user_id);
CREATE INDEX IF NOT EXISTS idx_mentors_vetting_status ON public.mentors(vetting_status);
CREATE INDEX IF NOT EXISTS idx_mentors_mentor_type ON public.mentors(mentor_type);
CREATE INDEX IF NOT EXISTS idx_mentors_rating ON public.mentors(rating);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_domain ON public.jobs(domain);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON public.jobs(posted_date);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON public.jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_is_remote ON public.jobs(is_remote);

-- Job Applications indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);

-- Assessment indexes
CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment_id ON public.assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_order ON public.assessment_questions(assessment_id, order_number);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_id ON public.assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_completed_at ON public.assessment_results(completed_at);

-- Mentoring Sessions indexes
CREATE INDEX IF NOT EXISTS idx_mentoring_sessions_user_id ON public.mentoring_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mentoring_sessions_mentor_id ON public.mentoring_sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentoring_sessions_session_date ON public.mentoring_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_mentoring_sessions_status ON public.mentoring_sessions(status);

-- Career Paths indexes
CREATE INDEX IF NOT EXISTS idx_career_paths_user_id ON public.career_paths(user_id);

-- Testimonials indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_mentor_id ON public.testimonials(mentor_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON public.testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON public.testimonials(is_approved);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor_id ON public.bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON public.bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================
-- CREATE TRIGGER FUNCTION FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CREATE TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================

-- Users table trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Mentors table trigger
DROP TRIGGER IF EXISTS update_mentors_updated_at ON public.mentors;
CREATE TRIGGER update_mentors_updated_at
  BEFORE UPDATE ON public.mentors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Jobs table trigger
DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Job Applications table trigger
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Assessments table trigger
DROP TRIGGER IF EXISTS update_assessments_updated_at ON public.assessments;
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Mentoring Sessions table trigger
DROP TRIGGER IF EXISTS update_mentoring_sessions_updated_at ON public.mentoring_sessions;
CREATE TRIGGER update_mentoring_sessions_updated_at
  BEFORE UPDATE ON public.mentoring_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Career Paths table trigger
DROP TRIGGER IF EXISTS update_career_paths_updated_at ON public.career_paths;
CREATE TRIGGER update_career_paths_updated_at
  BEFORE UPDATE ON public.career_paths
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Case Studies table trigger
DROP TRIGGER IF EXISTS update_case_studies_updated_at ON public.case_studies;
CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Bookings table trigger
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Payments table trigger
DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES (Optional - Run to verify)
-- ============================================

-- Uncomment to verify tables were created:
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- Uncomment to verify RLS is enabled:
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename;

-- ============================================
-- COMPLETE! ✅
-- ============================================
-- All 14 tables created with:
-- ✅ Row Level Security (RLS) enabled
-- ✅ RLS policies configured
-- ✅ Foreign key relationships
-- ✅ Indexes for performance
-- ✅ Auto-update triggers for updated_at
-- ✅ Input validation (CHECK constraints)
-- 
-- Next steps:
-- 1. Verify tables in Supabase Table Editor
-- 2. Configure environment variables
-- 3. Test authentication
-- 4. Insert sample data (optional)
-- ============================================

