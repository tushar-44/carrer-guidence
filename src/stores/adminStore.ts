import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface MentorApplication {
  id: string;
  name: string;
  email: string;
  expertise: string[];
  experience: string;
  vettingStatus: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  userType: string;
  createdAt: string;
  isActive: boolean;
}

interface AnalyticsData {
  totalUsers: number;
  totalMentors: number;
  totalBookings: number;
  totalRevenue: number;
  userGrowth: Array<{ date: string; count: number }>;
  bookingStats: Array<{ status: string; count: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

interface AdminStore {
  mentorApplications: MentorApplication[];
  users: User[];
  analytics: AnalyticsData | null;
  loading: boolean;
  fetchMentorApplications: () => Promise<void>;
  approveMentor: (mentorId: string, reason?: string) => Promise<void>;
  rejectMentor: (mentorId: string, reason: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  toggleUserStatus: (userId: string, isActive: boolean) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  logAdminAction: (actionType: string, targetId: string, targetType: string, details: any) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  mentorApplications: [],
  users: [],
  analytics: null,
  loading: false,

  fetchMentorApplications: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(`
          *,
          users!inner (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const applications: MentorApplication[] = (data || []).map((mentor: any) => ({
        id: mentor.id,
        name: mentor.users?.full_name || mentor.name || 'Unknown',
        email: mentor.users?.email || '',
        expertise: mentor.expertise || [],
        experience: mentor.bio || mentor.experience || '',
        vettingStatus: mentor.vetting_status || 'pending',
        appliedAt: mentor.created_at,
      }));

      set({ mentorApplications: applications });
    } catch (error) {
      console.error('Error fetching mentor applications:', error);
    } finally {
      set({ loading: false });
    }
  },

  approveMentor: async (mentorId, reason) => {
    try {
      const { error } = await supabase
        .from('mentors')
        .update({
          vetting_status: 'approved',
          vetting_completed_at: new Date().toISOString(),
        })
        .eq('id', mentorId);

      if (error) throw error;

      await get().logAdminAction('approve_mentor', mentorId, 'mentor', { reason });
      await get().fetchMentorApplications();
    } catch (error) {
      console.error('Error approving mentor:', error);
      throw error;
    }
  },

  rejectMentor: async (mentorId, reason) => {
    try {
      const { error } = await supabase
        .from('mentors')
        .update({
          vetting_status: 'rejected',
          vetting_completed_at: new Date().toISOString(),
        })
        .eq('id', mentorId);

      if (error) throw error;

      await get().logAdminAction('reject_mentor', mentorId, 'mentor', { reason });
      await get().fetchMentorApplications();
    } catch (error) {
      console.error('Error rejecting mentor:', error);
      throw error;
    }
  },

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const users: User[] = (data || []).map((user: any) => ({
        id: user.id,
        email: user.email,
        fullName: user.full_name || 'Unknown',
        role: user.role || 'user',
        userType: user.user_type || 'graduates',
        createdAt: user.created_at,
        isActive: user.is_active !== false,
      }));

      set({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;

      await get().logAdminAction('update_user_role', userId, 'user', { newRole: role });
      await get().fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  toggleUserStatus: async (userId, isActive) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId);

      if (error) throw error;

      await get().logAdminAction('toggle_user_status', userId, 'user', { isActive });
      await get().fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  fetchAnalytics: async () => {
    set({ loading: true });
    try {
      // Fetch various analytics data
      const [usersData, mentorsData, bookingsData, paymentsData] = await Promise.all([
        supabase.from('users').select('id, created_at'),
        supabase.from('mentors').select('id'),
        supabase.from('bookings').select('id, status, created_at'),
        supabase.from('payments').select('amount, created_at, status'),
      ]);

      const analytics: AnalyticsData = {
        totalUsers: usersData.data?.length || 0,
        totalMentors: mentorsData.data?.length || 0,
        totalBookings: bookingsData.data?.length || 0,
        totalRevenue: paymentsData.data
          ?.filter((p: any) => p.status === 'completed')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0,
        userGrowth: [],
        bookingStats: [],
        revenueByMonth: [],
      };

      set({ analytics });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      set({ loading: false });
    }
  },

  logAdminAction: async (actionType, targetId, targetType, details) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('admin_actions').insert({
        admin_id: user.id,
        action_type: actionType,
        target_id: targetId,
        target_type: targetType,
        details,
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  },
}));