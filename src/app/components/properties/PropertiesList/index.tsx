'use client'

import { useGetPropertyQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { SingleProperty } from '@/app/components/properties/SingleProperty'
import { PropertyCard } from '@/app/components/common/PropertyCard'
import PropertySearch from '../../common/SearchBar'

const API_KEY = '63286d2185d3b4e90728e054b59870df'

export const PropertiesList = (): React.ReactElement => {
  const { data, error, isLoading } = useGetPropertyQuery()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addresses, setAddresses] = useState<{ [key: string]: string }>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTriggered, setSearchTriggered] = useState(false)

  useEffect(() => {
    if (!data || data.length === 0) return

    const fetchAddresses = async () => {
      try {
        const addressMap: { [key: string]: string } = {}

        await Promise.all(
          data.map(async (property) => {
            if (property.location?.coordinates) {
              const [lng, lat] = property.location.coordinates
              const url = `http://api.positionstack.com/v1/reverse?access_key=${API_KEY}&query=${lat},${lng}&output=json`

              const response = await axios.get(url)
              addressMap[property._id] = response.data?.data?.[0]?.label || 'Address not found'
            } else {
              addressMap[property._id] = 'No coordinates available'
            }
          })
        )

        setAddresses(addressMap)
      } catch (error) {
        console.error('Error during reverse geocoding:', error)
      }
    }

    fetchAddresses()
  }, [data])

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId)
    setIsModalOpen(true)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {(error as any).message}</div>

  return (
    <>
      <PropertySearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSearchTriggered={setSearchTriggered}
      />

      {!searchTriggered && ( // Only show this section when there's no search input
        <div className="grid  grid-cols sm:grid-cols-[200px_200px] md:grid-cols-[300px_300px_300px_300px] 2xl:grid-cols-4 2xl:px-48 px-5 sm:px-20 gap-3">
          {data?.map((property) => {
            if (property.status === 'pending' || property.status === 'rejected') {
              return <div key={property._id}></div>
            }
            return (
              <PropertyCard
                key={property._id}
                property={property}
                address={addresses[property._id] || 'Loading address...'}
                onClick={() => handlePropertyClick(property._id)}
              />
            )
          })}
        </div>
      )}

      {/* Single Property Modal */}
      {selectedPropertyId && (
        <SingleProperty
          propertyId={selectedPropertyId}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      )}
    </>
  )
}
