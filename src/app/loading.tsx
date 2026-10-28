import React from 'react'
import { Container, Typography } from '@/app/components/common'
import { PropertyGridSkeleton } from '@/app/components/common/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-background py-16">
      <Container className="space-y-12">
        {/* Editorial Loading Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-card px-4 py-1.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            <Typography variant="extraSmallBold" className="uppercase tracking-widest text-accent font-mono">
              Loading Properties
            </Typography>
          </div>
          <Typography variant="h2" className="text-foreground font-extrabold tracking-tight">
            Finding Available Homes
          </Typography>
          <Typography variant="bodyRegular" className="text-body max-w-lg">
            Loading verified luxury properties and details...
          </Typography>
        </div>

        {/* Shimmering Estates Grid */}
        <PropertyGridSkeleton count={6} />
      </Container>
    </div>
  )
}
