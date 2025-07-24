'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Save, Loader2, Car, Store, Settings, Sparkles, Shield, Crown, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CarOwnerProfile {
  id: string
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  userName: string | null
  userEmail: string
  userPhone: string | null
  totalBookings: number
  createdAt: string
  updatedAt: string
}

interface ShopOwnerProfile {
  id: string
  businessName: string
  description: string | null
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  isVerified: boolean
  userName: string | null
  userEmail: string
  totalBookings: number
  totalServices: number
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [carOwnerProfile, setCarOwnerProfile] = useState<CarOwnerProfile | null>(null)
  const [shopOwnerProfile, setShopOwnerProfile] = useState<ShopOwnerProfile | null>(null)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchProfile()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const endpoint = session?.user.role === 'CAR_OWNER' 
        ? '/api/profile/car-owner' 
        : '/api/profile/shop-owner'
        
      const response = await fetch(endpoint)
      const data = await response.json()

      if (data.success) {
        if (session?.user.role === 'CAR_OWNER') {
          setCarOwnerProfile(data.profile)
          setFormData({
            name: data.profile.userName || session.user.name || '',
            phone: data.profile.userPhone || '',
            address: data.profile.address || '',
            city: data.profile.city || '',
            state: data.profile.state || '',
            zipCode: data.profile.zipCode || ''
          })
        } else {
          setShopOwnerProfile(data.profile)
          setFormData({
            name: data.profile.userName || session.user.name || '',
            businessName: data.profile.businessName || '',
            description: data.profile.description || '',
            address: data.profile.address || '',
            city: data.profile.city || '',
            state: data.profile.state || '',
            zipCode: data.profile.zipCode || '',
            phone: data.profile.phone || ''
          })
        }
      } else {
        // If profile doesn't exist, initialize with session data
        if (session?.user.role === 'CAR_OWNER') {
          setFormData({
            name: session.user.name || '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: ''
          })
        } else {
          setFormData({
            name: session.user.name || '',
            businessName: '',
            description: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            phone: ''
          })
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Initialize with session data if API fails
      if (session?.user.role === 'CAR_OWNER') {
        setFormData({
          name: session.user.name || '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: ''
        })
      } else {
        setFormData({
          name: session.user.name || '',
          businessName: '',
          description: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          phone: ''
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const endpoint = session?.user.role === 'CAR_OWNER' 
        ? '/api/profile/car-owner' 
        : '/api/profile/shop-owner'

      console.log('Submitting profile update:', {
        endpoint,
        role: session?.user.role,
        formData
      })

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        alert('Profile updated successfully!')
        fetchProfile()
      } else {
        console.error('Update failed:', data)
        alert(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  if (status === 'loading' || loading) {
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
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Full Screen Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      
      {/* Car Image Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/car.png"
          alt="Profile Management Background"
          fill
          className="object-cover object-center blur-sm scale-110 opacity-20"
          priority
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/5 rounded-full blur-2xl"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-30"></div>
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-20"></div>
      <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-blue-300 rounded-full animate-pulse opacity-15"></div>

      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/5 to-transparent"></div>

      {/* Centered Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Profile Settings
            </h2>
            <p className="text-gray-300 text-lg">
              {isShopOwner ? 'Manage your shop profile and business details' : 'Manage your profile and preferences'}
            </p>
          </div>

          <Card className="bg-gray-900/5 backdrop-blur-2xl border-gray-700/20 shadow-2xl p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info Section */}
            <div className="space-y-4 bg-transparent border border-gray-600/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white border-b border-gray-600/30 pb-2 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session.user.email || ''}
                    className="bg-transparent border-gray-500/50 text-gray-300 placeholder-gray-400 rounded-lg"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Role-specific fields */}
            {isShopOwner ? (
              <div className="space-y-4 bg-transparent border border-gray-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white border-b border-gray-600/30 pb-2 mb-4">Business Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="businessName" className="text-gray-300">Business Name</Label>
                    <Input
                      id="businessName"
                      type="text"
                      value={formData.businessName || ''}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Input
                      id="description"
                      type="text"
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                      placeholder="Brief description of your business"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-gray-300">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-gray-300">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-gray-300">State</Label>
                    <Input
                      id="state"
                      type="text"
                      value={formData.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode" className="text-gray-300">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={formData.zipCode || ''}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 bg-transparent border border-gray-600/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white border-b border-gray-600/30 pb-2 mb-4">Address Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-gray-300">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                      placeholder="Your home address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-gray-300">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-gray-300">State</Label>
                    <Input
                      id="state"
                      type="text"
                      value={formData.state || ''}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode" className="text-gray-300">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={formData.zipCode || ''}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="bg-transparent border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all rounded-lg"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </div>
            )}


            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Card>

        <div className="text-center mt-8">
          <Link 
            href={isShopOwner ? '/dashboard/shop-owner' : '/dashboard/car-owner'}
            className="text-gray-300 hover:text-white transition-colors inline-flex items-center gap-2 bg-gray-800/20 rounded-lg px-4 py-2 border border-gray-600/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  </div>
  )
}