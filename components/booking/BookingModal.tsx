'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Car, 
  Clock, 
  DollarSign, 
  MapPin, 
  Star, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description?: string
  price: number
  duration: number
  category: string
}

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  color?: string
  plateNumber?: string
  vehicleType: string
}

interface Shop {
  id: string
  name: string
  description: string
  address: string
  rating: number
  totalReviews: number
  services: Service[]
  contactPhone: string
  isVerified: boolean
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  shop: Shop | null
}

export default function BookingModal({ isOpen, onClose, shop }: BookingModalProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'select-service' | 'select-vehicle' | 'booking-details' | 'confirmation'>('select-service')

  // Fetch vehicles when modal opens
  useEffect(() => {
    if (isOpen && shop) {
      fetchVehicles()
    }
  }, [isOpen, shop])

  const fetchVehicles = async () => {
    setIsLoadingVehicles(true)
    try {
      const response = await fetch('/api/vehicles')
      const data = await response.json()
      
      if (data.success) {
        setVehicles(data.vehicles)
        // Auto-select first vehicle if only one exists
        if (data.vehicles.length === 1) {
          setSelectedVehicle(data.vehicles[0])
        }
      } else {
        console.error('Failed to fetch vehicles:', data.error)
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setIsLoadingVehicles(false)
    }
  }

  if (!shop) return null

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setStep('select-vehicle')
  }

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setStep('booking-details')
  }

  const handleBookingSubmit = async () => {
    if (!selectedService || !selectedVehicle || !bookingDate || !bookingTime) return

    setIsLoading(true)
    setError('') // Clear any previous errors
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopId: shop.id,
          serviceId: selectedService.id,
          vehicleId: selectedVehicle.id,
          date: bookingDate,
          time: bookingTime,
          notes: notes.trim()
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStep('confirmation')
      } else {
        // Handle different error types
        setError(data.error || 'Booking failed. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      setError('An error occurred while booking. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setSelectedService(null)
    setSelectedVehicle(null)
    setVehicles([])
    setBookingDate('')
    setBookingTime('')
    setNotes('')
    setError('')
    setStep('select-service')
  }

  const getVehicleTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'car':
        return '🚗'
      case 'suv':
        return '🚙'
      case 'truck':
        return '🚚'
      case 'bike':
        return '🏍️'
      case 'van':
        return '🚐'
      default:
        return '🚗'
    }
  }

  const formatVehicleName = (vehicle: Vehicle) => {
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  // Generate time slots (9 AM to 6 PM)
  const timeSlots = []
  for (let hour = 9; hour <= 18; hour++) {
    const time12 = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`
    const time24 = `${hour.toString().padStart(2, '0')}:00`
    timeSlots.push({ display: time12, value: time24 })
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{shop.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{shop.address}</span>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Book your car wash service in just a few steps
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Select Service */}
        {step === 'select-service' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm text-white font-bold">1</div>
              <h3 className="text-lg font-semibold text-white">Select a Service</h3>
            </div>

            <div className="grid gap-3">
              {shop.services.map((service) => (
                <Card 
                  key={service.id}
                  className="bg-gray-700/50 border-gray-600 hover:border-blue-500 cursor-pointer transition-colors"
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-green-400">
                            <DollarSign className="w-4 h-4" />
                            <span>₹{service.price}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-blue-400">
                            <Clock className="w-4 h-4" />
                            <span>{service.duration} min</span>
                          </div>
                          <div className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                            {service.category}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-blue-500/10">
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Vehicle */}
        {step === 'select-vehicle' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm text-white font-bold">2</div>
              <h3 className="text-lg font-semibold text-white">Select Your Vehicle</h3>
            </div>

            {isLoadingVehicles ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-400">Loading your vehicles...</p>
              </div>
            ) : vehicles.length > 0 ? (
              <div className="grid gap-3">
                {vehicles.map((vehicle) => (
                  <Card 
                    key={vehicle.id}
                    className={`cursor-pointer transition-colors ${
                      selectedVehicle?.id === vehicle.id
                        ? 'bg-blue-500/20 border-blue-500'
                        : 'bg-gray-700/50 border-gray-600 hover:border-blue-500'
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-2xl">
                            {getVehicleTypeIcon(vehicle.vehicleType)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{formatVehicleName(vehicle)}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span className="capitalize">{vehicle.vehicleType}</span>
                              {vehicle.color && (
                                <>
                                  <span>•</span>
                                  <span>{vehicle.color}</span>
                                </>
                              )}
                              {vehicle.plateNumber && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono">{vehicle.plateNumber}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {selectedVehicle?.id === vehicle.id && (
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-400 mb-2">No vehicles found</h4>
                <p className="text-gray-500 mb-4">You need to add a vehicle before booking services.</p>
                <Button
                  onClick={() => window.open('/dashboard/car-owner/vehicles', '_blank')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </Button>
              </div>
            )}

            {vehicles.length > 0 && (
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('select-service')}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => selectedVehicle && handleVehicleSelect(selectedVehicle)}
                  disabled={!selectedVehicle}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Booking Details */}
        {step === 'booking-details' && selectedService && selectedVehicle && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm text-white font-bold">3</div>
              <h3 className="text-lg font-semibold text-white">Booking Details</h3>
            </div>

            {/* Selected Service & Vehicle Summary */}
            <div className="grid gap-4">
              <Card className="bg-gray-700/30 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{selectedService.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-green-400 font-medium">₹{selectedService.price}</span>
                        <span className="text-blue-400">{selectedService.duration} min</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setStep('select-service')}
                      className="text-gray-400 hover:text-white"
                    >
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/30 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-lg">
                        {getVehicleTypeIcon(selectedVehicle.vehicleType)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{formatVehicleName(selectedVehicle)}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="capitalize">{selectedVehicle.vehicleType}</span>
                          {selectedVehicle.color && (
                            <>
                              <span>•</span>
                              <span>{selectedVehicle.color}</span>
                            </>
                          )}
                          {selectedVehicle.plateNumber && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{selectedVehicle.plateNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setStep('select-vehicle')}
                      className="text-gray-400 hover:text-white"
                    >
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-300">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={bookingDate}
                  onChange={(e) => {
                    setBookingDate(e.target.value)
                    setError('') // Clear error when date changes
                  }}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-gray-300">Preferred Time</Label>
                <select
                  id="time"
                  value={bookingTime}
                  onChange={(e) => {
                    setBookingTime(e.target.value)
                    setError('') // Clear error when time changes
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.display}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-300">Special Instructions (Optional)</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or instructions..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setStep('select-vehicle')}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Back
              </Button>
              <Button 
                onClick={handleBookingSubmit}
                disabled={!bookingDate || !bookingTime || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirmation' && selectedService && selectedVehicle && (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
              <p className="text-gray-300">Your car wash service has been scheduled successfully.</p>
            </div>

            <Card className="bg-gray-700/30 border-gray-600">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Shop:</span>
                  <span className="text-white font-medium">{shop.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service:</span>
                  <span className="text-white font-medium">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vehicle:</span>
                  <span className="text-white font-medium">{formatVehicleName(selectedVehicle)}</span>
                </div>
                {selectedVehicle.plateNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">License Plate:</span>
                    <span className="text-white font-medium font-mono">{selectedVehicle.plateNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white font-medium">{new Date(bookingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white font-medium">
                    {timeSlots.find(slot => slot.value === bookingTime)?.display}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-600 pt-3">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-green-400 font-bold text-lg">₹{selectedService.price}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Close
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard/car-owner?tab=bookings'}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                View My Bookings
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}