import { MdOutlineBedroomParent } from 'react-icons/md'
import { FaBath } from 'react-icons/fa'
import { Modal } from '../../common/Modal'
import { Button } from '../../common/Button'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useGetSinglePropertyQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import { useEffect, useState } from 'react'
import { MImage, Typography } from '../../common'
import { usePathname } from 'next/navigation'
import { PropertyStatusButtons } from '../../admin/dashboard/properties/propertyStatusButtons'
import { ScheduleTour } from '../scheduleTour'
import { toast } from 'react-toastify'
import { ContactSeller } from '../../contact/contactSeller'
import { API_KEY } from '../PropertiesList'

// Dynamically import the SinglePropertyMap
const SinglePropertyMap = dynamic(() => import('../../common/Maps/SinglePropertyMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse" />,
})

interface SinglePropertyModalProps {
  propertyId: string | null
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const SingleProperty = ({
  propertyId,
  isOpen,
  setIsOpen,
}: SinglePropertyModalProps): React.ReactElement => {
  const {
    data: property,
    error,
    isLoading,
  } = useGetSinglePropertyQuery(propertyId || '', {
    skip: !propertyId,
  })

  const [address, setAddress] = useState<string>('')
  const [scheduleTourOpen, setScheduleTourOpen] = useState(false) // New state for tour modal
  const [contactOpen, SetContactOpen] = useState(false)

  const [mapKey, setMapKey] = useState(0) // Add key for map reset

  // Reset map when modal opens
  useEffect(() => {
    if (isOpen) {
      setMapKey((prev) => prev + 1)
    }
  }, [isOpen])

  useEffect(() => {
    if (property?.location?.coordinates) {
      const reverseGeocode = async (lat: number, lng: number) => {
        const url = `http://api.positionstack.com/v1/reverse?access_key=${API_KEY}&query=${lat},${lng}&output=json`

        try {
          const response = await axios.get(url)
          if (response.data?.data?.[0]) {
            setAddress(response.data.data[0].label)
          } else {
            setAddress('No address found')
          }
        } catch (error) {
          console.error('Error during reverse geocoding:', error)
          setAddress('Unable to geocode')
        }
      }

      const [lng, lat] = property.location.coordinates
      reverseGeocode(lat, lng)
    }

    return () => {
      setAddress('')
    }
  }, [property])

  const generateBedroomsAndBathrooms = () => {
    const bedrooms = Math.floor(Math.random() * 4) + 1
    const bathrooms = Math.floor(Math.random() * 3) + 1
    return { bedrooms, bathrooms }
  }

  const propertyBed = generateBedroomsAndBathrooms()

  const pathname = usePathname()

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="sm:max-w-[1300px] max-h-[94%] overflow-y-auto sm:p-5 pt-5"
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {(error as any).message}</div>
      ) : property ? (
        <div>
          <div className="grid lg:grid-cols-[60%_40%] gap-4 mt-4">
            <div>
              <MImage
                src={property.images?.[0]}
                alt={property.title}
                w={1000}
                h={600}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-2">
              {property.images?.slice(1, 5).map((image, index) => (
                <MImage
                  key={index}
                  src={image}
                  alt={`${property.title} - Image ${index + 2}`}
                  className="w-full h-[195px] object-cover rounded-lg"
                  w={500}
                  h={300}
                />
              ))}
            </div>
          </div>
          {property.status === 'rejected' ? (
            <Typography variant="h2" className="text-destructive text-center mx-auto">
              Rejection Reason : {property.rejectionReason}
            </Typography>
          ) : null}
          <div className="grid lg:grid-cols-[70%_30%] gap-8 mt-8">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-border pb-6">
                <div>
                  <Typography variant="h1" className="font-bold">
                    ${property.price?.toLocaleString()}
                  </Typography>
                  <p className="text-lg mt-1 text-muted-foreground">{address}</p>
                </div>
                <div className="flex items-center gap-4 sm:mr-4 bg-muted/50 p-4 rounded-xl">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1"><MdOutlineBedroomParent className="text-xl" /><Typography variant="h3">{propertyBed.bedrooms}</Typography></div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Beds</span>
                  </div>
                  <div className="h-8 w-[1px] bg-border"></div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1"><FaBath className="text-xl" /><Typography variant="h3">{propertyBed.bathrooms}</Typography></div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Baths</span>
                  </div>
                  <div className="h-8 w-[1px] bg-border"></div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1"><Typography variant="h3">{property.size || property.lotSize}</Typography></div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Sqft</span>
                  </div>
                </div>
              </div>
              
              <Typography variant="h3" className="mt-8 mb-4 font-semibold">
                What's special
              </Typography>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                {property.amenities?.map((amenity, index) => (
                  <div key={index} className="flex justify-center mt-2">
                    <p className="bg-muted px-5 text-[16px] font-semibold text-center rounded-lg py-2 w-full">
                      {amenity}
                    </p>
                  </div>
                ))}
                <div className="flex justify-center mt-2">
                  <p className="bg-muted text-[16px] text-center font-semibold px-5 rounded-lg py-2 w-full">
                    Lot Size: {property.lotSize}
                  </p>
                </div>
              </div>
              <Typography variant="h5" className="mt-3 mb-3">
                {property.description}
              </Typography>
              {property.location?.coordinates && (
                <div className="aspect-w-16 aspect-h-9 mb-4" style={{ height: '400px' }}>
                  <div key={mapKey}>
                    <SinglePropertyMap
                      lat={property.location.coordinates[1]}
                      lng={property.location.coordinates[0]}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-2 border border-border rounded-lg h-[450px] sticky top-[250px]">
              {property.status === 'pending' ? (
                pathname.startsWith('/admin/dashboard/properties') ? (
                  propertyId && <PropertyStatusButtons propertyId={propertyId} />
                ) : (
                  <>
                    <Button className="mx-auto w-[260px]">Get a Quote</Button>
                    <Button
                      className="mx-auto w-[260px]"
                      onClick={() => SetContactOpen(true)}
                    >
                      {' '}
                      Contact Seller
                    </Button>

                    <Button
                      className="mx-auto w-[260px]"
                      onClick={() => setScheduleTourOpen(true)}
                    >
                      Schedule a Tour
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button className="mx-auto w-[260px]">Get a Quote</Button>
                  <Button
                    className="mx-auto w-[260px]"
                    onClick={() => SetContactOpen(true)}
                  >
                    Contact Seller
                  </Button>
                  <Button
                    className="mx-auto w-[260px]"
                    onClick={() => setScheduleTourOpen(true)}
                  >
                    Schedule a Tour
                  </Button>
                </>
              )}
            </div>
          </div>
          {propertyId && (
            <ScheduleTour
              propertyId={propertyId}
              isOpen={scheduleTourOpen}
              setIsOpen={setScheduleTourOpen}
            />
          )}
          {propertyId && (
            <ContactSeller
              propertyId={propertyId}
              isOpen={contactOpen}
              setIsOpen={SetContactOpen}
            />
          )}
        </div>
      ) : (
        <div>No property details available.</div>
      )}
    </Modal>
  )
}
