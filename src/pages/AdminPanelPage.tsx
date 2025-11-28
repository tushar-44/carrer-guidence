import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SEO } from '@/components/seo/SEO';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MentorApprovalList } from '@/components/admin/MentorApprovalList';
import { UserManagement } from '@/components/admin/UserManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { Shield, Users, UserCheck, BarChart3, Settings } from 'lucide-react';

export function AdminPanelPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth/login');
        return;
      }

      // Check if user is admin
      if (profile && (profile as any).role !== 'admin') {
        navigate('/dashboard');
        return;
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (profile && (profile as any).role !== 'admin')) {
    return null;
  }

  return (
    <>
      <SEO
        title="Admin Panel - CareerPath"
        description="Manage users, mentors, and platform analytics"
      />

      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">
            Manage platform operations, users, and analytics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="mentors" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Mentors
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="mentors" className="space-y-6">
            <MentorApprovalList />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure platform-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Settings panel coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}