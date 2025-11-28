import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { StudentDashboardPage } from '@/pages/StudentDashboardPage';
import { MentorDashboardPage } from '@/pages/MentorDashboardPage';
import { Loader2 } from 'lucide-react';

export function DashboardRouter() {
  const { profile, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!profile && !user) {
        console.log('No profile or user found, redirecting to login');
        navigate('/auth/login');
      }
    }
  }, [profile, user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Route based on user type
  if (profile?.user_type === 'mentor') {
    return <MentorDashboardPage />;
  }

  // Default to student dashboard
  return <StudentDashboardPage />;
}

