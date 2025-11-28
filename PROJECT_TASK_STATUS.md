# 🔍 CareerPath Project Task Status (Deduplicated Backlog)

This document replaces the scattered TODO lists (`TODO.md`, `TODO-Phase1.md`, `TODO-Phase5-6.md`, `TODO-role-system.md`).  
Those files are now archived for historical context. All active work should reference the sections below.

---

## ✅ Recently Completed Highlights
- **Auth + Profiles**: Supabase trigger + frontend fallback keep `public.users` in sync with Auth.  
- **Dashboards**: Student “Career Command Center” and Mentor “Professional Studio” implemented with glassmorphism UI and charts.  
- **Home Hero**: Typography, CTA buttons, and character row redesigned for readability.  
- **Environment + Supabase Setup**: `.env.local` template, SQL schema, and setup guides finalized.

---

## 🟧 Active Backlog (Consolidated Tasks)

### 1. Role-Based User Journey
- Build/finish **user-type selection** during onboarding and persist to `user_type`.
- Enforce **role-gated navigation** (admins/mentors/students) across client routes and middleware (student-only pages, mentor-only studio, etc.).
- Add **role-aware landing hero CTA** (e.g., mentor recruitment vs student assessment).

### 2. Assessment System Upgrade
- Implement adaptive, multi-dimensional assessments (Aptitude, Interests, Personality, EQ, Skills).
- Add **question stepper** with progress + timing.
- Generate **results view** with radar/bar charts, skill-gap table, and AI recommendations.
- Persist **assessment answers/results** to Supabase + sync to dashboards.

### 3. Mentor & Job Workflows
- Finish **Mentor Detail** experience: availability calendar, slot booking modal, meeting link handling.
- Implement **booking flow** (create/edit/cancel sessions, payment hook once Razorpay ready).
- Enhance **Job Detail + Application** (resume upload, status tracking, saved jobs).
- Wire up **Supabase RPC / Edge Functions** for bookings, applications, and mentor verification.

### 4. Dashboard Data Integration
- Hook Student/Mentor dashboards to **live Supabase data** (assessment results, bookings, payments).
- Add **career goal tracker** and **learning roadmap** updates when assessments or sessions complete.
- Implement **real-time updates** (e.g., Supabase subscriptions or polling) for bookings and earnings.

### 5. Analytics & Reporting
- Build downloadable **progress reports** (PDF or on-screen) combining assessments, bookings, AI advice.
- Add **learning hours tracking**, **career milestones**, and **skill-development timelines**.
- Provide mentors with **financial analytics** sourced from real payment data (pending Razorpay integration).

### 6. Mobile & Performance Polish
- Audit dashboards and hero for **mobile breakpoints** (≤640px) and optimize layout/CTA stacks.
- Apply **lazy loading & code splitting** on heavy dashboard widgets.
- Add **loading skeletons**, error boundaries, and offline caching (service worker optional).

### 7. QA & Compliance
- Regression test **signup / onboarding / dashboard routing** for both roles.
- Verify **a11y**: keyboard navigation, ARIA labels on charts/buttons.
- Cross-browser test (Chrome, Firefox, Safari, Edge) + Lighthouse performance pass.

---

## 🗂️ Archived TODO Files
| File | Status | Notes |
|------|--------|-------|
| `TODO.md` | Archived | Hero section work merged into `HOME_PAGE_FIXES_COMPLETE.md`. |
| `TODO-Phase1.md` | Archived | Tasks merged into sections 1-3 above. |
| `TODO-Phase5-6.md` | Archived | Analytics/UX tasks merged into sections 4-7 above. |
| `TODO-role-system.md` | Archived | Role-based features completed; further work tracked in section 1. |

Please update *only* this document when adding/removing tasks to avoid duplicate backlogs.

---

## 📌 Next Steps
1. Prioritize sections 2–4 (Assessments, Workflows, Dashboard data) for end-to-end value.
2. Create scoped issues / tickets per bullet to track progress.
3. Remove the old TODO files once the team confirms this consolidated backlog is in use.

Need clarification on any task? Ping the AI assistant with the section + bullet number.  
Let's keep the backlog clean and single-sourced. 🚀

