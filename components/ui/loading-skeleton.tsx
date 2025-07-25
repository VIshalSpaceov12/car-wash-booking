import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'shimmer' | 'wave'
}

export function Skeleton({ className, variant = 'shimmer' }: SkeletonProps) {
  if (variant === 'shimmer') {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-md bg-gray-700/50",
          className
        )}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600/20 to-transparent"></div>
      </div>
    )
  }

  if (variant === 'wave') {
    return (
      <div
        className={cn(
          "animate-pulse rounded-md bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[wave_2s_ease-in-out_infinite]",
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-700",
        className
      )}
    />
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-gray-800 border-gray-700 rounded-lg p-6 space-y-4", className)}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  )
}

export function ShopCardSkeleton() {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden backdrop-blur-sm animate-pulse hover:border-gray-600/50 transition-all duration-300">
      {/* Image skeleton with gradient */}
      <div className="relative h-48 w-full bg-gradient-to-br from-gray-700/30 via-gray-600/20 to-gray-700/30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent animate-[shimmer_2s_infinite] -translate-x-full"></div>
        {/* Car icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-600/30 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-500/40 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Header section */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" variant="shimmer" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded-full" variant="shimmer" />
                  <Skeleton className="h-4 w-12" variant="shimmer" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4 rounded-full" variant="shimmer" />
                  <Skeleton className="h-4 w-16" variant="shimmer" />
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-5 w-16" variant="shimmer" />
              <Skeleton className="h-3 w-12" variant="shimmer" />
            </div>
          </div>
        </div>

        {/* Services section */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" variant="shimmer" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-6 w-20 rounded-full" variant="shimmer" />
            <Skeleton className="h-6 w-16 rounded-full" variant="shimmer" />
            <Skeleton className="h-6 w-18 rounded-full" variant="shimmer" />
          </div>
        </div>

        {/* Buttons section */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1 rounded-md" variant="shimmer" />
          <Skeleton className="h-10 flex-1 rounded-md" variant="shimmer" />
        </div>
      </div>
    </div>
  )
}

export function BookingCardSkeleton() {
  return (
    <div className="bg-gray-800 border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-5 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}