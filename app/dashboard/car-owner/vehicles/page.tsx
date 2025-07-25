'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import VehicleForm from '@/components/forms/VehicleForm'
import Image from 'next/image'
import { 
  Car, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar,
  AlertTriangle
} from 'lucide-react'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  color?: string
  plateNumber?: string
  vehicleType: string
  image?: string
  createdAt: string
  updatedAt: string
}

export default function VehiclesPage() {
  const { data: session } = useSession()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!session) return

      try {
        const response = await fetch('/api/vehicles')
        const data = await response.json()
        
        if (data.success) {
          setVehicles(data.vehicles)
        } else {
          console.error('Failed to fetch vehicles:', data.error)
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicles()
  }, [session])

  const handleAddVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      const data = await response.json()

      if (data.success) {
        setVehicles(prev => [data.vehicle, ...prev])
        setIsFormOpen(false)
        alert('Vehicle added successfully!')
      } else {
        alert(data.error || 'Failed to add vehicle')
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert('Failed to add vehicle. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingVehicle) return

    setIsSubmitting(true)
    try {
      // Debug logging
      console.log('🚗 Updating vehicle:', {
        vehicleId: editingVehicle.id,
        hasImage: !!vehicleData.image,
        imageLength: vehicleData.image?.length || 0,
        payloadSize: JSON.stringify(vehicleData).length
      })

      const response = await fetch(`/api/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })

      const data = await response.json()

      if (data.success) {
        setVehicles(prev => prev.map(v => 
          v.id === editingVehicle.id ? data.vehicle : v
        ))
        setEditingVehicle(null)
        alert('Vehicle updated successfully!')
      } else {
        console.error('❌ API Error:', data.error)
        alert(data.error || 'Failed to update vehicle')
      }
    } catch (error) {
      console.error('❌ Network Error updating vehicle:', error)
      alert('Failed to update vehicle. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setVehicles(prev => prev.filter(v => v.id !== vehicleId))
        setDeleteConfirm(null)
        alert('Vehicle deleted successfully!')
      } else {
        alert(data.error || 'Failed to delete vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Failed to delete vehicle. Please try again.')
    }
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Vehicles</h1>
          <p className="text-gray-400">Manage your vehicles for car wash bookings</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          [...Array(3)].map((_, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))
        ) : vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300">
              <CardHeader className="pb-3">
                {/* Vehicle Image */}
                {vehicle.image ? (
                  <div className="w-full h-40 relative rounded-lg overflow-hidden mb-4">
                    <Image
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Car className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No image</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-2xl">
                    {getVehicleTypeIcon(vehicle.vehicleType)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{formatVehicleName(vehicle)}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="capitalize">{vehicle.vehicleType}</span>
                      {vehicle.color && (
                        <>
                          <span>•</span>
                          <span>{vehicle.color}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {vehicle.plateNumber && (
                  <div className="mt-3 p-2 bg-gray-700/50 rounded-md border border-gray-600">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">License Plate</div>
                      <div className="text-white font-mono font-bold tracking-wider">
                        {vehicle.plateNumber}
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                  <Calendar className="w-3 h-3" />
                  Added {new Date(vehicle.createdAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingVehicle(vehicle)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirm(vehicle.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-600/10 hover:border-red-500"
                    disabled={vehicles.length <= 1}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>

                {vehicles.length <= 1 && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-500">
                    <AlertTriangle className="w-3 h-3" />
                    <span>You need at least one vehicle</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No vehicles added</h3>
            <p className="text-gray-500 mb-6">Add your first vehicle to start booking car wash services</p>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </div>
        )}
      </div>

      {/* Add Vehicle Form */}
      {isFormOpen && (
        <VehicleForm
          onSubmit={handleAddVehicle}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isSubmitting}
          title="Add New Vehicle"
          submitText="Add Vehicle"
        />
      )}

      {/* Edit Vehicle Form */}
      {editingVehicle && (
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleEditVehicle}
          onCancel={() => setEditingVehicle(null)}
          isLoading={isSubmitting}
          title="Edit Vehicle"
          submitText="Update Vehicle"
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Delete Vehicle
              </CardTitle>
              <CardDescription>
                Are you sure you want to delete this vehicle? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  onClick={() => setDeleteConfirm(null)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteVehicle(deleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}