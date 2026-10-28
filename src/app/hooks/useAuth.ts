'use client'

import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/lib/hooks'
import {
  setCredentials,
  updateUser,
  syncFromCookies,
  logout as logoutAction,
  type UserProfile,
} from '@/app/lib/features/auth/authSlice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, token, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  // Sync on initial mount and listen to auth change events across tabs/windows
  useEffect(() => {
    dispatch(syncFromCookies())

    const handleAuthChange = () => {
      dispatch(syncFromCookies())
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('luxus-auth-changed', handleAuthChange)
      window.addEventListener('storage', handleAuthChange)

      return () => {
        window.removeEventListener('luxus-auth-changed', handleAuthChange)
        window.removeEventListener('storage', handleAuthChange)
      }
    }
  }, [dispatch])

  const login = useCallback(
    (userData: UserProfile | any, authToken?: string | null) => {
      dispatch(setCredentials({ user: userData, token: authToken }))
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    dispatch(logoutAction())
  }, [dispatch])

  const updateProfile = useCallback(
    (partialUser: Partial<UserProfile>) => {
      dispatch(updateUser(partialUser))
    },
    [dispatch]
  )

  const sync = useCallback(() => {
    dispatch(syncFromCookies())
  }, [dispatch])

  const role = user?.role
  const isAdmin = role === 'admin'
  const isSeller = role === 'seller' || role === 'admin'
  const isBuyer = role === 'buyer'

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    role,
    isAdmin,
    isSeller,
    isBuyer,
    login,
    logout,
    updateProfile,
    sync,
  }
}

export default useAuth
