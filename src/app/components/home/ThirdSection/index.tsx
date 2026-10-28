'use client'

import React from 'react'
import Link from 'next/link'
import { Award, FileCheck2, LockKeyhole, ArrowRight } from 'lucide-react'
import { Container, Typography, PropertyGridSkeleton } from '@/app/components/common'
import { useGetPropertyQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import { PropertyCard } from '../../common/PropertyCard'
import { useRouter } from 'next/navigation'

export const ThirdSection: React.FC = () => {
  const router = useRouter()
  const { data: properties, isLoading } = useGetPropertyQuery()

  // Select top 3 approved flagship estates with fallback to curated architectural icons
  const rawFeatured = properties
    ?.filter((p) => p.status === 'approved' || !p.status)
    .slice(0, 3)

  const defaultFeatured = [
    {
      _id: 'flagship-1',
      title: 'The Bel-Air Promontory Estate',
      price: 42500000,
      type: 'Modernist Villa',
      category: 'Villa',
      lotSize: '14,200',
      status: 'approved' as const,
      propertyStatus: 'Live & Approved',
      images: ['/images/villa-modernist.jpg'],
      location: { type: 'Point' as const, coordinates: [-118.4468, 34.0837] as [number, number] },
    },
    {
      _id: 'flagship-2',
      title: 'Central Park Crown Sky Penthouse',
      price: 68000000,
      type: 'Sky Penthouse',
      category: 'Penthouse',
      lotSize: '11,800',
      status: 'approved' as const,
      propertyStatus: 'Live & Approved',
      images: ['/images/sky-penthouse.jpg'],
      location: { type: 'Point' as const, coordinates: [-73.9772, 40.7654] as [number, number] },
    },
    {
      _id: 'flagship-3',
      title: "Cap d'Antibes Waterfront Villa",
      price: 54000000,
      type: 'Waterfront Haven',
      category: 'Waterfront',
      lotSize: '16,500',
      status: 'approved' as const,
      propertyStatus: 'Live & Approved',
      images: ['/images/waterfront-haven.jpg'],
      location: { type: 'Point' as const, coordinates: [7.1243, 43.5528] as [number, number] },
    },
  ]

  const featuredProperties = rawFeatured && rawFeatured.length > 0 ? rawFeatured : defaultFeatured

  return (
    <section className="py-20 bg-background border-t border-border">
      <Container>
        {/* Quality Standards Section */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <div className="mb-3 inline-flex items-center gap-2">
            <Typography
              as="span"
              variant="extraSmallBold"
              className="text-xs font-semibold uppercase tracking-widest text-accent"
            >
              Why Choose Luxus &bull; Quality Standards
            </Typography>
          </div>
          <Typography
            as="h2"
            variant="h2"
            className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-6"
          >
            Carefully Selected Luxury Properties
          </Typography>
          <Typography
            as="p"
            variant="bodyRegular"
            className="text-base sm:text-lg text-body leading-relaxed"
          >
            Every property listed on Luxus is thoroughly verified for ownership, quality, and location to ensure a smooth and trusted buying experience.
          </Typography>
        </div>

        {/* Three Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 rounded-sm bg-card border border-border shadow-sm">
            <div className="h-12 w-12 rounded-sm bg-muted flex items-center justify-center mb-6 text-foreground">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <Typography as="h3" variant="h3" className="text-xl font-bold text-foreground mb-3">
              Exceptional Architecture
            </Typography>
            <Typography as="p" variant="bodyRegular" className="text-sm text-body leading-relaxed">
              Homes designed by top architects and designers, built with high-quality materials and craftsmanship.
            </Typography>
          </div>

          <div className="p-8 rounded-sm bg-card border border-border shadow-sm">
            <div className="h-12 w-12 rounded-sm bg-muted flex items-center justify-center mb-6 text-foreground">
              <FileCheck2 className="h-6 w-6 text-accent" />
            </div>
            <Typography as="h3" variant="h3" className="text-xl font-bold text-foreground mb-3">
              Verified Ownership &amp; Documents
            </Typography>
            <Typography as="p" variant="bodyRegular" className="text-sm text-body leading-relaxed">
              Every property has its ownership records and title deeds verified before it is listed on our platform.
            </Typography>
          </div>

          <div className="p-8 rounded-sm bg-card border border-border shadow-sm">
            <div className="h-12 w-12 rounded-sm bg-muted flex items-center justify-center mb-6 text-foreground">
              <LockKeyhole className="h-6 w-6 text-accent" />
            </div>
            <Typography as="h3" variant="h3" className="text-xl font-bold text-foreground mb-3">
              Secure Transactions
            </Typography>
            <Typography as="p" variant="bodyRegular" className="text-sm text-body leading-relaxed">
              Direct messaging between buyers and sellers with private, secure payment processes for peace of mind.
            </Typography>
          </div>
        </div>

        {/* Featured Properties Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-border gap-4">
          <div>
            <Typography
              as="span"
              variant="extraSmallBold"
              className="text-xs font-semibold uppercase tracking-widest text-accent block mb-1"
            >
              Featured Properties
            </Typography>
            <Typography as="h2" variant="h2" className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Featured Luxury Homes
            </Typography>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors group"
          >
            <Typography as="span" variant="smallBold" className="group-hover:text-accent transition-colors">
              Browse All Properties
            </Typography>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Estates Grid with Skeleton loading */}
        {isLoading ? (
          <PropertyGridSkeleton count={3} />
        ) : featuredProperties && featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onClick={() => router.push(`/properties/${property._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-body">
            <Typography variant="bodyRegular">
              No flagship properties currently available.
            </Typography>
          </div>
        )}
      </Container>
    </section>
  )
}

