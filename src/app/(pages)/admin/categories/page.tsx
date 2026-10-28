'use client'

import React from 'react'
import CategoryManagement from '@/app/components/admin/dashboard/categories'
import DashboardLayout from '@/app/(pages)/admin/layout'

export default function AdminCategoriesDirectPage() {
  return (
    <DashboardLayout>
      <CategoryManagement />
    </DashboardLayout>
  )
}
