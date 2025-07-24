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

    // For now, return mock data - will be replaced with real database queries
    const mockShops = [
      {
        id: '1',
        name: 'Premium Auto Spa',
        description: 'Professional car washing and detailing services',
        address: '123 Main Street, City Center',
        latitude: 12.9716,
        longitude: 77.5946,
        rating: 4.8,
        totalReviews: 156,
        priceRange: '₹199 - ₹699',
        image: '/images/car.png',
        services: [
          { id: '1', name: 'Basic Wash', price: 199, duration: 30 },
          { id: '2', name: 'Premium Wash', price: 399, duration: 45 },
          { id: '3', name: 'Full Detail', price: 699, duration: 90 }
        ],
        openHours: '8:00 AM - 8:00 PM',
        contactPhone: '+91 9876543210'
      },
      {
        id: '2',
        name: 'Quick Clean Station',
        description: 'Fast and affordable car wash services',
        address: '456 Park Avenue, Downtown',
        latitude: 12.9716,
        longitude: 77.5946,
        rating: 4.5,
        totalReviews: 89,
        priceRange: '₹149 - ₹399',
        image: '/images/car.png',
        services: [
          { id: '4', name: 'Express Wash', price: 149, duration: 20 },
          { id: '5', name: 'Standard Wash', price: 249, duration: 35 },
          { id: '6', name: 'Premium Clean', price: 399, duration: 50 }
        ],
        openHours: '7:00 AM - 9:00 PM',
        contactPhone: '+91 9876543211'
      },
      {
        id: '3',
        name: 'Luxury Car Care',
        description: 'High-end car detailing and premium services',
        address: '789 Business District, Tech Park',
        latitude: 12.9716,
        longitude: 77.5946,
        rating: 4.9,
        totalReviews: 234,
        priceRange: '₹399 - ₹999',
        image: '/images/car.png',
        services: [
          { id: '7', name: 'Luxury Wash', price: 499, duration: 60 },
          { id: '8', name: 'Premium Detail', price: 799, duration: 120 },
          { id: '9', name: 'Executive Package', price: 999, duration: 150 }
        ],
        openHours: '9:00 AM - 7:00 PM',
        contactPhone: '+91 9876543212'
      }
    ]

    return NextResponse.json({ 
      success: true, 
      shops: mockShops,
      total: mockShops.length 
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