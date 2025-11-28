# 📝 Manual Test Account Creation Guide

**Status:** Admin account created ✅ | Student 80% complete 🔄 | Mentor pending ⏳  
**Immediate Action Required:** Complete student account (1 minute)

---

## ✅ What's Already Done

### Admin Account Created:
- Email: `admin@careerpath.test`
- Password: `Admin123!@#`
- Status: ✅ Account exists in database
- Next: Update role to 'admin' via SQL

---

## 🎯 Complete These Steps Manually (10 minutes)

### Step 1: Complete Student Account (1 minute) - 80% DONE

**Current Status:** Form is already filled and ready at Step 2!

1. **Open Browser:**
   - Go to: http://localhost:5173/auth/register
   - You should see Step 2 (Career Details) already filled:
     - Career Stage: High School Student ✅
     - Industry: Technology ✅
     - Location: New York, USA ✅

2. **Complete Registration (ONLY 2 ACTIONS NEEDED):**
   - ✅ **CHECK the box**: "I agree to the Terms of Service" ← DO THIS
   - ✅ **CLICK**: "Create Account" button ← THEN THIS

3. **Verify:**
   - You should be redirected to login or dashboard
   - Account is created! ✅

**Note:** If the form is not at Step 2, you may need to:
- Fill Step 1: First Name: `Test`, Last Name: `Student`, Email: `student@careerpath.test`, Password: `Student123!@#`
- Click Continue to reach Step 2

---

### Step 2: Create Mentor Account (3 minutes)

1. **Logout** (if logged in)
   - Click profile menu → Logout

2. **Open Registration:**
   - Go to: http://localhost:5173/auth/register

3. **Fill Step 1 - Account Info:**
   - Select: **Expert Mentor** (Mentor/Coach option)
   - First Name: `Test`
   - Last Name: `Mentor`
   - Email: `mentor@careerpath.test`
   - Password: `Mentor123!@#`
   - Confirm Password: `Mentor123!@#`
   - Click **Continue**

4. **Fill Step 2 - Career Details:**
   - Career Stage: Select "Senior Professional (10+ years)"
   - Industry: Select "Technology"
   - Location: `San Francisco, USA`
   - Check: ✅ I agree to the Terms of Service
   - Click **Create Account**

5. **Verify:**
   - Account created successfully!

---

### Step 3: Run SQL to Update Accounts (2 minutes)

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/axxkzhcavbqcooevayyn/sql

2. **Run This SQL:**

```sql
-- First ensure role column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.users ADD COLUMN role VARCHAR(50) DEFAULT 'student';
  END IF;
END $$;

-- Update Admin Account
UPDATE users 
SET role = 'admin',
    user_type = 'graduates',
    full_name = 'Admin User',
    updated_at = NOW()
WHERE email = 'admin@careerpath.test';

-- Update Student Account  
UPDATE users 
SET role = 'student',
    user_type = 'graduates',
    full_name = 'Test Student',
    updated_at = NOW()
WHERE email = 'student@careerpath.test';

-- Update Mentor Account
UPDATE users 
SET role = 'mentor',
    user_type = 'mentor',
    full_name = 'Test Mentor',
    updated_at = NOW()
WHERE email = 'mentor@careerpath.test';

-- Create Mentor Profile
INSERT INTO mentors (
    user_id,
    expertise,
    hourly_rate,
    years_of_experience,
    mentor_type,
    vetting_status,
    bio,
    created_at,
    updated_at
)
SELECT 
    id,
    ARRAY['Software Engineering', 'Career Guidance'],
    75.00,
    8,
    'professional',
    'approved',
    'Experienced software engineer and mentor',
    NOW(),
    NOW()
FROM users 
WHERE email = 'mentor@careerpath.test'
ON CONFLICT (user_id) DO UPDATE
SET expertise = EXCLUDED.expertise,
    updated_at = NOW();

-- Verify All Accounts
SELECT 
    email,
    user_type,
    role,
    full_name,
    created_at
FROM users
WHERE email LIKE '%careerpath.test%'
ORDER BY created_at;
```

**Note:** Database has TWO columns - `user_type` (graduates/mentor/company) and `role` (admin/student/mentor)

3. **Click Run** (or press Ctrl+Enter)

4. **Verify Output:**
   - Should see 3 accounts listed
   - All roles should be correct

---

### Step 4: Test Login with Each Account (2 minutes)

#### Test Admin Login:
1. Go to: http://localhost:5173/auth/login
2. Email: `admin@careerpath.test`
3. Password: `Admin123!@#`
4. Click Sign In
5. Navigate to: http://localhost:5173/admin-panel
6. ✅ Should see admin panel

#### Test Student Login:
1. Logout
2. Login with:
   - Email: `student@careerpath.test`
   - Password: `Student123!@#`
3. Navigate to: http://localhost:5173/dashboard
4. ✅ Should see student dashboard

#### Test Mentor Login:
1. Logout
2. Login with:
   - Email: `mentor@careerpath.test`
   - Password: `Mentor123!@#`
3. Navigate to: http://localhost:5173/dashboard/mentor
4. ✅ Should see mentor dashboard

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] Admin account created
- [ ] Student account created
- [ ] Mentor account created
- [ ] SQL script executed successfully
- [ ] Admin: role='admin', user_type='graduates'
- [ ] Student: role='student', user_type='graduates'  
- [ ] Mentor: role='mentor', user_type='mentor'
- [ ] Mentor profile exists in mentors table
- [ ] Can login with admin account
- [ ] Can access admin panel
- [ ] Can login with student account
- [ ] Can access student dashboard
- [ ] Can login with mentor account
- [ ] Can access mentor dashboard

---

## 🎯 After All Accounts Created

### Next Steps:
1. ✅ All test accounts ready
2. ⏭️ Proceed to **Payment Testing**
3. ⏭️ Follow `NEXT_ACTIONS_READY.md`

### Quick Reference:

| Account | Email | Password | User Type | Dashboard |
|---------|-------|----------|-----------|-----------|
| Admin | admin@careerpath.test | Admin123!@# | admin | /admin-panel |
| Student | student@careerpath.test | Student123!@# | graduates | /dashboard |
| Mentor | mentor@careerpath.test | Mentor123!@# | mentor | /dashboard/mentor |

---

**Estimated Time:** 6 minutes remaining  
**Current Status:** Admin created ✅, Student 80% done 🔄, Mentor pending ⏳  
**Immediate Next:** Finish student account (1 min), then create mentor (3 min), then run SQL (2 min)

🚀 **Almost there! Student account is 80% complete - just check the Terms box and click Create Account!**