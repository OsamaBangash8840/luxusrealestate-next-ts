import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../../axiosBaseQuery'
import { DashboardStats } from './types'

export const adminApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'adminApi',
  endpoints: (build) => ({
    adminDashboard: build.query<DashboardStats, void>({
      query: () => ({
        url: 'api/admin/stats',
        method: 'GET',
      }),
    }),
  }),
})

export const { useAdminDashboardQuery } = adminApiSlice
