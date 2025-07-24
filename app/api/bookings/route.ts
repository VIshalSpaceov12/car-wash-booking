import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Mock bookings data - will be replaced with real database queries
    const mockBookings = [
      {
        id: '1',
        customerId: session.user.id,
        customerName: session.user.name,
        shopId: '1',
        shopName: 'Premium Auto Spa',
        serviceId: '2',
        serviceName: 'Premium Wash',
        date: '2024-01-22',
        time: '10:00 AM',
        status: 'upcoming',
        price: 399,
        notes: 'Please wash the exterior thoroughly',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        customerId: session.user.id,
        customerName: session.user.name,
        shopId: '2',
        shopName: 'Quick Clean Station',
        serviceId: '5',
        serviceName: 'Standard Wash',
        date: '2024-01-18',
        time: '2:00 PM',
        status: 'completed',
        price: 249,
        notes: '',
        createdAt: '2024-01-15T14:00:00Z',
        updatedAt: '2024-01-18T15:00:00Z'
      },
      {
        id: '3',
        customerId: session.user.id,
        customerName: session.user.name,
        shopId: '3',
        shopName: 'Luxury Car Care',
        serviceId: '8',
        serviceName: 'Premium Detail',
        date: '2024-01-25',
        time: '11:00 AM',
        status: 'confirmed',
        price: 799,
        notes: 'Full interior and exterior detailing',
        createdAt: '2024-01-21T09:00:00Z',
        updatedAt: '2024-01-21T09:00:00Z'
      }
    ]

    // Filter by status if provided
    let filteredBookings = mockBookings
    if (status) {
      filteredBookings = mockBookings.filter(booking => booking.status === status)
    }

    // Apply pagination
    const paginatedBookings = filteredBookings.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      bookings: paginatedBookings,
      total: filteredBookings.length,
      hasMore: offset + limit < filteredBookings.length
    })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      shopId,
      serviceId,
      date,
      time,
      notes
    } = body

    // Validate required fields
    if (!shopId || !serviceId || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: shopId, serviceId, date, time' },
        { status: 400 }
      )
    }

    // Validate date is not in the past
    const bookingDate = new Date(`${date} ${time}`)
    if (bookingDate < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Cannot book for past dates' },
        { status: 400 }
      )
    }

    // Mock service data (in real app, fetch from database)
    const mockServices = {
      '1': { name: 'Basic Wash', price: 199 },
      '2': { name: 'Premium Wash', price: 399 },
      '3': { name: 'Full Detail', price: 699 },
      '4': { name: 'Express Wash', price: 149 },
      '5': { name: 'Standard Wash', price: 249 },
      '6': { name: 'Premium Clean', price: 399 },
      '7': { name: 'Luxury Wash', price: 499 },
      '8': { name: 'Premium Detail', price: 799 },
      '9': { name: 'Executive Package', price: 999 }
    }

    const mockShops = {
      '1': 'Premium Auto Spa',
      '2': 'Quick Clean Station',
      '3': 'Luxury Car Care'
    }

    const service = mockServices[serviceId as keyof typeof mockServices]
    const shopName = mockShops[shopId as keyof typeof mockShops]

    if (!service || !shopName) {
      return NextResponse.json(
        { success: false, error: 'Invalid shop or service ID' },
        { status: 400 }
      )
    }

    // Create new booking (mock data - in real app, save to database)
    const newBooking = {
      id: Date.now().toString(),
      customerId: session.user.id,
      customerName: session.user.name,
      shopId,
      shopName,
      serviceId,
      serviceName: service.name,
      date,
      time,
      status: 'confirmed',
      price: service.price,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: 'Booking created successfully'
    })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}