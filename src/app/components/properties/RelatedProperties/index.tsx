'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useGetRelatedPropertiesQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import { Typography, PropertyCard, PropertyCardSkeleton } from '@/app/components/common'

interface RelatedPropertiesProps {
  propertyId: string
}

export const RelatedProperties: React.FC<RelatedPropertiesProps> = ({ propertyId }) => {
  const router = useRouter()
  const { data: properties = [], isLoading } = useGetRelatedPropertiesQuery(propertyId)

  if (!isLoading && properties.length === 0) {
    return null
  }

  return (
    <section className="py-12 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <Typography
              as="span"
              variant="extraSmallBold"
              className="text-xs font-semibold uppercase tracking-widest text-accent"
            >
              Similar Homes
            </Typography>
          </div>
          <Typography as="h2" variant="h2" className="text-2xl font-bold text-foreground">
            Similar Properties
          </Typography>
          <Typography as="p" variant="smallRegular" className="text-xs text-body mt-1">
            Properties with similar style, size, or location.
          </Typography>
        </div>

        <Link
          href="/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline uppercase tracking-wider"
        >
          <Typography as="span" variant="extraSmallBold" className="text-accent uppercase tracking-wider">
            Browse All Properties
          </Typography>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 3).map((item) => (
            <PropertyCard
              key={item._id}
              property={item}
              onClick={() => router.push(`/properties/${item._id}`)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default RelatedProperties
