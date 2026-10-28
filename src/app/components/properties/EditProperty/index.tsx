'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  MapPin,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Maximize2,
  Calendar,
  Save,
} from 'lucide-react'
import {
  useGetSinglePropertyQuery,
  useUpdatePropertyMutation,
} from '@/app/lib/features/properties/propertiesApiSlice'
import { useGetAllCategoriesQuery } from '@/app/lib/features/categories/categoryApiSlice'
import { Container, Typography, Skeleton } from '@/app/components/common'
import { toast } from 'react-toastify'

const PROPERTY_TYPES = [
  'Modernist Villa',
  'Sky Penthouse',
  'Alpine Chalet',
  'Waterfront Estate',
  'Historic Manor',
  'Private Island Compound',
]

const AMENITY_OPTIONS = [
  'Infinity Edge Pool',
  'Private Helipad',
  'Sommelier Wine Cellar',
  'Subterranean Wellness Spa',
  '24/7 Security Guardhouse',
  'Private Yacht Slip',
  'Automotive Gallery (8+ Cars)',
  'Smart Automation System',
]

interface EditPropertyProps {
  propertyId: string
}

export const EditProperty: React.FC<EditPropertyProps> = ({ propertyId }) => {
  const router = useRouter()
  const { data: initialData, isLoading: isFetching } = useGetSinglePropertyQuery(propertyId)
  const { data: dbCategories = [] } = useGetAllCategoriesQuery()
  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [type, setType] = useState('Modernist Villa')
  const [category, setCategory] = useState('')
  const [address, setAddress] = useState('')
  const [size, setSize] = useState('')
  const [lotSize, setLotSize] = useState('')
  const [buildYear, setBuildYear] = useState<number | ''>(2024)
  const [amenities, setAmenities] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setPrice(initialData.price || '')
      setType(initialData.type || 'Modernist Villa')
      setCategory(typeof initialData.category === 'object' && initialData.category !== null ? (initialData.category as any).name : String(initialData.category || ''))
      setAddress(initialData.address || (initialData.location as any)?.address || '')
      setSize(initialData.size || '')
      setLotSize(initialData.lotSize || '')
      setBuildYear(initialData.buildYear || 2024)
      setAmenities(Array.isArray(initialData.amenities) ? initialData.amenities : [])
      setImageUrl(initialData.images?.[0] || '')
    }
  }, [initialData])

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !price || !category) {
      toast.error('Please complete all required fields.')
      return
    }

    try {
      await updateProperty({
        id: propertyId,
        payload: {
          title: title.trim(),
          description: description.trim(),
          price: Number(price),
          type,
          category,
          location: initialData?.location || { type: 'Point', coordinates: [-118.4468, 34.0837] },
          address: address.trim(),
          size: size.trim(),
          lotSize: lotSize.trim(),
          buildYear: Number(buildYear),
          amenities,
          images: imageUrl.trim() ? [imageUrl.trim()] : initialData?.images || ['/images/villa-modernist.jpg'],
        },
      }).unwrap()

      toast.success('Property updated successfully. Listing is in review.')
      router.push('/user/seller/properties')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update property.')
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background py-12">
        <Container className="max-w-3xl space-y-6">
          <Skeleton className="h-8 w-48 rounded-sm" />
          <Skeleton className="h-64 w-full rounded-sm" />
          <Skeleton className="h-64 w-full rounded-sm" />
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <Container className="max-w-3xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/user/seller/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:underline uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <Typography
              as="span"
              variant="extraSmallBold"
              className="text-xs uppercase tracking-widest text-accent"
            >
              Seller Dashboard
            </Typography>
          </div>
          <Typography as="h1" variant="h2" className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Edit Property Listing
          </Typography>
          <Typography as="p" variant="smallRegular" className="text-xs text-body mt-1">
            Updating an approved property will send it for review before changes go live.
          </Typography>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Core Specs */}
          <div className="p-6 rounded-sm bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Building2 className="h-4 w-4 text-accent" />
              <span>Core Specifications</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Estate Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Bel-Air Promontory Estate"
                className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Valuation ($ USD) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 42500000"
                className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Property Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Property Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                  required
                >
                  <option value="">Select Category</option>
                  {dbCategories.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Property Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the property, features, materials, and surroundings..."
                className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Card 2: Spatial Metrics & Location */}
          <div className="p-6 rounded-sm bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <MapPin className="h-4 w-4 text-accent" />
              <span>Location &amp; Spatial Metrics</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 10410 Bellagio Road, Bel-Air, CA 90077"
                className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Interior Size (sq ft)
                </label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g. 14,200"
                  className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Lot Size (Acres / sq ft)
                </label>
                <input
                  type="text"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                  placeholder="e.g. 2.4 Acres"
                  className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Build Year
                </label>
                <input
                  type="number"
                  value={buildYear}
                  onChange={(e) => setBuildYear(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 2024"
                  className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Amenities & Media */}
          <div className="p-6 rounded-sm bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Amenities &amp; Photography</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Curated Amenities
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AMENITY_OPTIONS.map((item) => {
                  const isChecked = amenities.includes(item)
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity(item)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-sm text-xs text-left border transition-all ${
                        isChecked
                          ? 'bg-accent/15 border-accent text-foreground font-semibold'
                          : 'bg-background border-border text-body hover:text-foreground'
                      }`}
                    >
                      <div
                        className={`h-3.5 w-3.5 rounded-sm border flex items-center justify-center ${
                          isChecked ? 'bg-accent border-accent text-background' : 'border-border'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                      <span>{item}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                Primary Hero Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="e.g. /images/villa-modernist.jpg or https://..."
                className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link
              href="/user/seller/properties"
              className="px-5 py-2.5 rounded-sm border border-border text-xs font-semibold text-body hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isUpdating ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </Container>
    </div>
  )
}
export default EditProperty
