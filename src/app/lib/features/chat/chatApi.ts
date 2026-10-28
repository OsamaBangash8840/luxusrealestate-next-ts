// app/lib/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/',
  }),
  tagTypes: ['Messages', 'Conversations'],
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (userId: string) => `/conversations/user/${userId}`,
      providesTags: ['Conversations'],
    }),
    getMessages: builder.query({
      query: (conversationId: string) => `/conversations/${conversationId}/messages`,
      providesTags: ['Messages'],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, content, senderId }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: 'POST',
        body: { content, senderId },
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
})

export const { 
  useGetConversationsQuery, 
  useGetMessagesQuery, 
  useSendMessageMutation 
} = chatApi
