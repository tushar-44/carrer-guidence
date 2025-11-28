import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { processBookingPayment } from '@/lib/payments/razorpay';
import { usePaymentStore } from '@/stores/paymentStore';
import { toast } from 'sonner';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  mentorName: string;
  bookingId: string;
  userEmail?: string;
  userName?: string;
  onSuccess: () => void;
  onFailure: (error: string) => void;
}

export function PaymentModal({
  open,
  onOpenChange,
  amount,
  mentorName,
  bookingId,
  userEmail,
  userName,
  onSuccess,
  onFailure,
}: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const { addPayment, updatePaymentStatus } = usePaymentStore();

  const handlePayment = async () => {
    setProcessing(true);
    setStatus('processing');

    // Create payment record
    const paymentId = `payment_${Date.now()}`;
    addPayment({
      bookingId,
      amount,
      currency: 'INR',
      status: 'pending',
      mentorName,
    });

    try {
      const response = await processBookingPayment(
        amount,
        mentorName,
        bookingId,
        userEmail,
        userName
      );

      // Update payment with Razorpay details
      updatePaymentStatus(paymentId, 'completed', response.razorpay_payment_id);
      
      setStatus('success');
      toast.success('Payment successful!');
      
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
      }, 2000);
    } catch (error: any) {
      console.error('Payment error:', error);
      updatePaymentStatus(paymentId, 'failed');
      setStatus('failed');
      toast.error(error.message || 'Payment failed');
      onFailure(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Secure payment for your mentoring session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Payment Summary */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mentor</span>
              <span className="font-medium">{mentorName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Session Fee</span>
              <span className="font-medium">₹{amount}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>₹{amount}</span>
            </div>
          </div>

          {/* Status Display */}
          {status === 'processing' && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing payment...</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Payment successful!</span>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>Payment failed. Please try again.</span>
            </div>
          )}

          {/* Payment Button */}
          {status === 'idle' && (
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ₹{amount}
                </>
              )}
            </Button>
          )}

          {status === 'failed' && (
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full"
              variant="outline"
            >
              Retry Payment
            </Button>
          )}

          {/* Security Info */}
          <p className="text-xs text-center text-muted-foreground">
            🔒 Secured by Razorpay. Your payment information is encrypted and secure.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}