'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Store, 
  MapPin, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Building,
  FileText,
  DollarSign,
  Clock,
  Plus,
  Trash2
} from 'lucide-react'

export default function ShopOwnerOnboarding() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  
  const [businessData, setBusinessData] = useState({
    businessName: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  })
  
  const [services, setServices] = useState([
    { name: 'Basic Wash', price: 199, duration: 30, category: 'Basic' }
  ])

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!session) return
      
      try {
        const response = await fetch('/api/onboarding/status')
        const data = await response.json()
        
        if (data.success && data.isCompleted) {
          router.replace(data.redirectUrl)
          return
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error)
      } finally {
        setIsCheckingStatus(false)
      }
    }

    checkOnboardingStatus()
  }, [session, router])

  // Show loading while checking status
  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
          <p className="text-white">Checking your business profile...</p>
        </div>
      </div>
    )
  }

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBusinessData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleServiceChange = (index: number, field: string, value: string | number) => {
    setServices(prev => prev.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    ))
  }

  const addService = () => {
    setServices([...services, { name: '', price: 0, duration: 30, category: 'Basic' }])
  }

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index))
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Save business data and services
      const response = await fetch('/api/onboarding/shop-owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business: businessData,
          services: services.filter(service => service.name && service.price > 0)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to complete onboarding')
      }

      // Redirect to dashboard
      router.push('/dashboard/shop-owner')
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Failed to complete onboarding. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStepIcon = (step: number) => {
    if (currentStep > step) {
      return <CheckCircle className="w-6 h-6 text-green-400" />
    } else if (currentStep === step) {
      return <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">{step}</div>
    } else {
      return <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 text-sm font-bold">{step}</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Store className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Car Wash Booking</h1>
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Welcome, {session?.user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-300">
            Let's set up your car wash business and start accepting bookings
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Step 1 */}
            <div className="flex items-center">
              {getStepIcon(1)}
              <span className={`ml-2 text-sm font-medium ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`}>
                Business
              </span>
            </div>
            
            <div className={`h-px w-12 ${currentStep > 1 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
            
            {/* Step 2 */}
            <div className="flex items-center">
              {getStepIcon(2)}
              <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`}>
                Services
              </span>
            </div>
            
            <div className={`h-px w-12 ${currentStep > 2 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
            
            {/* Step 3 */}
            <div className="flex items-center">
              {getStepIcon(3)}
              <span className={`ml-2 text-sm font-medium ${currentStep >= 3 ? 'text-white' : 'text-gray-400'}`}>
                Complete
              </span>
            </div>
          </div>
        </div>

        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
          <CardContent className="p-8">
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Business Details</h3>
                  <p className="text-gray-400">Tell us about your car wash business</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Business Name</label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="businessName"
                        value={businessData.businessName}
                        onChange={handleBusinessChange}
                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Premium Car Wash"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Business Description</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <textarea
                        name="description"
                        value={businessData.description}
                        onChange={handleBusinessChange}
                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Professional car washing services with premium care"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Business Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={businessData.phone}
                        onChange={handleBusinessChange}
                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Business Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={businessData.address}
                        onChange={handleBusinessChange}
                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="456 Business Ave"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">City</label>
                      <input
                        type="text"
                        name="city"
                        value={businessData.city}
                        onChange={handleBusinessChange}
                        className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="San Francisco"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">State</label>
                      <input
                        type="text"
                        name="state"
                        value={businessData.state}
                        onChange={handleBusinessChange}
                        className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="CA"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={businessData.zipCode}
                      onChange={handleBusinessChange}
                      className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="94107"
                      required
                    />
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 py-3"
                  disabled={!businessData.businessName || !businessData.phone || !businessData.address || !businessData.city || !businessData.state || !businessData.zipCode}
                >
                  Next: Add Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Services Setup */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <DollarSign className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Your Services</h3>
                  <p className="text-gray-400">Add the services you offer to customers</p>
                </div>

                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-medium">Service {index + 1}</h4>
                        {services.length > 1 && (
                          <Button
                            onClick={() => removeService(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Service Name</label>
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Basic Wash"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Category</label>
                          <select
                            value={service.category}
                            onChange={(e) => handleServiceChange(index, 'category', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="Basic">Basic</option>
                            <option value="Premium">Premium</option>
                            <option value="Deluxe">Deluxe</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Price (₹)</label>
                          <input
                            type="number"
                            value={service.price}
                            onChange={(e) => handleServiceChange(index, 'price', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="199"
                            min="0"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Duration (minutes)</label>
                          <input
                            type="number"
                            value={service.duration}
                            onChange={(e) => handleServiceChange(index, 'duration', parseInt(e.target.value) || 30)}
                            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="30"
                            min="15"
                            step="15"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    onClick={addService}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Service
                  </Button>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    disabled={services.some(service => !service.name || service.price <= 0)}
                  >
                    Review Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Completion */}
            {currentStep === 3 && (
              <div className="space-y-6 text-center">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Business Setup Complete!</h3>
                  <p className="text-gray-400">Your car wash business is ready to accept bookings</p>
                </div>

                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6 text-left">
                  <h4 className="font-semibold text-white mb-4">Business Summary:</h4>
                  <div className="space-y-2 text-sm mb-4">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Name:</span> {businessData.businessName}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Address:</span> {businessData.address}, {businessData.city}, {businessData.state} {businessData.zipCode}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Phone:</span> {businessData.phone}
                    </p>
                  </div>
                  
                  <h5 className="font-semibold text-white mb-2">Services ({services.filter(s => s.name && s.price > 0).length}):</h5>
                  <div className="space-y-1 text-sm">
                    {services.filter(service => service.name && service.price > 0).map((service, index) => (
                      <p key={index} className="text-gray-300">
                        <span className="text-gray-400">•</span> {service.name} - ₹{service.price} ({service.duration} min)
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Setting up...' : 'Launch Business'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}