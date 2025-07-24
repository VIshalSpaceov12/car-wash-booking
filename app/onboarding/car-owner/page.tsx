'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Car, 
  MapPin, 
  User, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Home,
  Plus
} from 'lucide-react'

export default function CarOwnerOnboarding() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  
  const [profileData, setProfileData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })
  
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    plateNumber: '',
    vehicleType: 'car'
  })

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
          <Car className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-white">Checking your profile...</p>
        </div>
      </div>
    )
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVehicleData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
      // Save profile data
      const profileResponse = await fetch('/api/onboarding/car-owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: profileData,
          vehicle: vehicleData
        }),
      })

      if (!profileResponse.ok) {
        throw new Error('Failed to complete onboarding')
      }

      // Redirect to dashboard
      router.push('/dashboard/car-owner')
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
      return <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">{step}</div>
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
            <Car className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Car Wash Booking</h1>
          </div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome, {session?.user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-300">
            Let's set up your profile to get started with booking car wash services
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Step 1 */}
            <div className="flex items-center">
              {getStepIcon(1)}
              <span className={`ml-2 text-sm font-medium ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`}>
                Profile
              </span>
            </div>
            
            <div className={`h-px w-12 ${currentStep > 1 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
            
            {/* Step 2 */}
            <div className="flex items-center">
              {getStepIcon(2)}
              <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`}>
                Vehicle
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
            {/* Step 1: Profile Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Home className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Your Address</h3>
                  <p className="text-gray-400">Help us find car wash services near you</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Street Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main Street"
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
                        value={profileData.city}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="San Francisco"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">State</label>
                      <input
                        type="text"
                        name="state"
                        value={profileData.state}
                        onChange={handleProfileChange}
                        className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      value={profileData.zipCode}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="94105"
                      required
                    />
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3"
                  disabled={!profileData.address || !profileData.city || !profileData.state || !profileData.zipCode}
                >
                  Next: Add Vehicle
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Vehicle Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Car className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Your Vehicle</h3>
                  <p className="text-gray-400">Tell us about your vehicle for better service</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Make</label>
                      <input
                        type="text"
                        name="make"
                        value={vehicleData.make}
                        onChange={handleVehicleChange}
                        className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Honda"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Model</label>
                      <input
                        type="text"
                        name="model"
                        value={vehicleData.model}
                        onChange={handleVehicleChange}
                        className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Civic"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Year</label>
                      <input
                        type="number"
                        name="year"
                        value={vehicleData.year}
                        onChange={handleVehicleChange}
                        className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Color</label>
                      <input
                        type="text"
                        name="color"
                        value={vehicleData.color}
                        onChange={handleVehicleChange}
                        className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Silver"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">License Plate</label>
                      <input
                        type="text"
                        name="plateNumber"
                        value={vehicleData.plateNumber}
                        onChange={handleVehicleChange}
                        className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ABC123"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Vehicle Type</label>
                      <select
                        name="vehicleType"
                        value={vehicleData.vehicleType}
                        onChange={handleVehicleChange}
                        className="w-full px-3 py-3 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="car">Car</option>
                        <option value="suv">SUV</option>
                        <option value="truck">Truck</option>
                        <option value="bike">Motorcycle</option>
                        <option value="van">Van</option>
                      </select>
                    </div>
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
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={!vehicleData.make || !vehicleData.model}
                  >
                    Complete Setup
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
                  <h3 className="text-2xl font-bold text-white mb-2">You're All Set!</h3>
                  <p className="text-gray-400">Your profile has been created successfully</p>
                </div>

                <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6 text-left">
                  <h4 className="font-semibold text-white mb-4">Profile Summary:</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Address:</span> {profileData.address}, {profileData.city}, {profileData.state} {profileData.zipCode}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Vehicle:</span> {vehicleData.year} {vehicleData.make} {vehicleData.model}
                      {vehicleData.color && ` (${vehicleData.color})`}
                    </p>
                    {vehicleData.plateNumber && (
                      <p className="text-gray-300">
                        <span className="text-gray-400">License Plate:</span> {vehicleData.plateNumber}
                      </p>
                    )}
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
                    {isLoading ? 'Setting up...' : 'Go to Dashboard'}
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