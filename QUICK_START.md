# 🚀 CareerPath - Quick Start Guide

**Get your platform running in 15 minutes!**

---

## ⚠️ Important: Use Vite Dev Server

**You're seeing a blank page?** Make sure you're using Vite's dev server, NOT Live Server!

### ❌ Wrong: Static File Server (port 5500)
- Live Server
- Python SimpleHTTPServer
- Any static file server

### ✅ Correct: Vite Dev Server (port 5173 or 5175)
```bash
npm run dev
```

---

## 📋 Prerequisites

- [x] Node.js 20.19+ installed
- [x] Supabase account created
- [x] Project already cloned

---

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies (2 minutes)

```bash
npm install
```

### Step 2: Apply Database Migration (3 minutes)

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/axxkzhcavbqcooevayyn/sql
2. Copy the content from `supabase/migrations/001_fix_schema_issues.sql`
3. Paste and execute in SQL Editor
4. Verify success (should show "Success. No rows returned")

### Step 3: Verify Environment Variables (1 minute)

Check `.env.local` file has these values:

```env
✅ VITE_SUPABASE_URL=https://axxkzhcavbqcooevayyn.supabase.co
✅ VITE_SUPABASE_ANON_KEY=eyJhbGc...
✅ OPENAI_API_KEY=sk-proj-wVXC8ndU8pm...
✅ VITE_RAZORPAY_KEY_ID=rzp_test_RkIVo14pCCzdEO
```

All set? Great! ✅

### Step 4: Deploy Edge Functions (5 minutes)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref axxkzhcavbqcooevayyn

# Deploy functions
supabase functions deploy ai
supabase functions deploy payments
supabase functions deploy bookings
supabase functions deploy assessments

# Set secrets
supabase secrets set OPENAI_API_KEY=sk-proj-wVXC8ndU8pm...
supabase secrets set RAZORPAY_KEY_ID=rzp_test_RkIVo14pCCzdEO
supabase secrets set RAZORPAY_KEY_SECRET=r0LNYjZuse4URVj6LMcbXxHt
```

### Step 5: Start Development Server (1 minute)

```bash
npm run dev
```

**You should see:**
```
  VITE v7.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

**Open `http://localhost:5173/` in your browser** (NOT port 5500!) 🎉

---

## 🧪 Quick Test

### Test 1: Sign Up
1. Go to http://localhost:5173/auth/signup
2. Create account
3. Login

### Test 2: Take Assessment
1. Navigate to `/assessment`
2. Complete assessment
3. View results

### Test 3: Browse Mentors
1. Go to `/mentors`
2. Click on a mentor
3. Try booking (payment in test mode)

### Test 4: Check Dashboard
1. Go to `/dashboard`
2. Verify data appears

---

## 🐛 Troubleshooting

### Issue: Blank Page

**Problem:** Using Live Server or static file server (port 5500)

**Solution:**
1. Stop Live Server
2. Close browser tabs on port 5500
3. Run `npm run dev`
4. Open `http://localhost:5173/`
5. Clear browser cache: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

**Why?** Vite dev server handles TypeScript, ES modules, and HMR. Static servers don't.

---

### Issue: Database connection error

**Solution:** Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`

---

### Issue: Functions not working

**Solution:** 
1. Deploy all functions: `supabase functions deploy <function-name>`
2. Set secrets: `supabase secrets set KEY=value`
3. Verify: `supabase functions list` and `supabase secrets list`

---

### Issue: Payment failing

**Solution:** Use test card `4111 1111 1111 1111` with any CVV and future expiry

---

### Issue: Module errors in console

**Solution:**
1. Ensure using Vite dev server (NOT Live Server)
2. Clear browser cache
3. Check terminal for errors
4. Run `npm install` again if needed

---

## 📚 Next Steps

1. ✅ Read `VERIFICATION_CHECKLIST.md` for detailed testing
2. ✅ Read `DEPLOYMENT_GUIDE.md` for production deployment
3. ✅ Check `PROJECT_ROADMAP_2025.md` for remaining features

---

## 🎯 What Works Now

✅ User authentication  
✅ Profile management  
✅ AI-powered assessments  
✅ Mentor browsing & booking  
✅ Payment processing (test mode)  
✅ Dashboard with real data  
✅ Admin panel  
✅ Jobs listing  

---

## 🚧 What's Next

🔲 Email notifications  
🔲 Company job posting UI  
🔲 Real-time updates  
🔲 Video call integration  
🔲 Community features  

---

## 📝 Important Notes

- **Always use `npm run dev`** to start the development server
- The Vite server runs on port **5173** by default (or 5175 if 5173 is busy)
- **Never use Live Server** or other static file servers for Vite projects
- The favicon works automatically when using Vite (it's in the `public/` folder)
- ES modules and TypeScript require Vite's build process

---

**You're all set! Happy coding! 🚀**