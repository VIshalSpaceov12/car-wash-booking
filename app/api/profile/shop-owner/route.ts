import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/profile/shop-owner - Get shop owner profile
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
        { success: false, error: 'Only shop owners can access this endpoint' },
        { status: 403 }
      )
    }

    // Get shop owner profile
    const shopOwner = await prisma.shopOwner.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        services: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            bookings: true,
            services: true
          }
        }
      }
    })

    if (!shopOwner) {
      return NextResponse.json(
        { success: false, error: 'Shop owner profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: shopOwner.id,
        businessName: shopOwner.businessName,
        description: shopOwner.description,
        address: shopOwner.address,
        city: shopOwner.city,
        state: shopOwner.state,
        zipCode: shopOwner.zipCode,
        phone: shopOwner.phone,
        isVerified: shopOwner.isVerified,
        userName: shopOwner.user.name,
        userEmail: shopOwner.user.email,
        totalBookings: shopOwner._count.bookings,
        totalServices: shopOwner._count.services,
        createdAt: shopOwner.createdAt.toISOString(),
        updatedAt: shopOwner.updatedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching shop owner profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/profile/shop-owner - Update shop owner profile
export async function PUT(request: NextRequest) {
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
        { success: false, error: 'Only shop owners can update profiles' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { businessName, description, address, city, state, zipCode, phone } = body

    // Validate required fields
    if (!businessName || !address || !city || !state || !zipCode || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update shop owner profile
    const updatedProfile = await prisma.shopOwner.update({
      where: { userId: session.user.id },
      data: {
        businessName: businessName.trim(),
        description: description?.trim() || null,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        phone: phone.trim()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedProfile.id,
        businessName: updatedProfile.businessName,
        description: updatedProfile.description,
        address: updatedProfile.address,
        city: updatedProfile.city,
        state: updatedProfile.state,
        zipCode: updatedProfile.zipCode,
        phone: updatedProfile.phone,
        isVerified: updatedProfile.isVerified,
        userName: updatedProfile.user.name,
        userEmail: updatedProfile.user.email,
        updatedAt: updatedProfile.updatedAt.toISOString()
      },
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Error updating shop owner profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}