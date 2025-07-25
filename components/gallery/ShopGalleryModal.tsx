'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Images, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  Download,
  Store,
  MapPin,
  Star,
  Phone,
  Loader2
} from 'lucide-react'
import Image from 'next/image'

interface ShopGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  shop: any
}

export default function ShopGalleryModal({ isOpen, onClose, shop }: ShopGalleryModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'slider'>('grid')
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Fetch shop gallery images when modal opens
  useEffect(() => {
    if (isOpen && shop) {
      fetchShopGallery()
    }
  }, [isOpen, shop])

  const fetchShopGallery = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/shops/${shop.id}/gallery`)
      const data = await response.json()
      
      if (data.success) {
        setGalleryImages(data.images || [])
      } else {
        console.error('Failed to fetch shop gallery:', data.error)
        setGalleryImages([])
      }
    } catch (error) {
      console.error('Error fetching shop gallery:', error)
      setGalleryImages([])
    } finally {
      setIsLoading(false)
    }
  }

  if (!shop) return null

  const totalImages = galleryImages.length

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % totalImages)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
  }

  const downloadImage = (src: string, index: number) => {
    const link = document.createElement('a')
    link.href = src
    link.download = `${shop.name}_gallery_${index + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{shop.name} - Gallery</h2>
              <p className="text-sm text-gray-400 font-normal">
                Browse our work showcase
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Shop Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-gray-400">Location</p>
                <p className="text-white font-medium">{shop.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <div>
                <p className="text-gray-400">Rating</p>
                <p className="text-white font-medium">{shop.rating || 'New'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-gray-400">Contact</p>
                <p className="text-white font-medium">{shop.contactPhone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading gallery...</p>
          </div>
        ) : totalImages === 0 ? (
          <div className="text-center py-12">
            <Images className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No Gallery Images</h3>
            <p className="text-gray-500">This shop hasn't uploaded any gallery images yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  {totalImages} Images
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  Work Showcase
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="group relative">
                    <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={image.src || image}
                        alt={`Gallery image ${index + 1}`}
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
                        onClick={() => downloadImage(image.src || image, index)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Slider View */}
            {viewMode === 'slider' && totalImages > 0 && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={galleryImages[selectedImageIndex]?.src || galleryImages[selectedImageIndex]}
                      alt={`Gallery image ${selectedImageIndex + 1}`}
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
                        <Badge className="bg-purple-500/20 text-purple-300">
                          Gallery Image
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
                          galleryImages[selectedImageIndex]?.src || galleryImages[selectedImageIndex],
                          selectedImageIndex
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
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-purple-500'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={image.src || image}
                          alt={`Thumbnail ${index + 1}`}
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