'use client'

import React, { useState } from 'react'
import { routes, USER_DATA } from '@/app/base/utils/constants'
import { useRegisterMutation } from '../../../lib/features/auth/register/registerApiSlice'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { Button } from '../../common/Button'
import { Modal } from '../../common/Modal'
import { TextField } from '../../form'
import { Typography } from '../../common'
import { toast } from 'react-toastify'
import { GoogleLoginButton } from '../googleBtn'

interface IPayLoad {
  username: string
  email: string
  password: string
  role: 'buyer' | 'seller'
}

export const RegisterMain = (): React.ReactElement => {
  const [payload, setPayload] = useState<IPayLoad>({
    username: '',
    email: '',
    password: '',
    role: 'buyer',
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
    password?: string
    role?: string
  }>({})
  const [isVerificationNeeded, setIsVerificationNeeded] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setPayload((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: { username?: string; email?: string; password?: string; role?: string } = {}

    if (!payload.username?.trim()) {
      newErrors.username = 'Name is required'
    }
    if (!payload.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(payload.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!payload.password?.trim()) {
      newErrors.password = 'Password is required'
    }
    if (!payload.role) {
      newErrors.role = 'Role is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) return

    const trimmedPayload = {
      username: payload.username.trim(),
      email: payload.email.trim(),
      password: payload.password,
      role: payload.role,
    }

    try {
      console.log('Attempting registration with payload:', trimmedPayload)

      const response = await register(trimmedPayload).unwrap()

      console.log('Registration successful:', response)

      setRegisteredEmail(trimmedPayload.email)

      if (response) {
        setIsVerificationNeeded(true)
        setCookie(USER_DATA, JSON.stringify(response), { maxAge: 60 * 60 * 24 })
        toast.success(`User ${trimmedPayload.username} has successfully registered`)
        router.push(routes.emailSent)
      }
    } catch (error: any) {
      console.error('Registration error:', error)

      if (error?.data?.message) {
        toast.error(error.data.message)
      } else if (error?.message) {
        toast.error(error.message)
      } else {
        toast.error('Failed to register. Please try again.')
      }

      if (error?.data?.fields) {
        setErrors(error.data.fields)
      }
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={isLoading}>
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </Button>

      <Modal className="max-w-[630px]" isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="flex w-full overflow-hidden rounded-lg">
          {/* Left Section */}
          <div className="w-1/2 bg-gradient-to-br from-blue-600 to-primary text-white p-8 flex flex-col justify-center">
            <Typography variant="h3" className="text-white mb-2">
              Luxus Real Estate
            </Typography>
            <Typography variant="extraSmallRegular" className="text-white">
              Step into Luxury Living – Sign Up with Luxus Real Estate Today!
            </Typography>
          </div>

          {/* Right Section */}
          <div className="w-[70%] bg-white p-8">
            <Typography variant="h1" className="text-blue-700 mb-6">
              Sign up
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <TextField
                  name="username"
                  placeholder="Enter your name"
                  value={payload.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>

              <div>
                <TextField
                  name="email"
                  placeholder="Enter your email"
                  value={payload.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <TextField
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={payload.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:opacity-90 text-white font-bold py-2 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </Button>

              <GoogleLoginButton />
            </form>
          </div>
        </div>
      </Modal>
    </>
  )
}
