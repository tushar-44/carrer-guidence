-- Migration: 003_add_payment_and_ai_features.sql
-- Add comprehensive payment, assessment, and AI features

-- ============================================
-- 1. Assessment Results Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- ============================================
-- 2. Career Roadmaps Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.career_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessment_results(id) ON DELETE SET NULL,
  career_path VARCHAR(255) NOT NULL,
  milestones JSONB NOT NULL DEFAULT '[]',
  resources JSONB DEFAULT '[]',
  timeline_months INTEGER,
  current_step INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  ai_generated BOOLEAN DEFAULT true,
  ai_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. Admin Actions Log Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  target_id UUID,
  target_type VARCHAR(50),
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. Bookings Table (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_time TIME NOT NULL,
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
-- 5. Update Payments Table
-- ============================================
-- Drop existing if needed and recreate with proper structure
DROP TABLE IF EXISTS public.payments CASCADE;

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  razorpay_order_id VARCHAR(255) UNIQUE,
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50) DEFAULT 'razorpay',
  metadata JSONB DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order ON public.payments(razorpay_order_id);

CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_completed ON public.assessment_results(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_roadmap_user ON public.career_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_assessment ON public.career_roadmaps(assessment_id);

CREATE INDEX IF NOT EXISTS idx_admin_actions_admin ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_type ON public.admin_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created ON public.admin_actions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor ON public.bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(session_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ============================================
-- 7. Row Level Security Policies
-- ============================================

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Payments Policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
CREATE POLICY "Users can insert own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Assessment Results Policies
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

-- Career Roadmaps Policies
DROP POLICY IF EXISTS "Users can view own roadmaps" ON public.career_roadmaps;
CREATE POLICY "Users can view own roadmaps"
  ON public.career_roadmaps FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own roadmaps" ON public.career_roadmaps;
CREATE POLICY "Users can insert own roadmaps"
  ON public.career_roadmaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own roadmaps" ON public.career_roadmaps;
CREATE POLICY "Users can update own roadmaps"
  ON public.career_roadmaps FOR UPDATE
  USING (auth.uid() = user_id);

-- Bookings Policies
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

-- Admin Actions Policies (only admins can view)
DROP POLICY IF EXISTS "Admins can view all actions" ON public.admin_actions;
CREATE POLICY "Admins can view all actions"
  ON public.admin_actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can insert actions" ON public.admin_actions;
CREATE POLICY "Admins can insert actions"
  ON public.admin_actions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- 8. Functions for Auto-Update Timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
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

-- ============================================
-- 9. Grant Permissions
-- ============================================
GRANT ALL ON public.payments TO authenticated;
GRANT ALL ON public.assessment_results TO authenticated;
GRANT ALL ON public.career_roadmaps TO authenticated;
GRANT ALL ON public.admin_actions TO authenticated;
GRANT ALL ON public.bookings TO authenticated;

-- ============================================
-- Migration Complete
-- ============================================