import { supabase } from './supabase';

// ==================== MENTORS SERVICE ====================
export const mentorsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('mentors')
      .select('*, users(full_name, avatar_url, email)')
      .order('rating', { ascending: false });
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('mentors')
      .select('*, users(full_name, avatar_url, email)')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async create(mentorData: any) {
    const { data, error } = await supabase
      .from('mentors')
      .insert(mentorData)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, mentorData: any) {
    const { data, error } = await supabase
      .from('mentors')
      .update(mentorData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async getAvailability(mentorId: string) {
    const { data, error } = await supabase
      .from('mentor_availability')
      .select('*')
      .eq('mentor_id', mentorId)
      .order('day_of_week');
    return { data, error };
  },

  async addAvailability(availabilityData: any) {
    const { data, error } = await supabase
      .from('mentor_availability')
      .insert(availabilityData)
      .select()
      .single();
    return { data, error };
  }
};

// ==================== JOBS SERVICE ====================
export const jobsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('posted_date', { ascending: false });
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getByDomain(domain: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('domain', domain)
      .order('posted_date', { ascending: false });
    return { data, error };
  },

  async searchJobs(query: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,company.ilike.%${query}%`)
      .order('posted_date', { ascending: false });
    return { data, error };
  },

  async create(jobData: any) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();
    return { data, error };
  }
};

// ==================== JOB APPLICATIONS SERVICE ====================
export const jobApplicationsService = {
  async getUserApplications(userId: string) {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*, jobs(*)')
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });
    return { data, error };
  },

  async applyToJob(userId: string, jobId: string, coverLetter?: string) {
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        user_id: userId,
        job_id: jobId,
        cover_letter: coverLetter,
        status: 'applied'
      })
      .select()
      .single();
    return { data, error };
  },

  async getApplicationStatus(userId: string, jobId: string) {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();
    return { data, error };
  }
};

// ==================== ASSESSMENTS SERVICE ====================
export const assessmentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('assessments')
      .select('*');
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getQuestions(assessmentId: string) {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('order_number');
    return { data, error };
  },

  async submitResults(userId: string, assessmentId: string, results: {
    score: number;
    total_points: number;
    percentage: number;
    time_taken_minutes?: number;
    answers?: any;
  }) {
    const { data, error } = await supabase
      .from('assessment_results')
      .insert({
        user_id: userId,
        assessment_id: assessmentId,
        status: 'completed',
        completed_at: new Date(),
        ...results
      })
      .select()
      .single();
    return { data, error };
  },

  async getUserResults(userId: string) {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*, assessments(*)')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
    return { data, error };
  }
};

// ==================== MENTORING SESSIONS SERVICE ====================
export const mentoringSessionsService = {
  async bookSession(userId: string, mentorId: string, sessionData: {
    session_date: string;
    duration_minutes?: number;
  }) {
    const { data, error } = await supabase
      .from('mentoring_sessions')
      .insert({
        user_id: userId,
        mentor_id: mentorId,
        status: 'scheduled',
        ...sessionData
      })
      .select()
      .single();
    return { data, error };
  },

  async getUserSessions(userId: string) {
    const { data, error } = await supabase
      .from('mentoring_sessions')
      .select('*, mentors(*, users(full_name, avatar_url))')
      .eq('user_id', userId)
      .order('session_date', { ascending: false });
    return { data, error };
  },

  async getMentorSessions(mentorId: string) {
    const { data, error } = await supabase
      .from('mentoring_sessions')
      .select('*, users(full_name, avatar_url, email)')
      .eq('mentor_id', mentorId)
      .order('session_date', { ascending: false });
    return { data, error };
  },

  async updateSession(sessionId: string, updates: any) {
    const { data, error } = await supabase
      .from('mentoring_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();
    return { data, error };
  },

  async cancelSession(sessionId: string) {
    return this.updateSession(sessionId, { status: 'cancelled' });
  }
};

// ==================== CAREER PATHS SERVICE ====================
export const careerPathsService = {
  async getUserCareerPath(userId: string) {
    const { data, error } = await supabase
      .from('career_paths')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  async createCareerPath(userId: string, pathData: {
    recommended_careers: string[];
    matching_jobs?: string[];
    recommended_mentors?: string[];
    assessment_score?: number;
  }) {
    const { data, error } = await supabase
      .from('career_paths')
      .insert({
        user_id: userId,
        ...pathData
      })
      .select()
      .single();
    return { data, error };
  },

  async updateCareerPath(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('career_paths')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    return { data, error };
  }
};

// ==================== TESTIMONIALS SERVICE ====================
export const testimonialsService = {
  async getMentorTestimonials(mentorId: string) {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*, users(full_name, avatar_url)')
      .eq('mentor_id', mentorId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createTestimonial(userId: string, mentorId: string, testimonialData: {
    rating: number;
    content: string;
  }) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        user_id: userId,
        mentor_id: mentorId,
        is_approved: false,
        ...testimonialData
      })
      .select()
      .single();
    return { data, error };
  }
};

// ==================== CASE STUDIES SERVICE ====================
export const caseStudiesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('slug', slug)
      .single();
    
    // Increment view count
    if (data?.id) {
      await supabase
        .from('case_studies')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);
    }

    return { data, error };
  }
};

// ==================== USERS SERVICE ====================
export const usersService = {
  async getCurrentUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  async createProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        ...profileData
      })
      .select()
      .single();
    return { data, error };
  }
};
