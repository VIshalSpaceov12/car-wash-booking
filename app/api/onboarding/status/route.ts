import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let isCompleted = false
    let redirectUrl = '/dashboard'

    if (session.user.role === 'CAR_OWNER') {
      const carOwner = await prisma.carOwner.findUnique({
        where: { userId: session.user.id },
        include: {
          vehicles: true
        }
      })
      
      isCompleted = !!(carOwner && carOwner.vehicles.length > 0)
      redirectUrl = '/dashboard/car-owner'
    } else if (session.user.role === 'SHOP_OWNER') {
      const shopOwner = await prisma.shopOwner.findUnique({
        where: { userId: session.user.id },
        include: {
          services: true
        }
      })
      
      isCompleted = !!(shopOwner && shopOwner.services.length > 0)
      redirectUrl = '/dashboard/shop-owner'
    }

    return NextResponse.json({
      success: true,
      isCompleted,
      redirectUrl,
      userRole: session.user.role
    })

  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check onboarding status' },
      { status: 500 }
    )
  }
}