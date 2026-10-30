'use client'

import React from 'react'
import { Cards } from '@/app/components/common/Card'
import { MImage, Typography } from '@/app/components/common'
import { TbBed } from 'react-icons/tb'
import { FaBath, FaMapMarkerAlt } from 'react-icons/fa'
import { usePathname } from 'next/navigation'

interface PropertyCardProps {
  property: any
  onClick: () => void
  address?: string
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, address }) => {
  const pathname = usePathname() // Get current route

  const generateBedroomsAndBathrooms = () => ({
    bedrooms: Math.floor(Math.random() * 4) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
  })

  const generateLotSize = () => Math.floor(Math.random() * 1000) + 1000

  const propertyBed = generateBedroomsAndBathrooms()
  const propertyLotSize = generateLotSize()

  const fallbackImages = [
    '/images/villa-modernist.jpg',
    '/images/sky-penthouse.jpg',
    '/images/waterfront-haven.jpg',
    '/images/alpine-sanctuary.jpg',
  ]
  const idChar = (property._id || '').charCodeAt((property._id || '').length - 1) || 0
  const fallbackImage = fallbackImages[idChar % fallbackImages.length]
  const primaryImage =
    property.images?.[0] && property.images[0].trim() !== '' && !property.images[0].includes('placeholder')
      ? property.images[0]
      : fallbackImage

  return (
    <Cards className="relative cursor-pointer group flex flex-col overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md" onClick={onClick}>
      {/* Property Status Badge */}
      <Typography
        variant="h5Light"
        className={`absolute top-4 left-4 z-10 rounded-md py-1 px-3 text-xs uppercase tracking-widest text-primary-foreground shadow-sm ${
          property.status === 'rejected' ? 'bg-destructive' : 'bg-primary'
        }`}
      >
        {pathname === '/admin' ? property.status : property.propertyStatus || (property.status === 'approved' ? 'Featured' : property.status || 'Active')}
      </Typography>

      {/* Image Gallery Container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-muted">
        <MImage
          src={primaryImage}
          alt={property.title || 'Luxury Property'}
          w={1000}
          h={1000}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Property Information Container */}
      <div className="flex flex-col p-4 flex-1">
        {/* Price & Category */}
        <div className="flex items-baseline justify-between mb-1">
          <Typography variant="h3" className="font-bold text-foreground">
            ${property.price?.toLocaleString()}
          </Typography>
          <Typography
            as="span"
            variant="extraSmallBold"
            className="font-mono text-accent uppercase tracking-wider font-bold text-[10px]"
          >
            {property.type || (typeof property.category === 'object' && property.category !== null ? property.category.name : property.category) || 'Property'}
          </Typography>
        </div>

        {/* Title */}
        <Typography variant="bodyBold" className="mb-2 line-clamp-1 text-foreground/90 font-medium">
          {property.title || 'Luxury Property'}
        </Typography>

        {/* Beds, Baths, Area (High Density Display) */}
        <div className="flex items-center gap-3 text-muted-foreground mb-3 text-xs">
          <div className="flex items-center gap-1 font-medium">
            <Typography as="span" variant="extraSmallBold" className="text-foreground">
              {propertyBed.bedrooms}
            </Typography>
            <Typography as="span" variant="extraSmallRegular">
              Beds
            </Typography>
          </div>
          <Typography as="span" variant="extraSmallRegular" className="text-muted-foreground">
            &bull;
          </Typography>
          <div className="flex items-center gap-1 font-medium">
            <Typography as="span" variant="extraSmallBold" className="text-foreground">
              {propertyBed.bathrooms}
            </Typography>
            <Typography as="span" variant="extraSmallRegular">
              Baths
            </Typography>
          </div>
          <Typography as="span" variant="extraSmallRegular" className="text-muted-foreground">
            &bull;
          </Typography>
          <div className="flex items-center gap-1 font-medium">
            <Typography as="span" variant="extraSmallBold" className="text-foreground">
              {property.lotSize ?? propertyLotSize}
            </Typography>
            <Typography as="span" variant="extraSmallRegular">
              sqft
            </Typography>
          </div>
        </div>

        {/* Location with Icon */}
        <div className="mt-auto flex items-center gap-1.5 pt-2 border-t border-border/60">
          <FaMapMarkerAlt className="text-accent text-xs flex-shrink-0" />
          <Typography variant="smallRegular" className="text-body line-clamp-1 text-xs">
            {address || property.locationName || property.address || (property.type === 'Sky Penthouse' ? 'Tribeca, New York, NY' : property.type === 'Waterfront Haven' ? "Cap d'Antibes, France" : property.type === 'Modernist Villa' ? 'Bel-Air, Los Angeles, CA' : 'St. Moritz, Switzerland')}
          </Typography>
        </div>
      </div>
    </Cards>
  )
}


