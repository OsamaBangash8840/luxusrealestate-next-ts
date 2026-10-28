'use client'

import React from 'react'
import { AuthGuard } from '@/app/components/common'

export default function UserPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
