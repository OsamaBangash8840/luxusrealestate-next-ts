'use client'

import React, { useState } from 'react'
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from '@/app/lib/features/auth/verifyEmail/verifyEmailApiSlice'
import { Button } from '../../common/Button'
import { TextField } from '../../form'
import { Typography } from '../../common/Typography'
import { toast } from 'react-toastify'

interface EmailVerificationProps {
  email: string
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email }) => {
  const [token, setToken] = useState<string>('')
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation()
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation()

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value)
  }

  const handleVerify = async () => {
    if (!token) {
      toast.error('Token is required.')
      return
    }

    try {
      await verifyEmail({ token }).unwrap()
      toast.success('Email verified successfully.')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Verification failed. Please try again.')
    }
  }

  const handleResend = async () => {
    try {
      await resendVerification({ email }).unwrap()
      toast.success('Verification email sent successfully.')
    } catch (error: any) {
      const retryAfter = error?.data?.retryAfter
      toast.error(
        retryAfter
          ? `Please wait ${retryAfter} seconds before requesting another email.`
          : error?.data?.message || 'Failed to resend verification email.'
      )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-lg">
      <Typography variant="h1" className="text-blue-700 mb-4">
        Email Verification
      </Typography>
      <Typography className="mb-6 text-center">
        Please enter the verification token sent to <strong>{email}</strong>.
      </Typography>
      <div className="w-full max-w-sm space-y-4">
        <TextField
          name="token"
          placeholder="Enter verification token"
          value={token}
          onChange={handleTokenChange}
        />
        <Button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:opacity-90"
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Email'}
        </Button>
        <Button
          onClick={handleResend}
          className="w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300"
          disabled={isResending}
        >
          {isResending ? 'Resending...' : 'Resend Verification Email'}
        </Button>
      </div>
    </div>
  )
}

export default EmailVerification
