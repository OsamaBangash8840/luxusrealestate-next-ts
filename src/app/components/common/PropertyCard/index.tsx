'use client'

import React from 'react'
import { Cards } from '@/app/components/common/Card'
import { MImage, Typography } from '@/app/components/common'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { usePathname } from 'next/navigation'
import { formatShortAddress, getCategoryName, saleStatusLabel, capitalize } from '@/app/base/utils/property'

interface PropertyCardProps {
  property: any
  onClick: () => void
  address?: string
}

const FALLBACK_IMAGE = '/images/villa-modernist.jpg'

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, address }) => {
  const pathname = usePathname()
  const isAdminView = pathname?.startsWith('/admin')

  const primaryImage =
    property.images?.[0] && property.images[0].trim() !== '' && !property.images[0].includes('placeholder')
      ? property.images[0]
      : FALLBACK_IMAGE

  // Only real data. Missing values are hidden, never invented.
  const displayAddress = address || formatShortAddress(property.address)
  const categoryLabel = capitalize(getCategoryName(property.category) || property.type || '')
  const badgeLabel = isAdminView ? capitalize(property.status || '') : saleStatusLabel(property.propertyStatus)
  const specs = [property.size, property.lotSize ? `Lot ${property.lotSize}` : '', property.buildYear ? `Built ${property.buildYear}` : '']
    .filter(Boolean)

  return (
    <Cards
      className="relative cursor-pointer group flex flex-col overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md"
      onClick={onClick}
    >
      {badgeLabel && (
        <span
          className={`absolute top-4 left-4 z-10 rounded-sm px-2.5 py-1 text-xs font-semibold shadow-sm ${
            property.status === 'rejected' && isAdminView
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-card/95 text-foreground backdrop-blur-sm'
          }`}
        >
          {badgeLabel}
        </span>
      )}

      <div className="relative overflow-hidden aspect-[4/3] bg-muted">
        <MImage
          src={primaryImage}
          alt={property.title || 'Property photo'}
          w={1000}
          h={1000}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col p-4 flex-1">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <Typography variant="h3" className="font-bold text-foreground">
            {property.price ? `$${Number(property.price).toLocaleString()}` : 'Price on request'}
          </Typography>
          {categoryLabel && (
            <span className="text-xs font-semibold text-accent truncate">{categoryLabel}</span>
          )}
        </div>

        <Typography variant="bodyBold" className="mb-2 line-clamp-1 text-foreground font-medium">
          {property.title}
        </Typography>

        {specs.length > 0 && (
          <p className="mb-3 text-xs text-body line-clamp-1">{specs.join(' · ')}</p>
        )}

        {displayAddress && (
          <div className="mt-auto flex items-center gap-1.5 pt-2 border-t border-border">
            <FaMapMarkerAlt className="text-accent text-xs flex-shrink-0" />
            <span className="text-xs text-body line-clamp-1">{displayAddress}</span>
          </div>
        )}
      </div>
    </Cards>
  )
}
