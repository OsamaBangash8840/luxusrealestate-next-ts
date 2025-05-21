import React, { useEffect, useState, useRef } from 'react'
import { useGetMessagesQuery, useSendMessageMutation } from '@/app/lib/features/chat/chatApi'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/lib/store'
import io from 'socket.io-client'

const socket = io('http://localhost:8000')

const ChatWindow = ({ conversationId }: any) => {
  const user = useSelector((state: RootState) => state.auth.user)
  const { data: messages, refetch } = useGetMessagesQuery(conversationId)
  const [sendMessage] = useSendMessageMutation()
  const [message, setMessage] = useState('')
  const [typing, setTyping] = useState(false)
  const messageEndRef = useRef(null)

  useEffect(() => {
    socket.emit('joinConversation', { conversationId })

    socket.on('newMessage', (newMsg) => {
      if (newMsg.conversationId === conversationId) refetch()
    })

    socket.on('typing', ({ userId }) => {
      if (userId !== user.id) setTyping(true)
    })

    socket.on('stopTyping', ({ userId }) => {
      if (userId !== user.id) setTyping(false)
    })

    return () => {
      socket.off('newMessage')
      socket.off('typing')
      socket.off('stopTyping')
    }
  }, [conversationId, refetch, user.id])

  const handleSendMessage = async () => {
    if (message.trim() === '') return

    const msgData = {
      conversationId,
      senderId: user.id,
      content: message,
      messageType: 'text',
      fileUrl: null,
    }

    await sendMessage(msgData)
    socket.emit('newMessage', msgData)
    setMessage('')
  }

  const handleTyping = () => {
    socket.emit('typing', { conversationId, userId: user.id })
    setTimeout(() => socket.emit('stopTyping', { conversationId, userId: user.id }), 2000)
  }

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages?.map((msg: any) => (
          <p key={msg.id} style={{ color: msg.senderId === user.id ? 'blue' : 'black' }}>
            {msg.content}
          </p>
        ))}
        {typing && <p>Someone is typing...</p>}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
          handleTyping()
        }}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  )
}

export default ChatWindow
