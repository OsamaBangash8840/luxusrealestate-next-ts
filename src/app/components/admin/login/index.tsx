'use client'

import React, { useState } from 'react'
import { routes, USER_DATA } from '@/app/base/utils/constants'
import { useLoginMutation } from '../../../lib/features/auth/login/authApiSlice'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { Button } from '../../common/Button'
import { Modal } from '../../common/Modal'
import { TextField } from '../../form'
import { Typography } from '../../common'
import { toast } from 'react-toastify'
import { GoogleLoginButton } from '../googleBtn'
import axios from 'axios'

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const LoginMain = (): React.ReactElement => {
  const [payload, setPayload] = useState({
    email: '',
    password: '',
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isVerificationNeeded, setIsVerificationNeeded] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')

  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()

  const clearErrors = (field?: keyof typeof payload) => {
    if (field) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    } else {
      setErrors({ email: '', password: '' })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setPayload((prev) => ({ ...prev, [name]: value.trim() }))
    clearErrors(name as keyof typeof payload)
  }

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {}
    let isValid = true

    if (!payload.email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!EMAIL_REGEX.test(payload.email)) {
      newErrors.email = 'Invalid email format'
      isValid = false
    }

    if (!payload.password) {
      newErrors.password = 'Password is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    clearErrors()

    if (!validateForm()) {
      return
    }

    try {
      console.log('Attempting login with payload:', payload)

      const response = await login({
        email: payload.email.trim(),
        password: payload.password,
      }).unwrap()

      console.log('Login successful:', response)

      setCookie(USER_DATA, JSON.stringify(response), { maxAge: 60 * 60 * 24 })

      toast.success('Successfully logged in')
      router.push(routes.home)
    } catch (error: any) {
      console.error('Login error:', error)

      if (error?.data?.needsVerification || error.needsVerification) {
        setLoginEmail(payload.email)
        setIsVerificationNeeded(true)
        toast.info('Please verify your email to continue')
        return
      }

      const errorMessage = error?.data?.message || error.message || 'An error occurred during login'

      setErrors({
        email: errorMessage,
        password: errorMessage,
      })

      toast.error(errorMessage)
    }
  }

  const handleResendVerification = async () => {
    try {
      // Call API to resend verification email (replace with your API function)
      const response = await axios.post('http://localhost:8000/api/resend-verification', {
        email: loginEmail,
      }) // Placeholder
      if (response) {
        toast.success('Verification email sent. Please check your inbox.')
      }
    } catch (error: any) {
      console.error('Resend verification error:', error)
      toast.error('Failed to resend verification email. Please try again.')
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={isLoading}>
        Sign In
      </Button>

      <Modal className="max-w-[630px]" isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="flex w-full overflow-hidden rounded-lg">
          {/* Left Section */}
          <div className="w-1/2 bg-gradient-to-br from-blue-600 to-primary text-white p-8 flex flex-col justify-center">
            <Typography variant="h3" className="text-white mb-2">
              Luxus Real Estate
            </Typography>
            <Typography variant="extraSmallRegular" className="text-white">
              Step into Luxury Living – Sign In with Luxus Real Estate Today!
            </Typography>
          </div>

          {/* Right Section */}
          <div className="w-[70%] bg-white p-8">
            {isVerificationNeeded ? (
              <div className="space-y-4">
                <Typography variant="h1" className="text-blue-700 mb-6">
                  Email Verification Needed
                </Typography>
                <Typography variant="extraSmallRegular">
                  Please verify your email address to continue.
                </Typography>
                <Button
                  className="bg-blue-600 hover:opacity-90 text-white font-bold py-2 rounded-lg"
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </Button>
              </div>
            ) : (
              <>
                <Typography variant="h1" className="text-blue-700 mb-6">
                  Sign In
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <TextField
                      name="email"
                      placeholder="Enter your email"
                      value={payload.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      autoComplete="email"
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
                      autoComplete="current-password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:opacity-90 text-white font-bold py-2 rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <GoogleLoginButton />
                </form>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
