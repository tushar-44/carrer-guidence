import { lazy, Suspense, Component, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GlobalDrawer } from "@/components/drawer/global-drawer";
import { SvgFilters } from "@/components/ui/svg-filters";
import { Toaster } from "@/components/ui/toast";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useUserStore } from "@/stores/userStore";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'oklch(0.15 0.02 264)',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '600px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
            <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'oklch(0.65 0.25 285)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Optimized loading component with minimal CSS
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'oklch(0.15 0.02 264)'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '3rem',
        height: '3rem',
        border: '2px solid transparent',
        borderTopColor: 'oklch(0.65 0.25 285)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{
        fontSize: '0.875rem',
        color: 'oklch(0.65 0.02 264)'
      }}>Loading...</p>
    </div>
  </div>
);

// Temporarily disable lazy loading to debug loading issue
import LoginPage from "@/app/auth/login/page";
import RegisterPage from "@/app/auth/register/page";
import { Home } from "@/sections/home/index-new";
// const LoginPage = lazy(() => import("@/app/auth/login/page"));
// const RegisterPage = lazy(() => import("@/app/auth/register/page"));
// const Home = lazy(() => import("@/sections/home/index-new").then(module => ({ default: module.Home })));
const MobileHomePage = lazy(() => import("@/pages/MobileHomePage").then(module => ({ default: module.MobileHomePage })));
const MentorsPage = lazy(() => import("@/pages/MentorsPage"));
const MentorDetailPage = lazy(() => import("@/pages/MentorDetailPage").then(module => ({ default: module.MentorDetailPage })));
const AssessmentPage = lazy(() => import("@/app/(main)/assessment/page"));
const Jobs = lazy(() => import("@/sections/skills").then(module => ({ default: module.Jobs })));
const DashboardRouter = lazy(() => import("@/components/dashboard/DashboardRouter").then(module => ({ default: module.DashboardRouter })));
const StudentDashboardPage = lazy(() => import("@/pages/StudentDashboardPage").then(module => ({ default: module.StudentDashboardPage })));
const MentorDashboardPage = lazy(() => import("@/pages/MentorDashboardPage").then(module => ({ default: module.MentorDashboardPage })));
const AboutPage = lazy(() => import("@/pages/AboutPage").then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import("@/pages/ContactPage").then(module => ({ default: module.ContactPage })));
const ProfileRouter = lazy(() => import("@/components/profile/ProfileRouter"));
const CaseStudyDetailPage = lazy(() => import("@/pages/CaseStudyDetailPage").then(module => ({ default: module.CaseStudyDetailPage })));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage").then(module => ({ default: module.PrivacyPolicyPage })));
const AdminPanelPage = lazy(() => import("@/pages/AdminPanelPage").then(module => ({ default: module.AdminPanelPage })));
const OnboardingPage = lazy(() => import("@/pages/OnboardingPage"));
const CareerRoadmapPage = lazy(() => import("@/app/(main)/career-roadmap/page"));

function DesktopApp() {
  return (
    <ErrorBoundary>
      <SmoothScrollProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="mentors" element={<MentorsPage />} />
            <Route path="mentors/:id" element={<MentorDetailPage />} />
            <Route path="assessment" element={<AssessmentPage />} />
            <Route path="career-roadmap" element={<CareerRoadmapPage />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<MentorDetailPage />} />
            <Route path="dashboard" element={<DashboardRouter />} />
            <Route path="dashboard/student" element={<StudentDashboardPage />} />
            <Route path="dashboard/mentor" element={<MentorDashboardPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="profile" element={<ProfileRouter />} />
            <Route path="admin-panel" element={<AdminPanelPage />} />
            <Route path="case-studies/:slug" element={<CaseStudyDetailPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          </Route>
          <Route path="*" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
          </Routes>
        </Suspense>
      </SmoothScrollProvider>
    </ErrorBoundary>
  );
}

function MobileApp() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
        <Route path="/" element={<MobileHomePage />} />
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/mentors/:id" element={<MentorDetailPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<MentorDetailPage />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/dashboard/student" element={<StudentDashboardPage />} />
        <Route path="/dashboard/mentor" element={<MentorDashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfileRouter />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

function PublicRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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
          <Route path="dashboard" element={<DashboardRouter />} />
          <Route path="dashboard/student" element={<StudentDashboardPage />} />
          <Route path="dashboard/mentor" element={<MentorDashboardPage />} />
          <Route path="case-studies/:slug" element={<CaseStudyDetailPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>
        <Route path="*" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function AppContent() {
  const { isDesktop } = useBreakpoint();
  const { user, loading, profile } = useAuth();
  const { isAuthenticated, currentUser } = useUserStore();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading CareerPath...</p>
        </div>
      </div>
    );
  }

  // Check authentication from both sources for reliability
  const isUserAuthenticated = !!user || isAuthenticated;

  // Debug logging
  console.log('Auth State:', {
    user: !!user,
    profile: !!profile,
    isAuthenticated,
    currentUser: !!currentUser,
    isUserAuthenticated
  });

  return (
    <>
      <SvgFilters />
      <GlobalDrawer />
      <Toaster />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth routes - accessible when NOT authenticated */}
          <Route path="/auth/login" element={
            isUserAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } />
          <Route path="/auth/register" element={
            isUserAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          } />
          
          {/* Protected routes - accessible when authenticated */}
          {isUserAuthenticated ? (
            <>
              {isDesktop ? (
                <Route path="/*" element={<DesktopApp />} />
              ) : (
                <Route path="/*" element={<MobileApp />} />
              )}
            </>
          ) : (
            <Route path="/*" element={<PublicRoutes />} />
          )}
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  try {
    return (
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">Error Loading App</h1>
          <p className="text-red-400 mb-4">{String(error)}</p>
          <pre className="text-left bg-gray-800 p-4 rounded overflow-auto text-sm">
            {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
          </pre>
          <p className="mt-4 text-gray-400">Check the browser console (F12) for more details.</p>
        </div>
      </div>
    );
  }
}