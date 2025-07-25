import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST /api/bookings/[id]/images - Add images to a booking
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'SHOP_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only shop owners can add booking images' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { type, images } = body

    // Validate required fields
    if (!type || !images || !Array.isArray(images)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, images' },
        { status: 400 }
      )
    }

    // Validate type
    if (type !== 'before' && type !== 'after') {
      return NextResponse.json(
        { success: false, error: 'Type must be either "before" or "after"' },
        { status: 400 }
      )
    }

    // Validate images array
    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one image is required' },
        { status: 400 }
      )
    }

    // Get shop owner profile
    const shopOwner = await prisma.shopOwner.findUnique({
      where: { userId: session.user.id }
    })

    if (!shopOwner) {
      return NextResponse.json(
        { success: false, error: 'Shop owner profile not found' },
        { status: 404 }
      )
    }

    // Verify booking exists and belongs to the shop owner
    const booking = await prisma.booking.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.shopOwnerId !== shopOwner.id) {
      return NextResponse.json(
        { success: false, error: 'You can only add images to your own bookings' },
        { status: 403 }
      )
    }

    // Prepare update data
    const fieldName = type === 'before' ? 'beforeImages' : 'afterImages'
    const currentImages = type === 'before' ? booking.beforeImages : booking.afterImages
    const updatedImages = [...currentImages, ...images]

    // Update booking with new images
    const updatedBooking = await prisma.booking.update({
      where: { id: resolvedParams.id },
      data: {
        [fieldName]: updatedImages
      },
      include: {
        carOwner: {
          include: {
            user: {
              select: {
                name: true,
                phone: true
              }
            }
          }
        },
        service: {
          select: {
            name: true
          }
        },
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      booking: {
        id: updatedBooking.id,
        customerName: updatedBooking.carOwner.user.name,
        customerPhone: updatedBooking.carOwner.user.phone,
        serviceName: updatedBooking.service.name,
        vehicleMake: updatedBooking.vehicle.make,
        vehicleModel: updatedBooking.vehicle.model,
        vehicleYear: updatedBooking.vehicle.year,
        scheduledAt: updatedBooking.scheduledAt.toISOString(),
        completedAt: updatedBooking.completedAt?.toISOString() || null,
        status: updatedBooking.status,
        beforeImages: updatedBooking.beforeImages,
        afterImages: updatedBooking.afterImages,
        totalAmount: updatedBooking.totalAmount
      },
      message: `${type === 'before' ? 'Before' : 'After'} images added successfully`
    })

  } catch (error) {
    console.error('Error adding booking images:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add images' },
      { status: 500 }
    )
  }
}

// GET /api/bookings/[id]/images - Get booking images
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: resolvedParams.id },
      include: {
        carOwner: {
          include: {
            user: {
              select: {
                id: true
              }
            }
          }
        },
        shopOwner: {
          include: {
            user: {
              select: {
                id: true
              }
            }
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this booking
    const hasAccess = 
      (session.user.role === 'CAR_OWNER' && booking.carOwner.user.id === session.user.id) ||
      (session.user.role === 'SHOP_OWNER' && booking.shopOwner.user.id === session.user.id)

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      images: {
        before: booking.beforeImages,
        after: booking.afterImages
      }
    })

  } catch (error) {
    console.error('Error fetching booking images:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}