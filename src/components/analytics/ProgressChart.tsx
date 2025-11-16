import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Target, BookOpen } from 'lucide-react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useBookingStore } from '@/stores/bookingStore';
import { useApplicationStore } from '@/stores/applicationStore';

export function ProgressChart() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const { getCurrentResult } = useAssessmentStore();
  const { bookings } = useBookingStore();
  const { getAllApplications } = useApplicationStore();

  const assessmentResult = getCurrentResult();
  const applications = getAllApplications();

  // Calculate progress metrics
  const skillProgress = assessmentResult?.skillGaps?.reduce((acc: number, gap: any) => {
    const progress = (gap.currentLevel || 0) / (gap.requiredLevel || 100) * 100;
    return acc + progress;
  }, 0) / (assessmentResult?.skillGaps?.length || 1) || 0;

  const completedSessions = bookings.filter((b: any) => b.status === 'completed').length;
  const totalSessions = bookings.length;
  const sessionProgress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  const applicationsProgress = applications.length > 0 ?
    (applications.filter((a: any) => a.status === 'interview' || a.status === 'offered').length / applications.length) * 100 : 0;

  const overallProgress = (skillProgress + sessionProgress + applicationsProgress) / 3;

  // Generate timeline data based on time range
  const getTimelineData = () => {
    const now = new Date();
    const data = [];

    for (let i = 0; i < (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90); i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Mock progress data - in real app, this would come from stored progress history
      const progress = Math.min(100, overallProgress + (Math.random() - 0.5) * 20);

      data.unshift({
        date: date.toISOString().split('T')[0],
        progress: Math.max(0, progress),
        sessions: Math.floor(Math.random() * 3),
        applications: Math.floor(Math.random() * 2)
      });
    }

    return data;
  };

  const timelineData = getTimelineData();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Skills</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.round(skillProgress)}%
            </div>
            <Progress value={skillProgress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Sessions</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {Math.round(sessionProgress)}%
            </div>
            <Progress value={sessionProgress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">Applications</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.round(applicationsProgress)}%
            </div>
            <Progress value={applicationsProgress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">Overall</span>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {Math.round(overallProgress)}%
            </div>
            <Progress value={overallProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Progress Timeline</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={timeRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('week')}
              >
                Week
              </Button>
              <Button
                variant={timeRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('month')}
              >
                Month
              </Button>
              <Button
                variant={timeRange === 'quarter' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('quarter')}
              >
                Quarter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-1">
            {timelineData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-sm transition-all hover:from-blue-600 hover:to-blue-700"
                  style={{ height: `${(data.progress / 100) * 200}px` }}
                />
                <div className="text-xs text-muted-foreground transform -rotate-45 origin-top-left">
                  {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timelineData.slice(-5).reverse().map((data, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">
                      Progress Update - {Math.round(data.progress)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(data.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {data.sessions > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {data.sessions} session{data.sessions > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {data.applications > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {data.applications} application{data.applications > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
