'use client'

import React, { useState } from 'react'
import { routes } from '@/app/base/utils/constants'
import { useRegisterMutation } from '../../../lib/features/auth/register/registerApiSlice'
import { useAuth } from '@/app/hooks/useAuth'
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
  phone: string
}

export const RegisterMain = (): React.ReactElement => {
  const [payload, setPayload] = useState<IPayLoad>({
    username: '',
    email: '',
    password: '',
    role: 'buyer',
    phone: '',
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
    password?: string
    role?: string
    phone?: string
  }>({})
  const [isVerificationNeeded, setIsVerificationNeeded] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()
  const { login: authenticateUser } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setPayload((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: {
      username?: string
      email?: string
      password?: string
      role?: string
      phone?: string
    } = {}

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
    if (!payload.phone) {
      newErrors.phone = 'Phone No is required'
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
      phone: payload.phone,
    }

    try {
      console.log('Attempting registration with payload:', trimmedPayload)

      const response = await register(trimmedPayload).unwrap()

      console.log('Registration successful:', response)

      setRegisteredEmail(trimmedPayload.email)

      if (response) {
        setIsVerificationNeeded(true)
        authenticateUser(response, (response as any)?.token || (response as any)?.data?.token)
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

      <Modal className="max-w-[690px] h-[90%]" isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="flex w-full overflow-hidden rounded-lg">
          {/* Left Section */}
          <div className="w-1/2 bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-8 flex flex-col justify-center">
            <Typography variant="h3" className="text-primary-foreground mb-2">
              Luxus Real Estate
            </Typography>
            <Typography variant="extraSmallRegular" className="text-primary-foreground">
              Step into Luxury Living – Sign Up with Luxus Real Estate Today!
            </Typography>
          </div>

          {/* Right Section */}
          <div className="w-[70%] bg-card p-8">
            <Typography variant="h1" className="text-primary mb-6">
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
                {errors.username && <p className="text-destructive text-sm mt-1">{errors.username}</p>}
              </div>

              <div>
                <TextField
                  name="email"
                  placeholder="Enter your email"
                  value={payload.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <TextField
                  name="phone"
                  placeholder="Enter your Phone No"
                  value={payload.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
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
                {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-foreground">
                  Select Role
                </label>
                <select
                  name="role"
                  id="role"
                  value={payload.role}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
                {errors.role && <p className="text-destructive text-sm mt-1">{errors.role}</p>}
              </div>

              <Button
                type="submit"
                className="w-full"
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
