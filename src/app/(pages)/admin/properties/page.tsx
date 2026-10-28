'use client'

import React, { Suspense } from 'react'
import { DashboardProperties } from '@/app/components/admin/dashboard/properties/allProperties'

import { Skeleton } from '@/app/components/common'

export default function AdminPropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-4">
          <Skeleton className="h-10 w-48 rounded-sm" />
          <Skeleton className="h-12 w-full rounded-sm" />
          <Skeleton className="h-96 w-full rounded-sm" />
        </div>
      }
    >
      <DashboardProperties />
    </Suspense>
  )
}

