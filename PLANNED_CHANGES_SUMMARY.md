# Planned Changes Summary - CareerPath Project

## Overview
This document outlines the specific changes I plan to implement based on the project analysis. **Please review this before I proceed with implementation.**

---

## 🔴 Critical Fixes (High Priority)

### 1. Database Schema Fixes
**Files to Modify:**
- `supabase/migrations/reset_and_create.sql` (or create new migration)

**Changes:**
- Add `vetting_status` column to `mentors` table
- Add `vetting_score` and `vetting_test_results` columns
- Create `bookings` table (or clarify if using `mentoring_sessions`)
- Add payment-related tables (`payments`, `transactions`)

**Impact:** Fixes runtime errors when filtering mentors and creating bookings.

---

### 2. Fix Mentor Filtering
**Files to Modify:**
- `src/pages/MentorsPage.tsx`

**Changes:**
- Remove or fix `vetting_status` filter until database is updated
- Add fallback for missing column
- Update to use correct column name after migration

**Impact:** Prevents errors when loading mentors page.

---

### 3. Fix Booking Functionality
**Files to Modify:**
- `src/components/mentors/BookingModal.tsx`
- `src/components/booking/BookingModal.tsx`
- `supabase/functions/bookings/index.ts`

**Changes:**
- Ensure booking uses correct table name
- Add proper error handling
- Connect to real database

**Impact:** Enables actual booking functionality.

---

## 🟡 Core Feature Completions

### 4. Payment Integration
**New Files:**
- `src/lib/payments/razorpay.ts` (or stripe.ts)
- `src/components/payments/PaymentModal.tsx`
- `supabase/functions/payments/index.ts`

**Files to Modify:**
- `src/components/booking/BookingModal.tsx`
- `src/pages/DashboardPage.tsx` (add payment history)

**Changes:**
- Integrate Razorpay or Stripe SDK
- Create payment intent flow
- Store payment records
- Add payment history to dashboard

**Impact:** Enables paid mentor sessions.

---

### 5. AI-Powered Mentor Vetting System
**New Files:**
- `supabase/functions/mentor-vetting/index.ts`
- `src/components/admin/MentorVettingPanel.tsx`
- `src/pages/MentorVettingPage.tsx`

**Files to Modify:**
- `src/pages/AdminPanelPage.tsx`
- `src/pages/OnboardingPage.tsx` (add vetting flow for mentors)

**Changes:**
- Create AI vetting test endpoint
- Build vetting UI for mentors
- Create admin approval interface
- Add automated scoring

**Impact:** Implements your unique mentor vetting feature.

---

### 6. Near-Peer Mentorship System
**Files to Modify:**
- `supabase/migrations/reset_and_create.sql`
- `src/pages/MentorsPage.tsx`
- `src/components/mentors/MentorCard.tsx`
- `src/pages/MentorDetailPage.tsx`

**Changes:**
- Add `mentor_type` field: `'near-peer' | 'professional'`
- Update filtering to show mentor type
- Add free session logic for near-peer mentors
- Add UI indicators

**Impact:** Implements your unique near-peer mentorship concept.

---

### 7. Complete AI Assessment Integration
**Files to Modify:**
- `src/lib/ai/careerAI.ts`
- `src/app/(main)/assessment/page.tsx`
- `supabase/functions/ai/index.ts`

**Changes:**
- Replace mock data with real OpenAI calls
- Implement dynamic question generation
- Add adaptive questioning logic
- Store generated questions

**Impact:** Makes assessment truly AI-powered.

---

### 8. Live Dashboard with Real Data
**Files to Modify:**
- `src/sections/about-me/index.tsx` (Dashboard component)
- `src/components/dashboard/SkillGapChart.tsx`
- `src/components/dashboard/UpcomingSessions.tsx`
- `src/pages/DashboardPage.tsx`

**Changes:**
- Connect to assessment store
- Connect to booking store
- Fetch real data from Supabase
- Add real-time updates
- Show actual progress

**Impact:** Dashboard becomes functional and useful.

---

### 9. Enhanced Admin Panel
**Files to Modify:**
- `src/pages/AdminPanelPage.tsx`

**New Files:**
- `src/components/admin/MentorApprovalList.tsx`
- `src/components/admin/UserManagement.tsx`
- `src/components/admin/AnalyticsDashboard.tsx`

**Changes:**
- Build mentor approval interface
- Add user management
- Add analytics dashboard
- Add content moderation tools

**Impact:** Enables platform management.

---

## 🟢 Additional Enhancements (Optional)

### 10. Company Job Posting
**New Files:**
- `src/pages/CompanyDashboard.tsx`
- `src/components/jobs/JobPostingForm.tsx`

**Files to Modify:**
- `src/pages/OnboardingPage.tsx` (add company flow)
- `src/pages/JobsPage.tsx`

**Changes:**
- Create company dashboard
- Build job posting form
- Add job management interface

**Impact:** Enables companies to post jobs.

---

### 11. Community Hub (Future Feature)
**New Files:**
- `src/pages/CommunityPage.tsx`
- `src/components/community/Forum.tsx`
- `src/components/community/AMASessions.tsx`

**Database:**
- Create forum tables
- Create AMA session tables

**Changes:**
- Build discussion forums
- Implement AMA scheduling
- Add peer-to-peer support

**Impact:** Adds community engagement features.

---

## 📋 Implementation Order

### Phase 1: Critical Fixes (Do First)
1. ✅ Database schema fixes
2. ✅ Fix mentor filtering
3. ✅ Fix booking functionality

### Phase 2: Core Features (Do Next)
4. ✅ Payment integration
5. ✅ AI mentor vetting
6. ✅ Near-peer mentorship
7. ✅ AI assessment completion
8. ✅ Live dashboard

### Phase 3: Enhancements (Do Last)
9. ✅ Admin panel
10. ✅ Company job posting
11. ✅ Community hub (if needed)

---

## ⚠️ Important Notes

1. **Database Migrations:** I'll create new migration files rather than modifying existing ones to preserve history.

2. **Backward Compatibility:** Changes will maintain backward compatibility where possible.

3. **Environment Variables:** You'll need to add:
   - `VITE_RAZORPAY_KEY` (or Stripe keys)
   - `OPENAI_API_KEY` (if not already set)
   - Payment webhook secrets

4. **Testing:** After implementation, you should test:
   - Mentor vetting flow
   - Payment processing
   - Booking creation
   - Dashboard data loading

5. **Supabase Setup:** Ensure Supabase Edge Functions are deployed for:
   - `/functions/ai`
   - `/functions/assessments`
   - `/functions/bookings`
   - `/functions/payments` (new)
   - `/functions/mentor-vetting` (new)

---

## 🎯 What I Need From You

Before I proceed, please confirm:

1. **Payment Gateway:** Razorpay (India) or Stripe (Global)?
2. **Priority:** Which features are most important to you?
3. **Timeline:** What's your deadline?
4. **Scope:** Should I implement all features or focus on specific ones?
5. **Testing:** Do you have a test Supabase instance set up?

---

## 📝 Estimated Implementation Time

- **Critical Fixes:** 2-3 hours
- **Payment Integration:** 4-6 hours
- **Mentor Vetting:** 6-8 hours
- **Near-Peer System:** 2-3 hours
- **AI Assessment:** 4-6 hours
- **Live Dashboard:** 4-6 hours
- **Admin Panel:** 6-8 hours

**Total:** ~30-40 hours of development work

---

**Ready to proceed?** Let me know which features you'd like me to implement first, and I'll start working on them!

