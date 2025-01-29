import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../axiosBaseQuery'
import { IPropertiesPayload, IProperty } from './types'

export const propertiesApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'propertiesApi',
  tagTypes: [],
  endpoints: (build) => ({
    getProperty: build.query<IProperty[], void>({
      query: () => ({
        url: 'api/properties',
        method: 'GET',
      }),
    }),
    addProperty: build.mutation<IProperty, IPropertiesPayload>({
      query: (payload) => ({
        url: 'api/properties',
        method: 'POST',
        body: payload, // Use "body" for the payload
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    getSingleProperty: build.query<IPropertiesPayload, string>({
      // Updated endpoint name
      query: (id) => ({
        url: `api/properties/${id}`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useGetPropertyQuery,
  useAddPropertyMutation,
  useGetSinglePropertyQuery, // Corrected hook name
} = propertiesApiSlice
