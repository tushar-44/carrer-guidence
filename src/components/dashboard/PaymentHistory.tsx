import { useEffect, useState } from 'react';
import { DollarSign, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  booking_id: string | null;
}

export function PaymentHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPaymentHistory();
    } else {
      // Mock data for guest users
      setPayments([
        {
          id: '1',
          amount: 1500,
          currency: 'INR',
          status: 'completed',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          booking_id: 'booking-1'
        },
        {
          id: '2',
          amount: 2000,
          currency: 'INR',
          status: 'completed',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          booking_id: 'booking-2'
        }
      ]);
      setLoading(false);
    }
  }, [user]);

  const fetchPaymentHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setPayments([]);
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
      <h3 className="font-heading text-xl text-foreground mb-6">Payment History</h3>
      <div className="space-y-3">
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No payment history yet
          </p>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <DollarSign className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-foreground">
                  {payment.currency} {payment.amount.toLocaleString()}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {new Date(payment.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex-shrink-0">
                {payment.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : payment.status === 'failed' ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 font-medium">
                    {payment.status}
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