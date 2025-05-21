'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { routes } from '@/app/base/utils/constants'
import { Typography } from '@/app/components/common'
import { useAdminDashboardQuery } from '@/app/lib/features/auth/admin/adminApiSlice'
import { TiTick } from 'react-icons/ti'

export const Stats = (): React.ReactElement | null => {
  const [stats] = useState({
    totalProperties: 126,
    vacant: 63,
    occupied: 32,
    unlisted: 31,
    newApplicants: 16,
    enquiries: 142,
    maintenanceRequests: 33,
    totalBalance: '$124,345',
  })
  const router = useRouter()
  const token = getCookie('token')

  // Redirect to login if token is missing
  useEffect(() => {
    if (!token) {
      router.push(routes.login)
    }
  }, [token, router])

  // Fetch admin dashboard stats only if token exists
  const { data, isLoading, error } = useAdminDashboardQuery(undefined, {
    skip: !token, // Skip API call if no token
  })

  if (!token) return null
  if (isLoading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-red-500 p-4">Error: {(error as any).message}</div>

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Property Stats */}
      <div className="flex justify-around text-center text-sm font-medium">
        <div className="">
          <Typography variant="h1">{data?.properties}</Typography>
          <Typography variant="h3" className="text-primary">
            Total Properties
          </Typography>
        </div>
        <div className="text-purple-500">
          <Typography variant="h1">{data?.users}</Typography>
          <Typography variant="h3" className="text-primary">
            Users
          </Typography>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-3 gap-4 px-10">
        <StatCard
          title="New Applicants"
          value={data?.approved ?? 0}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          title="Enquiry Messages"
          value={data?.pending ?? 0}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          title="Maintenance Requests"
          value={data?.rejected ?? 0}
          color="bg-red-100 text-red-700"
        />
      </div>

      {/* Revenue Overview */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold">Revenue Overview</h2>
        <p className="text-gray-500 text-sm">Your property finance report Jan 21 - Dec 21</p>
        <div className="mt-4 h-32 bg-gray-200 rounded-md flex items-center justify-center">
          {/* Placeholder for Chart/Graph */}
          <span className="text-gray-500">Graph Placeholder</span>
        </div>
        <div className="mt-4 text-3xl font-bold text-gray-900">{stats.totalBalance}</div>
        <p className="text-gray-500">Total balance</p>
      </div>
    </div>
  )

  // Reusable Stat Card Component
  function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
    return (
      <div className={`p-4 rounded-xl shadow-md ${color} flex flex-col items-center`}>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm font-medium">{title}</p>
      </div>
    )
  }
}
