'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Typography } from '@/app/components/common'
import { Button } from '@/app/components/common/Button'
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
    <div className="bg-background min-h-[90%] flex items-center justify-center p-4">
      <div className="max-w-[480px] w-full border border-border p-8 text-center mt-10">
        {status === 'verifying' && (
          <div>
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
            <Typography variant="h3" className="mt-4">Verifying your email...</Typography>
            <Typography variant="bodyRegular" className="mt-2 text-muted-foreground">This will only take a moment.</Typography>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <Typography variant="h3" className="mt-4 text-success">
              Email verified successfully!
            </Typography>
            <Typography variant="bodyRegular" className="mt-2 text-muted-foreground">
              Your email has been verified. You can now log in to your account.
            </Typography>
            <Button
              href="/login"
              className="mt-6"
            >
              Continue to Login
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <Typography variant="h3" className="mt-4 text-destructive">Verification failed</Typography>
            <Typography variant="bodyRegular" className="mt-2 text-destructive">{error}</Typography>
            <Button
              href="/resend-email"
              className="mt-6"
            >
              Resend Verification Email
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
