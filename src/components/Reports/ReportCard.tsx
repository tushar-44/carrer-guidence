import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, User } from 'lucide-react';
import type { ReportData } from '@/utils/reportGenerator';
import { ReportGenerator } from '@/utils/reportGenerator';

interface ReportCardProps {
  reportData: ReportData;
  onDownload: () => void;
  className?: string;
}

export function ReportCard({ reportData, onDownload, className }: ReportCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReportSummary = (report: ReportData) => {
    switch (report.reportType) {
      case 'Assessment Report':
        return `${Object.keys(report.data.categories || {}).length} categories analyzed`;
      case 'Progress Report':
        return `${report.data.metrics?.assessmentsCompleted || 0} assessments completed`;
      case 'Mentoring Summary':
        return `${report.data.totalSessions || 0} mentoring sessions`;
      case 'Job Applications Report':
        return `${report.data.totalApplications || 0} applications submitted`;
      default:
        return 'Report summary';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{reportData.reportType}</CardTitle>
          </div>
          <Badge variant="outline">{reportData.reportType.split(' ')[0]}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Report Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">User:</span>
            <span className="font-medium">{reportData.user}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Generated:</span>
            <span className="font-medium">{formatDate(reportData.generatedAt)}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {getReportSummary(reportData)}
          </p>
        </div>

        {/* Download Button */}
        <Button onClick={onDownload} className="w-full" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </CardContent>
    </Card>
  );
}
