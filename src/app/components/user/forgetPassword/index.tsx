'use client'
import axios from 'axios'
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
    <div className="bg-gray-50 min-h-full">
      <div className="min-h-[400px]  flex items-center justify-center p-4">
        <div className="max-w-[480px] w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-primary mb-6">
            Forgot Your Password?
          </h2>
          <Typography variant="bodyRegular" className="text-center">
            No worries! Just provide your email, and we’ll help you set up a new password.
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mt-1 relative mb-2">
                <TextField
                  id="email"
                  type="email"
                  required
                  className="block w-full shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={'Email Address'}
                />
              </div>
            </div>

            {status !== 'idle' && (
              <div
                className={`rounded-md p-4 ${status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <p
                  className={`text-sm ${status === 'success' ? 'text-green-700' : 'text-red-700'}`}
                >
                  {message}
                </p>
              </div>
            )}
            <Link href={routes.home} className=" mt-2 ">
              Back to Login?
            </Link>

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Request Reset Link'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
