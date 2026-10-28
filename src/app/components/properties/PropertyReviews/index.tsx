'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Star, ShieldCheck, MessageSquare, Send, CheckCircle2 } from 'lucide-react'
import { useGetPropertyReviewsQuery, useAddReviewMutation } from '@/app/lib/features/reviews/reviewsApiSlice'
import { useAuth } from '@/app/hooks/useAuth'
import { Typography, Skeleton } from '@/app/components/common'
import { toast } from 'react-toastify'

interface PropertyReviewsProps {
  propertyId: string
}

export const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId }) => {
  const { data: reviews = [], isLoading } = useGetPropertyReviewsQuery(propertyId)
  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation()
  const { isAuthenticated, user } = useAuth()

  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [message, setMessage] = useState<string>('')
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)

  // Calculations
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / totalReviews).toFixed(1)
    : '0.0'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating) {
      toast.error('Please select a star rating')
      return
    }
    if (!message.trim()) {
      toast.error('Please provide review details')
      return
    }

    try {
      await addReview({
        propertyId,
        rating,
        message: message.trim(),
      }).unwrap()
      toast.success('Review submitted successfully')
      setMessage('')
      setRating(5)
      setIsFormOpen(false)
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Failed to submit review'
      toast.error(msg)
    }
  }

  return (
    <div className="py-10 border-t border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <Typography
              as="span"
              variant="extraSmallBold"
              className="text-xs font-semibold uppercase tracking-widest text-accent"
            >
              Ratings &amp; Reviews
            </Typography>
          </div>
          <Typography as="h2" variant="h2" className="text-2xl font-bold text-foreground">
            Property Reviews
          </Typography>
        </div>

        {isAuthenticated && !isFormOpen && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            <Star className="h-3.5 w-3.5" />
            <span>Write a Review</span>
          </button>
        )}
      </div>

      {/* Rating Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-sm bg-card border border-border mb-8">
        <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-border text-center">
          <Typography as="span" variant="h1" className="text-4xl font-extrabold text-foreground mb-1">
            {averageRating}
          </Typography>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(Number(averageRating))
                    ? 'text-accent fill-accent'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <Typography as="p" variant="extraSmallRegular" className="text-xs text-body">
            Based on {totalReviews} verified member {totalReviews === 1 ? 'review' : 'reviews'}
          </Typography>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => Math.round(r.rating) === stars).length
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-medium text-body">{stars} ★</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-body">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review Submission Form Modal / Drawer */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-6 rounded-sm bg-card border border-border space-y-4 mb-8">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <Typography as="h3" variant="h4" className="font-bold text-foreground">
              Write a Review
            </Typography>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-body hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-2">
              Star Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoverRating || rating)
                        ? 'text-accent fill-accent'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-xs font-semibold text-foreground">
                {rating} of 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1.5">
              Your Review
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts about this property, location, or viewing experience..."
              required
              className="w-full p-3 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-sm border border-border text-xs font-semibold text-body hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Post Review'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Guest Invitation */}
      {!isAuthenticated && (
        <div className="p-4 rounded-sm bg-muted/50 border border-border flex items-center justify-between mb-8 text-xs">
          <div className="flex items-center gap-2 text-body">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Please sign in to write a review for this property.</span>
          </div>
          <Link
            href="/login"
            className="font-semibold text-accent hover:underline uppercase tracking-wider text-[11px]"
          >
            Sign In to Review &rarr;
          </Link>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-8 text-center rounded-sm bg-card border border-border text-body">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-60" />
          <Typography as="p" variant="smallRegular" className="text-xs">
            No reviews yet for this property. Be the first to leave a review.
          </Typography>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="p-5 rounded-sm bg-card border border-border shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-xs flex items-center justify-center">
                    {rev.name ? rev.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <div>
                    <Typography as="span" variant="extraSmallBold" className="font-semibold text-foreground text-xs">
                      {rev.name || 'Verified Member'}
                    </Typography>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= rev.rating ? 'text-accent fill-accent' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Typography as="span" variant="extraSmallRegular" className="text-[11px] text-body">
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                </Typography>
              </div>

              <Typography as="p" variant="smallRegular" className="text-xs text-body leading-relaxed pt-1">
                {rev.message}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertyReviews
