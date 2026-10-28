import React from 'react'
import { cn } from '@/app/base/utils/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-sm bg-muted/70 animate-pulse',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite]',
        'after:bg-gradient-to-r after:from-transparent after:via-background/25 after:to-transparent',
        className
      )}
      {...props}
    />
  )
}

export const PropertyCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-sm border border-border bg-card shadow-sm',
        className
      )}
    >
      {/* 4:3 Aspect Image Skeleton with simulated badge */}
      <div className="relative aspect-[4/3] w-full bg-muted/60 overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        <Skeleton className="absolute top-4 left-4 h-6 w-28 rounded-md bg-muted" />
      </div>

      {/* Card Info Skeleton */}
      <div className="flex flex-1 flex-col p-4 space-y-3">
        {/* Price & Typology */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-36 rounded-sm" />
          <Skeleton className="h-4 w-20 rounded-sm" />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-3/4 rounded-sm" />

        {/* Specs: beds, baths, area */}
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="h-4 w-14 rounded-sm" />
          <Skeleton className="h-4 w-14 rounded-sm" />
          <Skeleton className="h-4 w-16 rounded-sm" />
        </div>

        {/* Location line */}
        <div className="mt-auto pt-3 border-t border-border/60 flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-3.5 w-1/2 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

export const PropertyGridSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 6,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
        className
      )}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <PropertyCardSkeleton key={idx} />
      ))}
    </div>
  )
}

export const PropertyDetailSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-8 animate-pulse', className)}>
      {/* Hero Gallery Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[480px]">
        <Skeleton className="lg:col-span-2 h-full rounded-sm" />
        <div className="hidden lg:grid grid-rows-2 gap-4 h-full">
          <Skeleton className="h-full rounded-sm" />
          <Skeleton className="h-full rounded-sm" />
        </div>
      </div>

      {/* Title & Price Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-sm" />
          <Skeleton className="h-10 w-96 rounded-sm" />
          <Skeleton className="h-4 w-48 rounded-sm" />
        </div>
        <Skeleton className="h-12 w-48 rounded-sm" />
      </div>

      {/* Details & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-32 w-full rounded-sm" />
          <Skeleton className="h-48 w-full rounded-sm" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-sm" />
        </div>
      </div>
    </div>
  )
}
