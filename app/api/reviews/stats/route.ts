import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/reviews/stats - Get rating statistics for shops or services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')
    const serviceId = searchParams.get('serviceId')

    if (!shopId && !serviceId) {
      return NextResponse.json(
        { success: false, error: 'Either shopId or serviceId is required' },
        { status: 400 }
      )
    }

    let whereClause: any = {}

    if (shopId) {
      whereClause.shopOwnerId = shopId
    }

    if (serviceId) {
      whereClause.booking = {
        serviceId: serviceId
      }
    }

    // Get all reviews for aggregation
    const reviews = await prisma.review.findMany({
      where: whereClause,
      select: {
        rating: true,
        createdAt: true
      }
    })

    if (reviews.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          totalReviews: 0,
          averageRating: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          recentReviews: 0,
          ratingTrend: 'stable'
        }
      })
    }

    // Calculate statistics
    const totalReviews = reviews.length
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    // Rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })

    // Recent reviews (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentReviews = reviews.filter(review => review.createdAt >= thirtyDaysAgo).length

    // Rating trend (comparing last 30 days vs previous 30 days)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
    
    const recentRatings = reviews.filter(review => review.createdAt >= thirtyDaysAgo)
    const previousRatings = reviews.filter(review => 
      review.createdAt >= sixtyDaysAgo && review.createdAt < thirtyDaysAgo
    )

    let ratingTrend = 'stable'
    if (recentRatings.length > 0 && previousRatings.length > 0) {
      const recentAvg = recentRatings.reduce((sum, r) => sum + r.rating, 0) / recentRatings.length
      const previousAvg = previousRatings.reduce((sum, r) => sum + r.rating, 0) / previousRatings.length
      
      if (recentAvg > previousAvg + 0.2) ratingTrend = 'improving'
      else if (recentAvg < previousAvg - 0.2) ratingTrend = 'declining'
    }

    // Calculate percentages for distribution
    const distributionPercentages = {
      1: Math.round((distribution[1] / totalReviews) * 100),
      2: Math.round((distribution[2] / totalReviews) * 100),
      3: Math.round((distribution[3] / totalReviews) * 100),
      4: Math.round((distribution[4] / totalReviews) * 100),
      5: Math.round((distribution[5] / totalReviews) * 100)
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        distribution,
        distributionPercentages,
        recentReviews,
        ratingTrend
      }
    })

  } catch (error) {
    console.error('Error fetching review stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review statistics' },
      { status: 500 }
    )
  }
}