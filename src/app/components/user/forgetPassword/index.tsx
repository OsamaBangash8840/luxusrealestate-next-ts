'use client'
import { useState } from 'react'
import { Button } from '../../common/Button'
import { Loader2 } from 'lucide-react'
import { useForgetPasswordMutation } from '@/app/lib/features/auth/login/authApiSlice'
import { TextField } from '../../form'
import { Typography } from '../../common'
import { routes } from '@/app/base/utils/constants'
import Link from 'next/link'

export const ForgetPassword = (): React.ReactElement => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const [forgetPassword] = useForgetPasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await forgetPassword({ email }).unwrap()
      setStatus('success')
      setMessage('Verification email sent successfully!')
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="bg-background min-h-[90%] flex items-center justify-center p-4">
      <div className="max-w-[480px] w-full border border-border p-8 mt-10">
        <Typography variant="h2" className="text-center font-bold tracking-tight mb-6 mt-4">
          Forgot Password
        </Typography>
        <Typography variant="bodyRegular" className="text-center text-muted-foreground mb-8">
          Provide your email and we'll help you set up a new password.
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <TextField
                id="email"
                type="email"
                required
                className="block w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={'Email Address'}
              />
            </div>
          </div>

          {status !== 'idle' && (
            <div
              className={`border p-4 ${status === 'success' ? 'bg-success/5 border-success/20' : 'bg-destructive/5 border-destructive/20'}`}
            >
              <p
                className={`text-sm ${status === 'success' ? 'text-success' : 'text-destructive'}`}
              >
                {message}
              </p>
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link href={routes.home} className="text-sm underline hover:text-primary transition-colors">
              Back to Login?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full h-12 rounded-none mt-2"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Request Reset Link'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
