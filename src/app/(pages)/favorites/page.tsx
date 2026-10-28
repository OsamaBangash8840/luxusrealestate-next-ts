'use client'

import React from 'react'
import FavoritesPage from '../(user)/user/favorites/page'
import { AuthGuard } from '@/app/components/common'

export default function Page() {
  return (
    <AuthGuard>
      <FavoritesPage />
    </AuthGuard>
  )
}
