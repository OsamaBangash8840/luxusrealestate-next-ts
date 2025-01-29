'use client'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../../common/Button'
import { Loader2 } from 'lucide-react'
import { TextField } from '../../form'
import { useRouter } from 'next/navigation'
import { routes } from '@/app/base/utils/constants'
import { toast } from 'react-toastify'

export const ResetPassword = (): React.ReactElement => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError('Invalid or expired reset link.')
      return
    }

    setStatus('loading')
    setError(null)

    try {
      const response = await axios.post(`http://localhost:8000/api/reset-password/${token}`, {
        password,
      })

      if (response.status === 200) {
        setStatus('success')
        toast.success('Password reset successfully! You can now log in.')
        router.push(routes.login)
      } else {
        throw new Error(response.data.message || 'Failed to reset password')
      }
    } catch (err: any) {
      setStatus('error')
      setError(err.response?.data?.message || 'An error occurred. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-blue-700 mb-4">Reset Your Password</h2>

      {status === 'success' ? (
        <p className="text-green-600 text-center">
          Password reset successfully! You can now log in.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1">
              <TextField
                type="password"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
