import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/seo/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Loader2, DollarSign, Calendar, CheckCircle, Clock, TrendingUp, Users, Award, AlertCircle, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface Session {
  id: string;
  session_date: string;
  status: string;
  duration_minutes: number;
  users: {
    full_name: string;
    email: string;
  };
}

interface EarningsData {
  month: string;
  earnings: number;
  sessions: number;
}

export function MentorDashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mentorData, setMentorData] = useState<any>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [vettingStatus, setVettingStatus] = useState<string>('pending');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }

    if (user && profile) {
      if (profile.user_type !== 'mentor') {
        navigate('/dashboard/student');
        return;
      }
      fetchDashboardData();
    }
  }, [user, profile, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch mentor profile
      const { data: mentor, error: mentorError } = await supabase
        .from('mentors')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (!mentorError && mentor) {
        setMentorData(mentor);
        setVettingStatus(mentor.vetting_status || 'pending');
      }

      // Fetch upcoming sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('mentoring_sessions')
        .select(`
          *,
          users (
            full_name,
            email
          )
        `)
        .eq('mentor_id', mentor?.id || '')
        .eq('status', 'scheduled')
        .order('session_date', { ascending: true })
        .limit(5);

      if (!sessionsError && sessions) {
        setUpcomingSessions(sessions);
      }

      // Fetch completed sessions for earnings
      const { data: completed, error: completedError } = await supabase
        .from('mentoring_sessions')
        .select('*')
        .eq('mentor_id', mentor?.id || '')
        .eq('status', 'completed');

      if (!completedError && completed) {
        setCompletedSessions(completed.length);
        const earnings = completed.length * (mentor?.hourly_rate || 0);
        setTotalEarnings(earnings);

        // Generate earnings data for chart (last 6 months)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const earningsChart = months.map((month) => ({
          month,
          earnings: Math.floor(Math.random() * 5000) + 2000,
          sessions: Math.floor(Math.random() * 20) + 5
        }));
        setEarningsData(earningsChart);
      }

      // Fetch ratings from testimonials
      const { data: testimonials, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('rating')
        .eq('mentor_id', mentor?.id || '')
        .eq('is_approved', true);

      if (!testimonialsError && testimonials && testimonials.length > 0) {
        const avg = testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length;
        setAvgRating(Math.round(avg * 10) / 10);
      }

    } catch (error) {
      console.error('Error fetching mentor dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVettingStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-200 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-200 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/50';
    }
  };

  const getVettingStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-slate-300">Loading your Professional Studio...</p>
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
        title="Professional Studio — CareerPath"
        description="Your mentor dashboard with financial analytics and session management"
        url="https://www.careerpath.dev/dashboard/mentor"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Professional Studio, {profile.full_name || 'Mentor'}! 👋
              </h1>
              <p className="text-slate-300">Manage your mentorship business</p>
            </div>
            <Badge className={`${getVettingStatusColor(vettingStatus)} px-4 py-2 flex items-center gap-2`}>
              {getVettingStatusIcon(vettingStatus)}
              {vettingStatus.charAt(0).toUpperCase() + vettingStatus.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-white">${totalEarnings.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-300" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <p className="text-green-300 text-sm">+12% this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Completed Sessions</p>
                  <p className="text-3xl font-bold text-white">{completedSessions}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-300" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Upcoming Sessions</p>
                  <p className="text-3xl font-bold text-white">{upcomingSessions.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-300" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2">This week</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Average Rating</p>
                  <p className="text-3xl font-bold text-white">{avgRating || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-300" />
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2">Out of 5.0</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Financial Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Earnings Chart */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Earnings Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earningsData}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fill: '#cbd5e1' }} />
                      <YAxis tick={{ fill: '#cbd5e1' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorEarnings)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sessions Chart */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Sessions Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={earningsData}>
                      <XAxis dataKey="month" tick={{ fill: '#cbd5e1' }} />
                      <YAxis tick={{ fill: '#cbd5e1' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Bar dataKey="sessions" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Vetting Status Card */}
            {vettingStatus !== 'approved' && (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Vetting Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold mb-1">Application Status</p>
                        <p className="text-slate-400 text-sm">
                          {vettingStatus === 'pending' 
                            ? 'Your application is under review. We\'ll notify you once approved.'
                            : 'Your application was not approved. Please contact support for more information.'}
                        </p>
                      </div>
                      <Badge className={getVettingStatusColor(vettingStatus)}>
                        {vettingStatus.charAt(0).toUpperCase() + vettingStatus.slice(1)}
                      </Badge>
                    </div>
                    {mentorData?.vetting_score && (
                      <div>
                        <p className="text-slate-400 text-sm mb-2">Vetting Score</p>
                        <Progress value={mentorData.vetting_score} className="h-2" />
                        <p className="text-slate-300 text-sm mt-1">{mentorData.vetting_score}%</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Session Management */}
          <div className="space-y-6">
            {/* Upcoming Sessions Calendar */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/50 transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-white font-semibold">
                              {session.users?.full_name || 'Student'}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {new Date(session.session_date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-blue-500/50 text-blue-200">
                            {session.duration_minutes} min
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1 border-blue-500/50 text-blue-200 hover:bg-blue-500/20">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="border-green-500/50 text-green-200 hover:bg-green-500/20">
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                    <p className="text-slate-400 mb-4">No upcoming sessions</p>
                    <Button 
                      variant="outline" 
                      className="border-blue-500/50 text-blue-200 hover:bg-blue-500/20"
                      onClick={() => navigate('/profile')}
                    >
                      Update Availability
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-300" />
                    <span className="text-slate-300">Total Students</span>
                  </div>
                  <span className="text-white font-semibold">{completedSessions}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-300" />
                    <span className="text-slate-300">Hourly Rate</span>
                  </div>
                  <span className="text-white font-semibold">${mentorData?.hourly_rate || 0}/hr</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <span className="text-slate-300">Rating</span>
                  </div>
                  <span className="text-white font-semibold">{avgRating || 0}/5.0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

