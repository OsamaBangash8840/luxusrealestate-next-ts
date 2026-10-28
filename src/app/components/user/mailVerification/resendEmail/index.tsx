'use client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/app/components/common/Button'
import { TextField } from '@/app/components/form'
import { Typography } from '@/app/components/common'
import { useResendVerificationMutation } from '@/app/lib/features/auth/verifyEmail/verifyEmailApiSlice'

export const ResendVerification = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  const [resendVerification] = useResendVerificationMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await resendVerification({ email }).unwrap()
      setStatus('success')
      setMessage('Verification email sent successfully!')
    } catch (err) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="bg-background min-h-[90%] flex items-center justify-center p-4">
      <div className="max-w-[480px] w-full border border-border p-8 mt-10">
        <Typography variant="h2" className="text-center mb-6">Resend Verification Email</Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email address
            </label>
            <div className="mt-1 relative">
              <TextField
                id="email"
                type="email"
                required
                className="block w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {status !== 'idle' && (
            <div className={`rounded-md p-4 ${status === 'success' ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <p className={`text-sm ${status === 'success' ? 'text-success' : 'text-destructive'}`}>
                {message}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Send Verification Email'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
