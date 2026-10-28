'use client'
import React from 'react'
import { useGetConversationsQuery } from '@/app/lib/features/chat/chatApi'
import { useProfileQuery } from '@/app/lib/features/profile/profileApiSlice'

interface Conv {
  _id: string
  buyerId: string
  sellerName: string
  buyerName: string
}

const ChatList = ({ selectConversation }: { selectConversation: (id: string) => void }) => {
  const { data: userProfile, isLoading: isUserLoading } = useProfileQuery()
  const { data: conversations, isLoading: isConversationsLoading } = useGetConversationsQuery(
    userProfile?.username || '',
    { skip: !userProfile }
  )

  if (isUserLoading || isConversationsLoading) return <p>Loading...</p>

  return (
    <div>
      <h2>Conversations</h2>
      {conversations?.map((conv: Conv) => (
        <div 
          key={conv._id} 
          onClick={() => selectConversation(conv._id)} 
          className="cursor-pointer hover:bg-muted p-2 border-b"
        >
          <p>{conv.buyerName === userProfile?.username ? conv.sellerName : conv.buyerName}</p>
        </div>
      ))}
    </div>
  )
}

export default ChatList
