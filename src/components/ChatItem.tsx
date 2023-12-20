import React from 'react'
import { getChatobjectMetadata } from '../utils'

function ChatItem() {
  return (
    <div>
        <div>:</div>
        <div><img src="" alt="" /></div>
        {/* <div>{getChatobjectMetadata(chat,title).lastMessage}</div> */}
        {/* <div>{getChatobjectMetadata(chat,user).lastMessage}</div> */}

    </div>
  )
}

export default ChatItem