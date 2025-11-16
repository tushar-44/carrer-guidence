import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookingStore } from '@/stores/bookingStore';
import { Calendar as CalendarIcon, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import type { Mentor } from '@/data/mentors';

interface BookingModalProps {
  mentor: Mentor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ mentor, open, onOpenChange }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'confirm'>('date');
  const [loading, setLoading] = useState(false);
  const { addBooking } = useBookingStore();
  const { user } = useAuth();

  const handleBooking = async () => {
    if (selectedDate && selectedTime && topic && user) {
      try {
        setLoading(true);

        const { error } = await supabase
          .from('bookings')
          .insert({
            user_id: user.id,
            mentor_id: mentor.id,
            mentor_name: mentor.name,
            mentor_title: mentor.title,
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            topic: topic,
            notes: notes,
            status: 'pending'
          });

        if (error) throw error;

        // Also update local store for immediate UI feedback
        addBooking({
          mentorId: mentor.id,
          mentorName: mentor.name,
          mentorTitle: mentor.title,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          status: 'pending',
          notes
        });

        setStep('date');
        setSelectedDate(undefined);
        setSelectedTime('');
        setTopic('');
        setNotes('');
        onOpenChange(false);
      } catch (err) {
        console.error('Error creating booking:', err);
        // Handle error (show toast, etc.)
      } finally {
        setLoading(false);
      }
    }
  };

  const getAvailableTimesForDate = (date: Date): string[] => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const availability = mentor.availability.find(a => a.day === dayName);
    return availability?.slots || [];
  };

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book a Session with {mentor.name}</DialogTitle>
          <DialogDescription>
            ${mentor.hourlyRate}/hour • {mentor.responseTime}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'date' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Select a Date</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Please select a date from the mentor's available days
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setStep('time')} disabled={!selectedDate}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 'time' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Select a Time</h3>
                <Button variant="outline" size="sm" onClick={() => setStep('date')}>
                  Change Date
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {availableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    onClick={() => setSelectedTime(time)}
                    className="justify-start"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={() => setStep('date')}>Back</Button>
                <Button onClick={() => setStep('details')} disabled={!selectedTime}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Session Details</h3>
                <Button variant="outline" size="sm" onClick={() => setStep('time')}>
                  Change Time
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic">What would you like to discuss? *</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Career transition advice, Resume review"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                    placeholder="Any specific questions or topics..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={() => setStep('time')}>Back</Button>
                <Button onClick={() => setStep('confirm')} disabled={!topic}>
                  Review Booking
                </Button>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Confirm Your Booking</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">
                      {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTime}</p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="font-medium mb-1">Topic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{topic}</p>
                </div>
                {notes && (
                  <div className="border-t pt-3">
                    <p className="font-medium mb-1">Notes</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{notes}</p>
                  </div>
                )}
                <div className="border-t pt-3">
                  <p className="font-medium mb-1">Cost</p>
                  <p className="text-lg font-bold text-green-600">${mentor.hourlyRate}</p>
                </div>
              </div>
              <div className="flex justify-end mt-6 gap-2">
                <Button variant="outline" onClick={() => setStep('details')}>Back</Button>
                <Button onClick={handleBooking} className="gap-2" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}