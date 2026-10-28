'use client'

import React from 'react'
import { AddProperty } from '@/app/components/properties'
import { AuthGuard } from '@/app/components/common'

const Page = (): React.ReactElement => (
  <AuthGuard>
    <AddProperty />
  </AuthGuard>
)

export default Page