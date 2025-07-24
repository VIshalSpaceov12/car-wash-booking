'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
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
  Target,
  Trash2,
  Settings,
  Building,
  Phone
} from 'lucide-react'
import Image from 'next/image'

export default function ShopOwnerDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    avgRating: 0,
    activeServices: 0
  })
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Profile management state
  const [businessProfile, setBusinessProfile] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingService, setIsEditingService] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [newServiceData, setNewServiceData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '30',
    category: 'Basic'
  })

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    if (session && session.user.role === 'SHOP_OWNER') {
      fetchStats()
    }
  }, [session])

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

    if (session && session.user.role === 'SHOP_OWNER') {
      fetchBookings()
    }
  }, [session])

  // Fetch services data
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        const data = await response.json()
        if (data.success) {
          setServices(data.services)
        }
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session && session.user.role === 'SHOP_OWNER') {
      fetchServices()
    }
  }, [session])

  // Fetch business profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session || session.user.role !== 'SHOP_OWNER') return
      
      try {
        const response = await fetch('/api/profile/shop-owner')
        const data = await response.json()
        if (data.success) {
          setBusinessProfile(data.profile)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [session])

  // Handle service creation/editing
  const handleServiceSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingServiceId ? `/api/services/${editingServiceId}` : '/api/services'
      const method = editingServiceId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newServiceData),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh services
        const servicesResponse = await fetch('/api/services')
        const servicesData = await servicesResponse.json()
        if (servicesData.success) {
          setServices(servicesData.services)
        }

        // Reset form
        setNewServiceData({
          name: '',
          description: '',
          price: '',
          duration: '30',
          category: 'Basic'
        })
        setIsEditingService(false)
        setEditingServiceId(null)
      } else {
        alert('Failed to save service: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('An error occurred while saving the service')
    }
  }

  const handleEditService = (service) => {
    setNewServiceData({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category
    })
    setEditingServiceId(service.id)
    setIsEditingService(true)
  }

  const handleDeleteService = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Refresh services
        const servicesResponse = await fetch('/api/services')
        const servicesData = await servicesResponse.json()
        if (servicesData.success) {
          setServices(servicesData.services)
        }
      } else {
        alert('Failed to delete service: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('An error occurred while deleting the service')
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
                <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
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
                <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-white">{stats.avgRating || 'N/A'}</p>
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
                <p className="text-2xl font-bold text-white">{stats.activeServices}</p>
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
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'profile'
              ? 'text-purple-400 border-purple-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <Store className="w-4 h-4 inline mr-2" />
          Profile
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
              {isLoading ? (
                // Loading skeleton
                [...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-24"></div>
                      <div className="h-3 bg-gray-600 rounded w-16"></div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-16"></div>
                      <div className="h-6 bg-gray-600 rounded w-20"></div>
                    </div>
                  </div>
                ))
              ) : bookings.length > 0 ? (
                bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{booking.customerName}</p>
                      <p className="text-sm text-gray-400">{booking.serviceName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-400">₹{booking.totalAmount}</p>
                      <div className={`px-2 py-1 rounded-full text-xs ${
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">No recent bookings</p>
                </div>
              )}
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
              {isLoading ? (
                // Loading skeleton
                [...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-24"></div>
                      <div className="h-3 bg-gray-600 rounded w-16"></div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-16"></div>
                      <div className="h-3 bg-gray-600 rounded w-12"></div>
                    </div>
                  </div>
                ))
              ) : services.length > 0 ? (
                services.slice(0, 3).map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{service.name}</p>
                      <p className="text-sm text-gray-400">{service.bookingCount} bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-400">₹{service.price}</p>
                      <p className="text-xs text-gray-400">{service.duration} min</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">No services available</p>
                </div>
              )}
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
            {isLoading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-600 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-5 bg-gray-600 rounded w-32"></div>
                          <div className="h-4 bg-gray-600 rounded w-24"></div>
                          <div className="h-3 bg-gray-600 rounded w-40"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-600 rounded w-16"></div>
                        <div className="h-6 bg-gray-600 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{booking.customerName}</h3>
                          <p className="text-gray-400">{booking.serviceName}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
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
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-400">₹{booking.totalAmount}</div>
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
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No bookings yet</h3>
                <p className="text-gray-500">Your bookings will appear here once customers start booking your services.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Manage Services</h2>
            <Button 
              onClick={() => setIsEditingService(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>

          {/* Add/Edit Service Form */}
          {isEditingService && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingServiceId ? 'Edit Service' : 'Add New Service'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Service Name</label>
                      <input
                        type="text"
                        value={newServiceData.name}
                        onChange={(e) => setNewServiceData({...newServiceData, name: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Premium Car Wash"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Category</label>
                      <select
                        value={newServiceData.category}
                        onChange={(e) => setNewServiceData({...newServiceData, category: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Premium">Premium</option>
                        <option value="Deluxe">Deluxe</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <textarea
                      value={newServiceData.description}
                      onChange={(e) => setNewServiceData({...newServiceData, description: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Describe your service..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Price (₹)</label>
                      <input
                        type="number"
                        value={newServiceData.price}
                        onChange={(e) => setNewServiceData({...newServiceData, price: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="299"
                        min="0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Duration (minutes)</label>
                      <input
                        type="number"
                        value={newServiceData.duration}
                        onChange={(e) => setNewServiceData({...newServiceData, duration: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="30"
                        min="15"
                        step="15"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingService(false)
                        setEditingServiceId(null)
                        setNewServiceData({
                          name: '',
                          description: '',
                          price: '',
                          duration: '30',
                          category: 'Basic'
                        })
                      }}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    >
                      {editingServiceId ? 'Update Service' : 'Add Service'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardHeader className="animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-600 rounded w-24"></div>
                      <div className="w-8 h-8 bg-gray-600 rounded"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-600 rounded w-12"></div>
                      <div className="h-4 bg-gray-600 rounded w-16"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-600 rounded w-16"></div>
                      <div className="h-4 bg-gray-600 rounded w-12"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-600 rounded w-16"></div>
                      <div className="h-4 bg-gray-600 rounded w-8"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-600 rounded w-12"></div>
                      <div className="h-6 bg-gray-600 rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <Card key={service.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{service.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleEditService(service)}
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteService(service.id)}
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-lg font-semibold text-green-400">₹{service.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{service.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Bookings:</span>
                      <span className="text-blue-400">{service.bookingCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        service.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No services yet</h3>
                <p className="text-gray-500 mb-4">Create your first service to start accepting bookings.</p>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>
            )}
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

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Business Profile</h2>
           
          </div>

          {businessProfile && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Information */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Business Name</label>
                        <input
                          type="text"
                          defaultValue={businessProfile.businessName}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <textarea
                          defaultValue={businessProfile.description}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Phone</label>
                        <input
                          type="tel"
                          defaultValue={businessProfile.phone}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Business Name</p>
                        <p className="text-white font-medium">{businessProfile.businessName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Description</p>
                        <p className="text-gray-300">{businessProfile.description || 'No description provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="text-white font-medium">{businessProfile.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          businessProfile.isVerified 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {businessProfile.isVerified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Address</label>
                        <input
                          type="text"
                          defaultValue={businessProfile.address}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">City</label>
                          <input
                            type="text"
                            defaultValue={businessProfile.city}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">State</label>
                          <input
                            type="text"
                            defaultValue={businessProfile.state}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">ZIP Code</label>
                        <input
                          type="text"
                          defaultValue={businessProfile.zipCode}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Address</p>
                        <p className="text-white">{businessProfile.address}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">City</p>
                          <p className="text-white">{businessProfile.city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">State</p>
                          <p className="text-white">{businessProfile.state}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">ZIP Code</p>
                        <p className="text-white">{businessProfile.zipCode}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Statistics */}
              <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Business Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{stats.totalBookings}</div>
                      <div className="text-sm text-gray-400">Total Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">₹{stats.totalRevenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Total Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{stats.avgRating || 'N/A'}</div>
                      <div className="text-sm text-gray-400">Average Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{stats.activeServices}</div>
                      <div className="text-sm text-gray-400">Active Services</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!businessProfile && (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Profile Not Found</h3>
              <p className="text-gray-500">Complete onboarding to set up your business profile.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}