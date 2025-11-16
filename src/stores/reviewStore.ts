import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  mentorId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  sessionDate: string;
  helpful: number; // number of helpful votes
  verified: boolean; // verified booking completion
}

interface ReviewStore {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => void;
  updateReviewHelpful: (id: string) => void;
  getReviewsByMentor: (mentorId: string) => Review[];
  getAverageRating: (mentorId: string) => number;
  getTotalReviews: (mentorId: string) => number;
  hasUserReviewed: (mentorId: string, userId: string) => boolean;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: `review_${Date.now()}`,
          createdAt: new Date().toISOString(),
          helpful: 0
        };

        set((state) => ({
          reviews: [...state.reviews, newReview]
        }));
      },

      updateReviewHelpful: (id) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === id ? { ...review, helpful: review.helpful + 1 } : review
          )
        }));
      },

      getReviewsByMentor: (mentorId) => {
        return get().reviews
          .filter((review) => review.mentorId === mentorId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getAverageRating: (mentorId) => {
        const mentorReviews = get().reviews.filter((review) => review.mentorId === mentorId);
        if (mentorReviews.length === 0) return 0;

        const totalRating = mentorReviews.reduce((sum, review) => sum + review.rating, 0);
        return Math.round((totalRating / mentorReviews.length) * 10) / 10; // Round to 1 decimal
      },

      getTotalReviews: (mentorId) => {
        return get().reviews.filter((review) => review.mentorId === mentorId).length;
      },

      hasUserReviewed: (mentorId, userId) => {
        return get().reviews.some((review) =>
          review.mentorId === mentorId && review.userId === userId
        );
      }
    }),
    {
      name: 'review-store'
    }
  )
);
