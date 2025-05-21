'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../../common/Button'
import { Loader2 } from 'lucide-react'
import { TextField } from '../../form'
import { routes } from '@/app/base/utils/constants'
import { toast } from 'react-toastify'
import { useResetPasswordMutation } from '@/app/lib/features/auth/login/authApiSlice'
import { Typography } from '../../common/Typography'

export const ResetPassword = (): React.ReactElement => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // RTK Query mutation hook
  const [resetPassword] = useResetPasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError('Invalid or expired reset link.')
      return
    }

    setError(null)

    try {
      await resetPassword({ token, password }).unwrap()
      toast.success('Password reset successfully! You can now log in.')
      router.push(routes.login)
    } catch (err: any) {
      setError(err.data?.message || 'An error occurred. Please try again.')
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-[24px] semi-bold text-center text-blue-700 mb-4">
          Set a New Password for Your Account
        </h2>
        <Typography variant="bodyRegular" className="text-center mb-6">
          Create a new password to secure your account.
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="mt-1">
              <TextField
                type="password"
                required
                className="block w-full shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  )
}
