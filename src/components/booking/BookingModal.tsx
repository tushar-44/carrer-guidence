import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BookingModalProps {
  mentor: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    hourlyRate: number;
  };
  trigger: React.ReactNode;
}

export function BookingModal({ mentor, trigger }: BookingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');

  // Mock availability data
  const availability = [
    { date: "2024-01-15", day: "Monday", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
    { date: "2024-01-17", day: "Wednesday", slots: ["11:00 AM", "3:00 PM"] },
    { date: "2024-01-19", day: "Friday", slots: ["9:00 AM", "1:00 PM", "5:00 PM"] }
  ];

  const handleBooking = () => {
    if (selectedSlot) {
      setStep('confirm');
    }
  };

  const handleConfirm = () => {
    // Mock booking confirmation
    setStep('success');
  };

  const resetModal = () => {
    setSelectedSlot(null);
    setStep('select');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' && 'Book a Session'}
            {step === 'confirm' && 'Confirm Booking'}
            {step === 'success' && 'Booking Confirmed!'}
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6">
            {/* Mentor Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-heading text-lg font-semibold">{mentor.name}</h3>
                    <p className="text-muted-foreground">{mentor.title}</p>
                    <p className="text-primary font-medium">${mentor.hourlyRate}/hour</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability Selection */}
            <div className="space-y-4">
              <h4 className="font-heading text-lg font-semibold">Select a time slot</h4>
              {availability.map((day) => (
                <Card key={day.date}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{day.day}, January {day.date.split('-')[2]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2">
                      {day.slots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedSlot === `${day.date}-${slot}` ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSlot(`${day.date}-${slot}`)}
                          className="text-xs"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={resetModal}>
                Cancel
              </Button>
              <Button onClick={handleBooking} disabled={!selectedSlot}>
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{mentor.name}</h4>
                    <p className="text-sm text-muted-foreground">{mentor.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {selectedSlot?.split('-')[0] === '2024-01-15' && 'Monday, Jan 15'}
                      {selectedSlot?.split('-')[0] === '2024-01-17' && 'Wednesday, Jan 17'}
                      {selectedSlot?.split('-')[0] === '2024-01-19' && 'Friday, Jan 19'}
                      {' at '}
                      {selectedSlot?.split('-')[1]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">60 minutes</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold text-primary">${mentor.hourlyRate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Default</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button onClick={handleConfirm}>
                Confirm Booking
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-xl font-heading font-semibold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground">
                Your mentoring session with {mentor.name} has been scheduled.
                You'll receive a confirmation email with all the details.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session with</span>
                    <span className="font-medium">{mentor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">
                      {selectedSlot?.split('-')[0] === '2024-01-15' && 'Monday, Jan 15'}
                      {selectedSlot?.split('-')[0] === '2024-01-17' && 'Wednesday, Jan 17'}
                      {selectedSlot?.split('-')[0] === '2024-01-19' && 'Friday, Jan 19'}
                      {' at '}
                      {selectedSlot?.split('-')[1]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meeting Link</span>
                    <span className="font-medium text-primary">Zoom Link</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={resetModal}>
                Book Another Session
              </Button>
              <Button className="flex-1">
                View My Sessions
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
