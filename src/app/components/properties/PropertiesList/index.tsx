'use client'

import { useGetPropertyQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import React, { useState } from 'react'
import { Cards } from '../../common/Card'
import { MImage, Typography } from '../../common'
import { MdOutlineBedroomParent } from 'react-icons/md'
import { FaBath } from 'react-icons/fa'
import { SingleProperty } from '../SingleProperty'
import SearchBar from '../../common/SearchBar'
import PropertiesMap from '../../common/Maps/PropertiesMap'

export const PropertiesList = (): React.ReactElement => {
  const { data, error, isLoading } = useGetPropertyQuery()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    minSize: null,
    maxSize: null,
    search: '',
  })
  const [searchText, setSearchText] = useState('')
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {(error as any).message}</div>

  const generateBedroomsAndBathrooms = () => {
    const bedrooms = Math.floor(Math.random() * 4) + 1 // Generates a number between 1 and 4
    const bathrooms = Math.floor(Math.random() * 3) + 1 // Generates a number between 1 and 3
    return { bedrooms, bathrooms }
  }

  const generateLotSize = () => {
    const lotSize = Math.floor(Math.random() * 1000) + 1000
    return lotSize
  }

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId)
    setIsModalOpen(true)
  }

  const handleSearch = (text: any, latitude: any, longitude: any) => {
    setSearchText(text)
    setLat(latitude)
    setLng(longitude)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <>
      <div className="flex h-screen">
        <SearchBar onSearch={handleSearch} />
        <PropertiesMap filters={filters} searchText={searchText} lat={lat} lng={lng} />
      </div>
      <div className="grid grid-cols sm:grid-cols-[200px_200px] md:grid-cols-[300px_300px_300px_300px] 2xl:grid-cols-4 2xl:px-48 px-5 sm:px-20 gap-3">
        {data?.map((property) => {
          const propertyLotSize = generateLotSize()
          const propertyBed = generateBedroomsAndBathrooms()
          return (
            <Cards
              key={property._id}
              className="relative cursor-pointer"
              onClick={() => handlePropertyClick(property._id)}
            >
              <Typography
                variant="h5Light"
                className="absolute top-3 left-2 bg-black bg-opacity-60 text-white py-1 px-2 rounded-2xl"
              >
                For Sale
              </Typography>
              <MImage
                src={property.images[0]}
                alt={property.title}
                w={1000}
                h={1000}
                className="w-full h-[200px] object-cover rounded-t-md"
              />
              <div className="p-4">
                <Typography variant="h4">${property.price}</Typography>
                <div className="flex gap-2">
                  <Typography variant="h5Light">{propertyBed.bedrooms}</Typography>
                  <MdOutlineBedroomParent className="mt-1 text-lg" />
                  <Typography className="font-thin text-2xl text-gray-500">|</Typography>
                  <Typography variant="h5Light">{propertyBed.bathrooms}</Typography>
                  <FaBath className="mt-1 text-lg" />
                  <Typography className="font-thin text-2xl text-gray-500">|</Typography>
                  <Typography variant="h5Light">{property.lotSize ?? propertyLotSize}</Typography>
                </div>
              </div>
            </Cards>
          )
        })}
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
