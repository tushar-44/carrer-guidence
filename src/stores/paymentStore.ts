import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  mentorName?: string;
}

interface PaymentStore {
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  updatePaymentStatus: (id: string, status: Payment['status'], razorpayPaymentId?: string) => void;
  getPaymentsByStatus: (status: Payment['status']) => Payment[];
  getPaymentByBookingId: (bookingId: string) => Payment | undefined;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      payments: [],

      addPayment: (paymentData) => {
        const newPayment: Payment = {
          ...paymentData,
          id: `payment_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          payments: [...state.payments, newPayment],
        }));
      },

      updatePaymentStatus: (id, status, razorpayPaymentId) => {
        set((state) => ({
          payments: state.payments.map((payment) =>
            payment.id === id
              ? { ...payment, status, ...(razorpayPaymentId && { razorpayPaymentId }) }
              : payment
          ),
        }));
      },

      getPaymentsByStatus: (status) => {
        return get().payments.filter((payment) => payment.status === status);
      },

      getPaymentByBookingId: (bookingId) => {
        return get().payments.find((payment) => payment.bookingId === bookingId);
      },
    }),
    {
      name: 'payment-store',
    }
  )
);