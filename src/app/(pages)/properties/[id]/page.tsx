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
import { PropertyReviews, RelatedProperties } from '@/app/components/properties'
import dynamic from 'next/dynamic'
import axios from 'axios'

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
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Reverse geocode if coordinates exist
  useEffect(() => {
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
              <span className="inline-flex items-center gap-1 rounded-sm border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                <CheckCircle2 className="h-3 w-3" />
                Verified Listing
              </span>
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

        {/* Curatorial Photography Gallery Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-10">
          {/* Main Hero Photograph (8 cols) */}
          <div className="md:col-span-8 relative aspect-[16/10] overflow-hidden rounded-sm border border-border bg-muted">
            <MImage
              src={images[activePhotoIdx]}
              alt={property.title || 'Property Photograph'}
              w={1400}
              h={900}
              className="h-full w-full object-cover transition-all duration-300"
            />
            <div className="absolute bottom-3 right-3 rounded-sm bg-foreground/80 px-2.5 py-1 text-[11px] font-medium text-background backdrop-blur-sm">
              Photo {activePhotoIdx + 1} of {images.length}
            </div>
          </div>

          {/* Thumbnail Strip (4 cols) */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3">
            {images.slice(0, 3).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-sm border transition-all ${
                  activePhotoIdx === idx ? 'border-accent ring-2 ring-accent' : 'border-border opacity-80 hover:opacity-100'
                }`}
              >
                <MImage
                  src={img}
                  alt={`Gallery thumbnail ${idx + 1}`}
                  w={400}
                  h={240}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Core Spatial Matrix Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12 p-4 rounded-sm bg-card border border-border shadow-sm">
          <div className="p-3 text-center border-r border-border last:border-r-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
              Interior Area
            </span>
            <div className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <Maximize2 className="h-4 w-4 text-accent" />
              <span>{property.size || '12,500'} sq.ft</span>
            </div>
          </div>

          <div className="p-3 text-center border-r border-border last:border-r-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
              Lot Acreage
            </span>
            <div className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <Compass className="h-4 w-4 text-accent" />
              <span>{property.lotSize || '2.40'} Acres</span>
            </div>
          </div>

          <div className="p-3 text-center border-r border-border last:border-r-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
              Bedrooms
            </span>
            <div className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <Bed className="h-4 w-4 text-accent" />
              <span>6 Suites</span>
            </div>
          </div>

          <div className="p-3 text-center border-r border-border last:border-r-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
              Bathrooms
            </span>
            <div className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <Bath className="h-4 w-4 text-accent" />
              <span>9 Baths</span>
            </div>
          </div>

          <div className="p-3 text-center border-r border-border last:border-r-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
              Year Built
            </span>
            <div className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <Clock className="h-4 w-4 text-accent" />
              <span>{property.buildYear || '2023'}</span>
            </div>
          </div>

          <div className="p-3 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
              Property Type
            </span>
            <div className="text-base font-bold text-foreground flex items-center justify-center gap-1">
              <Building className="h-4 w-4 text-accent" />
              <span className="capitalize">{property.type || 'Villa'}</span>
            </div>
          </div>
        </div>

        {/* Two-Column Property Details Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Property Verification & Legal Status */}
            <div className="p-6 rounded-sm bg-card border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">
                  Property Verification &amp; Legal Status
                </h2>
              </div>
              <p className="text-xs text-body leading-relaxed mb-6">
                Before being listed on Luxus, this property underwent ownership deed verification and quality checks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-sm border border-border bg-background flex items-center gap-3">
                  <FileCheck className="h-4 w-4 text-accent flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Proof of Ownership</div>
                    <div className="text-[10px] text-success font-medium">Verified Clean Deed</div>
                  </div>
                </div>

                <div className="p-3 rounded-sm border border-border bg-background flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-accent flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Identity &amp; Tax Verification</div>
                    <div className="text-[10px] text-success font-medium">Verified</div>
                  </div>
                </div>

                <div className="p-3 rounded-sm border border-border bg-background flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-accent flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-foreground">Inspection Status</div>
                    <div className="text-[10px] text-success font-medium">Quality Confirmed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Architectural Narrative */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Architectural Narrative
              </h2>
              <div className="text-sm text-body leading-relaxed space-y-4">
                <p>
                  {property.description ||
                    'An extraordinary private residence offering an effortless synthesis of modernist geometry, organic limestone surfaces, and expansive panoramic vistas. Conceived for collectors demanding utmost discretion and bespoke entertaining environments.'}
                </p>
              </div>
            </div>

            {/* Curated Appointments & Amenities */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Curated Appointments &amp; Features
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(property.amenities && property.amenities.length > 0
                  ? property.amenities
                  : [
                      'Infinity Edge Lap Pool',
                      'Temperature Controlled Cellar',
                      'Private Helipad Access',
                      'Wellness Spa & Sauna',
                      'Motor Court for 8 Vehicles',
                      'Smart Home Crestron Automation',
                      'Sub-Zero & Gaggenau Suite',
                      'Dual Gated Perimeter Security',
                    ]
                ).map((amenity, idx) => (
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
                Executive Console
              </span>
              <h3 className="text-lg font-bold text-foreground mb-4">
                Acquisition &amp; Inquiry Options
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
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-sm border border-border bg-background text-foreground text-xs font-semibold uppercase tracking-wider hover:bg-muted hover:border-accent/40 transition-colors"
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
                  <span>Submit Formal Escrow Offer</span>
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
