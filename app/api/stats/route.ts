import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/stats - Get dashboard statistics for shop owner
export async function GET(request: NextRequest) {
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
        { success: false, error: 'Only shop owners can access stats' },
        { status: 403 }
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

    // Get statistics in parallel
    const [
      totalBookings,
      completedBookings,
      totalRevenue,
      activeServices,
      avgRatingData
    ] = await Promise.all([
      // Total bookings count
      prisma.booking.count({
        where: { shopOwnerId: shopOwner.id }
      }),
      
      // Completed bookings for revenue calculation
      prisma.booking.findMany({
        where: { 
          shopOwnerId: shopOwner.id,
          status: 'COMPLETED'
        },
        select: {
          totalAmount: true
        }
      }),
      
      // Sum of completed booking amounts
      prisma.booking.aggregate({
        where: { 
          shopOwnerId: shopOwner.id,
          status: 'COMPLETED'
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // Active services count
      prisma.service.count({
        where: { 
          shopOwnerId: shopOwner.id,
          isActive: true
        }
      }),
      
      // Average rating
      prisma.review.aggregate({
        where: { shopOwnerId: shopOwner.id },
        _avg: {
          rating: true
        }
      })
    ])

    const stats = {
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      avgRating: avgRatingData._avg.rating ? Number(avgRatingData._avg.rating.toFixed(1)) : 0,
      activeServices
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}