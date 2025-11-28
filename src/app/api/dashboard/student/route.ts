import { createClient } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a graduate/student
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', session.user.id)
      .single()

    if (userError || user?.user_type !== 'graduates') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Mock assessment results (replace with actual assessment data when available)
    const latestAssessmentResults = {
      aptitude: { score: 85, total: 100 },
      interests: { score: 78, total: 100 },
      personality: { score: 92, total: 100 },
      emotionalIntelligence: { score: 88, total: 100 },
      skillsReadiness: { score: 76, total: 100 }
    }

    // Get booked mentor sessions
    const { data: bookedSessions, error: sessionsError } = await supabase
      .from('mentoring_sessions')
      .select(`
        id,
        date,
        status,
        mentors (
          users (
            full_name
          )
        )
      `)
      .eq('student_id', session.user.id)
      .in('status', ['upcoming', 'confirmed'])

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError)
    }

    // Mock recommended courses (replace with actual recommendation logic)
    const recommendedCourses = [
      {
        id: '1',
        title: 'Advanced React Development',
        platform: 'Udemy',
        duration: '8 weeks',
        rating: 4.8
      },
      {
        id: '2',
        title: 'Data Structures & Algorithms',
        platform: 'Coursera',
        duration: '12 weeks',
        rating: 4.9
      },
      {
        id: '3',
        title: 'Machine Learning Fundamentals',
        platform: 'edX',
        duration: '10 weeks',
        rating: 4.7
      }
    ]

    // Mock roadmap milestone (replace with actual roadmap data)
    const nextMilestone = {
      title: 'Complete React Certification',
      description: 'Finish the advanced React course and pass the certification exam',
      progress: 65,
      deadline: '2024-02-15'
    }

    const dashboardData = {
      latestAssessmentResults,
      bookedSessionsCount: bookedSessions?.length || 0,
      bookedSessions: bookedSessions || [],
      recommendedCourses,
      nextMilestone
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
