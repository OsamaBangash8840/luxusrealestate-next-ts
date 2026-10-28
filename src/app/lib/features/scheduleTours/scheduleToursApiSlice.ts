import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../axiosBaseQuery'

export interface ICreatePaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

export const scheduleTourApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'scheduleTourApi',
  tagTypes: ['Tours'],
  endpoints: (build) => ({
    scheduleTour: build.mutation<
      void,
      {
        date: string
        propertyId: string
        name: string
        email: string
        phone: string
        message: string
        time: string
        isPremium?: boolean
        paymentIntentId?: string
      }
    >({
      query: (body) => ({
        url: 'api/schedule-tour',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tours'],
    }),

    createPaymentIntent: build.mutation<
      ICreatePaymentIntentResponse,
      { propertyId: string }
    >({
      query: (body) => ({
        url: 'api/create-payment-intent',
        method: 'POST',
        body,
      }),
    }),

    availableSlots: build.query({
      query: ({ date, propertyId }) => ({
        url: `api/available-slots?date=${date}&propertyId=${propertyId}`,
        method: 'GET',
      }),
      providesTags: ['Tours'],
    }),

    cancelTour: build.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `api/cancel/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tours'],
    }),
  }),
})

export const {
  useAvailableSlotsQuery,
  useScheduleTourMutation,
  useCreatePaymentIntentMutation,
  useCancelTourMutation,
} = scheduleTourApiSlice
