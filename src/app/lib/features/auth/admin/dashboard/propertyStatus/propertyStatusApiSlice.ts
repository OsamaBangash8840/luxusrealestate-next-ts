import axiosBaseQuery from '@/app/lib/features/axiosBaseQuery'
import { createApi } from '@reduxjs/toolkit/query/react'

export const propertyStatusApiSlice = createApi({
  reducerPath: 'statusApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Property'],
  endpoints: (builder) => ({
    updatePropertyStatus: builder.mutation({
      query: ({ id, status, rejectionReason }) => ({
        url: `api/admin/properties/${id}/status`,
        method: 'PUT',
        body: { status, rejectionReason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }],
    }),
  }),
})

export const { useUpdatePropertyStatusMutation } = propertyStatusApiSlice
