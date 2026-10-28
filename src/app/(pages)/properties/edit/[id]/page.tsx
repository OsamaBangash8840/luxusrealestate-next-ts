'use client'

import React from 'react'
import { EditProperty } from '@/app/components/properties'
import { AuthGuard } from '@/app/components/common'

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const resolvedParams = React.use(params)
  const propertyId = resolvedParams.id

  return (
    <AuthGuard requiredRole="seller">
      <EditProperty propertyId={propertyId} />
    </AuthGuard>
  )
}
