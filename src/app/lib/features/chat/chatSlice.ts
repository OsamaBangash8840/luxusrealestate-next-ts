import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store' // Ensure this is correctly pointing to your store.ts

interface Message {
  id: string
  senderId: string
  content: string
  messageType: string
  fileUrl?: string
  status: string
}

interface ChatState {
  messages: Message[]
  typingUsers: { [conversationId: string]: string[] }
}

const initialState: ChatState = {
  messages: [],
  typingUsers: {},
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    setTyping: (state, action: PayloadAction<{ conversationId: string; userId: string }>) => {
      const { conversationId, userId } = action.payload
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = []
      }
      if (!state.typingUsers[conversationId].includes(userId)) {
        state.typingUsers[conversationId].push(userId)
      }
    },
    removeTyping: (state, action: PayloadAction<{ conversationId: string; userId: string }>) => {
      const { conversationId, userId } = action.payload
      state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(
        (id: string) => id !== userId
      )
    },
  },
})

export const { addMessage, setTyping, removeTyping } = chatSlice.actions

// Selector to get messages from the state
export const selectMessages = (state: RootState) => state.chat.messages

export default chatSlice.reducer
