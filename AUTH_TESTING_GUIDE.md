# 🔐 Authentication Testing Guide

**Platform:** CareerPath  
**Date:** January 27, 2025  
**Purpose:** Step-by-step guide to test authentication flows

---

## 🎯 Prerequisites

- Dev server running: `npm run dev`
- Browser open at: `http://localhost:5173`
- Supabase dashboard access
- Clear browser cache/cookies (for fresh test)

---

## 📋 Test 1: User Registration

### Steps:

1. **Navigate to Registration Page**
   ```
   URL: http://localhost:5173/auth/register
   ```

2. **Fill Registration Form**
   - Email: `test.student@example.com`
   - Password: `Test123!@#`
   - Confirm Password: `Test123!@#`

3. **Submit Form**
   - Click "Sign Up" button
   - Watch for loading state

4. **Expected Results:**
   - ✅ Success message appears
   - ✅ Email confirmation sent (check Supabase dashboard)
   - ✅ Role selection modal appears
   - ✅ Can select Student or Mentor role

5. **Verify in Supabase:**
   - Open Supabase dashboard
   - Navigate to Authentication > Users
   - Verify new user entry exists
   - Check email matches

6. **Complete Onboarding:**
   - Select "Student" role
   - Click continue
   - Verify redirect to `/dashboard/student`

### Test Variations:

**Test 1a: Invalid Email**
- Email: `invalid-email`
- Expected: Error message "Invalid email format"

**Test 1b: Weak Password**
- Password: `123`
- Expected: Error message "Password must be at least 6 characters"

**Test 1c: Password Mismatch**
- Password: `Test123!@#`
- Confirm: `Different123!@#`
- Expected: Error message "Passwords do not match"

**Test 1d: Existing Email**
- Email: `test.student@example.com` (already registered)
- Expected: Error message "Email already registered"

---

## 📋 Test 2: User Login

### Steps:

1. **Navigate to Login Page**
   ```
   URL: http://localhost:5173/auth/login
   ```

2. **Fill Login Form**
   - Email: `test.student@example.com`
   - Password: `Test123!@#`

3. **Submit Form**
   - Click "Sign In" button
   - Watch for loading state

4. **Expected Results:**
   - ✅ Success message appears
   - ✅ Redirect to dashboard
   - ✅ User profile loads
   - ✅ Navigation shows "Logout" option

5. **Verify Session:**
   - Refresh page (F5)
   - Expected: Still logged in
   - Check localStorage for session token

### Test Variations:

**Test 2a: Invalid Credentials**
- Email: `test.student@example.com`
- Password: `WrongPassword123`
- Expected: Error message "Invalid credentials"

**Test 2b: Non-existent User**
- Email: `nonexistent@example.com`
- Password: `Test123!@#`
- Expected: Error message "User not found"

---

## 📋 Test 3: Session Persistence

### Steps:

1. **Login Successfully**
   - Follow Test 2 steps

2. **Refresh Page**
   - Press F5 or reload
   - Expected: Still logged in

3. **Close and Reopen Browser**
   - Close browser completely
   - Reopen and navigate to `http://localhost:5173`
   - Expected: Still logged in (if "Remember me" checked)

4. **Navigate Between Pages**
   - Go to `/mentors`
   - Go to `/assessment`
   - Go back to `/dashboard`
   - Expected: Session maintained throughout

---

## 📋 Test 4: Protected Routes

### Steps:

1. **Logout** (if logged in)
   - Click logout button
   - Verify redirect to homepage

2. **Try Accessing Protected Routes**
   - Navigate to: `http://localhost:5173/dashboard`
   - Expected: Redirect to `/auth/login`
   
   - Navigate to: `http://localhost:5173/dashboard/student`
   - Expected: Redirect to `/auth/login`

3. **Login and Access**
   - Login with valid credentials
   - Navigate to `/dashboard`
   - Expected: Access granted

---

## 📋 Test 5: Logout Functionality

### Steps:

1. **Login Successfully**
   - Follow Test 2 steps

2. **Click Logout**
   - Find logout button in navigation
   - Click logout

3. **Expected Results:**
   - ✅ Redirect to homepage or login page
   - ✅ Session cleared from localStorage
   - ✅ Cannot access protected routes
   - ✅ Navbar shows "Login" instead of "Logout"

4. **Verify Session Cleared**
   - Open DevTools > Application > Local Storage
   - Check for session tokens (should be cleared)
   - Try accessing `/dashboard` (should redirect to login)

---

## 📋 Test 6: Role-Based Access

### Test as Student:

1. **Register/Login as Student**
   - Email: `test.student@example.com`
   - Role: Student

2. **Access Student Dashboard**
   - Navigate to `/dashboard/student`
   - Expected: Access granted

3. **Try Accessing Mentor Dashboard**
   - Navigate to `/dashboard/mentor`
   - Expected: Access denied or redirect

### Test as Mentor:

1. **Register/Login as Mentor**
   - Email: `test.mentor@example.com`
   - Role: Mentor

2. **Access Mentor Dashboard**
   - Navigate to `/dashboard/mentor`
   - Expected: Access granted

3. **Try Accessing Student Dashboard**
   - Navigate to `/dashboard/student`
   - Expected: Access denied or redirect

---

## 🐛 Common Issues & Solutions

### Issue 1: "Loading CareerPath..." Stuck
**Solution:** 
- Check browser console for errors
- Verify Supabase environment variables
- Clear browser cache and reload

### Issue 2: Registration Not Working
**Solution:**
- Check Supabase dashboard > Authentication settings
- Verify email confirmation is disabled (for testing)
- Check network tab for API errors

### Issue 3: Session Not Persisting
**Solution:**
- Check localStorage for session tokens
- Verify Supabase session configuration
- Check browser privacy settings (cookies enabled)

### Issue 4: Redirect Loop
**Solution:**
- Clear all cookies and localStorage
- Check App.tsx authentication logic
- Verify protected route configuration

---

## 📊 Test Results Template

Use this template to document your test results:

```markdown
## Test Results - [Date]

### Test 1: User Registration
- Status: ✅ PASS / ❌ FAIL
- Notes: [Any observations]
- Screenshots: [Attach if needed]

### Test 2: User Login
- Status: ✅ PASS / ❌ FAIL
- Notes: [Any observations]

### Test 3: Session Persistence
- Status: ✅ PASS / ❌ FAIL
- Notes: [Any observations]

### Test 4: Protected Routes
- Status: ✅ PASS / ❌ FAIL
- Notes: [Any observations]

### Test 5: Logout Functionality
- Status: ✅ PASS / ❌ FAIL
- Notes: [Any observations]

### Test 6: Role-Based Access
- Status: ✅ PASS / ❌ FAIL
- Notes: [Any observations]

### Overall Result
- Total Tests: 6
- Passed: X
- Failed: Y
- Pass Rate: Z%
```

---

## 🔍 Debugging Tips

1. **Check Browser Console**
   - Press F12
   - Look for red errors
   - Check network tab for failed requests

2. **Check Supabase Logs**
   - Open Supabase dashboard
   - Navigate to Logs
   - Filter by authentication events

3. **Verify Environment Variables**
   ```bash
   # Check .env file
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Test API Directly**
   - Use Postman or curl to test Supabase auth endpoints
   - Verify responses match expected format

---

## ✅ Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Proper redirects
- ✅ Session persistence working
- ✅ Role-based access enforced
- ✅ Error messages clear and helpful
- ✅ UI responsive during auth operations

---

**Next Steps:** After authentication testing passes, proceed to Payment Integration Testing (see TESTING_CHECKLIST.md Phase 3)