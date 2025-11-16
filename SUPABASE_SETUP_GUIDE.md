# Supabase Backend Setup Guide

## 📋 Overview
This guide will walk you through setting up your entire backend with Supabase for the CareerPath application.

---

## ✅ Step 1: Access Your Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in with your account
3. Select your project: **onmcbkznvimzarqdxwfy**
4. Go to **SQL Editor** or **Table Editor**

---

## 📊 Step 2: Create Database Tables

### 2.1 Users Table (Extended Profile)
This extends Supabase auth with additional user data.

**Go to: SQL Editor → Run the query:**

```sql
-- Create users profile table (extends auth.users)
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

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view mentor profiles"
  ON public.users FOR SELECT 
  USING (user_type = 'mentor' OR auth.uid() = id);
```

---

### 2.2 Mentors Table

```sql
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
```

---

### 2.3 Availability/Slots Table

```sql
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
```

---

### 2.4 Jobs Table

```sql
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
```

---

### 2.5 Job Applications Table

```sql
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
```

---

### 2.6 Assessments Table

```sql
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
```

---

### 2.7 Assessment Questions Table

```sql
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
```

---

### 2.8 Assessment Results Table

```sql
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
```

---

### 2.9 Mentoring Sessions/Bookings Table

```sql
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
```

---

### 2.10 Career Paths Table

```sql
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
```

---

### 2.11 Testimonials Table

```sql
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
```

---

### 2.12 Case Studies Table

```sql
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
```

---

## 🔐 Step 3: Enable Row Level Security (RLS)

1. Go to **Authentication → Policies** in Supabase dashboard
2. All tables have RLS enabled with policies defined above
3. Test policies by running queries as different users

---

## 📤 Step 4: Insert Sample Data

```sql
-- Insert a mentor
INSERT INTO public.mentors (
  user_id,
  title,
  expertise,
  experience_years,
  hourly_rate,
  bio
) VALUES (
  'user-uuid-here',
  'Senior Software Architect',
  ARRAY['React', 'Node.js', 'AWS'],
  12,
  75.00,
  'Passionate about helping developers level up'
);

-- Insert jobs
INSERT INTO public.jobs (
  title,
  company,
  location,
  job_type,
  salary_range,
  description,
  skills_required,
  is_remote
) VALUES (
  'Senior Frontend Developer',
  'Google',
  'Mountain View, CA',
  'full-time',
  '$140,000 - $200,000',
  'Join our team to build next-generation web applications',
  ARRAY['React', 'TypeScript', 'CSS'],
  FALSE
);
```

---

## 🔗 Step 5: Update Your Frontend Code

Update `src/lib/supabase.ts` to add helper functions:

```typescript
// Add these functions to your supabase.ts file

export const mentorsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('mentors')
      .select('*, users(full_name, avatar_url, email)')
      .order('rating', { ascending: false });
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('mentors')
      .select('*, users(full_name, avatar_url, email)')
      .eq('id', id)
      .single();
    return { data, error };
  }
};

export const jobsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('posted_date', { ascending: false });
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  }
};

export const assessmentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('assessments')
      .select('*');
    return { data, error };
  },

  async getQuestions(assessmentId: string) {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('order_number');
    return { data, error };
  },

  async submitResults(userId: string, assessmentId: string, results: any) {
    const { data, error } = await supabase
      .from('assessment_results')
      .insert({
        user_id: userId,
        assessment_id: assessmentId,
        ...results
      });
    return { data, error };
  }
};
```

---

## 🚀 Step 6: Environment Variables Check

Verify in your `.env.local`:

```
VITE_SUPABASE_URL=https://onmcbkznvimzarqdxwfy.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## ✨ Step 7: Testing

1. Start your dev server: `npm run dev`
2. Test authentication (login/signup)
3. Verify data fetching in browser console
4. Check Supabase Dashboard → Logs for queries

---

## 📌 Important Notes

- **RLS Policies**: All tables have Row Level Security enabled. Users can only see data they should see.
- **Cascade Delete**: When a user is deleted from auth, their profile is automatically deleted.
- **Auto Timestamps**: `created_at` and `updated_at` fields are automatic.
- **Backups**: Supabase automatically backs up your database.

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission denied errors | Check RLS policies in SQL Editor |
| Missing data | Verify user_id matches auth.uid() |
| Slow queries | Add indexes on frequently queried columns |
| CORS errors | Check Supabase dashboard → Settings → API |

---

## 📞 Next Steps

1. ✅ Create all tables using SQL above
2. ✅ Test with sample data
3. ✅ Update frontend code with service functions
4. ✅ Test authentication flow
5. ✅ Monitor performance in Supabase logs
6. ✅ Add more indexes as needed for production

---

**Need help?** Check [Supabase Documentation](https://supabase.com/docs)
