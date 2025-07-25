'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-state'
import { Mail, Lock, User, ArrowRight, Car, Store, Phone } from 'lucide-react'
import Image from 'next/image'

function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') as 'car-owner' | 'shop-owner' | null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: role === 'shop-owner' ? 'SHOP_OWNER' : 'CAR_OWNER'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      // Sign in the user after successful registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.ok) {
        if (role === 'shop-owner') {
          router.push('/onboarding/shop-owner')
        } else {
          router.push('/onboarding/car-owner')
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 lg:px-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {role === 'shop-owner' ? (
                <Store className="w-8 h-8 text-purple-400" />
              ) : (
                <Car className="w-8 h-8 text-blue-400" />
              )}
              <h1 className="text-2xl font-bold text-white">Car Wash Booking</h1>
            </div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Get Started
            </h2>
            <p className="text-gray-300">
              Create your {role === 'shop-owner' ? 'Shop Owner' : 'Car Owner'} account
            </p>
          </div>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-white">Sign Up</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Create your account to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link 
                    href={`/auth/signin${role ? `?role=${role}` : ''}`}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link 
              href="/"
              className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Car Image with Better Description */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Car Image Display */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Image Container */}
          <div className="relative w-4/5 h-4/5 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/30">
            {/* Background for Image */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-gray-900/70 to-black/90"></div>
            
            {/* Car Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/images/car.png"
                alt="Premium Car Wash Service"
                fill
                className="object-cover object-center blur-sm scale-110 opacity-90"
                priority
              />
            </div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {/* Top Section - Brand */}
            <div className="absolute top-8 left-8 right-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {role === 'shop-owner' ? 'Build Your Business' : 'Premium Car Wash'}
                </h3>
                <p className="text-blue-100 text-lg">
                  {role === 'shop-owner' 
                    ? 'Connect • Manage • Grow' 
                    : 'Professional • Reliable • Convenient'
                  }
                </p>
              </div>
            </div>
            
            {/* Middle Section - Features */}
            <div className="absolute left-8 right-8 top-1/2 transform -translate-y-1/2">
              <div className="space-y-4">
                {role === 'shop-owner' ? (
                  <>
                    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Store className="w-6 h-6 text-green-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Business Growth</h4>
                        <p className="text-gray-300 text-sm">Expand your customer base</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <User className="w-6 h-6 text-purple-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Easy Management</h4>
                        <p className="text-gray-300 text-sm">Simple booking & customer tools</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <ArrowRight className="w-6 h-6 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Increase Revenue</h4>
                        <p className="text-gray-300 text-sm">More bookings, more income</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Car className="w-6 h-6 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Premium Quality</h4>
                        <p className="text-gray-300 text-sm">Expert care for your vehicle</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Phone className="w-6 h-6 text-purple-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Easy Booking</h4>
                        <p className="text-gray-300 text-sm">Schedule service in seconds</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Mail className="w-6 h-6 text-green-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Stay Connected</h4>
                        <p className="text-gray-300 text-sm">Real-time updates & notifications</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Bottom Section - Quote */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <blockquote className="text-white text-xl font-medium italic mb-2">
                  {role === 'shop-owner' 
                    ? '"Transform your passion into a thriving business"'
                    : '"Experience the difference with professional car care"'
                  }
                </blockquote>
                <p className="text-gray-400 text-sm">
                  {role === 'shop-owner' 
                    ? 'Join our network of successful business owners'
                    : 'Join our community of satisfied customers'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Blur Elements */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-blue-300 rounded-full animate-pulse opacity-30"></div>

        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<LoadingState fullScreen message="Loading sign up..." />}>
      <SignUpForm />
    </Suspense>
  )
}