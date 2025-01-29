import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../../axiosBaseQuery'

export interface IGoogleSignupRequestBody {
  email: string
  username: string
  role: 'buyer' | 'seller' | 'admin'
}

export interface IGoogleSignupResponse {
  user: {
    id: string
    username: string
    email: string
    role: 'buyer' | 'seller' | 'admin'
  }
  token: string
  message: string
}

export const googleAuthApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'googleAuthApi',
  endpoints: (build) => ({
    completeGoogleSignup: build.mutation<IGoogleSignupResponse, IGoogleSignupRequestBody>({
      query: (body) => ({
        url: 'api/complete-google-signup',
        method: 'post',
        body,
      }),
    }),
  }),
})

export const { useCompleteGoogleSignupMutation } = googleAuthApiSlice
