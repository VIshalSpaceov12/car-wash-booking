'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Star, User, Calendar, Car } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment?: string
  customerName: string
  serviceName: string
  createdAt: string
}

interface ReviewCardProps {
  review: Review
  showService?: boolean
  className?: string
}

export default function ReviewCard({ review, showService = true, className = '' }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return date.toLocaleDateString()
  }

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-red-400'
    if (rating === 3) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Very Good'
      case 5: return 'Excellent'
      default: return ''
    }
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white">{review.customerName}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-3 h-3" />
                {formatDate(review.createdAt)}
              </div>
            </div>
          </div>
          
          {/* Rating */}
          <div className="text-right">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs font-medium mt-1 ${getRatingColor(review.rating)}`}>
              {getRatingText(review.rating)}
            </p>
          </div>
        </div>

        {/* Service */}
        {showService && (
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
            <Car className="w-4 h-4" />
            <span>{review.serviceName}</span>
          </div>
        )}

        {/* Comment */}
        {review.comment && (
          <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-3 mt-3">
            <p className="text-gray-300 text-sm leading-relaxed italic">
              "{review.comment}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}