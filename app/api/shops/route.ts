import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/shops - Get all shops or nearby shops
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius') || '10' // Default 10km radius
    const search = searchParams.get('search')
    const priceRange = searchParams.get('priceRange')
    const serviceType = searchParams.get('serviceType')

    // Build filter conditions
    let whereConditions: any = {}

    // Add search filter
    if (search) {
      whereConditions.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { 
          services: {
            some: {
              name: { contains: search, mode: 'insensitive' }
            }
          }
        }
      ]
    }

    // Fetch shops from database with their services
    const shops = await prisma.shopOwner.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            name: true,
            phone: true
          }
        },
        services: {
          where: {
            isActive: true
          },
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            description: true,
            category: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    })

    // Transform data for frontend
    const transformedShops = shops.map(shop => {
      const totalReviews = shop.reviews.length
      const averageRating = totalReviews > 0 
        ? shop.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0

      const prices = shop.services.map(s => s.price)
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0

      return {
        id: shop.id,
        name: shop.businessName,
        description: shop.description || 'Professional car wash services',
        address: `${shop.address}, ${shop.city}, ${shop.state} ${shop.zipCode}`,
        rating: Number(averageRating.toFixed(1)),
        totalReviews,
        priceRange: prices.length > 0 ? `₹${minPrice} - ₹${maxPrice}` : 'Contact for pricing',
        image: '/images/car.png', // Default image for now
        services: shop.services.map(service => ({
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          description: service.description,
          category: service.category
        })),
        contactPhone: shop.phone,
        isVerified: shop.isVerified
      }
    })

    // Apply additional client-side filters
    let filteredShops = transformedShops

    // Filter by price range
    if (priceRange && priceRange !== 'all') {
      filteredShops = filteredShops.filter(shop => {
        const minPrice = Math.min(...shop.services.map(s => s.price))
        switch (priceRange) {
          case 'low': return minPrice < 300
          case 'medium': return minPrice >= 300 && minPrice < 500
          case 'high': return minPrice >= 500
          default: return true
        }
      })
    }

    // Filter by service type
    if (serviceType && serviceType !== 'all') {
      filteredShops = filteredShops.filter(shop => 
        shop.services.some(service => 
          service.category.toLowerCase() === serviceType.toLowerCase()
        )
      )
    }

    return NextResponse.json({ 
      success: true, 
      shops: filteredShops,
      total: filteredShops.length 
    })

  } catch (error) {
    console.error('Error fetching shops:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shops' },
      { status: 500 }
    )
  }
}

// POST /api/shops - Create a new shop (Shop owners only)
export async function POST(request: NextRequest) {
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
        { success: false, error: 'Only shop owners can create shops' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      address,
      latitude,
      longitude,
      contactPhone,
      openHours,
      services
    } = body

    // Validate required fields
    if (!name || !description || !address || !contactPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, return mock success response
    // In real implementation, this would create the shop in the database
    const newShop = {
      id: Date.now().toString(),
      name,
      description,
      address,
      latitude: latitude || 12.9716,
      longitude: longitude || 77.5946,
      rating: 0,
      totalReviews: 0,
      contactPhone,
      openHours: openHours || '8:00 AM - 8:00 PM',
      ownerId: session.user.id,
      services: services || [],
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      shop: newShop,
      message: 'Shop created successfully'
    })

  } catch (error) {
    console.error('Error creating shop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create shop' },
      { status: 500 }
    )
  }
}