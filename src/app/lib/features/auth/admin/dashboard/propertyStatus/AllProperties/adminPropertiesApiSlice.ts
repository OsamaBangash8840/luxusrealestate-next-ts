import axiosBaseQuery from '@/app/lib/features/axiosBaseQuery'
import { IProperty } from '@/app/lib/features/properties/types'
import { createApi } from '@reduxjs/toolkit/query/react'

export const adminPropertiesApiSlice = createApi({
  reducerPath: 'adminPropertiesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['ApprovedProperties'],
  endpoints: (builder) => ({
    approvedProperties: builder.query<IProperty[], void>({
      query: () => ({
        url: 'api/admin/approved',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; properties: Record<string, IProperty> }) =>
        Object.values(response.properties),
    }),
    pendingProperties: builder.query<IProperty[], void>({
      query: () => ({
        url: 'api/admin/pending',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; properties: Record<string, IProperty> }) =>
        Object.values(response.properties),
    }),
    rejectedProperties: builder.query<IProperty[], void>({
      query: () => ({
        url: 'api/admin/rejected',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; properties: Record<string, IProperty> }) =>
        Object.values(response.properties),
    }),
  }),
})

export const { useApprovedPropertiesQuery, usePendingPropertiesQuery, useRejectedPropertiesQuery } =
  adminPropertiesApiSlice
