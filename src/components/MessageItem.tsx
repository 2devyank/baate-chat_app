import React from 'react'
import { ChatMessageInterface } from '../interfaces/chat'

const MessageItem:React.FC<{
    isOwnMessage?:boolean;
    isGroupChatMessage?:boolean;
    message:ChatMessageInterface;
}>=({isOwnMessage,isGroupChatMessage,message})=> {
  return (
    <div>{message.content}</div>
  )
}

export default MessageItem