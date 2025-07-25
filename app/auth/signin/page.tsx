'use client'

import { useState, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-state'
import { Mail, Lock, ArrowRight, Car, Store, Sparkles, Shield, Clock } from 'lucide-react'
import Image from 'next/image'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') as 'car-owner' | 'shop-owner' | null

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        const session = await getSession()
        if (session?.user?.role === 'CAR_OWNER') {
          router.push('/dashboard/car-owner')
        } else if (session?.user?.role === 'SHOP_OWNER') {
          router.push('/dashboard/shop-owner')
        } else {
          router.push('/onboarding')
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
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
              Welcome Back
            </h2>
            <p className="text-gray-300">
              Sign in to your {role === 'shop-owner' ? 'Shop Owner' : 'Car Owner'} account
            </p>
          </div>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Email Sign In Form */}
              <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link 
                    href={`/auth/signup${role ? `?role=${role}` : ''}`}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Sign up
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
                  Premium Car Wash
                </h3>
                <p className="text-blue-100 text-lg">
                  Professional • Reliable • Convenient
                </p>
              </div>
            </div>
            
            {/* Middle Section - Features */}
            <div className="absolute left-8 right-8 top-1/2 transform -translate-y-1/2">
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Sparkles className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Premium Quality</h4>
                    <p className="text-gray-300 text-sm">Expert care for your vehicle</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Quick Service</h4>
                    <p className="text-gray-300 text-sm">Fast and efficient cleaning</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Trusted Service</h4>
                    <p className="text-gray-300 text-sm">Thousands of satisfied customers</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Section - Quote */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <blockquote className="text-white text-xl font-medium italic mb-2">
                  "Experience the difference with professional car care"
                </blockquote>
                <p className="text-gray-400 text-sm">Join our community of satisfied customers</p>
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

export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingState fullScreen message="Loading sign in..." />}>
      <SignInForm />
    </Suspense>
  )
}