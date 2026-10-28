import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../axiosBaseQuery'

export interface ISavedSearch {
  _id: string
  title?: string
  criteria: {
    location?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
  }
  frequency?: 'instant' | 'daily' | 'weekly'
  createdAt: string
}

export const savedSearchesApiSlice = createApi({
  reducerPath: 'savedSearchesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['SavedSearches'],
  endpoints: (build) => ({
    getSavedSearches: build.query<ISavedSearch[], void>({
      query: () => ({
        url: 'api/saved-searches',
        method: 'GET',
      }),
      providesTags: ['SavedSearches'],
    }),
    createSavedSearch: build.mutation<ISavedSearch, Partial<ISavedSearch>>({
      query: (payload) => ({
        url: 'api/saved-searches',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['SavedSearches'],
    }),
    deleteSavedSearch: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `api/saved-searches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SavedSearches'],
    }),
  }),
})

export const {
  useGetSavedSearchesQuery,
  useCreateSavedSearchMutation,
  useDeleteSavedSearchMutation,
} = savedSearchesApiSlice
