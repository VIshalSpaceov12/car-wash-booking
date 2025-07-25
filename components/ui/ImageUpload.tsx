'use client'

import { useState, useRef } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  placeholder = "Upload an image",
  disabled = false,
  className = ""
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (2MB limit to avoid database issues)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB')
      return
    }

    setIsLoading(true)

    try {
      // Compress image before converting to base64
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = document.createElement('img')
      
      img.onload = () => {
        // Calculate new dimensions (max 800px width/height)
        const maxSize = 800
        let { width, height } = img
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        
        // Debug logging
        console.log('🖼️ Image processed successfully:', {
          originalSize: file.size,
          originalDimensions: `${img.width}x${img.height}`,
          compressedDimensions: `${width}x${height}`,
          base64Length: compressedDataUrl.length,
          estimatedSize: Math.round(compressedDataUrl.length * 0.75) + ' bytes'
        })
        
        onChange(compressedDataUrl)
        setIsLoading(false)
      }
      
      img.onerror = () => {
        alert('Failed to process image')
        setIsLoading(false)
      }
      
      // Convert file to image
      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target?.result as string
      }
      reader.onerror = () => {
        alert('Failed to read image file')
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
      setIsLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    if (disabled || isLoading) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isLoading) {
      setDragActive(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleClick = () => {
    if (!disabled && !isLoading) {
      fileInputRef.current?.click()
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-4 transition-all duration-200 cursor-pointer
          ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${value ? 'border-solid border-gray-600' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled || isLoading}
        />

        {value ? (
          <div className="relative">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-700">
              <Image
                src={value}
                alt="Uploaded image"
                fill
                className="object-cover"
              />
            </div>
            {!disabled && (
              <Button
                onClick={handleRemove}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            {isLoading ? (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-400">Uploading...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-gray-700/50 rounded-lg flex items-center justify-center">
                  {dragActive ? (
                    <Upload className="w-6 h-6 text-blue-400" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-medium">{placeholder}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dragActive ? 'Drop image here' : 'Click to browse or drag & drop'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}