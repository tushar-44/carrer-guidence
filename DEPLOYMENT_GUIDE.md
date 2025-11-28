# 🚀 CareerPath Platform - Deployment Guide

**Last Updated:** January 2025  
**Status:** Ready for Deployment

---

## 📋 Pre-Deployment Checklist

### 1. Database Setup ✅

**Step 1: Apply Migration**
```bash
# Option A: Using Supabase CLI (Recommended)
supabase db push

# Option B: Manual via Supabase Dashboard
# 1. Go to https://supabase.com/dashboard/project/axxkzhcavbqcooevayyn/sql
# 2. Copy content from supabase/migrations/001_fix_schema_issues.sql
# 3. Execute the SQL
# 4. Verify no errors
```

**Step 2: Verify Schema**
```bash
# Run the verification script in Supabase SQL Editor
# File: verify-database.sql
```

**Expected Results:**
- ✅ 5 new columns in `mentors` table
- ✅ 6 new columns in `mentoring_sessions` table
- ✅ 3 new tables created (`payments`, `ai_roadmaps`, `mentor_vetting_tests`)
- ✅ 4 new columns in `jobs` table
- ✅ 6 indexes created
- ✅ RLS policies applied

---

### 2. Environment Variables Setup ✅

**Local Development (.env.local)**
```env
# Supabase
VITE_SUPABASE_URL=https://axxkzhcavbqcooevayyn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=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

# Razorpay (Test Mode)
VITE_RAZORPAY_KEY_ID=rzp_test_RkIVo14pCCzdEO
VITE_RAZORPAY_KEY_SECRET=r0LNYjZuse4URVj6LMcbXxHt

# Google OAuth
GOOGLE_CLIENT_ID=533661415619-kq65u6ppg956nlrintq76h1eqodm93dl.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

**Production (.env.production)**
```env
# Same as above but with PRODUCTION keys:
# - Razorpay LIVE keys (rzp_live_...)
# - Production Google OAuth credentials
# - Production Supabase project (if different)
```

---

### 3. Supabase Edge Functions Deployment

**Prerequisites:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref axxkzhcavbqcooevayyn
```

**Deploy All Functions:**
```bash
# Navigate to project root
cd "e:\final year project files\dev-site-main\dev-site-main"

# Deploy AI functions
supabase functions deploy ai
supabase functions deploy ai/generate-questions

# Deploy payment functions
supabase functions deploy payments

# Deploy booking functions
supabase functions deploy bookings

# Deploy assessment functions
supabase functions deploy assessments

# Deploy profile functions
supabase functions deploy profile
```

**Set Supabase Secrets:**
```bash
# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=sk-proj-wVXC8ndU8pm...

# Set Razorpay keys
supabase secrets set RAZORPAY_KEY_ID=rzp_test_RkIVo14pCCzdEO
supabase secrets set RAZORPAY_KEY_SECRET=r0LNYjZuse4URVj6LMcbXxHt

# Get webhook secret from Razorpay dashboard and set
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Verify secrets
supabase secrets list
```

---

### 4. Razorpay Setup

**Test Mode (Current):**
1. ✅ Already configured with test keys
2. ✅ Test cards available for testing

**Production Setup:**
1. Go to https://dashboard.razorpay.com
2. Switch to "Live Mode"
3. Get Live API Keys from Settings → API Keys
4. Update environment variables:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
   VITE_RAZORPAY_KEY_SECRET=your_live_secret
   ```
5. Setup Webhook:
   - URL: `https://axxkzhcavbqcooevayyn.supabase.co/functions/v1/payments/webhook`
   - Events: `payment.captured`, `payment.failed`, `order.paid`
   - Get webhook secret and update Supabase secrets

**Test Cards (Test Mode):**
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

---

## 🧪 Testing Before Deployment

### 1. Local Testing

**Start Development Server:**
```bash
npm run dev
# Server running at http://localhost:5175
```

**Test Checklist:**
- [ ] User signup and login works
- [ ] Profile creation and editing works
- [ ] Assessment can be completed
- [ ] Assessment results save to database
- [ ] Mentor browsing works
- [ ] Booking modal opens
- [ ] Payment flow works (test mode)
- [ ] Dashboard displays data
- [ ] Admin panel accessible (after setting role)
- [ ] No console errors

### 2. Database Testing

**Run Verification Queries:**
```sql
-- Check if migration applied
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'mentors' AND column_name = 'vetting_status';

-- Should return 1 row if migration successful
```

### 3. Edge Functions Testing

**Test AI Function:**
```bash
curl -X POST https://axxkzhcavbqcooevayyn.supabase.co/functions/v1/ai \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "generate_roadmap", "userId": "test-user-id"}'
```

**Test Payment Function:**
```bash
curl -X POST https://axxkzhcavbqcooevayyn.supabase.co/functions/v1/payments/create-order \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "currency": "INR"}'
```

---

## 🌐 Production Deployment

### Option 1: Vercel (Recommended)

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Login to Vercel**
```bash
vercel login
```

**Step 3: Deploy**
```bash
# First deployment (will ask questions)
vercel

# Production deployment
vercel --prod
```

**Step 4: Set Environment Variables in Vercel Dashboard**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

**Step 5: Configure Custom Domain (Optional)**
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

### Option 2: Netlify

**Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

**Step 2: Login to Netlify**
```bash
netlify login
```

**Step 3: Deploy**
```bash
# Initialize
netlify init

# Deploy
netlify deploy --prod
```

**Step 4: Set Environment Variables**
```bash
# Via CLI
netlify env:set VITE_SUPABASE_URL "https://axxkzhcavbqcooevayyn.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your_key"
# ... repeat for all variables

# Or via Netlify Dashboard → Site Settings → Environment Variables
```

---

### Option 3: Manual Build

**Build for Production:**
```bash
npm run build
```

**Output:**
- Build files in `dist/` folder
- Upload to any static hosting (AWS S3, Cloudflare Pages, etc.)

---

## 📊 Post-Deployment Verification

### 1. Smoke Tests

**Test URLs:**
```
✅ Homepage: https://your-domain.com
✅ Login: https://your-domain.com/auth/login
✅ Signup: https://your-domain.com/auth/signup
✅ Dashboard: https://your-domain.com/dashboard
✅ Mentors: https://your-domain.com/mentors
✅ Assessment: https://your-domain.com/assessment
✅ Jobs: https://your-domain.com/jobs
```

### 2. Functionality Tests

**Critical Flows:**
1. [ ] User can sign up
2. [ ] User can log in
3. [ ] User can complete assessment
4. [ ] User can browse mentors
5. [ ] User can book a session
6. [ ] Payment processing works
7. [ ] Dashboard shows data
8. [ ] Admin can approve mentors

### 3. Performance Tests

**Metrics to Check:**
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Mobile responsive

**Tools:**
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)
- GTmetrix

---

## 🔒 Security Checklist

### Pre-Production

- [ ] All API keys in environment variables (not hardcoded)
- [ ] Supabase RLS policies enabled on all tables
- [ ] CORS configured correctly
- [ ] Rate limiting enabled on Edge Functions
- [ ] Input validation on all forms
- [ ] SQL injection prevention (using Supabase client)
- [ ] XSS prevention (React handles this)
- [ ] HTTPS enabled (automatic with Vercel/Netlify)

### Razorpay Security

- [ ] Webhook signature verification enabled
- [ ] Payment amount verification on backend
- [ ] Order ID validation
- [ ] User authentication before payment
- [ ] Payment records in database

---

## 📧 Email Setup (Optional but Recommended)

### Option 1: Resend (Recommended)

```bash
npm install resend
```

**Setup:**
1. Create account at https://resend.com
2. Get API key
3. Add to environment: `RESEND_API_KEY=re_...`
4. Create email templates
5. Send emails via Edge Functions

### Option 2: SendGrid

```bash
npm install @sendgrid/mail
```

**Setup:**
1. Create account at https://sendgrid.com
2. Get API key
3. Add to environment: `SENDGRID_API_KEY=SG.xxx`
4. Configure sender email
5. Send emails via Edge Functions

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Solution: Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

**2. Edge Functions Not Working**
```
Solution: 
- Verify functions are deployed: supabase functions list
- Check secrets are set: supabase secrets list
- Check function logs in Supabase Dashboard
```

**3. Payment Failing**
```
Solution:
- Verify Razorpay keys are correct
- Check webhook is configured
- Verify payment function is deployed
- Check Razorpay dashboard for errors
```

**4. Assessment Not Saving**
```
Solution:
- Check assessment_results table exists
- Verify RLS policies allow insert
- Check browser console for errors
```

**5. Build Errors**
```
Solution:
- Clear node_modules: rm -rf node_modules && npm install
- Clear cache: npm run clean (if available)
- Check TypeScript errors: npm run type-check
```

---

## 📈 Monitoring & Analytics

### Setup Error Tracking

**Sentry (Recommended):**
```bash
npm install @sentry/react
```

**Configuration:**
```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

### Setup Analytics

**Google Analytics:**
```typescript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

---

## 🎯 Launch Checklist

### Pre-Launch (1 Week Before)

- [ ] All features tested
- [ ] Database migration applied
- [ ] Edge Functions deployed
- [ ] Environment variables configured
- [ ] Payment gateway in test mode
- [ ] Email notifications working
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Performance optimized
- [ ] Security audit completed

### Launch Day

- [ ] Switch Razorpay to live mode
- [ ] Deploy to production
- [ ] Verify all critical flows
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Announce launch

### Post-Launch (1 Week After)

- [ ] Monitor user feedback
- [ ] Fix critical bugs
- [ ] Optimize performance
- [ ] Add missing features
- [ ] Plan next iteration

---

## 📞 Support Resources

**Documentation:**
- Supabase: https://supabase.com/docs
- Razorpay: https://razorpay.com/docs
- Vercel: https://vercel.com/docs
- React: https://react.dev

**Community:**
- Supabase Discord
- React Discord
- Stack Overflow

---

**Deployment Status:** Ready for Production  
**Last Updated:** January 2025