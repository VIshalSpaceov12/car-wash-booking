'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Filter,
  ArrowUpDown,
  BarChart3,
  Users
} from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment?: string
  customerName: string
  serviceName: string
  createdAt: string
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  distribution: Record<number, number>
  distributionPercentages: Record<number, number>
  recentReviews: number
  ratingTrend: 'improving' | 'declining' | 'stable'
}

interface ReviewManagementProps {
  shopId: string
}

export default function ReviewManagement({ shopId }: ReviewManagementProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)

  useEffect(() => {
    fetchReviews()
    fetchStats()
  }, [shopId, sortBy, filterRating])

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({
        shopId,
        limit: '50'
      })
      
      if (filterRating) {
        params.append('rating', filterRating.toString())
      }

      const response = await fetch(`/api/reviews?${params}`)
      const data = await response.json()

      if (data.success) {
        let sortedReviews = [...data.reviews]
        
        switch (sortBy) {
          case 'newest':
            sortedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            break
          case 'oldest':
            sortedReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            break
          case 'highest':
            sortedReviews.sort((a, b) => b.rating - a.rating)
            break
          case 'lowest':
            sortedReviews.sort((a, b) => a.rating - b.rating)
            break
        }
        
        setReviews(sortedReviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/reviews/stats?shopId=${shopId}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-red-400'
    if (rating === 3) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Reviews</p>
                  <p className="text-2xl font-bold text-white">{stats.totalReviews}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Rating</p>
                  <p className="text-2xl font-bold text-white">{stats.averageRating}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Recent Reviews</p>
                  <p className="text-2xl font-bold text-white">{stats.recentReviews}</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Rating Trend</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getTrendIcon(stats.ratingTrend)}
                    <span className="text-sm text-gray-300 capitalize">
                      {stats.ratingTrend}
                    </span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rating Distribution */}
      {stats && stats.totalReviews > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Rating Distribution</CardTitle>
            <CardDescription>
              Breakdown of customer ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.distribution[rating]
                const percentage = stats.distributionPercentages[rating]
                
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-16">
                      <span className="text-sm text-gray-400">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-20 text-right">
                      <span className="text-sm text-gray-300">{count}</span>
                      <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Customer Reviews</CardTitle>
              <CardDescription>
                Manage and respond to customer feedback
              </CardDescription>
            </div>
            
            {/* Filters and Sort */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterRating || ''}
                  onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-700/30 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="bg-gray-700/30 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{review.customerName}</h4>
                          <p className="text-sm text-gray-400">{review.serviceName}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
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
                        <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>

                    {review.comment && (
                      <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 mb-3">
                        <p className="text-gray-300 text-sm italic">"{review.comment}"</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`border-gray-600 ${getRatingColor(review.rating)}`}
                      >
                        {review.rating} Star Review
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => {
                          // TODO: Implement reply functionality
                          console.log('Reply to review:', review.id)
                        }}
                      >
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500">
                {filterRating 
                  ? `No ${filterRating}-star reviews found.`
                  : 'Start providing great service to receive your first reviews!'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}