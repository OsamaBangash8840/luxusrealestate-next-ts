'use client'
import { useAddPropertyMutation } from '@/app/lib/features/properties/propertiesApiSlice'
import { IPropertiesPayload } from '@/app/lib/features/properties/types'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Typography } from '../../common'
import { TextAreaField, TextField } from '../../form'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { Button } from '../../common/Button'
import { routes } from '@/app/base/utils/constants'
import { getCookie } from 'cookies-next'

export const AddProperty = (): React.ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [payload, setPayload] = useState<IPropertiesPayload>({
    title: '',
    description: '',
    price: 0,
    location: { type: 'Point', coordinates: [0, 0] },
    type: '',
    buildYear: 0,
    size: '',
    lotSize: '',
    amenities: [],
    images: [],
    reviews: [],
    category: '',
  })
  const router = useRouter()
  const token = getCookie('token')

  useEffect(() => {
    if (!token) {
      router.push(routes.login)
    }
  }, [token, router])
  const [addProperty] = useAddPropertyMutation()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target

    if (name === 'coordinatesLng' || name === 'coordinatesLat') {
      setPayload({
        ...payload,
        location: {
          ...payload.location,
          coordinates: [
            name === 'coordinatesLng' ? +value : payload.location.coordinates[0],
            name === 'coordinatesLat' ? +value : payload.location.coordinates[1],
          ],
        },
      })
    } else if (['price', 'buildYear'].includes(name)) {
      setPayload({
        ...payload,
        [name]: +value,
      })
    } else {
      setPayload({
        ...payload,
        [name]: value,
      })
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!e.target.files) return

    const formData = new FormData()
    Array.from(e.target.files).forEach((file) => formData.append('files', file))

    try {
      const res = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      })
      const uploadedImages = await res.json()
      const uploadedImageUrls = uploadedImages.map((file: { imageUrl: string }) => file.imageUrl)
      setPayload({ ...payload, images: uploadedImageUrls })
      toast.success('Images uploaded successfully!')
    } catch (err) {
      console.error('Image upload failed:', err)
      toast.error('Image upload failed')
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!payload.title.trim()) newErrors.title = 'Title is required'
    if (!payload.description.trim()) newErrors.description = 'Description is required'
    if (payload.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (!payload.category) newErrors.category = 'Category is required'
    if (!payload.location.coordinates[0] || !payload.location.coordinates[1]) {
      newErrors.coordinates = 'Coordinates (Latitude and Longitude) are required'
    }
    if (payload.buildYear <= 0) newErrors.buildYear = 'Build year must be valid'
    if (!payload.size.trim()) newErrors.size = 'Size is required'
    if (!payload.lotSize.trim()) newErrors.lotSize = 'Lot size is required'
    if (!payload.amenities.length) newErrors.amenities = 'At least one amenity is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)

    console.log('Payload being sent:', payload) // Debug payload

    if (!validateForm()) {
      toast.error('Please correct the errors before submitting')
      setLoading(false)
      return
    }

    try {
      const response = await addProperty(payload).unwrap()
      toast.success(`${response.title} added successfully!`)
      setLoading(false)
      router.push('/')
    } catch (err: any) {
      setLoading(false)
      console.error('Error:', err.data || err.message)
      toast.error('Failed to add property. Please try again.')
    }
  }

  return (
    <div className="max-w-screen-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <Typography variant="h1" className=" text-center mb-2 p-2">
        Add Property Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <Typography variant="h5" className="text-black mb-2">
            Title
          </Typography>
          <TextField
            name="title"
            value={payload.title}
            onChange={handleChange}
            placeholder="Property Title"
            className="w-full p-3"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div className="mb-2">
          <Typography variant="h5" className="text-black mb-2">
            Description
          </Typography>
          <TextAreaField
            name="description"
            value={payload.description}
            onChange={handleChange}
            placeholder="Property Description"
            className="w-full p-3"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>
        <div className="mb-2">
          <Typography variant="h5" className="text-black mb-2">
            {' '}
            Select Category
          </Typography>
          <select
            name="category"
            value={payload.category}
            onChange={handleChange}
            className="w-full placeholder:text-secondary/30 bg-boxColorDark text-secondary h-[46px] shadow-lg xl:h-[56px] rounded-xl outline-none border border-boxOutline focus:border-primary bg-bgBox bg-opacity-80 text-sm sm:text-base p-2"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="villa">Villa</option>
            <option value="office">Office</option>
            <option value="shop">Shop</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        <div className="grid sm:grid-cols-2">
          <div className="mb-3">
            <Typography variant="h5" className="text-black mb-2">
              Longitude
            </Typography>
            <TextField
              name="coordinatesLng"
              type="number"
              value={payload.location.coordinates[0]}
              onChange={handleChange}
              placeholder="Longitude"
              className="w-full p-3"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          <div className="mb-2">
            <Typography variant="h5" className="text-black mb-2">
              Latitude
            </Typography>
            <TextField
              name="coordinatesLat"
              type="number"
              value={payload.location.coordinates[1]}
              onChange={handleChange}
              placeholder="Latitude"
              className="w-full p-3"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2">
          <div className="mb-3">
            <Typography variant="h5" className="text-black mb-2">
              Build Year
            </Typography>
            <TextField
              name="buildYear"
              type="number"
              value={payload.buildYear}
              onChange={handleChange}
              placeholder="Build Year"
              className="w-full p-3"
            />
            {errors.buildYear && <p className="text-red-500 text-sm">{errors.buildYear}</p>}
          </div>

          <div className="mb-3">
            <Typography variant="h5" className="text-black mb-2">
              Size (sqft)
            </Typography>
            <TextField
              name="size"
              value={payload.size}
              onChange={handleChange}
              placeholder="Size"
              className="w-full p-3"
            />
            {errors.size && <p className="text-red-500 text-sm">{errors.size}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2">
          <div className="mb-2">
            <Typography variant="h5" className="text-black mb-2">
              Lot Size (sqft)
            </Typography>
            <TextField
              name="lotSize"
              value={payload.lotSize}
              onChange={handleChange}
              placeholder="Lot Size"
              className="w-full p-3"
            />
            {errors.lotSize && <p className="text-red-500 text-sm">{errors.lotSize}</p>}
          </div>

          <div className="mb-2">
            <Typography variant="h5" className="text-black mb-2">
              Amenities
            </Typography>
            <TextField
              name="amenities"
              value={payload.amenities.join(', ')}
              onChange={(e) => setPayload({ ...payload, amenities: e.target.value.split(', ') })}
              placeholder="Comma-separated amenities"
              className="w-full p-3"
            />
            {errors.amenities && <p className="text-red-500 text-sm">{errors.amenities}</p>}
          </div>
        </div>

        <div className="mb-2">
          <label className="w-full h-[112px] bg-gradient-to-t from-newLinear/20 to-newLinear/30 flex flex-col items-center justify-center p-4 border border-dashed border-newLinear  shadow-newLinear rounded-lg cursor-pointer hover:border-gray-400 shadow-lg">
            <IoCloudUploadOutline className="text-2xl text-secondary" />
            <Typography className="mt-2">Upload Property images</Typography>
            <input type="file" multiple onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div className="mb-2">
          <Typography variant="h5" className="text-black mb-2">
            Property Price ($)
          </Typography>
          <TextField
            name="price"
            type="number"
            value={payload.price}
            onChange={handleChange}
            placeholder="Property Price"
            className="w-full p-3"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <Button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg">
          Add Property
        </Button>
      </form>
    </div>
  )
}
