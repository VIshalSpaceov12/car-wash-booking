'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { Car, Store, LogOut, User, Bell, Settings } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isShopOwner = session.user.role === 'SHOP_OWNER'

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Role */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isShopOwner ? (
                <Store className="w-8 h-8 text-purple-400" />
              ) : (
                <Car className="w-8 h-8 text-blue-400" />
              )}
              <div>
                <h1 className="text-xl font-bold text-white">Car Wash Booking</h1>
                <p className="text-sm text-gray-400">
                  {isShopOwner ? 'Shop Owner Dashboard' : 'Car Owner Dashboard'}
                </p>
              </div>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Bell className="w-5 h-5" />
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{session.user.name}</p>
                <p className="text-xs text-gray-400">{session.user.email}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Sign Out */}
            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}