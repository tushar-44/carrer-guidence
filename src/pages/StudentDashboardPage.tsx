import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Loader2, TrendingUp, Target, BookOpen, Users, Award, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface AssessmentResult {
  id: string;
  score: number;
  percentage: number;
  category: string;
  completed_at: string;
}

interface SkillData {
  skill: string;
  current: number;
  target: number;
  gap: number;
}

interface CareerGoal {
  title: string;
  progress: number;
  deadline: string;
  milestones: { title: string; completed: boolean }[];
}

export function StudentDashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillData[]>([]);
  const [careerGoal, setCareerGoal] = useState<CareerGoal | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/auth/login');
        return;
      }

      if (profile) {
        if (profile.user_type !== 'graduates') {
          console.log('User is mentor, redirecting to mentor dashboard');
          navigate('/dashboard/mentor');
          return;
        }
        fetchDashboardData();
      } else if (user) {
        // User exists but profile not loaded yet, try fetching dashboard data anyway
        fetchDashboardData();
      }
    }
  }, [user, profile, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch assessment results
      const { data: assessments, error: assessmentError } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user!.id)
        .order('completed_at', { ascending: false })
        .limit(5);

      if (!assessmentError && assessments) {
        setAssessmentResults(assessments);
        
        // Extract skill gaps from latest assessment
        if (assessments.length > 0) {
          const latest = assessments[0];
          if (latest.skill_gaps && Array.isArray(latest.skill_gaps)) {
            setSkillGaps(latest.skill_gaps);
          } else if (latest.answers) {
            const skills = calculateSkillGaps(latest.answers);
            setSkillGaps(skills);
          }
        }
      }

      // Fetch career roadmap
      const { data: roadmaps, error: roadmapError } = await supabase
        .from('career_roadmaps')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!roadmapError && roadmaps && roadmaps.length > 0) {
        const roadmap = roadmaps[0];
        const milestones = roadmap.milestones || [];
        const completedCount = milestones.filter((m: any) => m.completed).length;
        const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

        setCareerGoal({
          title: roadmap.career_path || 'Career Goal',
          progress,
          deadline: new Date(Date.now() + (roadmap.timeline_months || 12) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          milestones: milestones.slice(0, 4).map((m: any) => ({
            title: m.title,
            completed: m.completed || false
          }))
        });
      }

      // Fetch upcoming bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          mentors (
            id,
            name,
            title,
            expertise,
            avatar_url
          )
        `)
        .eq('user_id', user!.id)
        .in('status', ['pending', 'confirmed'])
        .gte('session_date', new Date().toISOString().split('T')[0])
        .order('session_date', { ascending: true })
        .limit(3);

      if (!bookingsError && bookings) {
        setUpcomingSessions(bookings.map((booking: any) => ({
          id: booking.id,
          mentorName: booking.mentors?.name || 'Mentor',
          mentorTitle: booking.mentors?.title || '',
          date: booking.session_date,
          time: booking.session_time,
          status: booking.status,
          meetingLink: booking.meeting_link
        })));
      }

      // Generate AI recommendations (mock for now)
      setAiRecommendations([
        {
          type: 'course',
          title: 'Advanced React Development',
          platform: 'Udemy',
          match: 92,
          reason: 'High skill gap in React'
        },
        {
          type: 'mentor',
          title: 'John Smith - Senior Developer',
          expertise: ['React', 'TypeScript'],
          match: 88,
          reason: 'Expert in your target skills'
        },
        {
          type: 'course',
          title: 'System Design Fundamentals',
          platform: 'Coursera',
          match: 85,
          reason: 'Recommended for career growth'
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSkillGaps = (_answers: any): SkillData[] => {
    // Mock skill gap calculation
    return [
      { skill: 'React', current: 65, target: 90, gap: 25 },
      { skill: 'TypeScript', current: 70, target: 85, gap: 15 },
      { skill: 'System Design', current: 45, target: 80, gap: 35 },
      { skill: 'Product Thinking', current: 60, target: 85, gap: 25 },
      { skill: 'Communication', current: 75, target: 90, gap: 15 },
    ];
  };

  const radarData = skillGaps.map(skill => ({
    skill: skill.skill,
    current: skill.current,
    target: skill.target,
    fullMark: 100
  }));

  const progressData = assessmentResults.map((result, index) => ({
    name: `Assessment ${index + 1}`,
    score: result.percentage,
    date: new Date(result.completed_at).toLocaleDateString()
  }));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-slate-300">Loading your Career Command Center...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <>
      <SEO
        title="Career Command Center — CareerPath"
        description="Your personalized career tracking hub with AI-powered insights and progress visualization"
        url="https://www.careerpath.dev/dashboard/student"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {profile.full_name || 'Student'}! 👋
              </h1>
              <p className="text-slate-300">Your Career Command Center</p>
            </div>
            <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/50 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Career Progress</p>
                  <p className="text-3xl font-bold text-white">{careerGoal?.progress || 0}%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-300" />
                </div>
              </div>
              <Progress value={careerGoal?.progress || 0} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Assessments</p>
                  <p className="text-3xl font-bold text-white">{assessmentResults.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-300" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2">Completed</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Upcoming Sessions</p>
                  <p className="text-3xl font-bold text-white">{upcomingSessions.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-300" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2">With mentors</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Avg. Score</p>
                  <p className="text-3xl font-bold text-white">
                    {assessmentResults.length > 0
                      ? Math.round(assessmentResults.reduce((acc, r) => acc + r.percentage, 0) / assessmentResults.length)
                      : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-300" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2">Overall</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Career Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gamified Progress Tracking */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Career Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                {careerGoal ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white">{careerGoal.title}</h3>
                        <Badge variant="outline" className="border-purple-500/50 text-purple-200">
                          {careerGoal.deadline}
                        </Badge>
                      </div>
                      <Progress value={careerGoal.progress} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      {careerGoal.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            milestone.completed 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-slate-700 text-slate-400'
                          }`}>
                            {milestone.completed ? '✓' : index + 1}
                          </div>
                          <span className={`flex-1 ${milestone.completed ? 'text-white line-through' : 'text-slate-300'}`}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400">Complete an assessment to generate your career roadmap</p>
                )}
              </CardContent>
            </Card>

            {/* Skill Analytics - Radar Chart */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Skill Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {skillGaps.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#4a5568" />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                        <Radar
                          name="Current"
                          dataKey="current"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Target"
                          dataKey="target"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.3}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-slate-400">Complete an assessment to see skill gaps</p>
                )}
              </CardContent>
            </Card>

            {/* Progress Chart */}
            {progressData.length > 0 && (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Progress Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <XAxis dataKey="name" tick={{ fill: '#cbd5e1' }} />
                        <YAxis tick={{ fill: '#cbd5e1' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                        <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - AI Recommendations & Sessions */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-semibold">{rec.title}</h4>
                        <p className="text-slate-400 text-sm">{rec.platform || rec.expertise?.join(', ')}</p>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-200">
                        {rec.match}% match
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-sm mb-3">{rec.reason}</p>
                    <Button size="sm" variant="outline" className="w-full border-purple-500/50 text-purple-200 hover:bg-purple-500/20">
                      Explore <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-300" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">
                              {session.mentors?.users?.full_name || 'Mentor'}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {new Date(session.session_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-green-500/50 text-green-200">
                          {session.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 mb-4">No upcoming sessions</p>
                    <Button 
                      variant="outline" 
                      className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
                      onClick={() => navigate('/mentors')}
                    >
                      Find a Mentor
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

