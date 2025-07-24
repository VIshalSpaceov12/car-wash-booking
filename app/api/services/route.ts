import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/services - Get services for a shop owner
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
        { success: false, error: 'Only shop owners can access services' },
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

    // Fetch services with booking counts
    const services = await prisma.service.findMany({
      where: { shopOwnerId: shopOwner.id },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const transformedServices = services.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      isActive: service.isActive,
      bookingCount: service._count.bookings,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      services: transformedServices
    })

  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/services - Create a new service
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
        { success: false, error: 'Only shop owners can create services' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, price, duration, category } = body

    // Validate required fields
    if (!name || !price || !duration || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, price, duration, category' },
        { status: 400 }
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

    // Create the service
    const newService = await prisma.service.create({
      data: {
        shopOwnerId: shopOwner.id,
        name: name.trim(),
        description: description?.trim() || null,
        price: parseFloat(price),
        duration: parseInt(duration),
        category: category.trim(),
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      service: {
        id: newService.id,
        name: newService.name,
        description: newService.description,
        price: newService.price,
        duration: newService.duration,
        category: newService.category,
        isActive: newService.isActive,
        createdAt: newService.createdAt.toISOString()
      },
      message: 'Service created successfully'
    })

  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    )
  }
}