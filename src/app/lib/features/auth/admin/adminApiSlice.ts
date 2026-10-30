import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../../axiosBaseQuery'
import { DashboardStats, UsersResponse, AdminUser } from './types'
import { IProperty } from '../../properties/types'

export const adminApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'adminApi',
  tagTypes: ['AdminStats', 'AdminUsers', 'AdminPending', 'AdminApproved', 'AdminRejected'],
  endpoints: (build) => ({
    adminDashboard: build.query<DashboardStats, void>({
      query: () => ({
        url: 'api/admin/stats',
        method: 'GET',
      }),
      providesTags: ['AdminStats'],
    }),

    getAdminUsers: build.query<UsersResponse, { page?: number; limit?: number; role?: string }>({
      query: (params) => ({
        url: 'api/admin/users',
        method: 'GET',
        params,
      }),
      providesTags: ['AdminUsers'],
    }),

    banUser: build.mutation<{ isBanned: boolean }, { id: string; isBanned: boolean }>({
      query: ({ id, isBanned }) => ({
        url: `api/admin/users/${id}/ban`,
        method: 'PATCH',
        body: { isBanned },
      }),
      invalidatesTags: ['AdminUsers', 'AdminStats'],
    }),

    getPendingProperties: build.query<IProperty[], void>({
      query: () => ({
        url: 'api/admin/pending',
        method: 'GET',
      }),
      transformResponse: (response: any) => Array.isArray(response) ? response : Array.isArray(response?.properties) ? response.properties : response?.properties ? Object.values(response.properties) : [],
      providesTags: ['AdminPending'],
    }),

    getApprovedProperties: build.query<IProperty[], void>({
      query: () => ({
        url: 'api/admin/approved',
        method: 'GET',
      }),
      transformResponse: (response: any) => Array.isArray(response) ? response : Array.isArray(response?.properties) ? response.properties : response?.properties ? Object.values(response.properties) : [],
      providesTags: ['AdminApproved'],
    }),

    getRejectedProperties: build.query<IProperty[], void>({
      query: () => ({
        url: 'api/admin/rejected',
        method: 'GET',
      }),
      transformResponse: (response: any) => Array.isArray(response) ? response : Array.isArray(response?.properties) ? response.properties : response?.properties ? Object.values(response.properties) : [],
      providesTags: ['AdminRejected'],
    }),

    updatePropertyStatus: build.mutation<
      IProperty,
      { id: string; status: 'approved' | 'rejected'; rejectionReason?: string }
    >({
      query: ({ id, status, rejectionReason }) => ({
        url: `api/admin/properties/${id}/status`,
        method: 'PUT',
        body: { status, rejectionReason },
      }),
      invalidatesTags: ['AdminPending', 'AdminApproved', 'AdminRejected', 'AdminStats'],
    }),
  }),
})

export const {
  useAdminDashboardQuery,
  useGetAdminUsersQuery,
  useBanUserMutation,
  useGetPendingPropertiesQuery,
  useGetApprovedPropertiesQuery,
  useGetRejectedPropertiesQuery,
  useUpdatePropertyStatusMutation,
} = adminApiSlice

