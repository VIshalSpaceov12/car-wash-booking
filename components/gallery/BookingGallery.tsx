'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ImageUpload from '@/components/ui/ImageUpload'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'
import { 
  Images, 
  Camera, 
  Calendar, 
  Car, 
  User, 
  Plus,
  Eye,
  Trash2,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react'

interface Booking {
  id: string
  customerName: string
  customerPhone: string
  serviceName: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  scheduledAt: string
  completedAt: string | null
  status: string
  beforeImages: string[]
  afterImages: string[]
  totalAmount: number
}

interface BookingGalleryProps {
  shopId: string
}

export default function BookingGallery({ shopId }: BookingGalleryProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isAddImagesOpen, setIsAddImagesOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageType, setImageType] = useState<'before' | 'after'>('before')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [newImages, setNewImages] = useState<string[]>([])

  useEffect(() => {
    fetchBookings()
  }, [shopId])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      
      if (data.success) {
        // Filter only bookings with images or completed status
        const bookingsWithImages = data.bookings.filter((booking: Booking) => 
          booking.status === 'COMPLETED' || 
          booking.beforeImages.length > 0 || 
          booking.afterImages.length > 0
        )
        setBookings(bookingsWithImages)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${booking.vehicleMake} ${booking.vehicleModel}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'with-images') {
        filtered = filtered.filter(booking => 
          booking.beforeImages.length > 0 || booking.afterImages.length > 0
        )
      } else if (statusFilter === 'no-images') {
        filtered = filtered.filter(booking => 
          booking.beforeImages.length === 0 && booking.afterImages.length === 0
        )
      }
    }

    setFilteredBookings(filtered)
  }

  const openGallery = (booking: Booking, type: 'before' | 'after', index: number = 0) => {
    setSelectedBooking(booking)
    setImageType(type)
    setSelectedImageIndex(index)
    setIsGalleryOpen(true)
  }

  const openAddImages = (booking: Booking) => {
    setSelectedBooking(booking)
    setNewImages([])
    setIsAddImagesOpen(true)
  }

  const handleAddImage = (imageUrl: string) => {
    setNewImages(prev => [...prev, imageUrl])
  }

  const handleRemoveImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveImages = async () => {
    if (!selectedBooking || newImages.length === 0) return

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: imageType,
          images: newImages
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update the booking in our state
        setBookings(prev => prev.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, [imageType === 'before' ? 'beforeImages' : 'afterImages']: [...booking[imageType === 'before' ? 'beforeImages' : 'afterImages'], ...newImages] }
            : booking
        ))
        setIsAddImagesOpen(false)
        setNewImages([])
        alert('Images added successfully!')
      } else {
        alert('Failed to add images: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving images:', error)
      alert('Failed to add images. Please try again.')
    }
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedBooking) return
    
    const images = imageType === 'before' ? selectedBooking.beforeImages : selectedBooking.afterImages
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
    } else {
      setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'CONFIRMED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Work Gallery</h2>
          <p className="text-gray-400">Manage before and after photos of your car wash services</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer, service, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Bookings</option>
                <option value="with-images">With Images</option>
                <option value="no-images">No Images</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
              <CardContent className="p-4">
                <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300">
              <CardContent className="p-4">
                {/* Image Preview */}
                <div className="relative h-48 bg-gray-700 rounded-lg mb-4 overflow-hidden">
                  {booking.beforeImages.length > 0 || booking.afterImages.length > 0 ? (
                    <div className="grid grid-cols-2 h-full gap-1">
                      {/* Before Image */}
                      <div className="relative group">
                        {booking.beforeImages.length > 0 ? (
                          <Image
                            src={booking.beforeImages[0]}
                            alt="Before"
                            fill
                            className="object-cover cursor-pointer"
                            onClick={() => openGallery(booking, 'before', 0)}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Before ({booking.beforeImages.length})</span>
                        </div>
                      </div>

                      {/* After Image */}
                      <div className="relative group">
                        {booking.afterImages.length > 0 ? (
                          <Image
                            src={booking.afterImages[0]}
                            alt="After"
                            fill
                            className="object-cover cursor-pointer"
                            onClick={() => openGallery(booking, 'after', 0)}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">After ({booking.afterImages.length})</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No images uploaded</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{booking.customerName}</h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      <span>{booking.vehicleYear} {booking.vehicleMake} {booking.vehicleModel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(booking.scheduledAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-300">{booking.serviceName}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {(booking.beforeImages.length > 0 || booking.afterImages.length > 0) && (
                      <Button
                        onClick={() => openGallery(booking, 'before', 0)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                    {booking.status === 'COMPLETED' && (
                      <Button
                        onClick={() => openAddImages(booking)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-600 text-blue-400 hover:bg-blue-600/10"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <Images className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Gallery Items</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No bookings match your current filters.'
                : 'Complete some bookings and add photos to build your gallery.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Image Gallery Modal */}
      {isGalleryOpen && selectedBooking && (
        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogContent className="max-w-4xl bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {imageType === 'before' ? 'Before' : 'After'} Photos - {selectedBooking.customerName}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Image Display */}
              <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
                {(() => {
                  const images = imageType === 'before' ? selectedBooking.beforeImages : selectedBooking.afterImages
                  return images.length > 0 ? (
                    <>
                      <Image
                        src={images[selectedImageIndex]}
                        alt={`${imageType} photo ${selectedImageIndex + 1}`}
                        fill
                        className="object-contain"
                      />
                      
                      {images.length > 1 && (
                        <>
                          <Button
                            onClick={() => navigateImage('prev')}
                            variant="ghost"
                            size="sm"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => navigateImage('next')}
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No {imageType} photos available</p>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Image Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setImageType('before')}
                    variant={imageType === 'before' ? 'default' : 'outline'}
                    size="sm"
                    className={imageType === 'before' ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
                  >
                    Before ({selectedBooking.beforeImages.length})
                  </Button>
                  <Button
                    onClick={() => setImageType('after')}
                    variant={imageType === 'after' ? 'default' : 'outline'}
                    size="sm"
                    className={imageType === 'after' ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
                  >
                    After ({selectedBooking.afterImages.length})
                  </Button>
                </div>
                
                {(() => {
                  const images = imageType === 'before' ? selectedBooking.beforeImages : selectedBooking.afterImages
                  return images.length > 0 && (
                    <span className="text-gray-400 text-sm">
                      {selectedImageIndex + 1} of {images.length}
                    </span>
                  )
                })()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Images Modal */}
      {isAddImagesOpen && selectedBooking && (
        <Dialog open={isAddImagesOpen} onOpenChange={setIsAddImagesOpen}>
          <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                Add Images - {selectedBooking.customerName}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Image Type Selection */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setImageType('before')}
                  variant={imageType === 'before' ? 'default' : 'outline'}
                  className={imageType === 'before' ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
                >
                  Before Photos
                </Button>
                <Button
                  onClick={() => setImageType('after')}
                  variant={imageType === 'after' ? 'default' : 'outline'}
                  className={imageType === 'after' ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
                >
                  After Photos
                </Button>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <ImageUpload
                  value=""
                  onChange={handleAddImage}
                  onRemove={() => {}}
                  placeholder={`Upload ${imageType} photos`}
                />
                
                {/* Preview uploaded images */}
                {newImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {newImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-24 bg-gray-700 rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`New ${imageType} photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          onClick={() => handleRemoveImage(index)}
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsAddImagesOpen(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveImages}
                  disabled={newImages.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Save Images ({newImages.length})
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}