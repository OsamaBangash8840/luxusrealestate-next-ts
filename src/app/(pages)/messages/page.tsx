'use client'

import React from 'react'
import NegotiationPage from '../(user)/chat/page'
import { AuthGuard } from '@/app/components/common'

export default function Page() {
  return (
    <AuthGuard>
      <NegotiationPage />
    </AuthGuard>
  )
}
