import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../axiosBaseQuery'
import { IRegisterRequestBody, IRegisterUser, IRegisterUserResponse } from '../auth/register/types'
import { IUserProfile } from './types'

export const profileApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'profileApi',
  endpoints: (build) => ({
    profile: build.query<IUserProfile, void>({
      query: () => ({
        url: 'api/profile',
        method: 'GET',
      }),
    }),
    updateProfile: build.mutation<IUserProfile, void>({
      query: (body) => ({
        url: 'api/profile',
        method: 'PUT',
        body,
      }),
    }),
  }),
})

export const { useProfileQuery, useUpdateProfileMutation } = profileApiSlice
