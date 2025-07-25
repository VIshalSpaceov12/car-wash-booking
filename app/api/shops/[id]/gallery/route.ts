import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/shops/[id]/gallery - Get shop's gallery images from all completed bookings
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shopId = params.id

    if (!shopId) {
      return NextResponse.json(
        { success: false, error: 'Shop ID is required' },
        { status: 400 }
      )
    }

    // Verify shop exists
    const shop = await prisma.shopOwner.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        businessName: true
      }
    })

    if (!shop) {
      return NextResponse.json(
        { success: false, error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Get all completed bookings for this shop that have before/after images
    const bookingsWithImages = await prisma.booking.findMany({
      where: {
        shopOwnerId: shopId,
        status: 'COMPLETED',
        OR: [
          { beforeImages: { isEmpty: false } },
          { afterImages: { isEmpty: false } }
        ]
      },
      select: {
        id: true,
        beforeImages: true,
        afterImages: true,
        scheduledAt: true,
        service: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'desc'
      }
    })

    // Combine all images with metadata
    const galleryImages: any[] = []

    bookingsWithImages.forEach(booking => {
      // Add before images
      booking.beforeImages.forEach((image: string, index: number) => {
        galleryImages.push({
          src: image,
          type: 'before',
          bookingId: booking.id,
          serviceName: booking.service.name,
          date: booking.scheduledAt,
          description: `Before - ${booking.service.name}`
        })
      })

      // Add after images
      booking.afterImages.forEach((image: string, index: number) => {
        galleryImages.push({
          src: image,
          type: 'after',
          bookingId: booking.id,
          serviceName: booking.service.name,
          date: booking.scheduledAt,
          description: `After - ${booking.service.name}`
        })
      })
    })

    // Sort all images by date (newest first)
    galleryImages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({
      success: true,
      images: galleryImages,
      shop: {
        id: shop.id,
        name: shop.businessName
      },
      totalBookings: bookingsWithImages.length,
      totalImages: galleryImages.length
    })

  } catch (error) {
    console.error('Error fetching shop gallery:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shop gallery' },
      { status: 500 }
    )
  }
}