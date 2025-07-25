'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ImageUpload from '@/components/ui/ImageUpload'
import { Car, X } from 'lucide-react'

interface Vehicle {
  id?: string
  make: string
  model: string
  year: number
  color?: string
  plateNumber?: string
  vehicleType: string
  image?: string
}

interface VehicleFormProps {
  vehicle?: Vehicle
  onSubmit: (vehicleData: Omit<Vehicle, 'id'>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  title?: string
  submitText?: string
}

export default function VehicleForm({ 
  vehicle, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  title = 'Add Vehicle',
  submitText = 'Add Vehicle'
}: VehicleFormProps) {
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    color: vehicle?.color || '',
    plateNumber: vehicle?.plateNumber || '',
    vehicleType: vehicle?.vehicleType || 'car',
    image: vehicle?.image || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.make.trim()) {
      newErrors.make = 'Make is required'
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required'
    }

    const currentYear = new Date().getFullYear()
    if (formData.year < 1990 || formData.year > currentYear + 1) {
      newErrors.year = `Year must be between 1990 and ${currentYear + 1}`
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required'
    }

    // Validate plate number format (basic validation)
    if (formData.plateNumber && formData.plateNumber.trim()) {
      const plateRegex = /^[A-Z0-9]{3,10}$/i
      if (!plateRegex.test(formData.plateNumber.trim())) {
        newErrors.plateNumber = 'Please enter a valid plate number (3-10 characters, letters and numbers only)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Failed to submit vehicle form:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white">{title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {vehicle ? 'Update your vehicle details' : 'Add a new vehicle to your account'}
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Make and Model */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Make <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 bg-gray-700/50 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.make ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Honda"
                  disabled={isLoading}
                />
                {errors.make && <p className="text-red-400 text-xs">{errors.make}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Model <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 bg-gray-700/50 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.model ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Civic"
                  disabled={isLoading}
                />
                {errors.model && <p className="text-red-400 text-xs">{errors.model}</p>}
              </div>
            </div>

            {/* Year and Vehicle Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Year <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className={`w-full px-3 py-2.5 bg-gray-700/50 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.year ? 'border-red-500' : 'border-gray-600'
                  }`}
                  disabled={isLoading}
                />
                {errors.year && <p className="text-red-400 text-xs">{errors.year}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 bg-gray-700/50 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vehicleType ? 'border-red-500' : 'border-gray-600'
                  }`}
                  disabled={isLoading}
                >
                  <option value="car">Car</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="bike">Motorcycle</option>
                  <option value="van">Van</option>
                </select>
                {errors.vehicleType && <p className="text-red-400 text-xs">{errors.vehicleType}</p>}
              </div>
            </div>

            {/* Color and Plate Number */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Silver"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">License Plate</label>
                <input
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 bg-gray-700/50 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${
                    errors.plateNumber ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="ABC123"
                  disabled={isLoading}
                />
                {errors.plateNumber && <p className="text-red-400 text-xs">{errors.plateNumber}</p>}
              </div>
            </div>

            {/* Vehicle Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Vehicle Image</label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
                placeholder="Upload vehicle image"
                disabled={isLoading}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : submitText}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}