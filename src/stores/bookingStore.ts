import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Booking {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorTitle: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  createdAt: string;
}

interface BookingStore {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  getBookingsByStatus: (status: Booking['status']) => Booking[];
  getUpcomingBookings: () => Booking[];
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: (bookingData) => {
        const newBooking: Booking = {
          ...bookingData,
          id: `booking_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          bookings: [...state.bookings, newBooking],
        }));
      },

      updateBookingStatus: (id, status) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, status } : booking
          ),
        }));
      },

      getBookingsByStatus: (status) => {
        return get().bookings.filter((booking) => booking.status === status);
      },

      getUpcomingBookings: () => {
        const now = new Date();
        return get().bookings
          .filter((booking) => {
            const bookingDate = new Date(`${booking.date}T${booking.time}`);
            return bookingDate > now && booking.status !== 'cancelled';
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA.getTime() - dateB.getTime();
          });
      },
    }),
    {
      name: 'booking-store',
    }
  )
);
