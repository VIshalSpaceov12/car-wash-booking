'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Star, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Car,
  Calendar,
  Clock
} from 'lucide-react'

interface Booking {
  id: string
  shopName: string
  serviceName: string
  scheduledAt: string
  totalAmount: number
  status: string
}

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  booking: Booking | null
  onReviewSubmitted?: () => void
}

export default function ReviewModal({ isOpen, onClose, booking, onReviewSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!booking) return null

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          rating,
          comment: comment.trim()
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
        if (onReviewSubmitted) {
          onReviewSubmitted()
        }
      } else {
        alert('Failed to submit review: ' + data.error)
      }
    } catch (error) {
      console.error('Review submission error:', error)
      alert('An error occurred while submitting your review. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setRating(0)
    setHoveredRating(0)
    setComment('')
    setIsSubmitted(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Very Good'
      case 5: return 'Excellent'
      default: return 'Select rating'
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-red-400'
    if (rating === 3) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Rate Your Experience</h2>
            </div>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            How was your car wash service?
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card className="bg-gray-700/30 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <Car className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{booking.shopName}</h4>
                    <p className="text-sm text-gray-400">{booking.serviceName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(booking.scheduledAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(booking.scheduledAt).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating Selection */}
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Rate this service</h3>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className={`text-sm mt-2 font-medium ${getRatingColor(hoveredRating || rating)}`}>
                  {getRatingText(hoveredRating || rating)}
                </p>
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium text-gray-300">
                Share your experience (Optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-500">
                {comment.length}/500
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReview}
                disabled={rating === 0 || isLoading}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="text-center space-y-6 py-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
              <p className="text-gray-300">Your review has been submitted successfully.</p>
            </div>

            <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className={`font-medium ${getRatingColor(rating)}`}>
                  {getRatingText(rating)}
                </span>
              </div>
              {comment && (
                <p className="text-sm text-gray-300 italic">"{comment}"</p>
              )}
            </div>

            <Button 
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}