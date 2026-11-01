'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  BadgeDollarSign,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Share2,
  Heart,
  Clock,
  Sparkles,
  Building,
  Compass,
} from 'lucide-react'
import { useGetSinglePropertyQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import { Container, MImage, Typography, PropertyDetailSkeleton, ErrorHandler } from '@/app/components/common'
import { ScheduleTour } from '@/app/components/properties/scheduleTour'
import { ContactSeller } from '@/app/components/contact/contactSeller'
import { PropertyReviews, RelatedProperties, PropertyGallery } from '@/app/components/properties'
import dynamic from 'next/dynamic'
import axios from 'axios'
import { formatAddress, getCategoryName, saleStatusLabel, capitalize } from '@/app/base/utils/property'

const SinglePropertyMap = dynamic(
  () => import('@/app/components/common/Maps/SinglePropertyMap'),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-muted animate-pulse" />,
  }
)

export default function SinglePropertyPage() {
  const router = useRouter()
  const { id } = useParams()
  const propertyId = Array.isArray(id) ? id[0] : id || ''

  const { data: property, isLoading, error } = useGetSinglePropertyQuery(propertyId, {
    skip: !propertyId,
  })

  const [address, setAddress] = useState<string>('')
  const [scheduleTourOpen, setScheduleTourOpen] = useState(false)
  const [contactSellerOpen, setContactSellerOpen] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Set address from property data or reverse geocode if coordinates exist
  useEffect(() => {
    if (property?.address) {
      if (typeof property.address === 'string' && property.address.trim()) {
        setAddress(property.address)
        return
      }
      if (typeof property.address === 'object') {
        const addrObj = property.address as any
        const parts = [addrObj.street, addrObj.city, addrObj.state, addrObj.country].filter(Boolean)
        if (parts.length > 0) {
          setAddress(parts.join(', '))
          return
        }
      }
    }

    if (property?.location?.coordinates) {
      const [lng, lat] = property.location.coordinates
      const fetchAddress = async () => {
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          )
          if (res.data?.display_name) {
            setAddress(res.data.display_name.split(',').slice(0, 3).join(','))
          }
        } catch {
          setAddress('Prime Residential Enclave')
        }
      }
      fetchAddress()
    }
  }, [property])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <Container>
          <PropertyDetailSkeleton />
        </Container>
      </div>
    )
  }

  if (error || !property) {
    return (
      <ErrorHandler
        title="Property Unavailable"
        description="The requested property is either no longer available or does not exist."
        showHomeButton={true}
        showResetButton={false}
      />
    )
  }


  const fallbackImages = [
    '/images/villa-modernist.jpg',
    '/images/sky-penthouse.jpg',
    '/images/waterfront-haven.jpg',
    '/images/alpine-sanctuary.jpg',
  ]
  const images =
    property.images && property.images.length > 0 && property.images[0].trim() !== '' && !property.images[0].includes('placeholder')
      ? property.images
      : fallbackImages
  const refCode = propertyId.slice(-6).toUpperCase()

  return (
    <div className="min-h-screen bg-background py-8">
      <Container>
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-body font-medium">
            <Link href="/properties" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Properties</span>
            </Link>
            <span className="text-border">/</span>
            <span className="text-accent uppercase tracking-widest font-semibold">Ref #{refCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-sm border border-border transition-colors ${
                isBookmarked ? 'bg-accent/10 text-accent border-accent/40' : 'bg-card text-body hover:text-foreground'
              }`}
              title="Save Property"
            >
              <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-accent' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: property.title, url: window.location.href })
                }
              }}
              className="p-2 rounded-sm border border-border bg-card text-body hover:text-foreground transition-colors"
              title="Share Property"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Property Header Info */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Property Details &bull; Ref #{refCode}
              </span>
              {saleStatusLabel((property as any).propertyStatus) && (
                <span className="inline-flex items-center gap-1 rounded-sm border border-success/30 bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  {saleStatusLabel((property as any).propertyStatus)}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              {property.title || 'Luxury Home'}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-body font-medium mt-2">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span>{address || 'Prime Location'}</span>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs font-semibold uppercase tracking-widest text-body block mb-0.5">
              Price
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              ${Number(property.price || 0).toLocaleString()} <span className="text-sm font-normal text-body">USD</span>
            </div>
          </div>
        </div>

        {/* Curatorial Photography Gallery */}
        <div className="mb-10">
          <PropertyGallery images={images} title={property.title || 'Luxury Estate'} />
        </div>

        {/* Spatial Specifications Ribbon */}
        {(() => {
          const specItems = [
            property.size && {
              label: 'Interior Area',
              value: property.size.toLowerCase().includes('sq') ? property.size : `${property.size} sq ft`,
              icon: Maximize2,
            },
            property.lotSize && {
              label: 'Lot Size',
              value: property.lotSize,
              icon: Compass,
            },
            property.buildYear && {
              label: 'Year Built',
              value: String(property.buildYear),
              icon: Clock,
            },
            property.type && {
              label: 'Property Type',
              value: capitalize(property.type),
              icon: Building,
            },
            (property as any).propertyStatus && {
              label: 'Status',
              value: saleStatusLabel((property as any).propertyStatus),
              icon: CheckCircle2,
            },
          ].filter(Boolean) as { label: string; value: string; icon: any }[]

          if (specItems.length === 0) return null

          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-12 p-4 rounded-sm bg-card border border-border shadow-sm">
              {specItems.map((spec, idx) => {
                const Icon = spec.icon
                return (
                  <div key={idx} className="p-3 text-center border-r border-border last:border-r-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-body block mb-1">
                      {spec.label}
                    </span>
                    <div className="text-sm sm:text-base font-bold text-foreground flex items-center justify-center gap-1.5">
                      <Icon className="h-4 w-4 text-accent" />
                      <span>{spec.value}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Two-Column Property Details Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Property Overview & Narrative */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                About this Property
              </h2>
              <div className="text-sm text-body leading-relaxed space-y-4">
                <p>
                  {property.description ||
                    'Detailed property narrative and architectural documentation available upon inquiry.'}
                </p>
              </div>
            </div>

            {/* Curated Appointments & Features */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Features &amp; Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-sm border border-border bg-card text-xs font-medium text-foreground flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Geospatial Map Container */}
            {property.location?.coordinates && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Geospatial &amp; Enclave Coordinates
                </h2>
                <div className="h-80 rounded-sm border border-border overflow-hidden shadow-sm">
                  <SinglePropertyMap
                    lat={property.location.coordinates[1]}
                    lng={property.location.coordinates[0]}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Executive Determination Console (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            {/* Primary Action Card */}
            <div className="p-6 rounded-sm bg-card border border-border shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-1">
                Inquiry & Viewing
              </span>
              <h3 className="text-lg font-bold text-foreground mb-4">
                Contact &amp; Schedule
              </h3>

              <div className="space-y-3 mb-6">
                {/* Schedule Tour Trigger */}
                <button
                  type="button"
                  onClick={() => setScheduleTourOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Private Viewing</span>
                </button>

                {/* Direct Negotiation Trigger */}
                <button
                  type="button"
                  onClick={() => setContactSellerOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-sm border border-border bg-background text-foreground text-xs font-semibold uppercase tracking-wider hover:bg-muted hover:border-accent/40 transition-colors shadow-sm"
                >
                  <MessageSquare className="h-4 w-4 text-accent" />
                  <span>Initiate Principal Discussion</span>
                </button>

                {/* Binding Offer Trigger */}
                <button
                  type="button"
                  onClick={() => router.push(`/chat?propertyId=${propertyId}`)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-sm border border-accent/40 bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider hover:bg-accent/20 transition-colors"
                >
                  <BadgeDollarSign className="h-4 w-4 text-accent" />
                  <span>Make an Offer</span>
                </button>
              </div>

              {/* Acquisition Financial Summary */}
              <div className="pt-4 border-t border-border space-y-2 text-xs">
                <div className="flex justify-between text-body">
                  <span>Catalogue Price</span>
                  <span className="font-semibold text-foreground">
                    ${Number(property.price || 0).toLocaleString()} USD
                  </span>
                </div>
                <div className="flex justify-between text-body">
                  <span>Est. Escrow Deposit (10%)</span>
                  <span className="font-semibold text-foreground">
                    ${Math.round(Number(property.price || 0) * 0.1).toLocaleString()} USD
                  </span>
                </div>
                <div className="flex justify-between text-body">
                  <span>Estimated Closing</span>
                  <span className="font-semibold text-foreground">30 &ndash; 45 Days</span>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="p-6 rounded-sm bg-card border border-border shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-body block mb-2">
                Seller Information &bull; Verified
              </span>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                  {property.seller?.email ? property.seller.email[0].toUpperCase() : 'L'}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    {property.seller?.email ? property.seller.email.split('@')[0] : 'Property Agent'}
                  </div>
                  <div className="text-xs text-muted-foreground">Verified Seller</div>
                </div>
              </div>
              <p className="text-xs text-body leading-relaxed">
                Inquiries are sent directly and securely to the seller.
              </p>
            </div>
          </div>
        </div>

        {/* Curatorial Reviews & Member Appraisals */}
        <PropertyReviews propertyId={propertyId} />

        {/* Similar / Related Estates */}
        <RelatedProperties propertyId={propertyId} />

        {/* Schedule Tour Modal */}
        <ScheduleTour
          propertyId={propertyId}
          isOpen={scheduleTourOpen}
          setIsOpen={setScheduleTourOpen}
        />

        {/* Contact Seller Modal */}
        <ContactSeller
          propertyId={propertyId}
          isOpen={contactSellerOpen}
          setIsOpen={setContactSellerOpen}
        />
      </Container>
    </div>
  )
}
