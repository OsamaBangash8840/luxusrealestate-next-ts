'use client'
import { TextField } from '@/app/components/form'
import React, { useState } from 'react'
import { PropertyCard } from '../PropertyCard'
import { SingleProperty } from '../../properties/SingleProperty'

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

      const response = await fetch(`http://localhost:8000/api/properties/search?${queryParams}`)
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
    <div className="w-full px-5 sm:px-20  mx-auto p-6 bg-white rounded-lg">
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
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            🔍 Search
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Property Type Filter */}
          <select
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="p-2 border rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
              className="p-2 border rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="mt-6">
          {loading && <p className="text-blue-500">Loading properties...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && properties.length > 0 && (
            <div className="grid grid-cols sm:grid-cols-[200px_200px] md:grid-cols-[300px_300px_300px_300px] 2xl:grid-cols-4 2xl:px-48 gap-6">
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
  )
}

export default PropertySearch
