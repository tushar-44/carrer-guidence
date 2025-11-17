-- Migration: Add Missing Features
-- Adds vetting_status, bookings, payments, and near-peer mentorship support

-- ============================================
-- 1) Add missing columns to mentors table
-- ============================================

ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS vetting_status VARCHAR(20) DEFAULT 'pending' 
  CHECK (vetting_status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS vetting_score DECIMAL(5, 2);

ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS vetting_test_results JSONB;

ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS mentor_type VARCHAR(20) DEFAULT 'professional' 
  CHECK (mentor_type IN ('near-peer', 'professional'));

-- Update existing mentors to have approved status if they're verified
UPDATE public.mentors 
SET vetting_status = 'approved' 
WHERE verified = TRUE AND vetting_status IS NULL;

-- ============================================
-- 2) Create payments table FIRST (before bookings)
-- ============================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  booking_id UUID, -- Will add foreign key after bookings table is created
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_method VARCHAR(50) DEFAULT 'razorpay',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments"
  ON public.payments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3) Create bookings table (references payments)
-- ============================================

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentors ON DELETE CASCADE,
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  topic TEXT,
  notes TEXT,
  meeting_link TEXT,
  payment_status VARCHAR(20) DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Mentors can view bookings for their sessions"
  ON public.bookings FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM public.mentors WHERE id = mentor_id
  ));

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their bookings"
  ON public.bookings FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================
-- 4) Add foreign key from payments to bookings (now that both tables exist)
-- ============================================

ALTER TABLE public.payments
ADD CONSTRAINT fk_payments_booking_id 
FOREIGN KEY (booking_id) 
REFERENCES public.bookings(id) 
ON DELETE SET NULL;

-- ============================================
-- 5) Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_mentors_vetting_status ON public.mentors(vetting_status);
CREATE INDEX IF NOT EXISTS idx_mentors_mentor_type ON public.mentors(mentor_type);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor_id ON public.bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON public.bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- ============================================
-- 6) Add function to update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- End of migration
-- ============================================

