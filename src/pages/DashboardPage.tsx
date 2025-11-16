import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { Dashboard } from "@/sections/about-me/index";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

interface AssessmentResult {
  id: string;
  user_id: string;
  assessment_id: string;
  results: {
    skillScores: Record<string, number>;
    roadmap: any[];
  };
  created_at: string;
}

export function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchAssessmentData();
    }
  }, [user, authLoading, navigate]);

  const fetchAssessmentData = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching assessment data:', error);
      } else if (data && data.length > 0) {
        setAssessmentData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching assessment data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <>
      <SEO
        title="Student Dashboard — CareerPath"
        description="Your Career Tracking Hub - Monitor your progress, track achievements, and stay on course with personalized insights and real-time guidance."
        url="https://www.careerpath.dev/dashboard"
      />
      <div className="py-8">
        {profile && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome, {profile.full_name || 'User'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's your personalized career dashboard
            </p>
          </div>
        )}
        <Dashboard assessmentData={assessmentData} />
      </div>
    </>
  );
}
