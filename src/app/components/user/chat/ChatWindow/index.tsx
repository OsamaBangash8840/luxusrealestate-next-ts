'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Typography } from '@/app/components/common'
import { Button } from '@/app/components/common/Button'
import { TextField } from '@/app/components/form'

export default function ChatPage() {
  const socketRef = useRef<Socket | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [roomName, setRoomName] = useState('')
  const [socketID, setSocketId] = useState('')

  // Initialize and set up socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:8000', {
      withCredentials: true,
    })

    socketRef.current.on('connect', () => {
      setSocketId(socketRef.current?.id ?? '')
      console.log('Connected:', socketRef.current?.id)
    })

    socketRef.current.on('receive-message', (data) => {
      console.log('Received message:', data)

      // If data is a string, use directly; if it's an object, extract the message
      const content = typeof data === 'string' ? data : data.message
      setMessages((prev) => [...prev, content])
    })

    socketRef.current.on('welcome', (msg) => {
      console.log('Welcome message:', msg)
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    socketRef.current?.emit('message', { message, room })
    setMessage('')
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomName.trim()) return

    socketRef.current?.emit('join-room', roomName)
    setRoomName('')
  }

  return (
    <div className="p-4">
      <Typography variant="h5">Socket ID: {socketID}</Typography>

      <div className="overflow-y-auto border mb-4 p-4 space-y-4 max-h-[400px]">
        {/* Join Room Form */}
        <form onSubmit={handleJoinRoom} className="space-y-2">
          <Typography variant="h5">Join Room</Typography>
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room Name"
          />
          <Button type="submit" className="text-primary">
            Join
          </Button>
        </form>

        {/* Send Message Form */}
        <form onSubmit={handleSendMessage} className="space-y-2">
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
          />
          <TextField value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room" />
          <Button type="submit" className="text-primary">
            Send
          </Button>
        </form>

        {/* Display Messages */}
        <div className="space-y-2 mt-4">
          {messages.map((m, i) => (
            <Typography key={i} variant="h3">
              {m}
            </Typography>
          ))}
        </div>
      </div>
    </div>
  )
}
