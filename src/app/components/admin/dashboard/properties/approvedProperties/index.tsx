'use client'
import { PropertyCard } from '@/app/components/common/PropertyCard'
import { SingleProperty } from '@/app/components/properties/SingleProperty'
import { useApprovedPropertiesQuery } from '@/app/lib/features/auth/admin/dashboard/propertyStatus/AllProperties/adminPropertiesApiSlice'
import axios from 'axios'
import { useEffect, useState } from 'react'

const API_KEY = '63286d2185d3b4e90728e054b59870df'

export const ApprovedProperties = (): React.ReactElement => {
  const { data, error, isLoading } = useApprovedPropertiesQuery()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addresses, setAddresses] = useState<{ [key: string]: string }>({})

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
  console.log('API Data:', data)
  if (error) return <div>Error: {(error as any).message}</div>

  return (
    <>
      <div className="grid grid-cols sm:grid-cols-[200px_200px] md:grid-cols-[320px_320px_320px] 2xl:grid-cols-4 2xl:px-48 px-5 sm:px-2 gap-3">
        {data?.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            address={addresses[property._id] || 'Loading address...'}
            onClick={() => handlePropertyClick(property._id)}
          />
        ))}
      </div>

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
