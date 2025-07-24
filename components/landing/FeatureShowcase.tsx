'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, 
  MapPin, 
  CreditCard, 
  Star, 
  Shield, 
  Smartphone,
  BarChart3,
  Users,
  Clock
} from 'lucide-react'

export function FeatureShowcase() {
  const carOwnerFeatures = [
    {
      icon: MapPin,
      title: 'Find Nearby Services',
      description: 'Discover trusted car wash services in your area with real-time availability'
    },
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule your car wash at your convenience with our simple booking system'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with multiple payment options'
    },
    {
      icon: Star,
      title: 'Rate & Review',
      description: 'Share your experience and help others find the best services'
    }
  ]

  const shopOwnerFeatures = [
    {
      icon: BarChart3,
      title: 'Business Analytics',
      description: 'Track your revenue, customer growth, and service performance'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Build and maintain relationships with your customer base'
    },
    {
      icon: Clock,
      title: 'Schedule Management',
      description: 'Efficiently manage your bookings and optimize your workflow'
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Manage your business on-the-go with our responsive platform'
    }
  ]

  const platformFeatures = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All shop owners are verified and background-checked for your safety'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help with any issues'
    }
  ]

  return (
    <section id="features" className="py-20 px-4" data-role-selector>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're looking to get your car washed or grow your car wash business, 
            we provide all the tools you need for success
          </p>
        </div>

        {/* Car Owner Features */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12 text-blue-400">
            For Car Owners
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {carOwnerFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Shop Owner Features */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12 text-purple-400">
            For Shop Owners
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopOwnerFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Features */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-12 text-green-400">
            Platform Benefits
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {platformFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-3xl font-bold mb-4 text-white">
              Ready to Get Started?
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Join thousands of satisfied customers and business owners
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Start as Car Owner
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Start as Shop Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}