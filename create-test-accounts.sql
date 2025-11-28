-- ============================================
-- Create Test Accounts for CareerPath
-- ============================================
-- Run this in Supabase SQL Editor after signing up users through the UI

-- IMPORTANT: First ensure the role column exists
-- Add role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.users 
    ADD COLUMN role VARCHAR(50) DEFAULT 'student';
    
    RAISE NOTICE 'Added role column to users table';
  ELSE
    RAISE NOTICE 'Role column already exists';
  END IF;
END $$;

-- ============================================

-- 1. CREATE ADMIN ACCOUNT
-- First, sign up through UI with email: admin@careerpath.test
-- Then run this:
UPDATE users 
SET role = 'admin',
    user_type = 'graduates',  -- Must be one of: graduates, mentor, company
    full_name = 'Admin User',
    updated_at = NOW()
WHERE email = 'admin@careerpath.test';

-- Verify admin account
SELECT id, email, user_type, role, full_name, created_at 
FROM users 
WHERE email = 'admin@careerpath.test';

-- ============================================

-- 2. CREATE STUDENT TEST ACCOUNT
-- First, sign up through UI with email: student@careerpath.test
-- Then run this:
UPDATE users 
SET user_type = 'graduates',
    role = 'student',
    full_name = 'Test Student',
    phone = '+1234567890',
    location = 'New York, USA',
    bio = 'Test student account for testing dashboard features',
    updated_at = NOW()
WHERE email = 'student@careerpath.test';

-- Verify student account
SELECT id, email, user_type, role, full_name, created_at 
FROM users 
WHERE email = 'student@careerpath.test';

-- ============================================

-- 3. CREATE MENTOR TEST ACCOUNT
-- First, sign up through UI with email: mentor@careerpath.test
-- Then run this:
UPDATE users 
SET user_type = 'mentor',
    role = 'mentor',
    full_name = 'Test Mentor',
    phone = '+1234567891',
    location = 'San Francisco, USA',
    bio = 'Experienced software engineer and mentor',
    updated_at = NOW()
WHERE email = 'mentor@careerpath.test';

-- Add mentor profile
INSERT INTO mentors (
    user_id,
    title,
    expertise,
    experience_years,
    hourly_rate,
    mentor_type,
    vetting_status,
    bio,
    created_at,
    updated_at
)
SELECT 
    id,
    'Senior Software Engineer',
    ARRAY['Software Engineering', 'Career Guidance', 'System Design'],
    8,
    75.00,
    'professional',
    'approved',
    'Experienced software engineer with 8 years in the industry. Specialized in full-stack development and system design.',
    NOW(),
    NOW()
FROM users 
WHERE email = 'mentor@careerpath.test'
ON CONFLICT (user_id) DO UPDATE
SET expertise = EXCLUDED.expertise,
    experience_years = EXCLUDED.experience_years,
    hourly_rate = EXCLUDED.hourly_rate,
    updated_at = NOW();

-- Verify mentor account
SELECT u.id, u.email, u.user_type, u.role, u.full_name, m.expertise, m.hourly_rate, m.vetting_status
FROM users u
LEFT JOIN mentors m ON u.id = m.user_id
WHERE u.email = 'mentor@careerpath.test';

-- ============================================

-- 4. VIEW ALL TEST ACCOUNTS
SELECT 
    id,
    email,
    user_type,
    role,
    full_name,
    created_at,
    CASE 
        WHEN role = 'admin' THEN '🔑 Admin'
        WHEN email LIKE '%student%' THEN '📚 Student'
        WHEN email LIKE '%mentor%' THEN '👨‍🏫 Mentor'
        ELSE '👤 User'
    END as account_type
FROM users
WHERE email LIKE '%careerpath.test%'
ORDER BY created_at DESC;

-- ============================================

-- 5. CREATE SAMPLE DATA FOR TESTING

-- Sample assessment result for student
INSERT INTO assessment_results (
    user_id,
    assessment_id,
    score,
    total_points,
    percentage,
    results,
    created_at
)
SELECT 
    id,
    (SELECT id FROM assessments LIMIT 1),
    85,
    100,
    85.0,
    jsonb_build_object(
        'strengths', ARRAY['Problem Solving', 'Communication', 'Technical Skills'],
        'weaknesses', ARRAY['Time Management', 'Public Speaking'],
        'recommendations', ARRAY['Take a leadership course', 'Practice presentations']
    ),
    NOW()
FROM users 
WHERE email = 'student@careerpath.test'
ON CONFLICT DO NOTHING;

-- Sample booking for student
INSERT INTO bookings (
    user_id,
    mentor_id,
    scheduled_at,
    duration_minutes,
    status,
    session_topic,
    notes,
    created_at
)
SELECT 
    s.id,
    m.user_id,
    NOW() + INTERVAL '3 days',
    60,
    'confirmed',
    'Career Guidance Session',
    'Looking for advice on transitioning to tech industry',
    NOW()
FROM users s
CROSS JOIN mentors m
WHERE s.email = 'student@careerpath.test'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Sample payment for student
INSERT INTO payments (
    user_id,
    booking_id,
    amount,
    currency,
    status,
    payment_method,
    razorpay_order_id,
    razorpay_payment_id,
    created_at
)
SELECT 
    user_id,
    id,
    75.00,
    'INR',
    'captured',
    'card',
    'order_test_' || substr(md5(random()::text), 1, 10),
    'pay_test_' || substr(md5(random()::text), 1, 10),
    NOW()
FROM bookings
WHERE user_id = (SELECT id FROM users WHERE email = 'student@careerpath.test')
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================

-- 6. VERIFY SAMPLE DATA
SELECT 
    'Assessment Results' as data_type,
    COUNT(*) as count
FROM assessment_results
WHERE user_id = (SELECT id FROM users WHERE email = 'student@careerpath.test')

UNION ALL

SELECT 
    'Bookings' as data_type,
    COUNT(*) as count
FROM bookings
WHERE user_id = (SELECT id FROM users WHERE email = 'student@careerpath.test')

UNION ALL

SELECT 
    'Payments' as data_type,
    COUNT(*) as count
FROM payments
WHERE user_id = (SELECT id FROM users WHERE email = 'student@careerpath.test');

-- ============================================

-- CLEANUP (if needed)
-- Uncomment to delete test accounts

-- DELETE FROM payments WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%careerpath.test%');
-- DELETE FROM bookings WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%careerpath.test%');
-- DELETE FROM assessment_results WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%careerpath.test%');
-- DELETE FROM mentors WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%careerpath.test%');
-- DELETE FROM users WHERE email LIKE '%careerpath.test%';

-- ============================================