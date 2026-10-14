import { io, Socket } from 'socket.io-client'

const socket: Socket = io(process.env.NEXT_PUBLIC_BACKEND_URL! || 'http://localhost:8000/', {
  autoConnect: false,
  withCredentials: true,
})

export default socket
