import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar, TrendingUp } from 'lucide-react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useBookingStore } from '@/stores/bookingStore';
import { useApplicationStore } from '@/stores/applicationStore';

export function ReportsDownload() {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const { getCurrentResult } = useAssessmentStore();
  const { bookings } = useBookingStore();
  const { getAllApplications } = useApplicationStore();

  const assessmentResult = getCurrentResult();
  const applications = getAllApplications();

  const reportTypes = [
    {
      id: 'assessment',
      title: 'Assessment Report',
      description: 'Complete assessment results with career recommendations',
      icon: FileText,
      available: !!assessmentResult,
      lastGenerated: assessmentResult?.completedAt || null
    },
    {
      id: 'progress',
      title: 'Progress Report',
      description: 'Monthly progress tracking and skill development',
      icon: TrendingUp,
      available: true,
      lastGenerated: new Date().toISOString() // Mock - would be stored in real app
    },
    {
      id: 'mentoring',
      title: 'Mentoring Summary',
      description: 'Session history and mentor feedback',
      icon: Calendar,
      available: bookings.length > 0,
      lastGenerated: bookings.length > 0 ? bookings[0].createdAt : null
    },
    {
      id: 'applications',
      title: 'Job Applications Report',
      description: 'Application status and interview tracking',
      icon: FileText,
      available: applications.length > 0,
      lastGenerated: applications.length > 0 ? applications[0].appliedDate : null
    }
  ];

  const handleDownloadReport = async (reportId: string) => {
    setGeneratingReport(reportId);

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock PDF generation - in real app, this would use a library like jsPDF or call an API
    const reportData = generateReportData(reportId);
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportId}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setGeneratingReport(null);
  };

  const generateReportData = (reportId: string) => {
    const now = new Date().toISOString();

    switch (reportId) {
      case 'assessment':
        return {
          reportType: 'Assessment Report',
          generatedAt: now,
          user: 'John Doe',
          assessmentResults: assessmentResult,
          recommendations: assessmentResult?.recommendations || [],
          skillGaps: assessmentResult?.skillGaps || []
        };

      case 'progress':
        return {
          reportType: 'Progress Report',
          generatedAt: now,
          user: 'John Doe',
          period: 'Last 30 days',
          metrics: {
            assessmentsCompleted: assessmentResult ? Object.keys(assessmentResult.categories).length : 0,
            sessionsCompleted: bookings.filter((b: any) => b.status === 'completed').length,
            applicationsSubmitted: applications.length,
            skillsImproved: assessmentResult?.skillGaps?.filter((gap: any) =>
              gap.currentLevel >= gap.requiredLevel
            ).length || 0
          }
        };

      case 'mentoring':
        return {
          reportType: 'Mentoring Summary',
          generatedAt: now,
          user: 'John Doe',
          totalSessions: bookings.length,
          completedSessions: bookings.filter((b: any) => b.status === 'completed').length,
          upcomingSessions: bookings.filter((b: any) => b.status === 'confirmed').length,
          mentors: [...new Set(bookings.map((b: any) => b.mentorName))],
          sessionHistory: bookings
        };

      case 'applications':
        return {
          reportType: 'Job Applications Report',
          generatedAt: now,
          user: 'John Doe',
          totalApplications: applications.length,
          statusBreakdown: {
            applied: applications.filter((a: any) => a.status === 'applied').length,
            reviewing: applications.filter((a: any) => a.status === 'reviewing').length,
            interview: applications.filter((a: any) => a.status === 'interview').length,
            offered: applications.filter((a: any) => a.status === 'offered').length,
            rejected: applications.filter((a: any) => a.status === 'rejected').length
          },
          applications: applications
        };

      default:
        return { error: 'Unknown report type' };
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Reports
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate and download detailed reports of your career progress
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              const isGenerating = generatingReport === report.id;

              return (
                <Card key={report.id} className={`transition-all ${!report.available ? 'opacity-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{report.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                        </div>
                      </div>
                      {report.available && (
                        <Badge variant="secondary" className="text-xs">
                          Available
                        </Badge>
                      )}
                    </div>

                    {report.lastGenerated && (
                      <p className="text-xs text-muted-foreground mb-4">
                        Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                      </p>
                    )}

                    <Button
                      onClick={() => handleDownloadReport(report.id)}
                      disabled={!report.available || isGenerating}
                      className="w-full"
                      variant={report.available ? "default" : "outline"}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: 'Assessment Report',
                date: '2024-01-15',
                status: 'Downloaded'
              },
              {
                type: 'Progress Report',
                date: '2024-01-01',
                status: 'Downloaded'
              },
              {
                type: 'Mentoring Summary',
                date: '2023-12-20',
                status: 'Downloaded'
              }
            ].map((history, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-sm">{history.type}</p>
                  <p className="text-xs text-muted-foreground">{history.date}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {history.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
