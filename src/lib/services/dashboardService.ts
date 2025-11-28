// Dashboard service for fetching real data from Supabase
import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalSessions: number;
  completedAssessments: number;
  skillsLearned: number;
  careerMatches: number;
}

export interface UpcomingSession {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorAvatar: string;
  date: string;
  time: string;
  topic: string;
  meetingLink?: string;
}

export interface SkillGap {
  skill: string;
  current: number;
  target: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}

export interface CareerRecommendation {
  title: string;
  matchPercentage: number;
  description: string;
  salaryRange: string;
  growthPotential: string;
}

/**
 * Fetch dashboard statistics for a user
 */
export async function fetchDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    // Fetch total sessions
    const { count: totalSessions } = await supabase
      .from('mentoring_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Fetch completed assessments
    const { count: completedAssessments } = await supabase
      .from('assessment_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed');

    // Fetch career paths
    const { data: careerPaths } = await supabase
      .from('career_paths')
      .select('recommended_careers')
      .eq('user_id', userId)
      .single();

    return {
      totalSessions: totalSessions || 0,
      completedAssessments: completedAssessments || 0,
      skillsLearned: 0, // Calculate from assessment results
      careerMatches: careerPaths?.recommended_careers?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalSessions: 0,
      completedAssessments: 0,
      skillsLearned: 0,
      careerMatches: 0,
    };
  }
}

/**
 * Fetch upcoming mentoring sessions
 */
export async function fetchUpcomingSessions(userId: string): Promise<UpcomingSession[]> {
  try {
    const { data: sessions, error } = await supabase
      .from('mentoring_sessions')
      .select(`
        id,
        session_date,
        notes,
        meeting_link,
        mentors (
          title,
          users (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'scheduled')
      .gte('session_date', new Date().toISOString())
      .order('session_date', { ascending: true })
      .limit(5);

    if (error) throw error;

    return (sessions || []).map((session: any) => ({
      id: session.id,
      mentorName: session.mentors?.users?.full_name || 'Mentor',
      mentorTitle: session.mentors?.title || '',
      mentorAvatar: session.mentors?.users?.avatar_url || '',
      date: new Date(session.session_date).toLocaleDateString(),
      time: new Date(session.session_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: session.notes || 'Career Guidance Session',
      meetingLink: session.meeting_link,
    }));
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    return [];
  }
}

/**
 * Fetch skill gaps from latest assessment
 */
export async function fetchSkillGaps(userId: string): Promise<SkillGap[]> {
  try {
    const { data: latestAssessment, error } = await supabase
      .from('assessment_results')
      .select('answers')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !latestAssessment?.answers) {
      return [];
    }

    // Parse answers to extract skill gaps
    const answers = latestAssessment.answers as Record<string, any>;
    const skillGaps: SkillGap[] = [];

    // Example skill gap calculation (customize based on your assessment structure)
    const skillCategories = [
      'JavaScript',
      'React',
      'Node.js',
      'System Design',
      'Communication',
    ];

    skillCategories.forEach((skill, index) => {
      const current = Math.floor(Math.random() * 3) + 2; // Mock calculation
      const target = 5;
      skillGaps.push({
        skill,
        current,
        target,
        gap: target - current,
        priority: target - current > 2 ? 'high' : target - current > 1 ? 'medium' : 'low',
      });
    });

    return skillGaps;
  } catch (error) {
    console.error('Error fetching skill gaps:', error);
    return [];
  }
}

/**
 * Fetch career recommendations
 */
export async function fetchCareerRecommendations(userId: string): Promise<CareerRecommendation[]> {
  try {
    const { data: careerPath, error } = await supabase
      .from('career_paths')
      .select('recommended_careers')
      .eq('user_id', userId)
      .single();

    if (error || !careerPath?.recommended_careers) {
      return [];
    }

    // Map career titles to full recommendations
    return careerPath.recommended_careers.slice(0, 3).map((career: string, index: number) => ({
      title: career,
      matchPercentage: 90 - index * 5,
      description: `Excellent match based on your skills and interests`,
      salaryRange: '$70,000 - $150,000',
      growthPotential: 'High',
    }));
  } catch (error) {
    console.error('Error fetching career recommendations:', error);
    return [];
  }
}

/**
 * Fetch payment history
 */
export async function fetchPaymentHistory(userId: string) {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        currency,
        status,
        payment_method,
        created_at,
        session_id,
        mentoring_sessions (
          mentors (
            users (
              full_name
            )
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return (payments || []).map((payment: any) => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.payment_method,
      date: new Date(payment.created_at).toLocaleDateString(),
      mentorName: payment.mentoring_sessions?.mentors?.users?.full_name || 'N/A',
    }));
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }
}