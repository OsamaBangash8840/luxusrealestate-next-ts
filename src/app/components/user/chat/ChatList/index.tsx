'use client'
import React from 'react'
import { useGetConversationsQuery } from '@/app/lib/features/chat/chatApi'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/lib/store'

const ChatList = ({ selectConversation }: any) => {
  const user = useSelector((state: RootState) => state.auth.user)
  const { data: conversations, isLoading } = useGetConversationsQuery(user?.id)

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h2>Conversations</h2>
      {conversations?.map((conv: any) => (
        <div key={conv._id} onClick={() => selectConversation(conv._id)}>
          <p>{conv.buyerId === user.id ? conv.sellerName : conv.buyerName}</p>
        </div>
      ))}
    </div>
  )
}

export default ChatList
