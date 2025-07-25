'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Images, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Clock,
  Car,
  Store,
  ZoomIn,
  Download
} from 'lucide-react'
import Image from 'next/image'
import { formatBookingDate, formatBookingTime } from '@/lib/utils'

interface BookingGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  booking: any
}

export default function BookingGalleryModal({ isOpen, onClose, booking }: BookingGalleryModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('grid')
  
  if (!booking) return null

  const beforeImages = booking.beforeImages || []
  const afterImages = booking.afterImages || []
  const allImages = [
    ...beforeImages.map((img: string, idx: number) => ({ src: img, type: 'before', index: idx })),
    ...afterImages.map((img: string, idx: number) => ({ src: img, type: 'after', index: idx }))
  ]

  const totalImages = allImages.length

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % totalImages)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
  }

  const downloadImage = (src: string, type: string, index: number) => {
    const link = document.createElement('a')
    link.href = src
    link.download = `${booking.shopName}_${type}_${index + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
              <Images className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Service Gallery</h2>
              <p className="text-sm text-gray-400 font-normal">
                Before & After Photos - {booking.shopName}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Booking Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-gray-400">Shop</p>
                <p className="text-white font-medium">{booking.shopName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-gray-400">Service</p>
                <p className="text-white font-medium">{booking.serviceName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-gray-400">Date</p>
                <p className="text-white font-medium">{formatBookingDate(booking.scheduledAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <div>
                <p className="text-gray-400">Time</p>
                <p className="text-white font-medium">{formatBookingTime(booking.scheduledAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {totalImages === 0 ? (
          <div className="text-center py-12">
            <Images className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No Photos Available</h3>
            <p className="text-gray-500">The shop hasn't uploaded any before/after photos for this service yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  {beforeImages.length} Before
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  {afterImages.length} After
                </Badge>
                <Badge variant="secondary" className="bg-gray-500/20 text-gray-300">
                  {totalImages} Total
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="text-xs"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'slider' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('slider')}
                  className="text-xs"
                >
                  Slider
                </Button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="space-y-6">
                {beforeImages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-300">Before Service</Badge>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {beforeImages.map((image: string, index: number) => (
                        <div key={`before-${index}`} className="group relative">
                          <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`Before service ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-white/20"
                              onClick={() => {
                                setSelectedImageIndex(index)
                                setViewMode('slider')
                              }}
                            >
                              <ZoomIn className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-white/20"
                              onClick={() => downloadImage(image, 'before', index)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {afterImages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Badge className="bg-green-500/20 text-green-300">After Service</Badge>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {afterImages.map((image: string, index: number) => (
                        <div key={`after-${index}`} className="group relative">
                          <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`After service ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-white/20"
                              onClick={() => {
                                setSelectedImageIndex(beforeImages.length + index)
                                setViewMode('slider')
                              }}
                            >
                              <ZoomIn className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-white/20"
                              onClick={() => downloadImage(image, 'after', index)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Slider View */}
            {viewMode === 'slider' && totalImages > 0 && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={allImages[selectedImageIndex].src}
                      alt={`${allImages[selectedImageIndex].type} service ${allImages[selectedImageIndex].index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Navigation Arrows */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={prevImage}
                    disabled={totalImages <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={nextImage}
                    disabled={totalImages <= 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  {/* Image Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={allImages[selectedImageIndex].type === 'before' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}>
                          {allImages[selectedImageIndex].type === 'before' ? 'Before Service' : 'After Service'}
                        </Badge>
                        <span className="text-white text-sm">
                          {selectedImageIndex + 1} of {totalImages}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={() => downloadImage(
                          allImages[selectedImageIndex].src,
                          allImages[selectedImageIndex].type,
                          allImages[selectedImageIndex].index
                        )}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-blue-500'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={image.src}
                          alt={`${image.type} ${image.index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}