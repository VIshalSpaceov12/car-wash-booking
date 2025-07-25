'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Car, Store, ArrowRight, CheckCircle } from 'lucide-react'

export function RoleSelector() {
  const handleRoleSelection = (role: 'car-owner' | 'shop-owner') => {
    // Navigate to sign up with role parameter
    window.location.href = `/auth/signup?role=${role}`
  }

  return (
    <section className="py-20 px-4" data-role-selector>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Choose Your Role
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select how you want to use our platform and get started with the right experience for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Car Owner Card */}
          <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Car className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Car/Bike Owner</CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Book professional wash services for your vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Find nearby car wash services</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Easy online booking system</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Secure payment processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Rate and review services</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Manage multiple vehicles</span>
                </div>
              </div>
              <Button 
                onClick={() => handleRoleSelection('car-owner')}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
              >
                Get Started as Car Owner
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Shop Owner Card */}
          <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Store className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Shop Owner</CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Manage your car wash business and grow your customer base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Complete business dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Manage bookings & schedules</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Create service packages</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Track revenue & analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Build customer relationships</span>
                </div>
              </div>
              <Button 
                onClick={() => handleRoleSelection('shop-owner')}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
              >
                Get Started as Shop Owner
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400">
            Not sure which option is right for you?{' '}
            <a href="#features" className="text-blue-400 hover:text-blue-300 underline">
              Learn more about our features
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}