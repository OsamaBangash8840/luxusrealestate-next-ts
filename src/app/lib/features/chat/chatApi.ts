import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
  tagTypes: ['Messages', 'Conversations'],
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (userId) => `/conversations/${userId}`,
      providesTags: ['Conversations'],
    }),
    getMessages: builder.query({
      query: (conversationId) => `/messages/${conversationId}`,
      providesTags: ['Messages'],
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: '/messages',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
})

export const { useGetConversationsQuery, useGetMessagesQuery, useSendMessageMutation } = chatApi
