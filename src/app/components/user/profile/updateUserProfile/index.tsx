'use client'
import { routes, USER_DATA } from '@/app/base/utils/constants'
import { Button } from '@/app/components/common/Button'
import { TextField } from '@/app/components/form'
import { useUpdateProfileMutation } from '@/app/lib/features/profile/profileApiSlice'
import { IUpdateProfile } from '@/app/lib/features/profile/types'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

export const UpdateUserProfile = (): React.ReactElement => {
  const [errors, setErrors] = useState<{ username?: string; phone?: string; role?: string }>({})
  const [payload, setPayload] = useState<IUpdateProfile>({
    username: '',
    phone: '',
    role: 'buyer',
  })
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setPayload((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // const validateForm = (): boolean => {
  //   const newErrors: { username?: string; role?: string; phone?: string } = {}

  //   if (!payload.username?.trim()) newErrors.username = 'Name is required'
  //   if (!payload.role) newErrors.role = 'Role is required'
  //   if (!payload.phone) newErrors.phone = 'Phone No is required'

  //   setErrors(newErrors)
  //   return Object.keys(newErrors).length === 0
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    // if (!validateForm()) return

    const trimmedPayload = {
      username: payload.username.trim(),
      role: payload.role,
      phone: payload.phone,
    }

    try {
      console.log('Attempting registration with payload:', trimmedPayload)
      const response = await updateProfile(trimmedPayload).unwrap()

      if (response) {
        setCookie(USER_DATA, JSON.stringify(response), { maxAge: 60 * 60 * 24 })
        toast.success(`User ${trimmedPayload.username} has successfully updated profile`)
        // router.push(routes.emailSent)
      }
    } catch (error: any) {
      console.error('Update error:', error)

      if (error?.data?.message) toast.error(error.data.message)
      else if (error?.message) toast.error(error.message)
      else toast.error('Failed to update profile. Please try again.')

      if (error?.data?.fields) setErrors(error.data.fields)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[90%] bg-gray-50 px-4">
      {/* Profile Update Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-6 mt-5">
        {/* Header Section */}
        <h2 className="text-center text-2xl font-bold text-gray-800">Update Your Profile</h2>
        <p className="text-center text-gray-500">Make sure your details are up to date.</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 ">
          {/* Username */}
          <div>
            <TextField
              name="username"
              placeholder="Enter your name"
              value={payload.username}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <TextField
              name="phone"
              placeholder="Enter your Phone No"
              value={payload.phone}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              name="role"
              id="role"
              value={payload.role}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
    </div>
  )
}
