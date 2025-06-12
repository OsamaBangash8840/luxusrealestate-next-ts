'use client'
import React, { useState } from 'react'
import ChatList from './ChatList'
// import ChatWindow from './ChatWindow'

const ChatApp = () => {
  const [selectedConversation, setSelectedConversation] = useState(null)

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '30%' }}>
        <ChatList selectConversation={setSelectedConversation} />
      </div>
      {/* <div style={{ width: '70%' }}>
        {selectedConversation ? (
          // <ChatWindow conversationId={selectedConversation} />
        ) : (
          <p>Select a conversation to start chatting.</p>
        )}
      </div> */}
    </div>
  )
}

export default ChatApp
