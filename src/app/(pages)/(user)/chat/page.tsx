'use client'

import { useEffect, useState } from 'react'
import { useGetMessagesQuery, useSendMessageMutation } from '@/app/lib/features/chat/chatApi'
import socket from '@/hooks/socket'

interface Props {
  conversationId: string
  userId: string
  userToken: string
  buyerId: string
  sellerId: string
  propertyId: string
}

export default function ChatWindow({
  conversationId,
  userId,
  userToken,
  buyerId,
  sellerId,
  propertyId,
}: Props) {
  const { data: messages, refetch } = useGetMessagesQuery(conversationId)
  const [sendMessage] = useSendMessageMutation()
  const [input, setInput] = useState('')

  useEffect(() => {
    socket.auth = { token: userToken }
    socket.connect()

    socket.emit('joinConversation', { conversationId, buyerId, sellerId, propertyId })

    socket.on('newMessage', () => {
      refetch() // Refresh messages on new socket message
    })

    return () => {
      socket.disconnect()
    }
  }, [conversationId, userToken, refetch, buyerId, sellerId, propertyId])

  const handleSend = async () => {
    if (!input.trim()) return

    await sendMessage({
      conversationId,
      content: input,
      senderId: userId,
    })

    setInput('')
  }

  return (
    <div className="flex flex-col border p-4 rounded max-w-xl mx-auto h-[600px]">
      <div className="flex-1 overflow-y-auto border-b mb-4 p-2">
        {messages?.map((msg: any) => (
          <div key={msg._id} className="mb-2">
            <div className="text-xs text-gray-500">{msg.senderId.username}</div>
            <div className="bg-gray-200 text-sm p-2 rounded inline-block">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border flex-1 px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  )
}
