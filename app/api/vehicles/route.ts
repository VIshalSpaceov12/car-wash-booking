import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/vehicles - Get user's vehicles
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
        { success: false, error: 'Only car owners can access vehicles' },
        { status: 403 }
      )
    }

    // Get car owner profile
    const carOwner = await prisma.carOwner.findUnique({
      where: { userId: session.user.id }
    })

    if (!carOwner) {
      return NextResponse.json(
        { success: false, error: 'Car owner profile not found' },
        { status: 404 }
      )
    }

    // Fetch vehicles
    const vehicles = await prisma.vehicle.findMany({
      where: { carOwnerId: carOwner.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      vehicles: vehicles.map(vehicle => ({
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        plateNumber: vehicle.plateNumber,
        vehicleType: vehicle.vehicleType,
        createdAt: vehicle.createdAt.toISOString(),
        updatedAt: vehicle.updatedAt.toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

// POST /api/vehicles - Add a new vehicle
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
        { success: false, error: 'Only car owners can add vehicles' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { make, model, year, color, plateNumber, vehicleType } = body

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

    // Get car owner profile
    const carOwner = await prisma.carOwner.findUnique({
      where: { userId: session.user.id }
    })

    if (!carOwner) {
      return NextResponse.json(
        { success: false, error: 'Car owner profile not found' },
        { status: 404 }
      )
    }

    // Check if plate number already exists (if provided)
    if (plateNumber) {
      const existingVehicle = await prisma.vehicle.findUnique({
        where: { plateNumber: plateNumber.trim().toUpperCase() }
      })

      if (existingVehicle) {
        return NextResponse.json(
          { success: false, error: 'A vehicle with this plate number already exists' },
          { status: 400 }
        )
      }
    }

    // Create new vehicle
    const newVehicle = await prisma.vehicle.create({
      data: {
        carOwnerId: carOwner.id,
        make: make.trim(),
        model: model.trim(),
        year: parseInt(year),
        color: color?.trim() || null,
        plateNumber: plateNumber?.trim().toUpperCase() || null,
        vehicleType: vehicleType
      }
    })

    return NextResponse.json({
      success: true,
      vehicle: {
        id: newVehicle.id,
        make: newVehicle.make,
        model: newVehicle.model,
        year: newVehicle.year,
        color: newVehicle.color,
        plateNumber: newVehicle.plateNumber,
        vehicleType: newVehicle.vehicleType,
        createdAt: newVehicle.createdAt.toISOString(),
        updatedAt: newVehicle.updatedAt.toISOString()
      },
      message: 'Vehicle added successfully'
    })

  } catch (error) {
    console.error('Error adding vehicle:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add vehicle' },
      { status: 500 }
    )
  }
}