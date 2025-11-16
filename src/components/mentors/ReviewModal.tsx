import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useReviewStore } from '@/stores/reviewStore';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  bookingId: string;
}

export function ReviewModal({ isOpen, onClose, mentorId, bookingId }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { addReview } = useReviewStore();

  const handleSubmit = () => {
    if (rating === 0) return;

    addReview({
      id: Date.now().toString(),
      mentorId,
      bookingId,
      rating,
      comment,
      createdAt: new Date(),
      userId: 'current-user' // In real app, get from auth
    });

    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rating */}
          <div>
            <Label className="text-sm font-medium">Rating</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-sm font-medium">
              Comment (Optional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this mentor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0}>
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
