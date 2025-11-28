import { useEffect, useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/stores/bookingStore';

interface Session {
  id: string;
  mentor: string;
  topic: string;
  date: string;
  status: string;
  duration_minutes: number;
}

export function UpcomingSessions() {
  const { user } = useAuth();
  const { getUpcomingBookings } = useBookingStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUpcomingSessions();
    } else {
      // Use booking store data or fallback to mock data
      const upcomingBookings = getUpcomingBookings();
      if (upcomingBookings.length > 0) {
        const formattedSessions = upcomingBookings.map(booking => ({
          id: booking.id,
          mentor: booking.mentorName,
          topic: `Session with ${booking.mentorTitle}`,
          date: new Date(booking.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          }),
          status: 'confirmed',
          duration_minutes: 60
        }));
        setSessions(formattedSessions);
      } else {
        setSessions([
          { id: '1', mentor: "Sarah Chen", topic: "React Best Practices", date: "Tomorrow, 2:00 PM", status: 'confirmed', duration_minutes: 60 },
          { id: '2', mentor: "Marcus Rodriguez", topic: "Product Strategy", date: "Dec 28, 4:00 PM", status: 'confirmed', duration_minutes: 90 },
          { id: '3', mentor: "Dr. Emily Watson", topic: "ML Fundamentals", date: "Dec 30, 10:00 AM", status: 'pending', duration_minutes: 60 }
        ]);
      }
      setLoading(false);
    }
  }, [user, getUpcomingBookings]);

  const fetchUpcomingSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          topic,
          scheduled_at,
          duration_minutes,
          status,
          mentors!inner (
            users!inner (
              full_name
            )
          )
        `)
        .eq('student_id', user!.id)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(5);

      if (error) throw error;

      const formattedSessions: Session[] = (data || []).map((session: any) => ({
        id: session.id,
        mentor: session.mentors?.users?.full_name || 'Unknown Mentor',
        topic: session.topic || 'General Session',
        date: new Date(session.scheduled_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }),
        status: session.status,
        duration_minutes: session.duration_minutes || 60
      }));

      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      // Fallback to booking store or mock data
      const upcomingBookings = getUpcomingBookings();
      if (upcomingBookings.length > 0) {
        const formattedSessions = upcomingBookings.map(booking => ({
          id: booking.id,
          mentor: booking.mentorName,
          topic: `Session with ${booking.mentorTitle}`,
          date: new Date(booking.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          }),
          status: 'confirmed',
          duration_minutes: 60
        }));
        setSessions(formattedSessions);
      } else {
        setSessions([
          { id: '1', mentor: "Sarah Chen", topic: "React Best Practices", date: "Tomorrow, 2:00 PM", status: 'confirmed', duration_minutes: 60 },
          { id: '2', mentor: "Marcus Rodriguez", topic: "Product Strategy", date: "Dec 28, 4:00 PM", status: 'confirmed', duration_minutes: 90 },
          { id: '3', mentor: "Dr. Emily Watson", topic: "ML Fundamentals", date: "Dec 30, 10:00 AM", status: 'pending', duration_minutes: 60 }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bento-no-min h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bento-no-min h-full">
      <h3 className="font-heading text-xl text-foreground mb-6">Upcoming Sessions</h3>
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No upcoming sessions. Book a mentor to get started!
          </p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-foreground truncate">{session.topic}</p>
                <p className="font-body text-xs text-muted-foreground">with {session.mentor}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {session.date} • {session.duration_minutes} min
                </p>
              </div>
              <div className="flex-shrink-0">
                {session.status === 'confirmed' ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 font-medium">
                    Confirmed
                  </span>
                ) : session.status === 'pending' ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 font-medium">
                    Pending
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 font-medium">
                    {session.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}