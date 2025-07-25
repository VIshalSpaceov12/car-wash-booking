import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        scheduledAt: true,
        status: true,
        totalAmount: true,
        carOwner: {
          select: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        service: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    const debugBookings = bookings.map(booking => ({
      id: booking.id,
      customerName: booking.carOwner.user.name,
      serviceName: booking.service.name,
      scheduledAt_raw: booking.scheduledAt,
      scheduledAt_iso: booking.scheduledAt.toISOString(),
      scheduledAt_utc: booking.scheduledAt.toLocaleString('en-US', { 
        timeZone: 'UTC',
        dateStyle: 'short',
        timeStyle: 'short'
      }),
      scheduledAt_ist: booking.scheduledAt.toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        dateStyle: 'short',
        timeStyle: 'short'
      }),
      scheduledAt_ist_time_only: booking.scheduledAt.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      status: booking.status,
      totalAmount: booking.totalAmount
    }))

    return NextResponse.json({
      success: true,
      bookings: debugBookings,
      serverTime: new Date().toISOString(),
      serverTimeIST: new Date().toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata' 
      }),
      environment: process.env.NODE_ENV,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({ error: 'Failed to fetch debug data' }, { status: 500 })
  }
}