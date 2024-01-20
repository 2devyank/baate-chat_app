import React from 'react'
import { ChatMessageInterface } from '../interfaces/chat'
import "../styles/messagetext.css"

const MessageItem:React.FC<{
    isOwnMessage?:boolean;
    isGroupChatMessage?:boolean;
    message:ChatMessageInterface;
}>=({isOwnMessage,isGroupChatMessage,message})=> {
  return (
    <div className={isOwnMessage?"Own":"NotOwn"}>{message.content}</div>
  )
}

export default MessageItem