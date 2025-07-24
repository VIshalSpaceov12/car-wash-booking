import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

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
        { success: false, error: 'Only shop owners can access this endpoint' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { business, services } = body

    // Validate required fields
    if (!business || !business.businessName || !business.address || !business.city || !business.state || !business.zipCode || !business.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required business fields' },
        { status: 400 }
      )
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one service is required' },
        { status: 400 }
      )
    }

    // Validate services
    for (const service of services) {
      if (!service.name || !service.price || service.price <= 0 || !service.duration || service.duration <= 0) {
        return NextResponse.json(
          { success: false, error: 'Invalid service data' },
          { status: 400 }
        )
      }
    }

    try {
      // Create or update shop owner profile
      const shopOwnerProfile = await prisma.shopOwner.upsert({
        where: { userId: session.user.id },
        update: {
          businessName: business.businessName.trim(),
          description: business.description?.trim() || null,
          address: business.address.trim(),
          city: business.city.trim(),
          state: business.state.trim(),
          zipCode: business.zipCode.trim(),
          phone: business.phone.trim(),
          isVerified: false
        },
        create: {
          userId: session.user.id,
          businessName: business.businessName.trim(),
          description: business.description?.trim() || null,
          address: business.address.trim(),
          city: business.city.trim(),
          state: business.state.trim(),
          zipCode: business.zipCode.trim(),
          phone: business.phone.trim(),
          isVerified: false
        }
      })

      // Delete existing services and create new ones
      await prisma.service.deleteMany({
        where: { shopOwnerId: shopOwnerProfile.id }
      })

      // Create services
      const createdServices = await Promise.all(
        services.map(service => 
          prisma.service.create({
            data: {
              shopOwnerId: shopOwnerProfile.id,
              name: service.name.trim(),
              description: `${service.category} car wash service`,
              price: parseFloat(service.price),
              duration: parseInt(service.duration),
              category: service.category || 'Basic',
              isActive: true
            }
          })
        )
      )

      return NextResponse.json({
        success: true,
        message: 'Shop owner onboarding completed successfully',
        business: {
          id: shopOwnerProfile.id,
          businessName: shopOwnerProfile.businessName,
          description: shopOwnerProfile.description,
          address: shopOwnerProfile.address,
          city: shopOwnerProfile.city,
          state: shopOwnerProfile.state,
          zipCode: shopOwnerProfile.zipCode,
          phone: shopOwnerProfile.phone,
          isVerified: shopOwnerProfile.isVerified
        },
        services: createdServices.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          category: service.category,
          isActive: service.isActive
        }))
      })

    } catch (error) {
      console.error('Error creating shop owner profile:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create business profile' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error processing shop owner onboarding:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process onboarding' },
      { status: 500 }
    )
  }
}