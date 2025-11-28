// Mentor vetting service using AI
import { supabase } from '@/lib/supabase';

export interface VettingQuestion {
  id: string;
  question: string;
  type: 'text' | 'scenario' | 'multiple';
  options?: string[];
  category: 'communication' | 'empathy' | 'expertise' | 'professionalism';
}

export interface VettingResult {
  score: number;
  passed: boolean;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

/**
 * Generate vetting test questions for a mentor
 */
export async function generateVettingTest(
  mentorId: string,
  expertise: string[]
): Promise<VettingQuestion[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/ai/generate-vetting-test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mentorId,
        expertise,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate vetting test');
    }

    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error('Error generating vetting test:', error);
    // Return fallback questions
    return getFallbackVettingQuestions();
  }
}

/**
 * Submit vetting test answers for AI evaluation
 */
export async function submitVettingTest(
  mentorId: string,
  answers: Record<string, string>
): Promise<VettingResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/ai/evaluate-vetting-test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mentorId,
        answers,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate vetting test');
    }

    const result = await response.json();

    // Update mentor vetting status
    await supabase
      .from('mentors')
      .update({
        vetting_status: result.passed ? 'approved' : 'rejected',
        vetting_score: result.score,
        vetting_test_results: { answers, result },
        vetting_completed_at: new Date().toISOString(),
      })
      .eq('id', mentorId);

    return result;
  } catch (error) {
    console.error('Error submitting vetting test:', error);
    throw error;
  }
}

/**
 * Get mentor vetting status
 */
export async function getMentorVettingStatus(mentorId: string) {
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('vetting_status, vetting_score, vetting_completed_at')
      .eq('id', mentorId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching vetting status:', error);
    return null;
  }
}

/**
 * Fallback vetting questions when AI is unavailable
 */
function getFallbackVettingQuestions(): VettingQuestion[] {
  return [
    {
      id: 'v1',
      question: 'A mentee is struggling with imposter syndrome and feels they are not good enough for their desired career. How would you help them?',
      type: 'text',
      category: 'empathy',
    },
    {
      id: 'v2',
      question: 'Describe your approach to creating a personalized learning plan for a mentee.',
      type: 'text',
      category: 'expertise',
    },
    {
      id: 'v3',
      question: 'How do you handle a situation where a mentee is not following through on agreed action items?',
      type: 'text',
      category: 'communication',
    },
    {
      id: 'v4',
      question: 'What is your availability for mentoring sessions?',
      type: 'multiple',
      options: [
        'Weekdays (9 AM - 5 PM)',
        'Weekdays (After 5 PM)',
        'Weekends',
        'Flexible',
      ],
      category: 'professionalism',
    },
    {
      id: 'v5',
      question: 'A mentee asks for career advice outside your area of expertise. What do you do?',
      type: 'scenario',
      category: 'professionalism',
    },
  ];
}