import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/profile/car-owner - Get car owner profile
export async function GET(request: NextRequest) {
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
        { success: false, error: 'Only car owners can access this endpoint' },
        { status: 403 }
      )
    }

    // Get car owner profile
    const carOwner = await prisma.carOwner.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })

    if (!carOwner) {
      // Create car owner profile if it doesn't exist
      const newCarOwner = await prisma.carOwner.create({
        data: {
          userId: session.user.id,
          address: null,
          city: null,
          state: null,
          zipCode: null
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          },
          _count: {
            select: {
              bookings: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        profile: {
          id: newCarOwner.id,
          address: newCarOwner.address,
          city: newCarOwner.city,
          state: newCarOwner.state,
          zipCode: newCarOwner.zipCode,
          userName: newCarOwner.user.name,
          userEmail: newCarOwner.user.email,
          userPhone: newCarOwner.user.phone,
          totalBookings: newCarOwner._count.bookings,
          createdAt: newCarOwner.createdAt.toISOString(),
          updatedAt: newCarOwner.updatedAt.toISOString()
        }
      })
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: carOwner.id,
        address: carOwner.address,
        city: carOwner.city,
        state: carOwner.state,
        zipCode: carOwner.zipCode,
        userName: carOwner.user.name,
        userEmail: carOwner.user.email,
        userPhone: carOwner.user.phone,
        totalBookings: carOwner._count.bookings,
        createdAt: carOwner.createdAt.toISOString(),
        updatedAt: carOwner.updatedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching car owner profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/profile/car-owner - Update car owner profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('PUT /api/profile/car-owner - Session:', session?.user)
    
    if (!session) {
      console.log('No session found')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'CAR_OWNER') {
      console.log('User role is not CAR_OWNER:', session.user.role)
      return NextResponse.json(
        { success: false, error: 'Only car owners can update profiles' },
        { status: 403 }
      )
    }

    const body = await request.json()
    console.log('Request body:', body)
    const { name, phone, address, city, state, zipCode } = body

    // Validate required fields
    if (!name) {
      console.log('Name is missing from request')
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    console.log('Updating user info for ID:', session.user.id)
    // Update user info first
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null
      }
    })

    console.log('User info updated, now upserting car owner profile')
    // Update or create car owner profile
    const updatedProfile = await prisma.carOwner.upsert({
      where: { userId: session.user.id },
      update: {
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        zipCode: zipCode?.trim() || null
      },
      create: {
        userId: session.user.id,
        address: address?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        zipCode: zipCode?.trim() || null
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    console.log('Profile updated successfully:', updatedProfile)

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedProfile.id,
        address: updatedProfile.address,
        city: updatedProfile.city,
        state: updatedProfile.state,
        zipCode: updatedProfile.zipCode,
        userName: updatedProfile.user.name,
        userEmail: updatedProfile.user.email,
        userPhone: updatedProfile.user.phone,
        updatedAt: updatedProfile.updatedAt.toISOString()
      },
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Error updating car owner profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}