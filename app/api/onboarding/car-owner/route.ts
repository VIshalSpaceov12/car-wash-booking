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

    if (session.user.role !== 'CAR_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only car owners can access this endpoint' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { profile, vehicle } = body

    // Validate required fields
    if (!profile || !profile.address || !profile.city || !profile.state || !profile.zipCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required profile fields' },
        { status: 400 }
      )
    }

    if (!vehicle || !vehicle.make || !vehicle.model || !vehicle.year) {
      return NextResponse.json(
        { success: false, error: 'Missing required vehicle fields' },
        { status: 400 }
      )
    }

    try {
      // Create or update car owner profile
      const carOwnerProfile = await prisma.carOwner.upsert({
        where: { userId: session.user.id },
        update: {
          address: profile.address.trim(),
          city: profile.city.trim(),
          state: profile.state.trim(),
          zipCode: profile.zipCode.trim()
        },
        create: {
          userId: session.user.id,
          address: profile.address.trim(),
          city: profile.city.trim(),
          state: profile.state.trim(),
          zipCode: profile.zipCode.trim()
        }
      })

      // Create vehicle (delete existing vehicles first for onboarding)
      await prisma.vehicle.deleteMany({
        where: { carOwnerId: carOwnerProfile.id }
      })

      const newVehicle = await prisma.vehicle.create({
        data: {
          carOwnerId: carOwnerProfile.id,
          make: vehicle.make.trim(),
          model: vehicle.model.trim(),
          year: parseInt(vehicle.year),
          color: vehicle.color?.trim() || null,
          plateNumber: vehicle.plateNumber?.trim() || null,
          vehicleType: vehicle.vehicleType || 'car'
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Car owner onboarding completed successfully',
        profile: {
          id: carOwnerProfile.id,
          address: carOwnerProfile.address,
          city: carOwnerProfile.city,
          state: carOwnerProfile.state,
          zipCode: carOwnerProfile.zipCode
        },
        vehicle: {
          id: newVehicle.id,
          make: newVehicle.make,
          model: newVehicle.model,
          year: newVehicle.year,
          color: newVehicle.color,
          plateNumber: newVehicle.plateNumber,
          vehicleType: newVehicle.vehicleType
        }
      })

    } catch (error) {
      console.error('Error creating car owner profile:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create profile' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error processing car owner onboarding:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process onboarding' },
      { status: 500 }
    )
  }
}