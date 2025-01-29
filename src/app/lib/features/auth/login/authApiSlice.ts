import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../../axiosBaseQuery' // Import the updated axiosBaseQuery
import type { IUserRequestBody, IUserLoginResponse } from './types'

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
    // Add other endpoints as needed
  }),
})

export const { useLoginMutation } = authApiSlice
