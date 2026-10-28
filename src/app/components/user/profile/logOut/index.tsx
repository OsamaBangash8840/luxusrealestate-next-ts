'use client'

import React from 'react'
import { useLogOutMutation } from '@/app/lib/features/auth/login/authApiSlice'
import { Button } from '@/app/components/common/Button'
import { useAuth } from '@/app/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export const LogoutButton = () => {
  const [serverLogout, { isLoading }] = useLogOutMutation()
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      try {
        await serverLogout().unwrap()
      } catch {
        // Continue client-side session clearance even if network fails
      }
      logout()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch {
      toast.error('Logout failed, please try again')
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      tone="danger"
      className="mx-auto px-4 py-2 rounded-md"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}
