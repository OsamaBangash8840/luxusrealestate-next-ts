'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useVerifyEmailMutation } from '@/app/lib/features/auth/verifyEmail/verifyEmailApiSlice'
import { toast } from 'react-toastify'

export const VerifyEmail = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') // Extract token from URL

  const [status, setStatus] = useState<'loading' | 'verifying' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  const [verifyEmail] = useVerifyEmailMutation()

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error')
        setError('Invalid or expired verification link.')
        return
      }

      setStatus('verifying')

      try {
        await verifyEmail({ token }).unwrap()
        setStatus('success')
        toast.success('Email Verified Successfully')
      } catch (err: any) {
        console.error('Verification Error:', err)
        setStatus('error')
        setError(err?.data?.message || 'An error occurred during verification.')
      }
    }

    verifyToken()
  }, [token, verifyEmail])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'verifying' && (
          <div>
            <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
            <h2 className="mt-4 text-xl font-semibold">Verifying your email...</h2>
            <p className="mt-2 text-gray-600">This will only take a moment.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-xl font-semibold text-green-900">
              Email verified successfully!
            </h2>
            <p className="mt-2 text-gray-600">
              Your email has been verified. You can now log in to your account.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold text-red-900">Verification failed</h2>
            <p className="mt-2 text-red-600">{error}</p>
            <Link
              href="/resend-email"
              className="mt-6 inline-block px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Resend Verification Email
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
