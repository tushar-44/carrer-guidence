import { createClient } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is a mentor
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', session.user.id)
      .single()

    if (userError || user?.user_type !== 'mentor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get mentor-specific data
    const { data: mentorData, error: mentorError } = await supabase
      .from('mentors')
      .select('vetting_status, vetting_scores, hourly_rate, availability')
      .eq('user_id', session.user.id)
      .single()

    if (mentorError) {
      return NextResponse.json({ error: 'Mentor profile not found' }, { status: 404 })
    }

    // Get upcoming sessions
    const { data: upcomingSessions, error: sessionsError } = await supabase
      .from('mentoring_sessions')
      .select(`
        id,
        date,
        status,
        users!mentoring_sessions_student_id_fkey (
          full_name,
          email
        )
      `)
      .eq('mentor_id', session.user.id)
      .eq('status', 'upcoming')
      .order('date', { ascending: true })

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError)
    }

    // Calculate earnings (completed sessions * hourly_rate)
    const { data: completedSessions, error: earningsError } = await supabase
      .from('mentoring_sessions')
      .select('id')
      .eq('mentor_id', session.user.id)
      .eq('status', 'completed')

    const earnings = (completedSessions?.length || 0) * (mentorData.hourly_rate || 50)

    // Get average rating
    const { data: ratings, error: ratingError } = await supabase
      .from('mentoring_sessions')
      .select('rating')
      .eq('mentor_id', session.user.id)
      .eq('status', 'completed')
      .not('rating', 'is', null)

    const avgRating = ratings && ratings.length > 0
      ? ratings.reduce((sum, session) => sum + (session.rating || 0), 0) / ratings.length
      : 0

    const dashboardData = {
      upcomingSessions: upcomingSessions || [],
      earnings,
      vettingStatus: mentorData.vetting_status,
      vettingScores: mentorData.vetting_scores,
      availability: mentorData.availability,
      completedSessions: completedSessions?.length || 0,
      avgRating: Math.round(avgRating * 10) / 10
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
