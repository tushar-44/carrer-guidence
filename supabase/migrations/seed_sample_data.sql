-- Seed: seed_sample_data.sql
-- Purpose: provide example seed data for the schema created by reset_and_create.sql
-- WARNING: This file assumes the schema exists. Do NOT run until you've run the migration.
-- IMPORTANT: `public.users.id` references `auth.users`. Create Auth users first in Supabase
-- (Dashboard -> Authentication -> Users) and copy their UUIDs. Replace the <AUTH_USER_UUID_*> placeholders below
-- with real auth user UUIDs before running.

-- Suggested workflow:
-- 1) Run reset_and_create.sql (migration) in Supabase SQL Editor.
-- 2) Create auth users in Supabase dashboard and copy their user UUIDs.
-- 3) Edit this file to replace <AUTH_USER_UUID_1>, <AUTH_USER_UUID_2>, etc. with the auth UUIDs.
-- 4) Run this seed file in Supabase SQL Editor.

-- -----------------------------
-- 1) Example users (REPLACE the UUID placeholders with actual auth.user IDs)
-- -----------------------------
-- INSERT INTO public.users (id, email, full_name, user_type, bio, created_at)
-- VALUES
--   ('<AUTH_USER_UUID_1>', 'alice.mentor@example.com', 'Alice Mentor', 'mentor', 'Experienced software mentor', now()),
--   ('<AUTH_USER_UUID_2>', 'bob.graduate@example.com', 'Bob Graduate', 'graduates', 'Recent CS grad', now()),
--   ('<AUTH_USER_UUID_3>', 'company.hr@example.com', 'Acme HR', 'company', 'Recruiter for Acme', now());

-- -----------------------------
-- 2) Create a mentor profile for an existing user (replace <AUTH_USER_UUID_1>)
-- -----------------------------
-- After inserting into public.users, run:
-- INSERT INTO public.mentors (id, user_id, title, expertise, experience_years, hourly_rate, bio, languages)
-- VALUES (
--   gen_random_uuid(),
--   '<AUTH_USER_UUID_1>',
--   'Senior Web Mentor',
--   ARRAY['react','typescript','nodejs'],
--   7,
--   45.00,
--   'I help early-career devs level up in frontend engineering.',
--   ARRAY['en']
-- );

-- -----------------------------
-- 3) Seed a sample job
-- -----------------------------
INSERT INTO public.jobs (id, title, company, location, job_type, salary_range, description, requirements, responsibilities, skills_required, domain, experience_level)
VALUES (
  gen_random_uuid(),
  'Frontend Engineer',
  'Acme Co',
  'Remote',
  'full-time',
  '40k-60k',
  'Work on modern web apps.',
  ARRAY['3+ years frontend experience','React','TypeScript'],
  ARRAY['Build UI features','Collaborate with product'],
  ARRAY['react','typescript'],
  'web',
  'mid'
);

-- -----------------------------
-- 4) Seed an assessment + question
-- -----------------------------
INSERT INTO public.assessments (id, title, description, category, total_questions, passing_score, duration_minutes)
VALUES (
  gen_random_uuid(),
  'Frontend Basics',
  'A short assessment for frontend fundamentals',
  'frontend',
  1,
  70.00,
  15
);

-- Link the question to the assessment (options stored as JSONB)
INSERT INTO public.assessment_questions (id, assessment_id, question_text, question_type, options, correct_answer, points, order_number)
SELECT gen_random_uuid(), a.id, 'Which hook is used for side effects in React?', 'single',
       '["useState","useEffect","useMemo"]'::jsonb, 'useEffect', 1, 1
FROM public.assessments a WHERE a.title = 'Frontend Basics' LIMIT 1;

-- -----------------------------
-- 5) Seed example career path for a user (replace <AUTH_USER_UUID_2> with a real user id)
-- -----------------------------
-- INSERT INTO public.career_paths (id, user_id, recommended_careers, matching_jobs, recommended_mentors, assessment_score)
-- VALUES (
--   gen_random_uuid(),
--   '<AUTH_USER_UUID_2>',
--   ARRAY['Frontend Engineer','UX Engineer'],
--   ARRAY[]::UUID[],
--   ARRAY[]::UUID[],
--   85.00
-- );

-- -----------------------------
-- 6) Optional: Create a booking (if you have bookings table). Replace placeholders accordingly
-- -----------------------------
-- If you have a bookings table and a mentor created, you can insert a booking sample like:
-- INSERT INTO public.bookings (id, user_id, mentor_id, slot_start, slot_end, status)
-- VALUES (gen_random_uuid(), '<AUTH_USER_UUID_2>', '<MENTOR_ID_PLACEHOLDER>', now() + interval '2 days', now() + interval '2 days' + interval '1 hour', 'scheduled');

-- -----------------------------
-- 7) Example testimonial (requires mentor_id and user_id)
-- -----------------------------
-- INSERT INTO public.testimonials (id, mentor_id, user_id, rating, content, is_approved)
-- VALUES (gen_random_uuid(), '<MENTOR_ID_PLACEHOLDER>', '<AUTH_USER_UUID_2>', 5, 'Great mentorship!', TRUE);

-- -----------------------------
-- Helpful verification queries to run after seeding
-- -----------------------------
-- SELECT count(*) FROM public.users;
-- SELECT count(*) FROM public.mentors;
-- SELECT count(*) FROM public.jobs;
-- SELECT count(*) FROM public.assessments;
-- SELECT * FROM public.assessment_questions LIMIT 5;

-- End of seed file
