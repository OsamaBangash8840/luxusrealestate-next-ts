'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Eye, EyeOff, Loader2, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/components/common/Button'

export const ResendVerification = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('http://localhost:8000/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Verification email sent successfully!')
      } else if (response.status === 429) {
        setStatus('error')
        setMessage(`Please wait ${data.retryAfter} seconds before requesting another email.`)
      } else {
        setStatus('error')
        setMessage(data.message || 'Failed to send verification email')
      }
    } catch (err) {
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-[400px] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Resend Verification Email</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                type="email"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {status !== 'idle' && (
            <div className={`rounded-md p-4 ${status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-sm ${status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {message}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
