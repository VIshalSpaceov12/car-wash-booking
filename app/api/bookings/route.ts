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

    // Get user's bookings from database
    let whereClause: any = {}
    
    if (session.user.role === 'CAR_OWNER') {
      // For car owners, get their bookings
      const carOwner = await prisma.carOwner.findUnique({
        where: { userId: session.user.id }
      })
      if (!carOwner) {
        return NextResponse.json({
          success: true,
          bookings: [],
          total: 0,
          hasMore: false
        })
      }
      whereClause.carOwnerId = carOwner.id
    } else if (session.user.role === 'SHOP_OWNER') {
      // For shop owners, get bookings for their shop
      const shopOwner = await prisma.shopOwner.findUnique({
        where: { userId: session.user.id }
      })
      if (!shopOwner) {
        return NextResponse.json({
          success: true,
          bookings: [],
          total: 0,
          hasMore: false
        })
      }
      whereClause.shopOwnerId = shopOwner.id
    }

    // Add status filter if provided
    if (status) {
      whereClause.status = status.toUpperCase()
    }

    // Fetch bookings from database
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        carOwner: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        shopOwner: {
          select: {
            businessName: true,
            address: true,
            city: true,
            state: true,
            phone: true
          }
        },
        service: {
          select: {
            name: true,
            description: true,
            price: true,
            duration: true
          }
        },
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
            color: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    // Transform bookings for frontend
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      customerId: booking.carOwner.userId,
      customerName: booking.carOwner.user.name,
      customerEmail: booking.carOwner.user.email,
      customerPhone: booking.carOwner.user.phone,
      shopId: booking.shopOwnerId,
      shopName: booking.shopOwner.businessName,
      shopAddress: `${booking.shopOwner.address}, ${booking.shopOwner.city}, ${booking.shopOwner.state}`,
      serviceId: booking.serviceId,
      serviceName: booking.service.name,
      serviceDescription: booking.service.description,
      vehicle: booking.vehicle ? {
        make: booking.vehicle.make,
        model: booking.vehicle.model,
        year: booking.vehicle.year,
        color: booking.vehicle.color
      } : null,
      scheduledAt: booking.scheduledAt.toISOString(),
      completedAt: booking.completedAt?.toISOString(),
      status: booking.status.toLowerCase(),
      totalAmount: booking.totalAmount,
      notes: booking.notes,
      beforeImages: booking.beforeImages || [],
      afterImages: booking.afterImages || [],
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString()
    }))

    const totalCount = await prisma.booking.count({ where: whereClause })
    const paginatedBookings = transformedBookings

    return NextResponse.json({
      success: true,
      bookings: paginatedBookings,
      total: totalCount,
      hasMore: offset + limit < totalCount
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
      vehicleId,
      date,
      time,
      notes
    } = body

    // Validate required fields
    if (!shopId || !serviceId || !vehicleId || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: shopId, serviceId, vehicleId, date, time' },
        { status: 400 }
      )
    }

    // Create IST datetime and convert to UTC for database storage
    // User input is assumed to be in IST timezone
    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = time.split(':').map(Number)
    
    // Create date in IST (UTC+5:30)
    const istDate = new Date()
    istDate.setUTCFullYear(year)
    istDate.setUTCMonth(month - 1) // Month is 0-indexed
    istDate.setUTCDate(day)
    istDate.setUTCHours(hours - 5) // Convert IST to UTC by subtracting 5 hours
    istDate.setUTCMinutes(minutes - 30) // Subtract 30 minutes for IST offset
    istDate.setUTCSeconds(0)
    istDate.setUTCMilliseconds(0)
    
    const bookingDateTime = istDate
    
    // Validate date is not in the past (compare in UTC)
    const now = new Date()
    if (bookingDateTime < now) {
      return NextResponse.json(
        { success: false, error: 'Cannot book for past dates' },
        { status: 400 }
      )
    }

    try {
      // Get car owner profile
      const carOwner = await prisma.carOwner.findUnique({
        where: { userId: session.user.id }
      })

      if (!carOwner) {
        return NextResponse.json(
          { success: false, error: 'Car owner profile not found' },
          { status: 404 }
        )
      }

      // Verify service exists and get details
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          shopOwner: {
            select: {
              id: true,
              businessName: true
            }
          }
        }
      })

      if (!service || !service.isActive) {
        return NextResponse.json(
          { success: false, error: 'Service not found or inactive' },
          { status: 404 }
        )
      }

      // Verify the service belongs to the specified shop
      if (service.shopOwner.id !== shopId) {
        return NextResponse.json(
          { success: false, error: 'Service does not belong to specified shop' },
          { status: 400 }
        )
      }

      // Verify vehicle exists and belongs to car owner
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: vehicleId }
      })

      if (!vehicle) {
        return NextResponse.json(
          { success: false, error: 'Vehicle not found' },
          { status: 404 }
        )
      }

      if (vehicle.carOwnerId !== carOwner.id) {
        return NextResponse.json(
          { success: false, error: 'Vehicle does not belong to this user' },
          { status: 403 }
        )
      }

      // Check for time slot conflicts - no two bookings for the same shop at the same time
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          shopOwnerId: shopId,
          scheduledAt: bookingDateTime,
          status: {
            in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] // Only check active bookings
          }
        }
      })

      if (conflictingBooking) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'This time slot is already booked. Please choose a different time.'
          },
          { status: 409 } // 409 Conflict status code
        )
      }

      // Create the booking
      const newBooking = await prisma.booking.create({
        data: {
          carOwnerId: carOwner.id,
          shopOwnerId: shopId,
          serviceId: serviceId,
          vehicleId: vehicle.id,
          scheduledAt: bookingDateTime,
          status: 'PENDING',
          totalAmount: service.price,
          notes: notes || null
        },
        include: {
          service: {
            select: {
              name: true,
              price: true
            }
          },
          shopOwner: {
            select: {
              businessName: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        booking: {
          id: newBooking.id,
          shopName: newBooking.shopOwner.businessName,
          serviceName: newBooking.service.name,
          scheduledAt: newBooking.scheduledAt.toISOString(),
          status: newBooking.status.toLowerCase(),
          totalAmount: newBooking.totalAmount,
          notes: newBooking.notes
        },
        message: 'Booking created successfully'
      })

    } catch (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create booking' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error processing booking request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process booking request' },
      { status: 500 }
    )
  }
}