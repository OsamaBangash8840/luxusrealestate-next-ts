'use client'
import { routes } from '@/app/base/utils/constants'
import { Button } from '@/app/components/common/Button'
import { TextField } from '@/app/components/form'
import { useUpdateProfileMutation } from '@/app/lib/features/profile/profileApiSlice'
import { IUpdateProfile } from '@/app/lib/features/profile/types'
import { useAuth } from '@/app/hooks/useAuth'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Typography } from '@/app/components/common'

export const UpdateUserProfile = (): React.ReactElement => {
  const [errors, setErrors] = useState<{ username?: string; phone?: string; role?: string }>({})
  const [payload, setPayload] = useState<IUpdateProfile>({
    username: '',
    phone: '',
    role: 'buyer',
  })
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const { updateProfile: syncUser } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setPayload((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const trimmedPayload = {
      username: payload.username.trim(),
      role: payload.role,
      phone: payload.phone,
    }

    try {
      console.log('Attempting registration with payload:', trimmedPayload)
      const response = await updateProfile(trimmedPayload).unwrap()

      if (response) {
        syncUser(response)
        toast.success(`User ${trimmedPayload.username} has successfully updated profile`)
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
    <div className="flex items-center justify-center min-h-[90%] bg-background px-4">
      {/* Profile Update Card */}
      <div className="bg-background border border-border p-8 w-full max-w-md space-y-8 mt-10">
        {/* Header Section */}
        <Typography variant="h2" className="text-center font-bold tracking-tight">Update Details</Typography>
        <Typography variant="bodyRegular" className="text-center text-muted-foreground">Keep your profile up to date.</Typography>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <TextField
              name="username"
              placeholder="Enter your name"
              value={payload.username}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full"
            />
            {errors.username && <p className="text-destructive text-sm mt-1">{errors.username}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <TextField
              name="phone"
              placeholder="Enter your Phone No"
              value={payload.phone}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full"
            />
            {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-xs uppercase tracking-wider font-medium text-foreground mb-2">
              Select Role
            </label>
            <select
              name="role"
              id="role"
              value={payload.role}
              onChange={handleChange}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
            {errors.role && <p className="text-destructive text-sm mt-1">{errors.role}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
    </div>
  )
}
