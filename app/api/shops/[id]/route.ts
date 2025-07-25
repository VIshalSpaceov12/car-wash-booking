import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/shops/[id] - Get shop details with services
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const shopId = resolvedParams.id

    const shop = await prisma.shopOwner.findUnique({
      where: { id: shopId },
      include: {
        user: {
          select: {
            name: true
          }
        },
        services: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!shop) {
      return NextResponse.json(
        { success: false, error: 'Shop not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      shop: {
        id: shop.id,
        businessName: shop.businessName,
        description: shop.description,
        address: shop.address,
        city: shop.city,
        state: shop.state,
        zipCode: shop.zipCode,
        phone: shop.phone,
        isVerified: shop.isVerified,
        ownerName: shop.user.name,
        totalBookings: shop._count.bookings,
        createdAt: shop.createdAt.toISOString(),
        services: shop.services.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          category: service.category,
          isActive: service.isActive,
          createdAt: service.createdAt.toISOString(),
          updatedAt: service.updatedAt.toISOString()
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching shop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shop details' },
      { status: 500 }
    )
  }
}