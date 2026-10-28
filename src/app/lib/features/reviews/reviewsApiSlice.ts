import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../axiosBaseQuery'
import { IReview, IReviewsResponse, IAddReviewPayload } from './types'

export const reviewsApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'reviewsApi',
  tagTypes: ['Reviews'],
  endpoints: (build) => ({
    getPropertyReviews: build.query<IReview[], string>({
      query: (propertyId) => ({
        url: `api/properties/${propertyId}/reviews`,
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        return response?.reviews || response?.data?.reviews || []
      },
      providesTags: ['Reviews'],
    }),
    addReview: build.mutation<IReview, IAddReviewPayload>({
      query: ({ propertyId, rating, message }) => ({
        url: `api/properties/${propertyId}/reviews`,
        method: 'POST',
        body: { rating, message },
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
})

export const { useGetPropertyReviewsQuery, useAddReviewMutation } = reviewsApiSlice
