'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, ArrowDown } from 'lucide-react'

export function HeroSection() {
  const scrollToRoleSelection = () => {
    const roleSection = document.querySelector('[data-role-selector]')
    roleSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40" />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-300 rounded-full animate-pulse opacity-30" />
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-300 rounded-full animate-ping opacity-50" />
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Main Heading */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Premium Car Wash Services</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Connect with
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Car Wash Experts
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform connecting <span className="text-blue-400 font-semibold">car owners</span> with 
            trusted <span className="text-purple-400 font-semibold">car wash professionals</span>. 
            Book services, manage your business, and experience premium care for your vehicle.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            onClick={scrollToRoleSelection}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-xl text-lg transition-all duration-300"
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
            <div className="text-gray-400">Registered Shops</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">10K+</div>
            <div className="text-gray-400">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">50K+</div>
            <div className="text-gray-400">Services Completed</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToRoleSelection}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowDown className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  )
}