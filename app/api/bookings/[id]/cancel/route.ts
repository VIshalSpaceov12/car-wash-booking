import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a shop owner
    if (session.user.role !== 'SHOP_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only shop owners can cancel bookings' },
        { status: 403 }
      )
    }

    const bookingId = params.id
    const { reason } = await request.json()

    // Get the booking to verify it belongs to this shop owner
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        shopOwner: {
          userId: session.user.id
        }
      },
      include: {
        carOwner: {
          include: {
            user: true
          }
        },
        service: true,
        vehicle: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found or access denied' },
        { status: 404 }
      )
    }

    // Check if booking can be cancelled (pending or confirmed)
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      return NextResponse.json(
        { success: false, error: 'Only pending or confirmed bookings can be cancelled' },
        { status: 400 }
      )
    }

    // Update booking status to cancelled
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: 'CANCELLED',
        notes: reason ? `${booking.notes || ''}\n\nCancellation reason: ${reason}`.trim() : booking.notes,
        updatedAt: new Date()
      },
      include: {
        carOwner: {
          include: {
            user: true
          }
        },
        service: true,
        vehicle: true,
        shopOwner: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: {
        id: updatedBooking.id,
        status: updatedBooking.status,
        customerName: updatedBooking.carOwner.user.name,
        serviceName: updatedBooking.service.name,
        scheduledAt: updatedBooking.scheduledAt,
        totalAmount: updatedBooking.totalAmount,
        vehicleInfo: `${updatedBooking.vehicle.year} ${updatedBooking.vehicle.make} ${updatedBooking.vehicle.model}`,
        notes: updatedBooking.notes
      }
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}