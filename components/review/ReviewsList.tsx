'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ReviewCard from './ReviewCard'
import { Star, MessageSquare, Filter, ChevronDown, Loader2 } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment?: string
  customerName: string
  serviceName: string
  createdAt: string
}

interface ReviewsListProps {
  shopId?: string
  serviceId?: string
  title?: string
  showFilter?: boolean
  limit?: number
  className?: string
}

export default function ReviewsList({ 
  shopId, 
  serviceId, 
  title = "Customer Reviews", 
  showFilter = true,
  limit = 10,
  className = "" 
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [showingCount, setShowingCount] = useState(limit)

  useEffect(() => {
    fetchReviews()
  }, [shopId, serviceId, ratingFilter])

  const fetchReviews = async (offset = 0) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (shopId) params.append('shopId', shopId)
      if (serviceId) params.append('serviceId', serviceId)
      params.append('limit', showingCount.toString())
      params.append('offset', offset.toString())
      if (ratingFilter) params.append('rating', ratingFilter.toString())

      const response = await fetch(`/api/reviews?${params}`)
      const data = await response.json()

      if (data.success) {
        if (offset === 0) {
          setReviews(data.reviews)
        } else {
          setReviews(prev => [...prev, ...data.reviews])
        }
        setHasMore(data.hasMore)
        setTotal(data.total)
      } else {
        console.error('Failed to fetch reviews:', data.error)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    const newCount = showingCount + limit
    setShowingCount(newCount)
    fetchReviews(reviews.length)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++
      }
    })
    return distribution
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const distribution = getRatingDistribution()
  const averageRating = getAverageRating()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="w-5 h-5" />
                {title}
              </CardTitle>
              <CardDescription>
                {total} review{total !== 1 ? 's' : ''} from our customers
              </CardDescription>
            </div>
            
            {total > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(parseFloat(String(averageRating)))
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-white">{averageRating}</span>
                </div>
                <p className="text-sm text-gray-400">Average rating</p>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Rating Distribution */}
        {total > 0 && showFilter && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Rating breakdown:</span>
                {showFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRatingFilter(null)}
                    className={`text-xs ${ratingFilter === null ? 'text-blue-400' : 'text-gray-400'}`}
                  >
                    All ratings
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = distribution[rating as keyof typeof distribution]
                  const percentage = total > 0 ? (count / total) * 100 : 0
                  
                  return (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                      className={`text-left p-2 rounded-md border transition-colors ${
                        ratingFilter === rating
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-white">{rating}</span>
                      </div>
                      <div className="text-xs text-gray-400">{count} ({percentage.toFixed(0)}%)</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Reviews List */}
      {isLoading && reviews.length === 0 ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showService={!serviceId} // Only show service if not filtering by specific service
            />
          ))}
          
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                onClick={loadMore}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Load More Reviews
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No reviews yet</h3>
            <p className="text-gray-500">
              {ratingFilter 
                ? `No reviews with ${ratingFilter} star${ratingFilter !== 1 ? 's' : ''} found.`
                : 'Be the first to leave a review for this service!'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}