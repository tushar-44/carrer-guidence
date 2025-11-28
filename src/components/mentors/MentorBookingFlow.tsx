import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { createRazorpayOrder, verifyPayment, loadRazorpayScript } from '@/lib/payments/razorpay';
import { Clock, Calendar as CalendarIcon, DollarSign, CheckCircle2 } from 'lucide-react';

interface MentorBookingFlowProps {
  mentor: {
    id: string;
    user_id: string;
    full_name: string;
    hourly_rate: number;
    is_near_peer: boolean;
    expertise: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const TIME_SLOTS: TimeSlot[] = [
  { time: '09:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '12:00 PM', available: false },
  { time: '01:00 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '03:00 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '05:00 PM', available: true },
  { time: '06:00 PM', available: true },
];

const DURATIONS = [
  { value: '30', label: '30 minutes', multiplier: 0.5 },
  { value: '60', label: '1 hour', multiplier: 1 },
  { value: '90', label: '1.5 hours', multiplier: 1.5 },
];

export function MentorBookingFlow({ mentor, isOpen, onClose }: MentorBookingFlowProps) {
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'payment' | 'confirmation'>('date');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('60');
  const [topic, setTopic] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedDuration = DURATIONS.find(d => d.value === duration);
  const totalCost = mentor.is_near_peer ? 0 : (mentor.hourly_rate * (selectedDuration?.multiplier || 1));

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep('time');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleDetailsSubmit = () => {
    if (!topic.trim()) {
      toast.error('Please enter a session topic');
      return;
    }
    
    if (mentor.is_near_peer) {
      // Free booking - skip payment
      handleBookingSubmit();
    } else {
      setStep('payment');
    }
  };

  const handleBookingSubmit = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please login to book a session');
        return;
      }

      // Create booking in database
      const scheduledAt = new Date(selectedDate!);
      const [hours, minutes] = selectedTime.split(':');
      const isPM = selectedTime.includes('PM');
      scheduledAt.setHours(
        isPM && hours !== '12' ? parseInt(hours) + 12 : parseInt(hours),
        parseInt(minutes)
      );

      const { error } = await supabase
        .from('mentoring_sessions')
        .insert({
          user_id: user.id,
          mentor_id: mentor.id,
          scheduled_at: scheduledAt.toISOString(),
          duration_minutes: parseInt(duration),
          topic,
          notes,
          status: 'pending',
          amount: totalCost,
        })
        .select()
        .single();

      if (error) throw error;

      setStep('confirmation');
      
      toast.success('Session booked successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please login to continue');
        return;
      }

      // Create Razorpay order
      const order = await createRazorpayOrder(totalCost, 'INR');

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setIsLoading(false);
        return;
      }

      // Open Razorpay checkout
      const Razorpay = (window as any).Razorpay;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'CareerPath',
        description: `Mentoring session with ${mentor.full_name}`,
        order_id: order.orderId,
        handler: async function (response: any) {
          // Verify payment
          const isValid = await verifyPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );

          if (isValid) {
            await handleBookingSubmit();
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#8B5CF6',
        },
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setStep('date');
    setSelectedDate(undefined);
    setSelectedTime('');
    setDuration('60');
    setTopic('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Session with {mentor.full_name}</DialogTitle>
          <DialogDescription>
            {mentor.is_near_peer ? 'Free near-peer mentoring session' : `₹${mentor.hourly_rate}/hour`}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {['date', 'time', 'details', mentor.is_near_peer ? null : 'payment', 'confirmation'].filter(Boolean).map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {i + 1}
              </div>
              {i < (mentor.is_near_peer ? 3 : 4) && (
                <div className="w-12 h-0.5 bg-gray-200 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Date Selection */}
        {step === 'date' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4" />
              <span>Select a date for your session</span>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || date.getDay() === 0}
              className="rounded-md border"
            />
          </div>
        )}

        {/* Step 2: Time Selection */}
        {step === 'time' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Select a time slot</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? 'default' : 'outline'}
                  disabled={!slot.available}
                  onClick={() => handleTimeSelect(slot.time)}
                  className="h-12"
                >
                  {slot.time}
                </Button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => setStep('date')}>
              ← Back to date
            </Button>
          </div>
        )}

        {/* Step 3: Session Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <div>
              <Label>Session Duration</Label>
              <RadioGroup value={duration} onValueChange={setDuration} className="mt-2">
                {DURATIONS.map((d) => (
                  <div key={d.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={d.value} id={d.value} />
                    <Label htmlFor={d.value} className="font-normal cursor-pointer">
                      {d.label}
                      {!mentor.is_near_peer && ` - ₹${(mentor.hourly_rate * d.multiplier).toFixed(0)}`}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="topic">Session Topic *</Label>
              <input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Career guidance, Resume review, Interview prep"
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific topics or questions you'd like to discuss..."
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep('time')}>
                ← Back
              </Button>
              <Button onClick={handleDetailsSubmit} className="flex-1">
                {mentor.is_near_peer ? 'Confirm Booking' : 'Proceed to Payment'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Payment (Paid mentors only) */}
        {step === 'payment' && !mentor.is_near_peer && (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Session Duration</span>
                <span className="font-medium">{selectedDuration?.label}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Hourly Rate</span>
                <span className="font-medium">₹{mentor.hourly_rate}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-purple-600">₹{totalCost.toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Secure payment powered by Razorpay</span>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep('details')}>
                ← Back
              </Button>
              <Button onClick={handlePayment} disabled={isLoading} className="flex-1">
                {isLoading ? 'Processing...' : `Pay ₹${totalCost.toFixed(0)}`}
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 'confirmation' && (
          <div className="space-y-4 text-center py-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2">Session Booked!</h3>
              <p className="text-gray-600">
                Your mentoring session has been confirmed
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{selectedDuration?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Topic:</span>
                <span className="font-medium">{topic}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              You'll receive a confirmation email with the meeting link shortly.
            </p>

            <Button onClick={resetAndClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}