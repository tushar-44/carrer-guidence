# TODO: Role-Based Profile System + Dashboards

> **Status:** Archived. All role-system tasks are tracked/completed elsewhere; refer to `PROJECT_TASK_STATUS.md` for any follow-up work.

## Step 1: Update Roles Constants ✅
- Updated `src/constants/roles.ts` to define mappings for user_type to roles (graduates -> Student, mentor -> Mentor)

## Step 2: Create API Utilities ✅
- Created `src/lib/api/dashboard.ts` with functions to fetch dashboard data from Supabase (student and mentor dashboards)

## Step 3: Update Profile Page ✅
- Modified `src/pages/ProfilePage.tsx` to include tabs: Personal Details (editable fields) and Security (placeholders)

## Step 4: Create Student Dashboard Page ✅
- Created `src/pages/DashboardStudentPage.tsx` with widgets: Progress, Skill Gap Radar, Upcoming Sessions, Recommended Courses

## Step 5: Create Mentor Dashboard Page ✅
- Created `src/pages/DashboardMentorPage.tsx` with widgets: Session Stats, Availability Calendar, Vetting Status

## Step 6: Update Navigation ✅
- Modified navigation components in `src/components/navigation/` to show role-based links (Student: Home, Assessments, Mentors, Profile; Mentor: Home, Sessions, Availability, Profile)

## Step 7: Implement Role-Based Redirections ✅
- Updated auth logic in `src/hooks/useAuth.tsx` or routing to redirect after login based on user_type
- Added client-side route protection for dashboards

## Step 8: Testing and Followup ✅
- Tested role-based access and redirections
- Ensured responsiveness with Tailwind
- Added mock data where needed
- Updated Supabase migrations if role column needs adjustment (but keep user_type)
