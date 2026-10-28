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
    <div className="bg-background min-h-[90%] flex items-center justify-center p-4">
      <div className="max-w-[480px] w-full mt-10 p-8 border border-border">
        <Typography variant="h2" className="text-center font-bold tracking-tight mb-4 mt-4">
          Set a New Password
        </Typography>
        <Typography variant="bodyRegular" className="text-center text-muted-foreground mb-8">
          Create a new password to secure your account.
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <TextField
                type="password"
                required
                className="block w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>

          {error && <div className="border border-destructive/20 bg-destructive/5 p-4"><p className="text-destructive text-sm text-center">{error}</p></div>}

          <Button
            type="submit"
            className="w-full h-12 rounded-none mt-4"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  )
}
