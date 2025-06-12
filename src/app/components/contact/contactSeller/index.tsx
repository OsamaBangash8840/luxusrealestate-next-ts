import { useGetSinglePropertyQuery } from '@/app/lib/features/properties/propertiesApiSlice'
import React from 'react'
import { Modal } from '../../common/Modal'
import { Button } from '../../common/Button'
import { toast } from 'react-toastify'

interface contactSellerProps {
  propertyId: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const ContactSeller: React.FC<contactSellerProps> = ({ propertyId, isOpen, setIsOpen }) => {
  const {
    data: property,
    error,
    isLoading,
  } = useGetSinglePropertyQuery(propertyId || '', {
    skip: !propertyId,
  })

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="sm:max-w-[600px] max-h-[94%] overflow-y-auto sm:p-2 pt-5"
      >
        <div className="flex gap-3 px-5 py-4">
          <Button
            className="mx-auto w-[260px] bg-white text-primary mb-4"
            onClick={() => {
              console.log('Phone Number:', property?.seller?.phone)
              if (property?.seller?.phone) {
                window.location.href = `tel:${property.seller.phone}`
              } else {
                toast.error('Phone number not available')
              }
            }}
          >
            Call Now {property?.seller.phone}
          </Button>
          <Button
            className="mx-auto w-[260px] bg-white text-primary mb-4"
            onClick={() => {
              if (property?.seller?.email) {
                window.open(`mailto:${property.seller.email}`, '_self')
              } else {
                alert('Email not available')
              }
            }}
          >
            <a href={`mailto:${property?.seller.email}`} className="btn">
              Send Mail {property?.seller.email}
            </a>
          </Button>
        </div>
      </Modal>
    </>
  )
}
