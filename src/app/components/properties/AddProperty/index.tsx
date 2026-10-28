'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-toastify'
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  ShieldCheck,
  Building2,
  MapPin,
  Maximize2,
  Sparkles,
  Info,
  Layers,
  Image as ImageIcon,
  Check,
} from 'lucide-react'
import { useAddPropertyMutation } from '@/app/lib/features/properties/propertiesApiSlice'
import { useGetAllCategoriesQuery } from '@/app/lib/features/categories/categoryApiSlice'
import { IPropertiesPayload } from '@/app/lib/features/properties/types'
import { Container } from '../../common/Container'
import { routes } from '@/app/base/utils/constants'

const STEPS = [
  { id: 1, title: 'Basic Information', subtitle: 'Title, property type & price' },
  { id: 2, title: 'Location & Address', subtitle: 'Street address & map coordinates' },
  { id: 3, title: 'Size & Amenities', subtitle: 'Living area, lot size & features' },
  { id: 4, title: 'Photos & Final Review', subtitle: 'Upload photos & submit for review' },
]

const PROPERTY_TYPES = [
  'Villa / Mansion',
  'Sky Penthouse',
  'Alpine Chalet',
  'Waterfront Estate',
  'Historic Manor',
  'Private Island Compound',
]

const CATEGORIES = [
  'Modern Architectural Estate',
  'Waterfront Luxury',
  'Metropolitan Sky Residence',
  'Historic Landmark Estate',
  'Private Alpine Sanctuary',
  'Equestrian Compound',
]

const AMENITY_OPTIONS = [
  'Infinity Edge Pool',
  'Private Helipad',
  'Sommelier Wine Cellar',
  'Subterranean Wellness Spa',
  '24/7 Security Guardhouse',
  'Private Yacht Slip',
  'Automotive Gallery (8+ Cars)',
  'Dolby Atmos Screening Room',
  'Smart Home Automation',
  'Geothermal Climate Control',
  'Private Tennis Court',
  'Staff Quarters & Service Wing',
]

export const AddProperty = (): React.ReactElement => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [addProperty, { isLoading: isSubmitting }] = useAddPropertyMutation()
  const { data: serverCategories = [] } = useGetAllCategoriesQuery()

  const categoryList =
    serverCategories.length > 0
      ? Array.from(new Set([...serverCategories.map((c) => c.name), ...CATEGORIES]))
      : CATEGORIES

  // Form State
  const [formData, setFormData] = useState<IPropertiesPayload>({
    title: '',
    description: '',
    price: 0,
    type: 'Villa / Mansion',
    category: 'Modern Architectural Estate',
    buildYear: new Date().getFullYear(),
    size: '',
    lotSize: '',
    location: {
      type: 'Point',
      coordinates: [-118.4468, 34.0837], // Default Los Angeles luxury coordinate
    },
    amenities: ['Infinity Edge Pool', '24/7 Security Guardhouse'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    ],
    reviews: [],
    status: 'pending',
    seller: {
      phone: '',
      email: '',
    },
    rejectionReason: '',
  })

  // Address helper state
  const [addressDetails, setAddressDetails] = useState({
    street: '10771 Bellagio Road',
    city: 'Los Angeles',
    state: 'CA',
    country: 'United States',
    zipCode: '90077',
  })

  const [newImageUrl, setNewImageUrl] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'price' || name === 'buildYear') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCoordinateChange = (index: 0 | 1, value: string) => {
    const num = Number(value)
    setFormData((prev) => {
      const updatedCoords: [number, number] = [...prev.location.coordinates]
      updatedCoords[index] = num
      return {
        ...prev,
        location: {
          ...prev.location,
          coordinates: updatedCoords,
        },
      }
    })
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity)
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      }
    })
  }

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()],
    }))
    setNewImageUrl('')
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }))
  }

  const validateStep = (stepNumber: number): boolean => {
    const stepErrors: { [key: string]: string } = {}

    if (stepNumber === 1) {
      if (!formData.title.trim()) stepErrors.title = 'Property title is required'
      if (!formData.description.trim()) stepErrors.description = 'Property description is required'
      if (!formData.price || formData.price <= 0) stepErrors.price = 'Valid price is required'
      if (!formData.buildYear || formData.buildYear < 1800)
        stepErrors.buildYear = 'Valid construction year required'
    } else if (stepNumber === 2) {
      if (!formData.location.coordinates[0] || !formData.location.coordinates[1]) {
        stepErrors.coordinates = 'Precise longitude and latitude are required'
      }
    } else if (stepNumber === 3) {
      if (!formData.size.trim()) stepErrors.size = 'Interior living footprint is required'
      if (!formData.lotSize.trim()) stepErrors.lotSize = 'Total lot area is required'
      if (formData.amenities.length === 0)
        stepErrors.amenities = 'Select at least one signature amenity'
    } else if (stepNumber === 4) {
      if (formData.images.length === 0)
        stepErrors.images = 'At least one verified high-resolution photograph is required'
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(4)) return

    try {
      const submissionPayload: Partial<IPropertiesPayload> = {
        ...formData,
        status: 'pending', // Submits into review queue
      }
      await addProperty(submissionPayload).unwrap()
      toast.success('Property successfully submitted for review')
      router.push('/user/seller/properties')
    } catch (err: any) {
      console.error('Property addition error:', err)
      toast.error(err?.data?.message || 'Failed to submit property. Please check the fields.')
    }
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs text-body">
          <Link href="/user/seller" className="hover:text-foreground transition-colors">
            Seller Dashboard
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/user/seller/properties" className="hover:text-foreground transition-colors">
            My Properties
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Add New Property</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-border gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Seller Dashboard &bull; List a Property
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Add a New Property
            </h1>
            <p className="text-xs text-body mt-1">
              Complete the 4 steps below to submit your property listing for review.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-body bg-card px-3 py-2 rounded-sm border border-border">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Listing Verification Active</span>
          </div>
        </div>

        {/* 4-Step Progressive Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id
            const isActive = currentStep === step.id

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (isCompleted || validateStep(currentStep)) {
                    setCurrentStep(step.id)
                  }
                }}
                className={`p-3 text-left rounded-sm border transition-all ${
                  isActive
                    ? 'bg-card border-accent shadow-sm'
                    : isCompleted
                    ? 'bg-muted/40 border-border opacity-90'
                    : 'bg-card/50 border-border/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isActive ? 'text-accent' : isCompleted ? 'text-success' : 'text-body'
                    }`}
                  >
                    0{step.id}
                  </span>
                  {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                </div>
                <p className="text-xs font-bold text-foreground truncate">{step.title}</p>
                <p className="text-[10px] text-body truncate mt-0.5">{step.subtitle}</p>
              </button>
            )
          })}
        </div>

        {/* Wizard Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Fields Container (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-card border border-border rounded-sm p-6 sm:p-8 shadow-sm">
              {/* STEP 1: Core Specifications & Pricing */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">
                      01. Basic Information &amp; Price
                    </h2>
                    <p className="text-xs text-body mt-0.5">
                      Enter the title, property type, and asking price of the property.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-2">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleTextChange}
                      placeholder="e.g. The Bel-Air Promontory Estate"
                      className="w-full px-3.5 py-2.5 rounded-sm bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent"
                    />
                    {errors.title && (
                      <p className="text-destructive text-xs mt-1.5">{errors.title}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-2">
                        Property Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleTextChange}
                        className="w-full px-3.5 py-2.5 rounded-sm bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent"
                      >
                        {PROPERTY_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleTextChange}
                        className="w-full px-3.5 py-2.5 rounded-sm bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent"
                      >
                        {categoryList.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-2">
                        Valuation / Asking Price (USD $) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-body text-sm font-semibold">
                          $
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price || ''}
                          onChange={handleTextChange}
                          placeholder="42,500,000"
                          className="w-full pl-8 pr-3.5 py-2.5 rounded-sm bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent font-mono"
                        />
                      </div>
                      {errors.price && (
                        <p className="text-destructive text-xs mt-1.5">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-2">
                        Year of Construction / Completion *
                      </label>
                      <input
                        type="number"
                        name="buildYear"
                        value={formData.buildYear || ''}
                        onChange={handleTextChange}
                        placeholder="2024"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent font-mono"
                      />
                      {errors.buildYear && (
                        <p className="text-destructive text-xs mt-1.5">{errors.buildYear}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-2">
                      Property Description *
                    </label>
                    <textarea
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleTextChange}
                      placeholder="Describe the property layout, key features, views, and unique amenities..."
                      className="w-full px-3.5 py-2.5 rounded-sm bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent"
                    />
                    {errors.description && (
                      <p className="text-destructive text-xs mt-1.5">{errors.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Location & Geographic GeoJSON */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">
                      02. Location & Map Coordinates
                    </h2>
                    <p className="text-xs text-body mt-0.5">
                      Enter the street address and GPS coordinates for property mapping.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-2">
                        Physical Street Address
                      </label>
                      <input
                        type="text"
                        value={addressDetails.street}
                        onChange={(e) =>
                          setAddressDetails({ ...addressDetails, street: e.target.value })
                        }
                        placeholder="10771 Bellagio Road"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-body mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={addressDetails.city}
                          onChange={(e) =>
                            setAddressDetails({ ...addressDetails, city: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-body mb-1">
                          State / Canton
                        </label>
                        <input
                          type="text"
                          value={addressDetails.state}
                          onChange={(e) =>
                            setAddressDetails({ ...addressDetails, state: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-body mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={addressDetails.zipCode}
                          onChange={(e) =>
                            setAddressDetails({ ...addressDetails, zipCode: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-body mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={addressDetails.country}
                          onChange={(e) =>
                            setAddressDetails({ ...addressDetails, country: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-sm bg-muted/40 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                        GeoJSON Point Matrix [ Longitude, Latitude ] *
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-body mb-1">
                          Longitude (X coordinate)
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.location.coordinates[0]}
                          onChange={(e) => handleCoordinateChange(0, e.target.value)}
                          className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-body mb-1">
                          Latitude (Y coordinate)
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.location.coordinates[1]}
                          onChange={(e) => handleCoordinateChange(1, e.target.value)}
                          className="w-full px-3 py-2 rounded-sm bg-background border border-border text-foreground text-xs font-mono"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-body mt-3">
                      Quick luxury presets:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {[
                        { name: 'Beverly Hills', coords: [-118.4468, 34.0837] },
                        { name: 'Manhattan 57th St', coords: [-73.9772, 40.7654] },
                        { name: 'Geneva Lakeside', coords: [6.1432, 46.2044] },
                        { name: 'Dubai Palm Jumeirah', coords: [55.1172, 25.1124] },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              location: {
                                ...prev.location,
                                coordinates: preset.coords as [number, number],
                              },
                            }))
                          }}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-sm bg-background border border-border hover:border-accent text-body hover:text-foreground transition-all"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Spatial Metrics & Amenities */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">
                      03. Spatial Metrics & Curated Amenities
                    </h2>
                    <p className="text-xs text-body mt-0.5">
                      Specify certified living square footage, land acreage, and verified bespoke amenities.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-2">
                        Interior Living Footprint *
                      </label>
                      <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleTextChange}
                        placeholder="e.g. 14,200 sq.ft"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent font-mono"
                      />
                      {errors.size && (
                        <p className="text-destructive text-xs mt-1.5">{errors.size}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-2">
                        Total Parcel / Lot Size *
                      </label>
                      <input
                        type="text"
                        name="lotSize"
                        value={formData.lotSize}
                        onChange={handleTextChange}
                        placeholder="e.g. 2.40 Acres / 104,544 sq.ft"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent font-mono"
                      />
                      {errors.lotSize && (
                        <p className="text-destructive text-xs mt-1.5">{errors.lotSize}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-heading uppercase tracking-wider">
                        Signature Curated Amenities *
                      </label>
                      <span className="text-[11px] text-body">
                        {formData.amenities.length} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {AMENITY_OPTIONS.map((amenity) => {
                        const isSelected = formData.amenities.includes(amenity)
                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => toggleAmenity(amenity)}
                            className={`flex items-center justify-between p-2.5 rounded-sm border text-xs text-left transition-all ${
                              isSelected
                                ? 'bg-accent/10 border-accent text-foreground font-semibold'
                                : 'bg-background border-border text-body hover:border-border/80'
                            }`}
                          >
                            <span>{amenity}</span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-accent" />}
                          </button>
                        )
                      })}
                    </div>
                    {errors.amenities && (
                      <p className="text-destructive text-xs mt-1.5">{errors.amenities}</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Media Gallery & Verification Gate */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">
                      04. Photos &amp; Final Review
                    </h2>
                    <p className="text-xs text-body mt-0.5">
                      Upload property photos and review your listing details before submitting.
                    </p>
                  </div>

                  {/* Image URL Input and List */}
                  <div>
                    <label className="block text-xs font-semibold text-heading uppercase tracking-wider mb-2">
                      Add 4K Photography Assets *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-3.5 py-2 rounded-sm bg-background border border-border text-foreground text-xs focus:outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Add URL
                      </button>
                    </div>
                    {errors.images && (
                      <p className="text-destructive text-xs mt-1.5">{errors.images}</p>
                    )}

                    {/* Previews Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-sm overflow-hidden border border-border group bg-muted"
                        >
                          <img
                            src={img}
                            alt={`Estate asset ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-sm bg-card/80 text-destructive text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-[2px] bg-foreground/80 text-background text-[9px] font-mono uppercase tracking-wider">
                              Primary Hero
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Review Checklist */}
                  <div className="p-4 rounded-sm bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-accent" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Submission Checklist
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        <span className="text-foreground">
                          Property ownership and address verified
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        <span className="text-foreground">
                          Accurate pricing and property category selected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        <span className="text-foreground">
                          Location pinpointed on map
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        <span className="text-foreground">
                          High-resolution photos added
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Control Buttons */}
              <div className="flex items-center justify-between pt-8 mt-6 border-t border-border">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm border border-border text-foreground hover:bg-muted text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] shadow-sm"
                  >
                    <span>Continue to Step 0{currentStep + 1}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-2.5 rounded-sm bg-accent text-accent-foreground hover:opacity-95 text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] shadow-sm disabled:opacity-50"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>{isSubmitting ? 'Submitting Property...' : 'Submit Property for Review'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Reactive Preview Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-border rounded-sm p-5 shadow-sm sticky top-8">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Live Catalogue Preview
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-accent/10 border border-accent/30 text-accent text-[10px] font-mono uppercase">
                  Pending Audit
                </span>
              </div>

              {/* Card Replica */}
              <div className="border border-border rounded-sm overflow-hidden bg-background">
                <div className="aspect-[16/10] relative bg-muted overflow-hidden">
                  {formData.images[0] ? (
                    <img
                      src={formData.images[0]}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-body">
                      <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                      <span className="text-xs">No media provided</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-[2px] bg-card/90 backdrop-blur-sm border border-border text-foreground text-[10px] font-mono uppercase tracking-wider">
                    {formData.type || 'Residence'}
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-[2px] bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {formData.category || 'Curated'}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-lg font-mono font-bold text-foreground">
                    ${formData.price ? formData.price.toLocaleString('en-US') : '0'} USD
                  </div>

                  <h3 className="text-sm font-bold text-foreground line-clamp-1">
                    {formData.title || 'Untitled Property'}
                  </h3>

                  <p className="text-xs text-body line-clamp-2">
                    {formData.description ||
                      'Property description will appear here once entered.'}
                  </p>

                  <div className="pt-3 mt-2 border-t border-border flex items-center justify-between text-[11px] text-body">
                    <span>{formData.size || '0 sq.ft'}</span>
                    <span>&bull;</span>
                    <span>{formData.lotSize || '0 Acres'}</span>
                    <span>&bull;</span>
                    <span>Built {formData.buildYear || '2024'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-sm bg-muted/40 border border-border text-[11px] text-body flex items-start gap-2">
                <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p>
                  All newly submitted properties are reviewed and verified before being published to the public catalog.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
