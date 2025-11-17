# 🚀 Supabase Backend Setup Checklist

## Complete Step-by-Step Setup for CareerPath Backend

---

## ✅ PHASE 1: Initial Setup (5 mins)

- [ ] Access Supabase Dashboard at [supabase.com](https://supabase.com)
- [ ] Sign in to your project: **onmcbkznvimzarqdxwfy**
- [ ] Note your credentials:
  - [ ] **Project URL**: `https://onmcbkznvimzarqdxwfy.supabase.co`
  - [ ] **Anon Key**: Already in `.env`
  - [ ] **Service Role Key**: Already in `.env`

---

## ✅ PHASE 2: Create Database Tables (15-20 mins)

Go to **SQL Editor** in Supabase and run each SQL query:

### Step 1: Users Profile Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.1
- [ ] Paste into SQL Editor
- [ ] Click "Execute" or `Ctrl+Enter`
- [ ] Verify: Check `public.users` table appears in left sidebar

### Step 2: Mentors Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.2
- [ ] Execute in SQL Editor
- [ ] Verify table created

### Step 3: Mentor Availability Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.3
- [ ] Execute
- [ ] Verify table created

### Step 4: Jobs Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.4
- [ ] Execute
- [ ] Verify table created

### Step 5: Job Applications Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.5
- [ ] Execute
- [ ] Verify table created

### Step 6: Assessments Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.6
- [ ] Execute
- [ ] Verify table created

### Step 7: Assessment Questions Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.7
- [ ] Execute
- [ ] Verify table created

### Step 8: Assessment Results Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.8
- [ ] Execute
- [ ] Verify table created

### Step 9: Mentoring Sessions Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.9
- [ ] Execute
- [ ] Verify table created

### Step 10: Career Paths Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.10
- [ ] Execute
- [ ] Verify table created

### Step 11: Testimonials Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.11
- [ ] Execute
- [ ] Verify table created

### Step 12: Case Studies Table
- [ ] Copy SQL from `SUPABASE_SETUP_GUIDE.md` → Section 2.12
- [ ] Execute
- [ ] Verify table created

---

## ✅ PHASE 3: Verify Row Level Security (5 mins)

- [ ] Go to **Authentication → Policies** in left sidebar
- [ ] Check each table has at least 2 policies:
  - [ ] `users` table - SELECT, UPDATE policies
  - [ ] `mentors` table - SELECT policy
  - [ ] `jobs` table - SELECT policy
  - [ ] `job_applications` table - SELECT, INSERT policies
  - [ ] `assessments` table - SELECT policy
  - [ ] `assessment_questions` table - SELECT policy
  - [ ] `assessment_results` table - SELECT, INSERT policies
  - [ ] `mentoring_sessions` table - SELECT policy
  - [ ] Other tables - at least 1 SELECT policy

---

## ✅ PHASE 4: Configure API Access (5 mins)

- [ ] Go to **Settings → API** in left sidebar
- [ ] Verify **Project URL** matches in your `.env`:
  ```
  VITE_SUPABASE_URL=https://onmcbkznvimzarqdxwfy.supabase.co
  ```
  - [ ] Copy **Anon public key** and verify it's in `.env` (use a local, redacted placeholder in repo):
  ```
  VITE_SUPABASE_ANON_KEY=REPLACE_ME_SUPABASE_ANON_KEY
  ```
- [ ] Note **Service role key** location for backend operations

---

## ✅ PHASE 5: Enable Authentication Methods (5 mins)

- [ ] Go to **Authentication → Providers**
- [ ] **Email/Password** - Enable (if not already)
  - [ ] Check "Confirm email" (optional)
  - [ ] Check "Autoconfirm users" for testing
- [ ] **Google OAuth** - Verify enabled
  - [ ] Client ID: `REPLACE_ME_GOOGLE_CLIENT_ID`
  - [ ] Client Secret: `REPLACE_ME_GOOGLE_CLIENT_SECRET`

---

## ✅ PHASE 6: Configure CORS (5 mins)

- [ ] Go to **Settings → API**
- [ ] Scroll to **CORS settings**
- [ ] Add your domain:
  ```
  http://localhost:5173
  http://localhost:3000
  https://yourdomain.com
  https://www.yourdomain.com
  ```
- [ ] Click "Save"

---

## ✅ PHASE 7: Update Frontend Code (10 mins)

- [ ] Import services in your components:
  ```typescript
  import { 
    mentorsService, 
    jobsService, 
    assessmentsService 
  } from '@/lib/supabase-services';
  ```

- [ ] Use in components:
  ```typescript
  const { data: mentors } = await mentorsService.getAll();
  const { data: jobs } = await jobsService.getAll();
  ```

---

## ✅ PHASE 8: Test Authentication (5 mins)

1. [ ] Start dev server: `npm run dev`
2. [ ] Go to **Login** page
3. [ ] Test **Email/Password** signup:
   - [ ] Enter test email: `test@example.com`
   - [ ] Enter password: `Test123!@#`
   - [ ] Click "Sign Up"
   - [ ] Verify success or check browser console for errors
4. [ ] Test **Login**:
   - [ ] Use same credentials
   - [ ] Verify you're logged in (dashboard loads)
5. [ ] Test **Logout**:
   - [ ] Click logout
   - [ ] Verify redirected to home

---

## ✅ PHASE 9: Test Data Fetching (5 mins)

1. [ ] Open browser **DevTools** (F12)
2. [ ] Go to **Console** tab
3. [ ] Test mentor fetching:
   ```javascript
   // Paste this in console
   import { mentorsService } from '@/lib/supabase-services';
   const result = await mentorsService.getAll();
   console.log(result);
   ```
4. [ ] Check if data loads (will be empty initially - that's OK)
5. [ ] Look for any errors

---

## ✅ PHASE 10: Insert Sample Data (10 mins)

- [ ] Go to **SQL Editor** in Supabase
- [ ] Copy sample data SQL from `SUPABASE_SETUP_GUIDE.md` → Section 4
- [ ] Modify with your test data
- [ ] Execute and verify data appears in Tables view

---

## ✅ PHASE 11: Monitor & Debug (ongoing)

- [ ] Go to **Logs** in Supabase dashboard
- [ ] Watch for errors:
  - [ ] Permission errors = RLS policy issue
  - [ ] Not found errors = Table name typo
  - [ ] Connection errors = CORS or network issue
- [ ] Go to **Home** to see database stats
- [ ] Check storage usage

---

## 🎯 Final Verification Checklist

- [ ] All 12 tables created in Supabase
- [ ] RLS policies enabled on all tables
- [ ] Authentication methods working (Email/Password + Google)
- [ ] CORS configured for your domain
- [ ] Environment variables set in `.env`
- [ ] Frontend can authenticate users
- [ ] Frontend can fetch data from Supabase
- [ ] No console errors when using the app
- [ ] Sample data inserted and visible

---

## 📞 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Permission denied" | RLS policy too restrictive | Check policies in **Settings → Policies** |
| "Row not found" | Wrong table/column name | Check table names in SQL Editor |
| "CORS error" | Domain not in whitelist | Add domain to **Settings → API → CORS** |
| Empty data | No sample data inserted | Insert test data from Phase 10 |
| Auth not working | Google OAuth not configured | Check **Authentication → Providers** |
| "Cannot read property 'user'" | Auth state not ready | Add loading check in component |

---

## 🚀 Next Steps After Setup

1. **Populate Production Data**:
   - [ ] Insert real mentors data
   - [ ] Import jobs from external API
   - [ ] Create assessment questions

2. **Add More Features**:
   - [ ] Payments/Stripe integration for booking
   - [ ] Email notifications
   - [ ] File uploads (avatars, certificates)

3. **Optimize Performance**:
   - [ ] Add database indexes on frequently queried columns
   - [ ] Set up real-time subscriptions
   - [ ] Cache frequently accessed data

4. **Security Hardening**:
   - [ ] Review all RLS policies
   - [ ] Set up rate limiting
   - [ ] Add input validation

---

## 📚 Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Reference](https://supabase.com/docs/guides/database/sql-reference)
- [API Reference](https://supabase.com/docs/reference/javascript)

---

## ✨ Success! 🎉

Once all checkboxes are complete, your Supabase backend is ready for production!

---

**Questions?** Check the full guide in `SUPABASE_SETUP_GUIDE.md`
