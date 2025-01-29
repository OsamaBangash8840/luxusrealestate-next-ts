'use client'

import React, { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCompleteGoogleSignupMutation } from '@/app/lib/features/auth/google/googleApiSlice'
import { setCookie } from 'cookies-next'
import { USER_DATA } from '@/app/base/utils/constants'

const CompleteSignupContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [completeSignup] = useCompleteGoogleSignupMutation()

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

      setCookie(USER_DATA, JSON.stringify(result.user))
      router.push('/properties')
    } catch (err: any) {
      setError(err?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-96 p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl mb-4">Complete Your Profile</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input type="email" value={email} disabled className="w-full p-2 border rounded" />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'buyer' | 'seller')}
            className="w-full p-2 border rounded"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
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
