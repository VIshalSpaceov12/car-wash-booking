import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/reviews - Get reviews for a shop or service
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')
    const serviceId = searchParams.get('serviceId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let whereClause: any = {}

    if (shopId) {
      whereClause.shopOwnerId = shopId
    }

    if (serviceId) {
      whereClause.booking = {
        serviceId: serviceId
      }
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        carOwner: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        booking: {
          include: {
            service: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    const transformedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      customerName: review.carOwner.user.name,
      serviceName: review.booking.service.name,
      createdAt: review.createdAt.toISOString()
    }))

    const totalCount = await prisma.review.count({ where: whereClause })

    return NextResponse.json({
      success: true,
      reviews: transformedReviews,
      total: totalCount,
      hasMore: offset + limit < totalCount
    })

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'CAR_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only car owners can create reviews' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { bookingId, rating, comment } = body

    // Validate required fields
    if (!bookingId || !rating) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: bookingId, rating' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
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

      // Verify booking exists and belongs to the user
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          review: true
        }
      })

      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        )
      }

      if (booking.carOwnerId !== carOwner.id) {
        return NextResponse.json(
          { success: false, error: 'You can only review your own bookings' },
          { status: 403 }
        )
      }

      if (booking.status !== 'COMPLETED') {
        return NextResponse.json(
          { success: false, error: 'You can only review completed services' },
          { status: 400 }
        )
      }

      if (booking.review) {
        return NextResponse.json(
          { success: false, error: 'You have already reviewed this booking' },
          { status: 400 }
        )
      }

      // Create the review
      const newReview = await prisma.review.create({
        data: {
          bookingId: bookingId,
          carOwnerId: carOwner.id,
          shopOwnerId: booking.shopOwnerId,
          rating: rating,
          comment: comment?.trim() || null
        },
        include: {
          booking: {
            include: {
              service: {
                select: {
                  name: true
                }
              },
              shopOwner: {
                select: {
                  businessName: true
                }
              }
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        review: {
          id: newReview.id,
          rating: newReview.rating,
          comment: newReview.comment,
          serviceName: newReview.booking.service.name,
          shopName: newReview.booking.shopOwner.businessName,
          createdAt: newReview.createdAt.toISOString()
        },
        message: 'Review submitted successfully'
      })

    } catch (error) {
      console.error('Error creating review:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create review' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    )
  }
}