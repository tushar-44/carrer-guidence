import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ProfilePage from '@/pages/ProfilePage';
import MentorProfilePage from '@/pages/MentorProfilePage';
import { Loader2 } from 'lucide-react';

export default function ProfileRouter() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profile) {
      navigate('/auth/login');
    }
  }, [profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Route to mentor profile if user is a mentor
  if (profile?.user_type === 'mentor') {
    return <MentorProfilePage />;
  }

  // Default to regular profile page
  return <ProfilePage />;
}

