import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../../axiosBaseQuery' // Import the updated axiosBaseQuery
import { type IUserRequestBody, type IUserLoginResponse, IForgetPassResponse } from './types'

export const authApiSlice = createApi({
  baseQuery: axiosBaseQuery(), // Use the updated base query
  reducerPath: 'authApi',
  tagTypes: [],
  endpoints: (build) => ({
    login: build.mutation<IUserLoginResponse, IUserRequestBody>({
      query: (credentials) => ({
        url: `api/login`,
        method: 'post',
        body: credentials,
      }),
    }),
    forgetPassword: build.mutation<void, { email: string }>({
      query: (body) => ({
        url: `api/forget-password`,
        method: 'post',
        body: body,
      }),
    }),
    ResetPassword: build.mutation<void, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `api/reset-password/${token}`,
        method: 'post',
        body: { password },
      }),
    }),
    logOut: build.mutation<void, void>({
      query: () => ({
        url: 'api/logout',
        method: 'delete',
        credentials: 'include',
      }),
    }),
    // Add other endpoints as needed
  }),
})

export const {
  useLoginMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useLogOutMutation,
} = authApiSlice
