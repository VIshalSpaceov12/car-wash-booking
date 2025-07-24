import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  // Create test users
  const carOwner = await prisma.user.upsert({
    where: { email: 'carowner@test.com' },
    update: {},
    create: {
      email: 'carowner@test.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'CAR_OWNER',
      phone: '+1234567890'
    }
  })

  const shopOwner = await prisma.user.upsert({
    where: { email: 'shopowner@test.com' },
    update: {},
    create: {
      email: 'shopowner@test.com', 
      name: 'Sarah Wilson',
      password: hashedPassword,
      role: 'SHOP_OWNER',
      phone: '+1234567891'
    }
  })

  // Create CarOwner profile
  const carOwnerProfile = await prisma.carOwner.upsert({
    where: { userId: carOwner.id },
    update: {},
    create: {
      userId: carOwner.id,
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    }
  })

  // Create ShopOwner profile
  const shopOwnerProfile = await prisma.shopOwner.upsert({
    where: { userId: shopOwner.id },
    update: {},
    create: {
      userId: shopOwner.id,
      businessName: 'Premium Car Wash',
      description: 'Professional car washing services',
      address: '456 Business Ave',
      city: 'San Francisco', 
      state: 'CA',
      zipCode: '94107',
      phone: '+1234567891',
      isVerified: true
    }
  })

  // Delete existing services and create new ones
  await prisma.service.deleteMany({
    where: { shopOwnerId: shopOwnerProfile.id }
  })

  const createdServices = await prisma.service.createMany({
    data: [
      {
        shopOwnerId: shopOwnerProfile.id,
        name: 'Basic Wash',
        description: 'Exterior wash with soap and rinse',
        price: 199,
        duration: 30,
        category: 'Basic',
        isActive: true
      },
      {
        shopOwnerId: shopOwnerProfile.id,
        name: 'Premium Wash',
        description: 'Exterior wash, wax, and interior vacuum',
        price: 399,
        duration: 45,
        category: 'Premium',
        isActive: true
      },
      {
        shopOwnerId: shopOwnerProfile.id,
        name: 'Full Detail',
        description: 'Complete interior and exterior detailing',
        price: 699,
        duration: 90,
        category: 'Premium',
        isActive: true
      }
    ]
  })

  // Get the created services to reference in booking
  const services = await prisma.service.findMany({
    where: { shopOwnerId: shopOwnerProfile.id }
  })

  // Create a default vehicle for the car owner
  const existingVehicle = await prisma.vehicle.findFirst({
    where: { carOwnerId: carOwnerProfile.id }
  })

  let vehicle = existingVehicle
  if (!vehicle) {
    vehicle = await prisma.vehicle.create({
      data: {
        carOwnerId: carOwnerProfile.id,
        make: 'Honda',
        model: 'Civic',
        year: 2020,
        color: 'Silver',
        plateNumber: 'TEST123',
        vehicleType: 'car'
      }
    })
  }

  // Delete existing test bookings and create a new completed one
  await prisma.booking.deleteMany({
    where: { 
      carOwnerId: carOwnerProfile.id,
      notes: 'Test completed booking for review system'
    }
  })

  await prisma.booking.create({
    data: {
      carOwnerId: carOwnerProfile.id,
      shopOwnerId: shopOwnerProfile.id,
      serviceId: services[1].id, // Premium Wash
      vehicleId: vehicle.id,
      scheduledAt: new Date('2024-07-20T10:00:00Z'),
      completedAt: new Date('2024-07-20T10:45:00Z'),
      status: 'COMPLETED',
      totalAmount: 399,
      notes: 'Test completed booking for review system'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('Test users created:')
  console.log('- Car Owner: carowner@test.com / password123')
  console.log('- Shop Owner: shopowner@test.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })