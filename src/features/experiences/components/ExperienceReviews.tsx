'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ThumbsUp, MessageSquare, X, Loader2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import type { ExperienceBooking } from '../types';

interface Review {
  id: string;
  booking_id: string;
  user_name: string;
  rating: number;
  review_text: string;
  created_at: string;
  helpful_count: number;
  is_featured: boolean;
}

interface ExperienceReviewsProps {
  experienceId: string;
  completedBookings?: ExperienceBooking[];
}

// Mock reviews data - would come from Supabase
const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    booking_id: 'bk-1',
    user_name: 'Sarah M.',
    rating: 5,
    review_text: 'Absolutely incredible experience! The attention to detail was phenomenal. Would highly recommend to anyone visiting Dubai.',
    created_at: '2026-03-15T10:00:00Z',
    helpful_count: 12,
    is_featured: true,
  },
  {
    id: 'rev-2',
    booking_id: 'bk-2',
    user_name: 'James K.',
    rating: 5,
    review_text: 'Beyond expectations. The team went above and beyond to make this special.',
    created_at: '2026-03-10T14:30:00Z',
    helpful_count: 8,
    is_featured: false,
  },
  {
    id: 'rev-3',
    booking_id: 'bk-3',
    user_name: 'Emma L.',
    rating: 4,
    review_text: 'Great experience overall. Beautiful venue and excellent service.',
    created_at: '2026-03-05T09:15:00Z',
    helpful_count: 5,
    is_featured: false,
  },
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? 'text-luxury-gold fill-luxury-gold' : 'text-white/20'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewForm({ 
  booking, 
  onSubmit, 
  onCancel 
}: { 
  booking: ExperienceBooking; 
  onSubmit: (rating: number, text: string) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(rating, text);
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-lg p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-medium">Write a Review</h4>
        <button onClick={onCancel} className="text-white/40 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Your Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="p-1"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoveredStar || rating)
                      ? 'text-luxury-gold fill-luxury-gold'
                      : 'text-white/20'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Your Review</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:border-luxury-gold/50 focus:outline-none transition-colors resize-none"
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="flex-1 py-2.5 px-4 rounded-lg bg-luxury-gold text-luxury-black font-semibold text-sm hover:bg-luxury-gold/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-4 rounded-lg border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default function ExperienceReviews({ experienceId, completedBookings = [] }: ExperienceReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ExperienceBooking | null>(null);
  const profile = useAppStore((s) => s.profile);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Count ratings
  const ratingCounts = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const handleSubmitReview = async (rating: number, text: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      booking_id: selectedBooking?.id || 'unknown',
      user_name: profile?.first_name ? `${profile.first_name} ${profile.last_name?.[0]}.` : 'Anonymous',
      rating,
      review_text: text,
      created_at: new Date().toISOString(),
      helpful_count: 0,
      is_featured: false,
    };

    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    setSelectedBooking(null);
  };

  return (
    <section className="border-t border-white/10 pt-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-luxury-gold" />
        </div>
        <div>
          <h2 className="text-xl font-display text-white">Reviews</h2>
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(Number(averageRating))} />
            <span className="text-white/60 text-sm">{averageRating} ({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Rating Bars */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars] || 0;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-white/60 text-sm w-8">{stars}★</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-luxury-gold rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-white/40 text-sm w-8">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Write Review CTA */}
        {completedBookings.length > 0 && !showReviewForm && (
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Share Your Experience</h3>
            <p className="text-white/50 text-sm mb-4">
              You have {completedBookings.length} completed booking{completedBookings.length > 1 ? 's' : ''} for this experience.
            </p>
            <button
              onClick={() => {
                setSelectedBooking(completedBookings[0]);
                setShowReviewForm(true);
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-luxury-gold text-luxury-black font-semibold text-sm hover:bg-luxury-gold/90 transition-colors"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && selectedBooking && (
          <ReviewForm
            booking={selectedBooking}
            onSubmit={handleSubmitReview}
            onCancel={() => {
              setShowReviewForm(false);
              setSelectedBooking(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/10 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={review.rating} />
                  {review.is_featured && (
                    <span className="px-2 py-0.5 bg-luxury-gold/20 text-luxury-gold text-[10px] uppercase tracking-wider rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-white font-medium text-sm">{review.user_name}</p>
                <p className="text-white/40 text-xs">
                  {new Date(review.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-3">{review.review_text}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-white/40 text-xs hover:text-white/60 transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" />
                Helpful ({review.helpful_count})
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
