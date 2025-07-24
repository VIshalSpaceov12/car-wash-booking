'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Store,
  TrendingUp,
  Calendar,
  Users,
  Star,
  Plus,
  Edit,
  Eye,
  DollarSign,
  Package,
  Clock,
  MapPin,
  BarChart3,
  Sparkles,
  Shield,
  Target
} from 'lucide-react'
import Image from 'next/image'

export default function ShopOwnerDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - will be replaced with real API calls
  const mockStats = {
    totalBookings: 145,
    totalRevenue: 45600,
    avgRating: 4.7,
    activeServices: 8
  }

  const mockBookings = [
    {
      id: 1,
      customer: "John Doe",
      service: "Premium Wash",
      date: "2024-01-22",
      time: "10:00 AM",
      status: "upcoming",
      price: "₹399"
    },
    {
      id: 2,
      customer: "Sarah Wilson", 
      service: "Basic Wash",
      date: "2024-01-22",
      time: "2:00 PM",
      status: "confirmed",
      price: "₹199"
    },
    {
      id: 3,
      customer: "Mike Johnson",
      service: "Full Detail",
      date: "2024-01-21",
      time: "9:00 AM",
      status: "completed",
      price: "₹699"
    }
  ]

  const mockServices = [
    {
      id: 1,
      name: "Basic Wash",
      price: "₹199",
      duration: "30 min",
      bookings: 45,
      status: "active"
    },
    {
      id: 2,
      name: "Premium Wash",
      price: "₹399", 
      duration: "45 min",
      bookings: 32,
      status: "active"
    },
    {
      id: 3,
      name: "Full Detail",
      price: "₹699",
      duration: "90 min", 
      bookings: 18,
      status: "active"
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
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-purple-300 rounded-full animate-pulse opacity-30"></div>

        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-10 p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">
                Welcome back, {session?.user?.name?.split(' ')[0]}! 🏪
              </h1>
              <p className="text-gray-300 text-lg">
                Manage your car wash business and track your success.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Store className="w-12 h-12 text-purple-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{mockStats.totalBookings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{mockStats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-white">{mockStats.avgRating}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Services</p>
                <p className="text-2xl font-bold text-white">{mockStats.activeServices}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'text-purple-400 border-purple-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'bookings'
              ? 'text-purple-400 border-purple-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Bookings
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'services'
              ? 'text-purple-400 border-purple-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Services
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'customers'
              ? 'text-purple-400 border-purple-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Customers
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{booking.customer}</p>
                    <p className="text-sm text-gray-400">{booking.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-400">{booking.price}</p>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400'
                        : booking.status === 'upcoming'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {booking.status}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Popular Services */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Popular Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{service.name}</p>
                    <p className="text-sm text-gray-400">{service.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-purple-400">{service.price}</p>
                    <p className="text-xs text-gray-400">{service.duration}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">All Bookings</h2>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Booking
            </Button>
          </div>

          <div className="grid gap-4">
            {mockBookings.map((booking) => (
              <Card key={booking.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{booking.customer}</h3>
                        <p className="text-gray-400">{booking.service}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
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
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-400">{booking.price}</div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400'
                            : booking.status === 'upcoming'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Manage Services</h2>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockServices.map((service) => (
              <Card key={service.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{service.name}</CardTitle>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-lg font-semibold text-green-400">{service.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{service.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Bookings:</span>
                    <span className="text-blue-400">{service.bookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      {service.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Customer Management</h3>
          <p className="text-gray-500 mb-4">View and manage your customer database</p>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
            <Users className="w-4 h-4 mr-2" />
            Coming Soon
          </Button>
        </div>
      )}
    </div>
  )
}