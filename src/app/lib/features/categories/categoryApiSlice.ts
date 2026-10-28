import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../axiosBaseQuery'
import { ICategory, IAddCategoryPayload } from './types'

export const categoryApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'categoryApi',
  tagTypes: ['Categories'],
  endpoints: (build) => ({
    getAllCategories: build.query<ICategory[], void>({
      query: () => ({
        url: 'api/categories',
        method: 'GET',
      }),
      providesTags: ['Categories'],
    }),
    getCategoryById: build.query<ICategory, string>({
      query: (id) => ({
        url: `api/categories/${id}`,
        method: 'GET',
      }),
    }),
    addCategory: build.mutation<ICategory, IAddCategoryPayload>({
      query: (body) => ({
        url: 'api/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
})

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
} = categoryApiSlice
