import type { AssessmentResult } from '@/stores/assessmentStore';
import type { Booking } from '@/stores/bookingStore';
import type { Application } from '@/stores/applicationStore';

export interface ReportData {
  reportType: string;
  generatedAt: string;
  user: string;
  data: any;
}

export class ReportGenerator {
  static generateAssessmentReport(
    assessmentResult: AssessmentResult | null,
    userName: string = 'User'
  ): ReportData {
    return {
      reportType: 'Assessment Report',
      generatedAt: new Date().toISOString(),
      user: userName,
      data: {
        assessmentResults: assessmentResult,
        recommendations: assessmentResult?.recommendations || [],
        skillGaps: assessmentResult?.skillGaps || [],
        categories: assessmentResult?.categories || {},
        roadmap: assessmentResult?.roadmap || []
      }
    };
  }

  static generateProgressReport(
    assessmentResult: AssessmentResult | null,
    bookings: Booking[],
    applications: Application[],
    userName: string = 'User'
  ): ReportData {
    const completedSessions = bookings.filter(b => b.status === 'completed').length;
    const successfulApplications = applications.filter(a =>
      a.status === 'interview' || a.status === 'offered'
    ).length;

    return {
      reportType: 'Progress Report',
      generatedAt: new Date().toISOString(),
      user: userName,
      data: {
        period: 'Last 30 days',
        metrics: {
          assessmentsCompleted: assessmentResult ? Object.keys(assessmentResult.categories).length : 0,
          sessionsCompleted: completedSessions,
          applicationsSubmitted: applications.length,
          successfulApplications: successfulApplications,
          skillsImproved: assessmentResult?.skillGaps?.filter((gap: any) =>
            gap.currentLevel >= gap.requiredLevel
          ).length || 0
        },
        progress: {
          skillDevelopment: assessmentResult?.skillGaps?.reduce((acc: number, gap: any) =>
            acc + (gap.currentLevel / gap.requiredLevel * 100), 0
          ) / (assessmentResult?.skillGaps?.length || 1) || 0,
          mentoringProgress: bookings.length > 0 ? (completedSessions / bookings.length) * 100 : 0,
          applicationSuccess: applications.length > 0 ? (successfulApplications / applications.length) * 100 : 0
        }
      }
    };
  }

  static generateMentoringReport(
    bookings: Booking[],
    userName: string = 'User'
  ): ReportData {
    const completedSessions = bookings.filter(b => b.status === 'completed');
    const upcomingSessions = bookings.filter(b => b.status === 'confirmed');

    return {
      reportType: 'Mentoring Summary',
      generatedAt: new Date().toISOString(),
      user: userName,
      data: {
        totalSessions: bookings.length,
        completedSessions: completedSessions.length,
        upcomingSessions: upcomingSessions.length,
        mentors: [...new Set(bookings.map(b => b.mentorName))],
        sessionHistory: bookings.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
        averageRating: 4.7, // Mock - would be calculated from actual ratings
        mostFrequentTopics: ['Career Planning', 'Technical Skills', 'Interview Prep']
      }
    };
  }

  static generateApplicationsReport(
    applications: Application[],
    userName: string = 'User'
  ): ReportData {
    const statusBreakdown = {
      applied: applications.filter(a => a.status === 'applied').length,
      reviewing: applications.filter(a => a.status === 'reviewing').length,
      interview: applications.filter(a => a.status === 'interview').length,
      offered: applications.filter(a => a.status === 'offered').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };

    return {
      reportType: 'Job Applications Report',
      generatedAt: new Date().toISOString(),
      user: userName,
      data: {
        totalApplications: applications.length,
        statusBreakdown,
        successRate: applications.length > 0 ?
          ((statusBreakdown.interview + statusBreakdown.offered) / applications.length) * 100 : 0,
        applications: applications.sort((a, b) =>
          new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
        ),
        topCompanies: [...new Set(applications.map(a => a.company))].slice(0, 5),
        responseTime: 'Average 7 days' // Mock - would be calculated
      }
    };
  }

  static downloadReport(reportData: ReportData, format: 'json' | 'pdf' = 'json') {
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.reportType.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async generatePDFReport(reportData: ReportData): Promise<void> {
    // In a real implementation, this would use a library like jsPDF or Puppeteer
    // For now, we'll just download as JSON
    this.downloadReport(reportData, 'json');
  }
}
