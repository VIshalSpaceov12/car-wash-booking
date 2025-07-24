'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import BookingModal from '@/components/booking/BookingModal'
import ReviewModal from '@/components/review/ReviewModal'
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Search,
  Filter,
  Plus,
  History,
  Heart,
  Zap
} from 'lucide-react'

export default function CarOwnerDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('book')
  const [shops, setShops] = useState([])
  const [filteredShops, setFilteredShops] = useState([])
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedShop, setSelectedShop] = useState(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceRange: 'all', // all, low, medium, high
    rating: 'all', // all, 4+, 4.5+
    services: 'all', // all, basic, premium, deluxe
    distance: 'all' // all, nearby, city
  })

  // Fetch shops data
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('/api/shops')
        const data = await response.json()
        if (data.success) {
          setShops(data.shops)
          setFilteredShops(data.shops)
        }
      } catch (error) {
        console.error('Failed to fetch shops:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShops()
  }, [])

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings')
        const data = await response.json()
        if (data.success) {
          setBookings(data.bookings)
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      }
    }

    if (session) {
      fetchBookings()
    }
  }, [session])

  // Search and filter logic
  useEffect(() => {
    let filtered = [...shops]

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(shop => 
        shop.name.toLowerCase().includes(query) ||
        shop.address.toLowerCase().includes(query) ||
        shop.services.some(service => 
          service.name.toLowerCase().includes(query)
        )
      )
    }

    // Apply price range filter
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(shop => {
        const minPrice = Math.min(...shop.services.map(s => s.price))
        switch (filters.priceRange) {
          case 'low': return minPrice < 300
          case 'medium': return minPrice >= 300 && minPrice < 500
          case 'high': return minPrice >= 500
          default: return true
        }
      })
    }

    // Apply rating filter
    if (filters.rating !== 'all') {
      filtered = filtered.filter(shop => {
        const rating = shop.rating || 0
        switch (filters.rating) {
          case '4+': return rating >= 4
          case '4.5+': return rating >= 4.5
          default: return true
        }
      })
    }

    // Apply services filter
    if (filters.services !== 'all') {
      filtered = filtered.filter(shop => 
        shop.services.some(service => 
          service.category.toLowerCase() === filters.services.toLowerCase()
        )
      )
    }

    setFilteredShops(filtered)
  }, [shops, searchQuery, filters])

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && !event.target.closest('.filter-dropdown')) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFilterOpen])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({
      priceRange: 'all',
      rating: 'all',
      services: 'all',
      distance: 'all'
    })
    setIsFilterOpen(false)
  }

  const handleBookNow = (shop) => {
    setSelectedShop(shop)
    setIsBookingModalOpen(true)
  }

  const closeBookingModal = () => {
    setIsBookingModalOpen(false)
    setSelectedShop(null)
    // Refresh bookings after booking
    if (session) {
      const fetchBookings = async () => {
        try {
          const response = await fetch('/api/bookings')
          const data = await response.json()
          if (data.success) {
            setBookings(data.bookings)
          }
        } catch (error) {
          console.error('Failed to fetch bookings:', error)
        }
      }
      fetchBookings()
    }
  }

  const handleRateService = (booking) => {
    setSelectedBookingForReview(booking)
    setIsReviewModalOpen(true)
  }

  const closeReviewModal = () => {
    setIsReviewModalOpen(false)
    setSelectedBookingForReview(null)
  }

  const handleReviewSubmitted = () => {
    // Refresh bookings to show updated status
    if (session) {
      const fetchBookings = async () => {
        try {
          const response = await fetch('/api/bookings')
          const data = await response.json()
          if (data.success) {
            setBookings(data.bookings)
          }
        } catch (error) {
          console.error('Failed to fetch bookings:', error)
        }
      }
      fetchBookings()
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-xl">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Decorative Blur Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-blue-300 rounded-full animate-pulse opacity-30"></div>

        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-10 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">
                Welcome back, {session?.user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-300 text-lg">
                Ready to book your next car wash? Find premium services near you.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Car className="w-12 h-12 text-blue-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('book')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'book'
              ? 'text-blue-400 border-blue-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Search className="w-4 h-4 inline mr-2" />
          Book Service
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'bookings'
              ? 'text-blue-400 border-blue-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          My Bookings
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'favorites'
              ? 'text-blue-400 border-blue-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          Favorites
        </button>
      </div>

      {/* Book Service Tab */}
      {activeTab === 'book' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search shops, services, or locations..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative filter-dropdown">
              <Button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 ${
                  Object.values(filters).some(v => v !== 'all') || searchQuery ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {Object.values(filters).some(v => v !== 'all') && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                    {Object.values(filters).filter(v => v !== 'all').length}
                  </span>
                )}
              </Button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 backdrop-blur-sm">
                  <div className="p-5 space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Filters</h3>
                      <Button
                        onClick={clearFilters}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white text-sm px-2 py-1"
                      >
                        Clear All
                      </Button>
                    </div>

                    {/* Price Range Filter */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">Price Range</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'all', label: 'All Prices' },
                          { value: 'low', label: 'Under ₹300' },
                          { value: 'medium', label: '₹300 - ₹500' },
                          { value: 'high', label: 'Above ₹500' }
                        ].map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange('priceRange', option.value)}
                            className={`px-3 py-2.5 text-sm rounded-lg border transition-all duration-200 font-medium ${
                              filters.priceRange === option.value
                                ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">Minimum Rating</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'all', label: 'All Ratings' },
                          { value: '4+', label: '4+ Stars' },
                          { value: '4.5+', label: '4.5+ Stars' }
                        ].map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange('rating', option.value)}
                            className={`px-3 py-2.5 text-sm rounded-lg border transition-all duration-200 font-medium ${
                              filters.rating === option.value
                                ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Service Type Filter */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-300">Service Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'all', label: 'All Services' },
                          { value: 'basic', label: 'Basic' },
                          { value: 'premium', label: 'Premium' },
                          { value: 'deluxe', label: 'Deluxe' }
                        ].map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange('services', option.value)}
                            className={`px-3 py-2.5 text-sm rounded-lg border transition-all duration-200 font-medium ${
                              filters.services === option.value
                                ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Results Summary */}
                    <div className="pt-3 border-t border-gray-700">
                      <p className="text-sm text-gray-400 text-center">
                        Showing <span className="text-white font-medium">{filteredShops.length}</span> of <span className="text-white font-medium">{shops.length}</span> car wash services
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(Object.values(filters).some(v => v !== 'all') || searchQuery) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-400">Active filters:</span>
              
              {searchQuery && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  <Search className="w-3 h-3" />
                  "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:text-blue-100"
                  >
                    ×
                  </button>
                </div>
              )}

              {Object.entries(filters).map(([key, value]) => 
                value !== 'all' && (
                  <div key={key} className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                    {key === 'priceRange' && value === 'low' && 'Under ₹300'}
                    {key === 'priceRange' && value === 'medium' && '₹300-₹500'}
                    {key === 'priceRange' && value === 'high' && 'Above ₹500'}
                    {key === 'rating' && `${value} Rating`}
                    {key === 'services' && `${value} Services`}
                    <button
                      onClick={() => handleFilterChange(key, 'all')}
                      className="ml-1 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                )
              )}
              
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white text-sm"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Shop Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-gray-700 rounded-lg mb-3 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : filteredShops.length > 0 ? (
              filteredShops.map((shop) => (
                <Card key={shop.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-gray-700 rounded-lg mb-3 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <Car className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{shop.name}</CardTitle>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-300">{shop.rating || 'New'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">{shop.address.split(',')[1] || 'Nearby'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">{shop.priceRange}</div>
                        <div className="text-xs text-gray-400">starting from</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Services:</div>
                        <div className="flex flex-wrap gap-1">
                          {shop.services.slice(0, 3).map((service) => (
                            <span
                              key={service.id}
                              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                            >
                              {service.name}
                            </span>
                          ))}
                          {shop.services.length > 3 && (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                              +{shop.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleBookNow(shop)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                {shops.length === 0 ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No shops available</h3>
                    <p className="text-gray-500">We're working on adding more car wash services in your area!</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filters to find more options.</p>
                    <Button
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      Clear all filters
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{booking.shopName}</h3>
                        <p className="text-sm text-gray-400 mb-1">{booking.serviceName}</p>
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
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-400">₹{booking.totalAmount}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400'
                            : booking.status === 'confirmed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : booking.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {booking.status}
                        </div>
                        {booking.status === 'completed' && (
                          <Button
                            onClick={() => handleRateService(booking)}
                            size="sm"
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-xs"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Rate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No bookings yet</h3>
              <p className="text-gray-500 mb-4">Start by booking your first car wash service!</p>
              <Button 
                onClick={() => setActiveTab('book')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Find Services
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-4">Save your favorite car wash services for quick access!</p>
          <Button 
            onClick={() => setActiveTab('book')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Services
          </Button>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        shop={selectedShop}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        booking={selectedBookingForReview}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  )
}