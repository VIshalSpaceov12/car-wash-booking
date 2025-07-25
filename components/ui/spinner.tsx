import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'blue' | 'white' | 'gray' | 'purple'
  variant?: 'default' | 'gradient' | 'dots'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colorClasses = {
  blue: 'text-blue-400',
  white: 'text-white',
  gray: 'text-gray-400',
  purple: 'text-purple-400'
}

export function Spinner({ 
  size = 'md', 
  className,
  color = 'blue',
  variant = 'default'
}: SpinnerProps) {
  if (variant === 'gradient') {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-700/30"></div>
        {/* Gradient spinner */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-purple-400 animate-spin"></div>
        {/* Inner glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm"></div>
      </div>
    )
  }

  if (variant === 'dots') {
    const dotSize = size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2 h-2' : 'w-3 h-3'
    
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <div className={cn("rounded-full bg-blue-400 animate-bounce", dotSize)}></div>
        <div className={cn("rounded-full bg-purple-400 animate-bounce animation-delay-200", dotSize)}></div>
        <div className={cn("rounded-full bg-blue-400 animate-bounce animation-delay-400", dotSize)}></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <Loader2 
        className={cn(
          "animate-spin drop-shadow-lg",
          sizeClasses[size],
          colorClasses[color],
          className
        )} 
      />
      {/* Add a subtle glow effect */}
      <div className={cn(
        "absolute inset-0 animate-spin opacity-50 blur-sm",
        sizeClasses[size],
        colorClasses[color]
      )}>
        <Loader2 className="w-full h-full" />
      </div>
    </div>
  )
}