# 🗄️ Database Setup - Quick Guide

## 📁 File: `complete_database_schema.sql`

This file contains **everything you need** to set up your database in one go!

---

## 🚀 How to Use (3 Simple Steps)

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Copy & Paste
1. Open `supabase/complete_database_schema.sql` in your code editor
2. **Select ALL** (Ctrl+A / Cmd+A)
3. **Copy** (Ctrl+C / Cmd+C)
4. **Paste** into Supabase SQL Editor (Ctrl+V / Cmd+V)

### Step 3: Execute
1. Click **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait 2-3 minutes for execution
3. You should see: **"Success. No rows returned"**

**Done! ✅** All 14 tables are now created!

---

## 📊 What's Included

### ✅ 14 Database Tables
1. `users` - User profiles
2. `mentors` - Mentor profiles
3. `mentor_availability` - Availability slots
4. `jobs` - Job listings
5. `job_applications` - Applications
6. `assessments` - Assessment definitions
7. `assessment_questions` - Questions
8. `assessment_results` - Results
9. `mentoring_sessions` - Booked sessions
10. `career_paths` - Career recommendations
11. `testimonials` - Reviews/testimonials
12. `case_studies` - Success stories
13. `bookings` - Booking system
14. `payments` - Payment tracking

### ✅ Security Features
- Row Level Security (RLS) enabled on all tables
- RLS policies configured for data isolation
- User can only access their own data
- Public access for mentors, jobs, assessments

### ✅ Performance Optimizations
- 30+ indexes on frequently queried columns
- Foreign key relationships
- Cascading deletes

### ✅ Auto-Features
- Auto-update `updated_at` timestamps
- Auto-generate UUIDs for IDs
- Default values for common fields

---

## ✅ Verification

After running the SQL:

1. **Check Tables:**
   - Go to **Table Editor** in Supabase
   - You should see all 14 tables listed

2. **Check RLS:**
   - Go to **Authentication** → **Policies**
   - You should see policies for each table

3. **Test Connection:**
   - Try signing up in your app
   - User should appear in `users` table

---

## 🆘 Troubleshooting

### Error: "relation already exists"
**Solution:** Tables already created. This is fine - the `IF NOT EXISTS` will skip them.

### Error: "permission denied"
**Solution:** Make sure you're using the SQL Editor (not Table Editor). SQL Editor has admin privileges.

### Error: "syntax error"
**Solution:** 
- Make sure you copied the ENTIRE file
- Check for any missing semicolons
- Try running sections separately if needed

### Tables not showing
**Solution:**
- Refresh the browser
- Check you're in the correct project
- Verify schema is `public`

---

## 📝 What's Next?

After running this SQL:

1. ✅ **Configure Environment Variables**
   - Get credentials from Supabase → Settings → API
   - Add to `.env.local`

2. ✅ **Test Authentication**
   - Sign up/login in your app
   - Verify user appears in database

3. ✅ **Insert Sample Data** (Optional)
   - Add test mentors, jobs, assessments
   - Use Supabase Table Editor or SQL

---

## 📚 Related Files

- `BACKEND_IMPLEMENTATION_GUIDE.md` - Detailed step-by-step guide
- `BACKEND_ANALYSIS_REPORT.md` - Complete backend analysis
- `BACKEND_COMPLETE_SUMMARY.md` - Quick reference

---

## 🎉 Success!

If you see all 14 tables in the Table Editor, you're ready to go!

**Your database is now fully set up!** 🚀

---

**File Location:** `supabase/complete_database_schema.sql`  
**Execution Time:** ~2-3 minutes  
**Difficulty:** Easy (just copy-paste-run)

