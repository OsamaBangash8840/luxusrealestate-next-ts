import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../axiosBaseQuery'
// import { ScheduleTour } from './types'

export const scheduleTourApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'scheduleTourApi',
  tagTypes: [],
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
      }
    >({
      query: ({ date, propertyId, name, email, phone, message, time }) => ({
        url: 'api/schedule-tour',
        method: 'POST',
        body: { date, propertyId, name, email, phone, message, time }, // Ensure all fields are included
      }),
    }),

    availableSlots: build.query({
      query: ({ date, propertyId }) => ({
        url: `api/available-slots?date=${date}&propertyId=${propertyId}`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useAvailableSlotsQuery, useScheduleTourMutation } = scheduleTourApiSlice
