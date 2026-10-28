'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Layers, SlidersHorizontal } from 'lucide-react'
import { useGetPropertiesByCategoryQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import { Container, Typography, PropertyCard, PropertyGridSkeleton } from '@/app/components/common'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const categoryName = decodeURIComponent(resolvedParams.category || '')

  const { data: properties = [], isLoading } = useGetPropertiesByCategoryQuery(categoryName)

  return (
    <div className="min-h-screen bg-background py-10">
      <Container>
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:underline uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Global Catalogue</span>
          </Link>
        </div>

        {/* Category Header */}
        <div className="mb-10 pb-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <Typography
              as="span"
              variant="extraSmallBold"
              className="text-xs uppercase tracking-widest text-accent"
            >
              Architectural Classification
            </Typography>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Typography as="h1" variant="h1" className="text-3xl sm:text-4xl font-extrabold text-foreground capitalize tracking-tight">
                {categoryName} Estates
              </Typography>
              <Typography as="p" variant="smallRegular" className="text-sm text-body mt-1">
                Verified sanctuaries and architectural residencies classified under {categoryName}.
              </Typography>
            </div>
            <Typography as="span" variant="extraSmallMedium" className="text-xs text-body font-mono">
              {properties.length} estates available
            </Typography>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <PropertyGridSkeleton count={6} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" />
        ) : properties.length === 0 ? (
          <div className="p-16 text-center bg-card border border-border rounded-sm max-w-xl mx-auto shadow-sm">
            <Layers className="h-10 w-10 text-body mx-auto mb-3 opacity-40" />
            <Typography as="h3" variant="h4" className="text-lg font-bold text-foreground mb-1">
              No Listings in &ldquo;{categoryName}&rdquo;
            </Typography>
            <Typography as="p" variant="smallRegular" className="text-xs text-body mb-5">
              There are currently no properties listed in this category. Explore our other available properties.
            </Typography>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Browse All Properties</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onClick={() => router.push(`/properties/${property._id}`)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
