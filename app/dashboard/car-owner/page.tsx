'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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

  // Mock data - will be replaced with real API calls
  const mockShops = [
    {
      id: 1,
      name: "Premium Auto Spa",
      rating: 4.8,
      distance: "0.5 km",
      price: "₹299",
      image: "/images/car.png",
      services: ["Exterior Wash", "Interior Clean", "Wax Polish"]
    },
    {
      id: 2,
      name: "Quick Clean Station",
      rating: 4.5,
      distance: "1.2 km", 
      price: "₹199",
      image: "/images/car.png",
      services: ["Basic Wash", "Vacuum Clean"]
    },
    {
      id: 3,
      name: "Luxury Car Care",
      rating: 4.9,
      distance: "2.1 km",
      price: "₹499",
      image: "/images/car.png",
      services: ["Full Detail", "Premium Wax", "Interior Deep Clean"]
    }
  ]

  const mockBookings = [
    {
      id: 1,
      shop: "Premium Auto Spa",
      date: "2024-01-20",
      time: "10:00 AM",
      status: "completed",
      price: "₹299"
    },
    {
      id: 2,
      shop: "Quick Clean Station", 
      date: "2024-01-22",
      time: "2:00 PM",
      status: "upcoming",
      price: "₹199"
    }
  ]

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
                placeholder="Search car wash services..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button className="bg-gray-800 border border-gray-700 text-white hover:bg-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Shop Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockShops.map((shop) => (
              <Card key={shop.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
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
                          <span className="text-sm text-gray-300">{shop.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">{shop.distance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-400">{shop.price}</div>
                      <div className="text-xs text-gray-400">starting from</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Services:</div>
                      <div className="flex flex-wrap gap-1">
                        {shop.services.map((service, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* My Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {mockBookings.map((booking) => (
              <Card key={booking.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{booking.shop}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {booking.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-400">{booking.price}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mockBookings.length === 0 && (
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
    </div>
  )
}