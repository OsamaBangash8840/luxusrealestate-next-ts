import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery'; // Import the updated axiosBaseQuery
import type { IUserRequestBody, IUserLoginResponse } from './types';

export const authApiSlice = createApi({
  baseQuery: axiosBaseQuery(), // Use the updated base query with token
  reducerPath: 'authApi',
  tagTypes: [],
  endpoints: build => ({
    login: build.mutation<IUserLoginResponse, IUserRequestBody>({
      query: body => ({
        url: `api/login`,
        method: 'post',
        data: body,
      }),
    }),
    // Add other endpoints as needed
  }),
});

export const { useLoginMutation } = authApiSlice;
