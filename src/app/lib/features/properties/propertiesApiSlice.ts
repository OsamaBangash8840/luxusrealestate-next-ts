import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../axiosBaseQuery'
import { IPropertiesPayload, IProperty } from './types'

export const propertiesApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'propertiesApi',
  tagTypes: ['Properties', 'UserProperties', 'SellerStats'],
  endpoints: (build) => ({
    getProperty: build.query<IProperty[], void>({
      query: () => ({
        url: 'api/properties',
        method: 'GET',
      }),
      providesTags: ['Properties'],
    }),
    getUserProperties: build.query<IProperty[], void>({
      query: () => ({
        url: 'api/user/properties',
        method: 'GET',
      }),
      providesTags: ['UserProperties'],
    }),
    getSellerStats: build.query<any, void>({
      query: () => ({
        url: 'api/seller/stats',
        method: 'GET',
      }),
      providesTags: ['SellerStats'],
    }),
    addProperty: build.mutation<IProperty, Partial<IPropertiesPayload>>({
      query: (payload) => ({
        url: 'api/properties',
        method: 'POST',
        body: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Properties', 'UserProperties', 'SellerStats'],
    }),
    updateProperty: build.mutation<IProperty, { id: string; payload: Partial<IPropertiesPayload> }>({
      query: ({ id, payload }) => ({
        url: `api/properties/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Properties', 'UserProperties', 'SellerStats'],
    }),
    deleteProperty: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `api/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Properties', 'UserProperties', 'SellerStats'],
    }),
    getSingleProperty: build.query<IPropertiesPayload, string>({
      query: (id) => ({
        url: `api/properties/${id}`,
        method: 'GET',
      }),
    }),
    getRelatedProperties: build.query<IProperty[], string>({
      query: (id) => ({
        url: `api/properties/${id}/related`,
        method: 'GET',
      }),
    }),
    getPropertiesByCategory: build.query<IProperty[], string>({
      query: (category) => ({
        url: `api/category/${category}`,
        method: 'GET',
      }),
    }),
    searchProperties: build.query<any, Record<string, any>>({
      query: (params) => ({
        url: 'api/properties/search',
        method: 'GET',
        params,
      }),
    }),
  }),
})

export const {
  useGetPropertyQuery,
  useGetUserPropertiesQuery,
  useGetSellerStatsQuery,
  useAddPropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetSinglePropertyQuery,
  useGetRelatedPropertiesQuery,
  useGetPropertiesByCategoryQuery,
  useSearchPropertiesQuery,
} = propertiesApiSlice
