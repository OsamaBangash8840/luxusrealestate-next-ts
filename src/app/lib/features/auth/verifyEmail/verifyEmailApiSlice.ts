import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../../axiosBaseQuery'

export const verifyEmailApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'verifyEmailApi',
  endpoints: (build) => ({
    verifyEmail: build.mutation<void, { token: string }>({
      query: (body) => ({
        url: 'api/verify-email',
        method: 'post',
        body,
      }),
    }),
    resendVerification: build.mutation<void, { email: string }>({
      query: (body) => ({
        url: 'api/resend-verification',
        method: 'post',
        body,
      }),
    }),
  }),
})

export const { useVerifyEmailMutation, useResendVerificationMutation } = verifyEmailApiSlice
