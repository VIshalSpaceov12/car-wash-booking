import { Spinner } from "./spinner"
import { cn } from "@/lib/utils"
import { Car, Sparkles } from "lucide-react"

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
  fullScreen?: boolean
}

export function LoadingState({ 
  size = 'md', 
  message = 'Loading...', 
  className,
  fullScreen = false 
}: LoadingStateProps) {
  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-6",
      fullScreen ? "min-h-screen" : "py-12",
      className
    )}>
      {/* Animated Brand Icon */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        
        {/* Main container */}
        <div className="relative w-20 h-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-full flex items-center justify-center border border-gray-700/50 shadow-2xl">
          {/* Inner gradient background */}
          <div className="absolute inset-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full"></div>
          
          {/* Car icon */}
          <Car className="w-8 h-8 text-blue-400 relative z-10 animate-bounce" />
          
          {/* Floating sparkles */}
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-purple-400 animate-ping" />
          <Sparkles className="absolute -bottom-1 -left-1 w-3 h-3 text-blue-400 animate-ping animation-delay-500" />
        </div>
      </div>

      {/* Enhanced Spinner */}
      <div className="relative">
        <Spinner 
          size={size === 'sm' ? 'lg' : size === 'md' ? 'xl' : 'xl'} 
          variant="gradient"
          className="drop-shadow-lg"
        />
      </div>

      {/* Loading Message */}
      <div className="text-center space-y-2">
        <p className="text-white font-medium text-lg">{message}</p>
        <p className="text-gray-400 text-sm">Please wait while we prepare everything for you</p>
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black backdrop-blur-sm flex items-center justify-center z-50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-400/5 rounded-full blur-2xl animate-pulse animation-delay-500"></div>
        </div>
        <div className="relative z-10">
          {content}
        </div>
      </div>
    )
  }

  return content
}

export function InlineLoader({ 
  message = 'Loading...', 
  className 
}: { 
  message?: string
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Spinner size="sm" />
      <span className="text-gray-400 text-sm">{message}</span>
    </div>
  )
}

export function ButtonLoader({ 
  isLoading, 
  children,
  loadingText = 'Loading...'
}: {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {isLoading ? (
        <>
          <Spinner size="sm" variant="gradient" className="flex-shrink-0" />
          <span className="animate-pulse">{loadingText}</span>
        </>
      ) : (
        children
      )}
    </div>
  )
}