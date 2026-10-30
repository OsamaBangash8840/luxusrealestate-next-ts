'use client'

import React, { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, LayoutGrid, Map as MapIcon, X } from 'lucide-react'
import { useGetPropertyQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import { useGetAllCategoriesQuery } from '@/app/lib/features/categories/categoryApiSlice'
import { PropertyCard, Container, Typography, PropertyGridSkeleton } from '@/app/components/common'
import dynamic from 'next/dynamic'


const SinglePropertyMap = dynamic(() => import('../../common/Maps/SinglePropertyMap'), {
  ssr: false,
})

export const API_KEY = '63286d2185d3b4e90728e054b59870df'

export const PropertiesList: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  const initialLocation = searchParams.get('location') || ''
  const initialPrice = searchParams.get('price') || ''

  const { data: rawProperties, isLoading, error } = useGetPropertyQuery()
  const { data: dbCategories } = useGetAllCategoriesQuery()

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const [searchTerm, setSearchTerm] = useState<string>(initialLocation)
  const [priceFilter, setPriceFilter] = useState<string>(initialPrice)
  const [bedsFilter, setBedsFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid')
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null)

  const defaultEstates = useMemo(() => [
    {
      _id: 'est-bel-air',
      title: 'The Bel-Air Promontory Estate',
      description: 'Modernist concrete and travertine architectural masterpiece with 180-degree Los Angeles basin to Pacific Ocean vistas.',
      price: 42500000,
      type: 'Modernist Villa',
      category: 'villa',
      lotSize: '14,200',
      status: 'approved' as const,
      propertyStatus: 'Live & Approved',
      images: ['/images/villa-modernist.jpg'],
      location: { type: 'Point' as const, coordinates: [-118.4468, 34.0837] as [number, number] },
    },
    {
      _id: 'est-central-park',
      title: 'Central Park Crown Sky Penthouse',
      description: 'Monumental duplex penthouse with double-height salon overlooking Central Park and Manhattan skyline.',
      price: 68000000,
      type: 'Sky Penthouse',
      category: 'penthouse',
      lotSize: '11,800',
      status: 'approved' as const,
      propertyStatus: 'Live & Approved',
      images: ['/images/sky-penthouse.jpg'],
      location: { type: 'Point' as const, coordinates: [-73.9772, 40.7654] as [number, number] },
    },
    {
      _id: 'est-cap-d-antibes',
      title: "Cap d'Antibes Waterfront Sanctuary",
      description: 'Ultra-rare French Riviera contemporary peninsula estate with private yacht deep-water berth and heated infinity edge pool.',
      price: 54000000,
      type: 'Waterfront Haven',
      category: 'waterfront',
      lotSize: '16,500',
      status: 'approved' as const,
      propertyStatus: 'Live & Approved',
      images: ['/images/waterfront-haven.jpg'],
      location: { type: 'Point' as const, coordinates: [7.1243, 43.5528] as [number, number] },
    },
    {
      _id: 'est-st-moritz',
      title: 'St. Moritz Alpine Architectural Icon',
      description: 'Museum-grade alpine glass and timber compound overlooking the Engadin Valley with subterranean wellness spa and helipad.',
      price: 38500000,
      type: 'Alpine Sanctuary',
      category: 'architectural',
      lotSize: '13,400',
      status: 'approved' as const,
      propertyStatus: 'Live & Approved',
      images: ['/images/alpine-sanctuary.jpg'],
      location: { type: 'Point' as const, coordinates: [9.8355, 46.4908] as [number, number] },
    },
  ], [])

  // Dynamic Categories from Backend
  const categories = useMemo(() => {
    const base = [{ id: 'all', label: 'All Estates', matchValue: 'all' }]
    const categoryList: any[] = Array.isArray(dbCategories)
      ? dbCategories
      : Array.isArray((dbCategories as any)?.data)
      ? (dbCategories as any).data
      : []

    if (categoryList && categoryList.length > 0) {
      const mapped = categoryList.map((c) => ({
        id: c._id || c.name.toLowerCase(),
        label: c.name,
        matchValue: c.name.toLowerCase(),
      }))
      return [...base, ...mapped]
    }
    return [
      ...base,
      { id: 'villa', label: 'Modernist Villas', matchValue: 'villa' },
      { id: 'penthouse', label: 'Sky Penthouses', matchValue: 'penthouse' },
      { id: 'waterfront', label: 'Waterfront', matchValue: 'waterfront' },
      { id: 'architectural', label: 'Architectural', matchValue: 'architectural' },
    ]
  }, [dbCategories])

  // Filter properties
  const filteredProperties = useMemo(() => {
    const propertyList: any[] = Array.isArray(rawProperties)
      ? rawProperties
      : Array.isArray((rawProperties as any)?.data)
      ? (rawProperties as any).data
      : Array.isArray((rawProperties as any)?.properties)
      ? (rawProperties as any).properties
      : []

    const listToFilter = (propertyList && propertyList.length > 0) ? propertyList : defaultEstates
    return listToFilter.filter((p) => {
      // Status filter: approved only
      if (p.status && p.status !== 'approved') return false

      // Category filter
      if (activeCategory !== 'all') {
        const catName = typeof p.category === 'object' && p.category !== null ? (p.category as any).name : String(p.category || '')
        const catId = typeof p.category === 'object' && p.category !== null ? (p.category as any)._id : ''
        const selectedCat = categories.find((c) => c.id === activeCategory)
        const matchTarget = selectedCat?.matchValue || selectedCat?.label?.toLowerCase() || activeCategory.toLowerCase()

        const matchesName = catName.toLowerCase().includes(matchTarget) || matchTarget.includes(catName.toLowerCase())
        const matchesId = Boolean(catId && (catId === activeCategory || catId === selectedCat?.id))
        if (!matchesName && !matchesId) return false
      }

      // Keyword / Location search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        const matchesTitle = p.title?.toLowerCase().includes(term)
        const matchesDesc = p.description?.toLowerCase().includes(term)
        if (!matchesTitle && !matchesDesc) return false
      }

      // Price Filter
      if (priceFilter) {
        const price = Number(p.price) || 0
        if (priceFilter === '5m-15m' && (price < 5000000 || price > 15000000)) return false
        if (priceFilter === '15m-30m' && (price < 15000000 || price > 30000000)) return false
        if (priceFilter === '30m+' && price < 30000000) return false
      }

      return true
    })
  }, [rawProperties, activeCategory, searchTerm, priceFilter, categories, defaultEstates])

  // Center coordinates for map
  const activeProperty = useMemo(() => {
    if (hoveredPropertyId) {
      return filteredProperties.find((p) => p._id === hoveredPropertyId)
    }
    return filteredProperties[0]
  }, [filteredProperties, hoveredPropertyId])

  const mapCoordinates = useMemo(() => {
    if (activeProperty?.location?.coordinates) {
      return {
        lng: activeProperty.location.coordinates[0],
        lat: activeProperty.location.coordinates[1],
      }
    }
    return { lng: -118.4468, lat: 34.0837 } // Default Bel-Air coords
  }, [activeProperty])

  return (
    <div className="min-h-screen bg-background py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <Typography as="span" variant="extraSmallBold" className="text-xs font-semibold uppercase tracking-widest text-accent block mb-1">
            Browse Properties
          </Typography>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Typography as="h1" variant="h1" className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Luxury Homes &amp; Estates
              </Typography>
              <Typography as="p" variant="smallRegular" className="text-sm text-body mt-1">
                {filteredProperties.length} verified properties available
              </Typography>
            </div>

            {/* View Mode Switcher */}
            <div className="inline-flex rounded-sm border border-border bg-card p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-body hover:text-foreground'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Grid View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                  viewMode === 'split'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-body hover:text-foreground'
                }`}
              >
                <MapIcon className="h-3.5 w-3.5" />
                <span>Map View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 p-4 rounded-sm bg-card border border-border shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-background text-body hover:text-foreground hover:border-accent/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Refinement Inputs */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search location or estate..."
                className="w-full rounded-sm border border-input bg-background pl-9 pr-8 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Price Dropdown */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="rounded-sm border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Any Price</option>
              <option value="5m-15m">$5M &ndash; $15M</option>
              <option value="15m-30m">$15M &ndash; $30M</option>
              <option value="30m+">$30M+ USD</option>
            </select>

            {/* Bedrooms Dropdown */}
            <select
              value={bedsFilter}
              onChange={(e) => setBedsFilter(e.target.value)}
              className="rounded-sm border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">Any Beds</option>
              <option value="3">3+ Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
              <option value="7">7+ Bedrooms</option>
            </select>
          </div>
        </div>

        {/* Content Area: Grid View or Split Map View */}
        {isLoading ? (
          <PropertyGridSkeleton count={8} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" />
        ) : filteredProperties.length === 0 ? (
          <div className="p-16 text-center bg-card border border-border rounded-sm">
            <SlidersHorizontal className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <Typography as="h3" variant="h4" className="text-lg font-bold text-foreground mb-1">
              No Properties Found
            </Typography>
            <Typography as="p" variant="smallRegular" className="text-xs text-body mb-4">
              Try adjusting your category, search keywords, or price filter.
            </Typography>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all')
                setSearchTerm('')
                setPriceFilter('')
                setBedsFilter('all')
              }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onClick={() => router.push(`/properties/${property._id}`)}
              />
            ))}
          </div>
        ) : (
          /* Split Map Explorer Mode */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Property List */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[820px] overflow-y-auto pr-2">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  onMouseEnter={() => setHoveredPropertyId(property._id)}
                  className={`transition-all ${
                    hoveredPropertyId === property._id ? 'ring-2 ring-accent' : ''
                  }`}
                >
                  <PropertyCard
                    property={property}
                    onClick={() => router.push(`/properties/${property._id}`)}
                  />
                </div>
              ))}
            </div>

            {/* Right Interactive Leaflet Map */}
            <div className="lg:col-span-5 sticky top-24 h-[600px] lg:h-[820px] rounded-sm border border-border overflow-hidden shadow-sm">
              <SinglePropertyMap
                lat={mapCoordinates.lat}
                lng={mapCoordinates.lng}
              />
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
