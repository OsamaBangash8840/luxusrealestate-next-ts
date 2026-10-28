'use client'

import { setupListeners } from '@reduxjs/toolkit/query'
import React, { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, type AppStore } from './lib/store'
import { syncFromCookies } from './lib/features/auth/authSlice'

interface Props {
  readonly children: React.ReactNode
}

export const StoreProvider = ({ children }: Props): React.ReactElement => {
  const storeRef = useRef<AppStore | null>(null)

  if (storeRef.current === null) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  useEffect(() => {
    if (storeRef.current != null) {
      setupListeners(storeRef.current.dispatch)
      // Immediately hydrate centralized auth state from cookies
      storeRef.current.dispatch(syncFromCookies())
    }
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}
