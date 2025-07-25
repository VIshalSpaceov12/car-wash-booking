import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/services/[id] - Get a specific service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const service = await prisma.service.findUnique({
      where: { id: resolvedParams.id },
      include: {
        shopOwner: {
          select: {
            businessName: true,
            user: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category,
        image: service.image,
        isActive: service.isActive,
        shopName: service.shopOwner.businessName,
        ownerName: service.shopOwner.user.name,
        bookingCount: service._count.bookings,
        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PUT /api/services/[id] - Update a service
export async function PUT(
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

    if (session.user.role !== 'SHOP_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only shop owners can update services' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, price, duration, category, image, isActive } = body

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

    // Verify service belongs to the shop owner
    const existingService = await prisma.service.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!existingService) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    if (existingService.shopOwnerId !== shopOwner.id) {
      return NextResponse.json(
        { success: false, error: 'You can only update your own services' },
        { status: 403 }
      )
    }

    // Update the service
    const updatedService = await prisma.service.update({
      where: { id: resolvedParams.id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: parseFloat(price),
        duration: parseInt(duration),
        category: category.trim(),
        image: image || null,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({
      success: true,
      service: {
        id: updatedService.id,
        name: updatedService.name,
        description: updatedService.description,
        price: updatedService.price,
        duration: updatedService.duration,
        category: updatedService.category,
        image: updatedService.image,
        isActive: updatedService.isActive,
        updatedAt: updatedService.updatedAt.toISOString()
      },
      message: 'Service updated successfully'
    })

  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id] - Delete a service
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

    if (session.user.role !== 'SHOP_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only shop owners can delete services' },
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

    // Verify service belongs to the shop owner
    const existingService = await prisma.service.findUnique({
      where: { id: resolvedParams.id },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!existingService) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    if (existingService.shopOwnerId !== shopOwner.id) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own services' },
        { status: 403 }
      )
    }

    // Check if service has active bookings
    if (existingService._count.bookings > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete service with existing bookings. Deactivate instead.' },
        { status: 400 }
      )
    }

    // Delete the service
    await prisma.service.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}