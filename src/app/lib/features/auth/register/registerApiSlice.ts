import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../../axiosBaseQuery'
import type { IRegisterRequestBody, IRegisterUserResponse } from './types'

export const registerApiSlice = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: '' }), // Make sure this matches your baseURL config
  reducerPath: 'regisApi',
  tagTypes: [],
  endpoints: (build) => ({
    register: build.mutation<IRegisterUserResponse, IRegisterRequestBody>({
      query: (payload) => ({
        url: '/api/register',
        method: 'POST',
        body: payload, // Changed from 'data' to 'body' to match axiosBaseQuery
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
})

export const { useRegisterMutation } = registerApiSlice
