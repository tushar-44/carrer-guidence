import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search } from 'lucide-react';
import { ReportCard } from './ReportCard';
import { ReportGenerator, type ReportData } from '@/utils/reportGenerator';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useBookingStore } from '@/stores/bookingStore';
import { useApplicationStore } from '@/stores/applicationStore';

export function ReportDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reportType, setReportType] = useState<string>('all');
  const [reports, setReports] = useState<ReportData[]>([]);

  const { getCurrentResult } = useAssessmentStore();
  const { bookings } = useBookingStore();
  const { getAllApplications } = useApplicationStore();

  const assessmentResult = getCurrentResult();
  const applications = getAllApplications();

  const generateReport = (type: string) => {
    let report: ReportData | null = null;

    switch (type) {
      case 'assessment':
        report = ReportGenerator.generateAssessmentReport(assessmentResult);
        break;
      case 'progress':
        report = ReportGenerator.generateProgressReport(assessmentResult, bookings, applications);
        break;
      case 'mentoring':
        report = ReportGenerator.generateMentoringReport(bookings);
        break;
      case 'applications':
        report = ReportGenerator.generateApplicationsReport(applications);
        break;
    }

    if (report) {
      setReports(prev => [report!, ...prev]);
    }
  };

  const handleDownload = (report: ReportData) => {
    ReportGenerator.downloadReport(report);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = reportType === 'all' || report.reportType.toLowerCase().includes(reportType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Generate and download detailed reports</p>
        </div>
      </div>

      {/* Generate Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate New Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => generateReport('assessment')}
              className="h-20 flex-col gap-2"
            >
              <FileText className="w-6 h-6" />
              Assessment Report
            </Button>
            <Button
              variant="outline"
              onClick={() => generateReport('progress')}
              className="h-20 flex-col gap-2"
            >
              <FileText className="w-6 h-6" />
              Progress Report
            </Button>
            <Button
              variant="outline"
              onClick={() => generateReport('mentoring')}
              className="h-20 flex-col gap-2"
            >
              <FileText className="w-6 h-6" />
              Mentoring Summary
            </Button>
            <Button
              variant="outline"
              onClick={() => generateReport('applications')}
              className="h-20 flex-col gap-2"
            >
              <FileText className="w-6 h-6" />
              Applications Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="mentoring">Mentoring</SelectItem>
                <SelectItem value="applications">Applications</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <ReportCard
            key={report.generatedAt}
            reportData={report}
            onDownload={() => handleDownload(report)}
          />
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No reports generated yet</h3>
            <p className="text-muted-foreground">
              Generate your first report using the buttons above.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
