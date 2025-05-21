import React from 'react'
import { Cards } from '@/app/components/common/Card'
import { MImage, Typography } from '@/app/components/common'
import { MdOutlineBedroomParent } from 'react-icons/md'
import { FaBath } from 'react-icons/fa'
import { usePathname } from 'next/navigation'

interface PropertyCardProps {
  property: any
  onClick: () => void
  address?: string
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, address }) => {
  const pathname = usePathname() // Get current route

  const generateBedroomsAndBathrooms = () => ({
    bedrooms: Math.floor(Math.random() * 4) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
  })

  const generateLotSize = () => Math.floor(Math.random() * 1000) + 1000

  const propertyBed = generateBedroomsAndBathrooms()
  const propertyLotSize = generateLotSize()

  return (
    <Cards className="relative cursor-pointer" onClick={onClick}>
      <Typography
        variant="h5Light"
        className={`absolute top-3 left-2 bg-black bg-opacity-60 text-white py-1 px-2 rounded-2xl capitalize ${
          property.status === 'rejected' ? 'bg-red-800' : ''
        } ${property.status === 'approved' ? 'bg-primary' : ''}`}
      >
        {pathname === '/admin' ? property.status : property.propertyStatus}
      </Typography>

      <MImage
        src={property.images?.[0] || '/default-image.jpg'}
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
        <Typography variant="smallBold" className="mt-2">
          {address?.slice(0, 34) || 'Loading address...'}
        </Typography>
      </div>
    </Cards>
  )
}
