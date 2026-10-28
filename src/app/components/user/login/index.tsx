'use client'

import React, { useEffect, useState } from 'react'
import { routes } from '@/app/base/utils/constants'
import { useLoginMutation } from '../../../lib/features/auth/login/authApiSlice'
import { useAuth } from '@/app/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '../../common/Button'
import { Modal } from '../../common/Modal'
import { TextField } from '../../form'
import { Typography } from '../../common'
import { toast } from 'react-toastify'
import { GoogleLoginButton } from '../googleBtn'
import { axiosInstance } from '@/app/base/utils/axiosInstance'

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const LoginMain = (): React.ReactElement => {
  const [payload, setPayload] = useState({
    email: '',
    password: '',
  })
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isVerificationNeeded, setIsVerificationNeeded] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const pathname = usePathname() // Get current route

  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()
  const { isAuthenticated, login: authenticateUser } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false)
    }
  }, [isAuthenticated, isOpen])

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

      authenticateUser(response, (response as any)?.token || (response as any)?.data?.token)

      toast.success('Successfully logged in')
      setIsOpen(false)
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
      const response = await axiosInstance.post('/api/resend-verification', {
        email: loginEmail,
      })
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
      {pathname !== '/login' && (
        <Button onClick={() => setIsOpen(true)} disabled={isLoading}>
          Sign In
        </Button>
      )}

      <Modal className="max-w-[630px]" isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="flex w-full overflow-hidden rounded-lg">
          {/* Left Section */}
          <div className="w-1/2 bg-gradient-to-br from-primary/80 to-primary text-primary-foreground p-8 flex flex-col justify-center">
            <Typography variant="h3" className="text-primary-foreground mb-2">
              Luxus Real Estate
            </Typography>
            <Typography variant="extraSmallRegular" className="text-primary-foreground">
              Step into Luxury Living – Sign In with Luxus Real Estate Today!
            </Typography>
          </div>

          {/* Right Section */}
          <div className="w-[70%] bg-card p-8">
            {isVerificationNeeded ? (
              <div className="space-y-4">
                <Typography variant="h1" className="text-primary mb-6">
                  Email Verification Needed
                </Typography>
                <Typography variant="extraSmallRegular">
                  Please verify your email address to continue.
                </Typography>
                <Button
                  className="w-full"
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </Button>
              </div>
            ) : (
              <>
                <Typography variant="h1" className="text-primary mb-6">
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
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
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
                      <p className="text-destructive text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
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
