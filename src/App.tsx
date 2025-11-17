import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GlobalDrawer } from "@/components/drawer/global-drawer";
import { SvgFilters } from "@/components/ui/svg-filters";
import { Toaster } from "@/components/ui/toast";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useUserStore } from "@/stores/userStore";
import LoginPage from "@/app/auth/login/page";
import RegisterPage from "@/app/auth/register/page";
import { Home } from "@/sections/home/index-new";
import { MobileHomePage } from "@/pages/MobileHomePage";
import MentorsPage from "@/pages/MentorsPage";
import { MentorDetailPage } from "@/pages/MentorDetailPage";
import AssessmentPage from "@/app/(main)/assessment/page";
import { Jobs } from "@/sections/skills";
import { Dashboard } from "@/sections/about-me/index";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { CaseStudyDetailPage } from "@/pages/CaseStudyDetailPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { AdminPanelPage } from "@/pages/AdminPanelPage";
import OnboardingPage from "@/pages/OnboardingPage";
import CareerRoadmapPage from "@/app/(main)/career-roadmap/page";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

function DesktopApp() {
  return (
    <SmoothScrollProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="mentors" element={<MentorsPage />} />
          <Route path="mentors/:id" element={<MentorDetailPage />} />
          <Route path="assessment" element={<AssessmentPage />} />
          <Route path="career-roadmap" element={<CareerRoadmapPage />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<MentorDetailPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin-panel" element={<AdminPanelPage />} />
          <Route path="case-studies/:slug" element={<CaseStudyDetailPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>
        <Route path="*" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </SmoothScrollProvider>
  );
}

function MobileApp() {
  return (
    <Routes>
      <Route path="/" element={<MobileHomePage />} />
      <Route path="/mentors" element={<MentorsPage />} />
      <Route path="/mentors/:id" element={<MentorDetailPage />} />
      <Route path="/assessment" element={<AssessmentPage />} />
      <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<MentorDetailPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    </Routes>
  );
}

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="mentors" element={<MentorsPage />} />
        <Route path="mentors/:id" element={<MentorDetailPage />} />
        <Route path="assessment" element={<AssessmentPage />} />
        <Route path="career-roadmap" element={<CareerRoadmapPage />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<MentorDetailPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="case-studies/:slug" element={<CaseStudyDetailPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
      </Route>
      <Route path="*" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const { isDesktop } = useBreakpoint();
  const { isAuthenticated } = useUserStore();

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SvgFilters />
        <GlobalDrawer />
        <Toaster />
        {isAuthenticated ? (
          isDesktop ? <DesktopApp /> : <MobileApp />
        ) : (
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/*" element={<PublicRoutes />} />
          </Routes>
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}
