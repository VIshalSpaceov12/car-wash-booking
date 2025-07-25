'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ReviewsList from '@/components/review/ReviewsList'
import BookingModal from '@/components/booking/BookingModal'
import { 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Car,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  CheckCircle
} from 'lucide-react'

interface Shop {
  id: string
  businessName: string
  description?: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  isVerified: boolean
  ownerName: string
  services: Service[]
  totalBookings: number
  createdAt: string
}

interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration: number
  category: string
  isActive: boolean
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  distribution: Record<number, number>
  distributionPercentages: Record<number, number>
  recentReviews: number
  ratingTrend: 'improving' | 'declining' | 'stable'
}

export default function ShopProfilePage() {
  const params = useParams()
  const shopId = params.id as string
  
  const [shop, setShop] = useState<Shop | null>(null)
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  useEffect(() => {
    if (shopId) {
      fetchShopData()
      fetchReviewStats()
    }
  }, [shopId])

  const fetchShopData = async () => {
    try {
      const response = await fetch(`/api/shops/${shopId}`)
      const data = await response.json()
      
      if (data.success) {
        setShop(data.shop)
      } else {
        console.error('Failed to fetch shop:', data.error)
      }
    } catch (error) {
      console.error('Error fetching shop:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviewStats = async () => {
    try {
      const response = await fetch(`/api/reviews/stats?shopId=${shopId}`)
      const data = await response.json()
      
      if (data.success) {
        setReviewStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching review stats:', error)
    }
  }

  const handleBookService = (service: Service) => {
    setSelectedService(service)
    setIsBookingModalOpen(true)
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

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'Ratings improving'
      case 'declining':
        return 'Ratings declining'
      default:
        return 'Ratings stable'
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-64 bg-gray-800 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">Shop Not Found</h1>
        <p className="text-gray-400">The shop you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Shop Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl text-white">{shop.businessName}</CardTitle>
                {shop.isVerified && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{shop.address}, {shop.city}, {shop.state} {shop.zipCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{shop.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {new Date(shop.createdAt).getFullYear()}</span>
                </div>
              </div>

              {shop.description && (
                <CardDescription className="mt-4 text-gray-300">
                  {shop.description}
                </CardDescription>
              )}
            </div>

            {/* Rating Summary */}
            {reviewStats && reviewStats.totalReviews > 0 && (
              <div className="text-right ml-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(reviewStats.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-bold text-white">
                    {reviewStats.averageRating}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  {getTrendIcon(reviewStats.ratingTrend)}
                  <span className="text-gray-400">{getTrendText(reviewStats.ratingTrend)}</span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Car className="w-5 h-5" />
                Available Services
              </CardTitle>
              <CardDescription>
                Choose from our professional car wash services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shop.services.filter(service => service.isActive).map((service) => (
                <Card key={service.id} className="bg-gray-700/30 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-gray-400 mb-3">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration} min</span>
                          </div>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xl font-bold text-white mb-2">
                          ${service.price}
                        </div>
                        <Button
                          onClick={() => handleBookService(service)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <ReviewsList 
            shopId={shopId} 
            title="Customer Reviews"
            className="lg:col-span-2"
          />
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Shop Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Services</span>
                <span className="font-semibold text-white">
                  {shop.services.filter(s => s.isActive).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Bookings</span>
                <span className="font-semibold text-white">{shop.totalBookings}</span>
              </div>
              {reviewStats && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Reviews</span>
                    <span className="font-semibold text-white">{reviewStats.totalReviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Recent Reviews</span>
                    <span className="font-semibold text-white">{reviewStats.recentReviews}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          {reviewStats && reviewStats.totalReviews > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviewStats.distribution[rating]
                  const percentage = reviewStats.distributionPercentages[rating]
                  
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm text-gray-400">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-sm text-gray-400">{count} ({percentage}%)</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedService(null)
          }}
          shop={{
            id: shop.id,
            name: shop.businessName,
            description: shop.description || '',
            address: shop.address,
            rating: (shop as any).rating || 0,
            totalReviews: (shop as any).totalReviews || 0,
            services: [selectedService],
            contactPhone: shop.phone,
            isVerified: shop.isVerified
          }}
        />
      )}
    </div>
  )
}