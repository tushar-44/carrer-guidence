import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookingStore } from '@/stores/bookingStore';
import { Calendar as CalendarIcon, Clock, CheckCircle, Loader2, CreditCard } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { processBookingPayment } from '@/lib/payments/razorpay';
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
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'payment' | 'confirm'>('date');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { addBooking } = useBookingStore();
  const { user } = useAuth();
  
  // Check if mentor is near-peer (free) or professional (paid)
  const isNearPeer = mentor.mentor_type === 'near-peer' || mentor.hourlyRate === 0;

  const getFormattedDate = () => (selectedDate ? selectedDate.toISOString().split('T')[0] : '');

  const resetBookingState = () => {
    setStep('date');
    setSelectedDate(undefined);
    setSelectedTime('');
    setTopic('');
    setNotes('');
    setBookingId(null);
    onOpenChange(false);
  };

  const completeBookingLocally = (status: 'confirmed' | 'pending', message: string) => {
    addBooking({
      mentorId: mentor.id,
      mentorName: mentor.name || 'Mentor',
      mentorTitle: mentor.title || '',
      date: getFormattedDate(),
      time: selectedTime,
      status,
      notes
    });
    toast.success(message);
    resetBookingState();
  };

  const handlePayment = async () => {
    if (!bookingId) {
      toast.error('Booking information missing');
      return;
    }

    if (!isSupabaseConfigured || !user) {
      completeBookingLocally(
        'confirmed',
        'Booking confirmed! Our team will share the meeting link shortly.'
      );
      return;
    }

    try {
      setPaymentLoading(true);
      
      // Get user profile for payment
      const { data: profile } = await supabase
        .from('users')
        .select('email, full_name')
        .eq('id', user.id)
        .single();

      // Process payment via Razorpay
      await processBookingPayment(
        mentor.hourlyRate,
        mentor.name || 'Mentor',
        bookingId,
        profile?.email || user.email,
        profile?.full_name || user.email?.split('@')[0]
      );

      completeBookingLocally('confirmed', 'Payment successful! Booking confirmed.');
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err.message || 'Payment failed. We will confirm manually.');
      completeBookingLocally(
        'pending',
        'We recorded your booking. Our team will reach out to confirm payment.'
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !topic) {
      toast.error('Please fill in all required fields');
      return;
    }

    const isGuestMode = !isSupabaseConfigured || !user;

    if (!user && isSupabaseConfigured) {
      toast.error('Please log in to book a mentor session.');
      return;
    }

    try {
      setLoading(true);

      // Combine date and time into a single timestamp
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hours, minutes || 0, 0, 0);

      let createdBookingId: string | null = `mock-${Date.now()}`;

      if (!isGuestMode) {
        const bookingData = {
          user_id: user!.id,
          mentor_id: mentor.id,
          scheduled_at: scheduledAt.toISOString(),
          duration_minutes: 60,
          topic: topic,
          notes: notes || null,
          status: 'pending',
          payment_status: isNearPeer ? 'paid' : 'pending'
        };

        const { data: bookingDataResult, error: bookingError } = await supabase
          .from('bookings')
          .insert(bookingData)
          .select()
          .single();

        if (bookingError) {
          if (bookingError.message?.includes('relation') || bookingError.code === '42P01') {
            console.warn('bookings table not found, falling back to local session tracking');
            completeBookingLocally(
              isNearPeer ? 'confirmed' : 'pending',
              isNearPeer
                ? 'Free session booked successfully!'
                : 'Booking submitted. Our team will confirm payment shortly.'
            );
            return;
          }
          throw bookingError;
        }

        createdBookingId = bookingDataResult.id;
      }

      setBookingId(createdBookingId);

      if (isNearPeer || isGuestMode) {
        completeBookingLocally(
          'confirmed',
          'Free session booked successfully! Check your email for details.'
        );
        return;
      }

      setStep('payment');
    } catch (err: any) {
      console.error('Error creating booking:', err);
      toast.error(err.message || 'Failed to create booking. Saving request for manual follow-up.');
      completeBookingLocally(
        'pending',
        'We received your request. Our team will reach out to confirm the session.'
      );
    } finally {
      setLoading(false);
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
                <Button onClick={handleBooking} disabled={!topic || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Booking...
                    </>
                  ) : (
                    isNearPeer ? 'Confirm Free Booking' : 'Proceed to Payment'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Complete Payment</h3>
                <Button variant="outline" size="sm" onClick={() => setStep('details')}>
                  Back
                </Button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Session with</span>
                  <span className="font-medium">{mentor.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">60 minutes</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">₹{mentor.hourlyRate}</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Secure Payment</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      You'll be redirected to Razorpay's secure payment gateway to complete your booking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setStep('details')}>
                  Back
                </Button>
                <Button 
                  onClick={handlePayment} 
                  disabled={paymentLoading || !bookingId}
                  className="gap-2"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay ₹{mentor.hourlyRate}
                    </>
                  )}
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