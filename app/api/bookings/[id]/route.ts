import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/bookings/[id] - Get specific booking details
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

    const bookingId = resolvedParams.id

    // Mock booking data - in real app, fetch from database
    const mockBooking = {
      id: bookingId,
      customerId: session.user.id,
      customerName: session.user.name,
      customerEmail: session.user.email,
      customerPhone: '+91 9876543210',
      shopId: '1',
      shopName: 'Premium Auto Spa',
      shopAddress: '123 Main Street, City Center',
      shopPhone: '+91 9876543210',
      serviceId: '2',
      serviceName: 'Premium Wash',
      serviceDescription: 'Complete exterior and interior cleaning with premium products',
      serviceDuration: 45,
      date: '2024-01-22',
      time: '10:00 AM',
      status: 'confirmed',
      price: 399,
      notes: 'Please wash the exterior thoroughly',
      paymentStatus: 'pending',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    }

    // Check if user owns this booking or is the shop owner
    if (mockBooking.customerId !== session.user.id && session.user.role !== 'SHOP_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      booking: mockBooking
    })

  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// PATCH /api/bookings/[id] - Update booking
export async function PATCH(
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

    const bookingId = resolvedParams.id
    const body = await request.json()
    
    const allowedFields = ['date', 'time', 'notes', 'status']
    const updates: Record<string, any> = {}
    
    // Only allow specific fields to be updated
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Validate status updates (only shop owners can mark as completed)
    if (updates.status && updates.status === 'completed' && session.user.role !== 'SHOP_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only shop owners can mark bookings as completed' },
        { status: 403 }
      )
    }

    // Validate date/time if being updated
    if (updates.date && updates.time) {
      const newBookingDate = new Date(`${updates.date} ${updates.time}`)
      if (newBookingDate < new Date()) {
        return NextResponse.json(
          { success: false, error: 'Cannot reschedule to past dates' },
          { status: 400 }
        )
      }
    }

    // Mock updated booking - in real app, update database
    const updatedBooking = {
      id: bookingId,
      customerId: session.user.id,
      customerName: session.user.name,
      shopId: '1',
      shopName: 'Premium Auto Spa',
      serviceId: '2',
      serviceName: 'Premium Wash',
      date: updates.date || '2024-01-22',
      time: updates.time || '10:00 AM',
      status: updates.status || 'confirmed',
      price: 399,
      notes: updates.notes || 'Please wash the exterior thoroughly',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking updated successfully'
    })

  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[id] - Cancel booking
export async function DELETE(
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

    const bookingId = resolvedParams.id

    // Check if booking exists and user has permission (mock check)
    // In real app, fetch booking from database and verify ownership
    
    // Mock cancellation - in real app, update booking status in database
    const cancelledBooking = {
      id: bookingId,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      booking: cancelledBooking,
      message: 'Booking cancelled successfully'
    })

  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}