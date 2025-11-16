import { Calendar } from 'lucide-react';
import { useBookingStore } from '@/stores/bookingStore';

export function UpcomingSessions() {
  const { getUpcomingBookings } = useBookingStore();
  const upcomingBookings = getUpcomingBookings();

  // Use real booking data if available, otherwise fallback to mock data
  const sessions = upcomingBookings.length > 0 ? upcomingBookings.map(booking => ({
    mentor: booking.mentorName,
    topic: `Session with ${booking.mentorTitle}`,
    date: new Date(booking.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  })) : [
    { mentor: "Sarah Chen", topic: "React Best Practices", date: "Tomorrow, 2:00 PM" },
    { mentor: "Marcus Rodriguez", topic: "Product Strategy", date: "Dec 28, 4:00 PM" },
    { mentor: "Dr. Emily Watson", topic: "ML Fundamentals", date: "Dec 30, 10:00 AM" }
  ];

  return (
    <div className="bento-no-min h-full">
      <h3 className="font-heading text-xl text-foreground mb-6">Upcoming Sessions</h3>
      <div className="space-y-3">
        {sessions.map((session, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium text-foreground">{session.topic}</p>
              <p className="font-body text-xs text-muted-foreground">with {session.mentor}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">{session.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
