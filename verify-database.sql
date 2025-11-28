-- ============================================
-- CareerPath Database Verification Script
-- Run this in Supabase SQL Editor to verify schema
-- ============================================

-- 1. Check mentors table columns
SELECT 
  'mentors_columns' as check_name,
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'mentors'
  AND column_name IN ('vetting_status', 'vetting_score', 'vetting_test_results', 'mentor_type', 'vetting_completed_at')
ORDER BY column_name;

-- 2. Check mentoring_sessions table columns
SELECT 
  'mentoring_sessions_columns' as check_name,
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'mentoring_sessions'
  AND column_name IN ('payment_status', 'payment_amount', 'payment_id', 'payment_method', 'razorpay_order_id', 'razorpay_payment_id')
ORDER BY column_name;

-- 3. Check if new tables exist
SELECT 
  'new_tables' as check_name,
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('payments', 'ai_roadmaps', 'mentor_vetting_tests')
ORDER BY table_name;

-- 4. Check jobs table columns
SELECT 
  'jobs_columns' as check_name,
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'jobs'
  AND column_name IN ('company_user_id', 'status', 'views_count', 'applications_count')
ORDER BY column_name;

-- 5. Check indexes
SELECT 
  'indexes' as check_name,
  indexname,
  tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'idx_mentors_vetting_status',
    'idx_mentors_mentor_type',
    'idx_payments_user_id',
    'idx_payments_session_id',
    'idx_jobs_company_user_id',
    'idx_jobs_status'
  )
ORDER BY indexname;

-- 6. Check RLS policies
SELECT 
  'rls_policies' as check_name,
  tablename,
  policyname,
  cmd as command,
  qual as using_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('payments', 'ai_roadmaps', 'mentor_vetting_tests', 'jobs')
ORDER BY tablename, policyname;

-- 7. Count records in key tables
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'mentors', COUNT(*) FROM mentors
UNION ALL
SELECT 'mentoring_sessions', COUNT(*) FROM mentoring_sessions
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'ai_roadmaps', COUNT(*) FROM ai_roadmaps
UNION ALL
SELECT 'mentor_vetting_tests', COUNT(*) FROM mentor_vetting_tests
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
ORDER BY table_name;

-- ============================================
-- Expected Results Summary
-- ============================================
-- mentors_columns: Should return 5 rows
-- mentoring_sessions_columns: Should return 6 rows
-- new_tables: Should return 3 rows (payments, ai_roadmaps, mentor_vetting_tests)
-- jobs_columns: Should return 4 rows
-- indexes: Should return 6 rows
-- rls_policies: Should return multiple rows for each table
-- record_count: Shows current data in tables
-- ============================================

