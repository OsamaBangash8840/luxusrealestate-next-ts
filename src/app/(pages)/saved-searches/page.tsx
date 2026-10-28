'use client'

import React from 'react'
import SavedSearchesPage from '../(user)/user/saved-searches/page'
import { AuthGuard } from '@/app/components/common'

export default function Page() {
  return (
    <AuthGuard>
      <SavedSearchesPage />
    </AuthGuard>
  )
}
