import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/vehicles/[id] - Get specific vehicle
export async function GET(
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

    if (session.user.role !== 'CAR_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only car owners can access vehicles' },
        { status: 403 }
      )
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: resolvedParams.id },
      include: {
        carOwner: {
          select: {
            userId: true
          }
        }
      }
    })

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Check if vehicle belongs to the current user
    if (vehicle.carOwner.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      vehicle: {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        plateNumber: vehicle.plateNumber,
        vehicleType: vehicle.vehicleType,
        image: vehicle.image,
        createdAt: vehicle.createdAt.toISOString(),
        updatedAt: vehicle.updatedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
}

// PUT /api/vehicles/[id] - Update vehicle
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

    if (session.user.role !== 'CAR_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only car owners can update vehicles' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { make, model, year, color, plateNumber, vehicleType, image } = body

    // Validate required fields
    if (!make || !model || !year || !vehicleType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: make, model, year, vehicleType' },
        { status: 400 }
      )
    }

    // Validate year
    const currentYear = new Date().getFullYear()
    if (year < 1990 || year > currentYear + 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid year. Must be between 1990 and ' + (currentYear + 1) },
        { status: 400 }
      )
    }

    // Check if vehicle exists and belongs to user
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id: resolvedParams.id },
      include: {
        carOwner: {
          select: {
            userId: true
          }
        }
      }
    })

    if (!existingVehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    if (existingVehicle.carOwner.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check if plate number already exists (if provided and different from current)
    if (plateNumber && plateNumber.trim().toUpperCase() !== existingVehicle.plateNumber) {
      const plateExists = await prisma.vehicle.findUnique({
        where: { plateNumber: plateNumber.trim().toUpperCase() }
      })

      if (plateExists) {
        return NextResponse.json(
          { success: false, error: 'A vehicle with this plate number already exists' },
          { status: 400 }
        )
      }
    }

    // Log the incoming data for debugging
    console.log('Updating vehicle with data:', {
      make: make?.trim(),
      model: model?.trim(), 
      year: parseInt(year),
      color: color?.trim() || null,
      plateNumber: plateNumber?.trim().toUpperCase() || null,
      vehicleType,
      imageLength: image ? image.length : 0
    })

    // Update vehicle
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: resolvedParams.id },
      data: {
        make: make.trim(),
        model: model.trim(),
        year: parseInt(year),
        color: color?.trim() || null,
        plateNumber: plateNumber?.trim().toUpperCase() || null,
        vehicleType: vehicleType,
        image: image || null
      }
    })

    return NextResponse.json({
      success: true,
      vehicle: {
        id: updatedVehicle.id,
        make: updatedVehicle.make,
        model: updatedVehicle.model,
        year: updatedVehicle.year,
        color: updatedVehicle.color,
        plateNumber: updatedVehicle.plateNumber,
        vehicleType: updatedVehicle.vehicleType,
        image: updatedVehicle.image,
        createdAt: updatedVehicle.createdAt.toISOString(),
        updatedAt: updatedVehicle.updatedAt.toISOString()
      },
      message: 'Vehicle updated successfully'
    })

  } catch (error) {
    console.error('Error updating vehicle:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        code: (error as any).code,
        meta: (error as any).meta
      })
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update vehicle: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

// DELETE /api/vehicles/[id] - Delete vehicle
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

    if (session.user.role !== 'CAR_OWNER') {
      return NextResponse.json(
        { success: false, error: 'Only car owners can delete vehicles' },
        { status: 403 }
      )
    }

    // Check if vehicle exists and belongs to user
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: resolvedParams.id },
      include: {
        carOwner: {
          select: {
            userId: true
          }
        },
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS']
            }
          }
        }
      }
    })

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    if (vehicle.carOwner.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check if vehicle has active bookings
    if (vehicle.bookings.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete vehicle with active bookings. Please cancel or complete pending bookings first.' },
        { status: 400 }
      )
    }

    // Check if this is the user's only vehicle
    const carOwnerVehicleCount = await prisma.vehicle.count({
      where: { carOwnerId: vehicle.carOwnerId }
    })

    if (carOwnerVehicleCount <= 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your only vehicle. Please add another vehicle first.' },
        { status: 400 }
      )
    }

    // Delete vehicle
    await prisma.vehicle.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Vehicle deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}