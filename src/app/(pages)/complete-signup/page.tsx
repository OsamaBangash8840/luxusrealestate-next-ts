'use client'

import React, { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCompleteGoogleSignupMutation } from '@/app/lib/features/auth/google/googleApiSlice'
import { useAuth } from '@/app/hooks/useAuth'

const CompleteSignupContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [completeSignup] = useCompleteGoogleSignupMutation()
  const { login: authenticateUser } = useAuth()

  const [username, setUsername] = useState('')
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [error, setError] = useState('')

  const email = searchParams.get('email') || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await completeSignup({
        email,
        username,
        role,
      }).unwrap()

      authenticateUser(result.user, (result as any)?.token || null)
      router.push('/properties')
    } catch (err: any) {
      setError(err?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-card border border-border shadow-sm rounded-sm">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Complete Your Profile</h2>

        {error && <p className="text-destructive mb-4 text-sm">{error}</p>}

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-foreground">Email</label>
          <input type="email" value={email} disabled className="w-full p-2 border border-input bg-muted text-muted-foreground rounded-sm" />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-foreground">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border border-input bg-background text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-foreground">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'buyer' | 'seller')}
            className="w-full p-2 border border-input bg-background text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-primary text-primary-foreground p-3 rounded-sm font-medium hover:bg-primary/90 transition-colors">
          Complete Signup
        </button>
      </form>
    </div>
  )
}

const CompleteGoogleSignupPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteSignupContent />
    </Suspense>
  )
}

export default CompleteGoogleSignupPage
