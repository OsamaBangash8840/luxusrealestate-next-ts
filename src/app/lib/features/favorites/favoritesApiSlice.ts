import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../axiosBaseQuery'
import { IProperty } from '../properties/types'

export interface IFavoriteItem {
  _id: string
  property: IProperty
  createdAt: string
}

export const favoritesApiSlice = createApi({
  reducerPath: 'favoritesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Favorites'],
  endpoints: (build) => ({
    getFavorites: build.query<IProperty[], void>({
      query: () => ({
        url: 'api/favorites',
        method: 'GET',
      }),
      providesTags: ['Favorites'],
    }),
    addFavorite: build.mutation<{ success: boolean; message: string }, string>({
      query: (propertyId) => ({
        url: `api/favorites/${propertyId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Favorites'],
    }),
    removeFavorite: build.mutation<{ success: boolean; message: string }, string>({
      query: (propertyId) => ({
        url: `api/favorites/${propertyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites'],
    }),
  }),
})

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApiSlice
