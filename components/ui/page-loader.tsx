import { Car, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageLoaderProps {
  message?: string
  className?: string
}

export function PageLoader({ 
  message = 'Loading...', 
  className 
}: PageLoaderProps) {
  return (
    <div className={cn(
      "fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center z-50 overflow-hidden",
      className
    )}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Moving gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000 animate-float"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl animate-pulse animation-delay-500"></div>
        
        {/* Floating sparkles */}
        <div className="absolute top-1/4 right-1/4 text-blue-400 animate-ping animation-delay-200">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-purple-400 animate-ping animation-delay-400">
          <Sparkles className="w-3 h-3" />
        </div>
        <div className="absolute top-1/3 left-1/4 text-blue-300 animate-ping animation-delay-1000">
          <Zap className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Logo Container */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-blue-400 border-r-purple-400 animate-spin"></div>
          
          {/* Inner container */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-full flex items-center justify-center border-2 border-gray-700/50 shadow-2xl backdrop-blur-sm">
            {/* Inner gradient background */}
            <div className="absolute inset-3 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full animate-pulse"></div>
            
            {/* Car icon */}
            <Car className="w-12 h-12 text-blue-400 relative z-10 animate-bounce" />
            
            {/* Corner sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-purple-400 animate-ping" />
            <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-blue-400 animate-ping animation-delay-500" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Car Wash Booking</h2>
          <p className="text-xl text-gray-300 animate-pulse">{message}</p>
          <p className="text-sm text-gray-400">Preparing the best car wash experience for you</p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce animation-delay-500"></div>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-[shimmer_2s_infinite] w-full transform -translate-x-full"></div>
        </div>
      </div>
    </div>
  )
}