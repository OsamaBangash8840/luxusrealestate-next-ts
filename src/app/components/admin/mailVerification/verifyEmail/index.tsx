'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const VerifyEmail = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') // Extract token from URL
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  console.log('Token from URL:', token) // Debugging log

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.error('No token found in URL.')
        return
      }

      try {
        const response = await fetch('http://localhost:8000/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()
        console.log('Backend Response:', data) // Debugging log

        if (response.ok) {
          setStatus('success')
        } else {
          setStatus('error')
          setError(data.message || 'Verification failed')
        }
      } catch (err) {
        console.error('Fetch Error:', err)
        setStatus('error')
        setError('An error occurred during verification.')
      }
    }

    if (token) verifyToken()
  }, [token])

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
              Your email has been verified. You can now login to your account.
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
