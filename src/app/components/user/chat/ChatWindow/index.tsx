'use client'

import { useEffect, useState } from 'react'
import { useGetMessagesQuery, useSendMessageMutation } from '@/app/lib/features/chat/chatApi'
import socket from '@/hooks/socket'
import { Button } from '@/app/components/common/Button'
import { Typography } from '@/app/components/common'

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
    <div className="flex flex-col border border-border p-4 rounded max-w-xl mx-auto h-[600px]">
      <div className="flex-1 overflow-y-auto border-b border-border mb-4 p-2">
        {messages?.map((msg: any) => (
          <div key={msg._id} className="mb-2">
            <Typography variant="extraSmallRegular" className="text-muted-foreground">{msg.senderId.username}</Typography>
            <div className="bg-muted text-sm p-2 rounded inline-block">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border border-input flex-1 px-2 py-1 rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <Button onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  )
}
