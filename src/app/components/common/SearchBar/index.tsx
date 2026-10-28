'use client'
import { TextField } from '@/app/components/form'
import React, { useState } from 'react'
import { PropertyCard } from '../PropertyCard'
import { SingleProperty } from '../../properties/SingleProperty'
import { Button } from '@/app/components/common/Button'
import { Typography, Container } from '@/app/components/common'
import { baseURL } from '@/app/base/utils/axiosInstance'

interface FilterOptions {
  minPrice?: number
  maxPrice?: number
  category?: string
  location?: string
}

interface Property {
  _id: string
  title: string
  price: number
  location: { address: string }
  seller: { name: string; email: string }
  category: { name: string }
  status: string
}

interface PropertySearchProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  setSearchTriggered: (triggered: boolean) => void
}

const PropertySearch: React.FC<PropertySearchProps> = ({
  searchTerm,
  setSearchTerm,
  setSearchTriggered,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({})
  const [properties, setProperties] = useState<Property[]>([]) // Store fetched properties
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = ['House', 'Apartment', 'Condo', 'Villa', 'Townhouse']
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco']

  const handleSearch = async () => {
    setSearchTriggered(true)
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        search: searchTerm,
        ...Object.fromEntries(
          Object.entries(filters)
            .filter(([_, value]) => value !== undefined && value !== '')
            .map(([key, value]) => [key, String(value)])
        ),
      })

      const response = await fetch(`${baseURL}api/properties/search?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        setProperties(data.properties) // Store fetched properties in state
      } else {
        setError('No properties found')
        setProperties([])
      }
    } catch (error) {
      setError('Error fetching properties')
      console.error('Error searching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId)
    setIsModalOpen(true)
  }

  return (
    <Container className="py-6 mt-4">
      <div className="w-full mx-auto p-6 bg-card rounded-lg border border-border">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <TextField
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
          >
            🔍 Search
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Property Type Filter */}
          <select
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="p-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Property Type</option>
            {categories.map((type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="p-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Location</option>
            {locations.map((location) => (
              <option key={location} value={location.toLowerCase()}>
                {location}
              </option>
            ))}
          </select>

          {/* Price Range Filter */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
              className="p-2 border border-input rounded-lg w-1/2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="number"
              placeholder="Max Price"
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
              className="p-2 border border-input rounded-lg w-1/2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="mt-6">
          {loading && <Typography variant="bodyRegular" className="text-primary">Loading properties...</Typography>}
          {error && <Typography variant="bodyRegular" className="text-destructive">{error}</Typography>}
          {!loading && !error && properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {properties.map((property) => (
                <div key={property._id} className="">
                  {property.status === 'approved' ? (
                    <>
                      <PropertyCard
                        key={property._id}
                        property={property}
                        onClick={() => handlePropertyClick(property._id)}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
              {/* Single Property Modal */}
              {selectedPropertyId && (
                <SingleProperty
                  propertyId={selectedPropertyId}
                  isOpen={isModalOpen}
                  setIsOpen={setIsModalOpen}
                />
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </Container>
  )
}

export default PropertySearch
