import React, { useState } from 'react'
import { getChatobjectMetadata } from '../utils'
import { ChatListIteminterface } from '../interfaces/chat'
import { useAuth } from '../context/AuthContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
const ChatItem: React.FC<{
  chat:ChatListIteminterface,
  onCLick:(chat:ChatListIteminterface)=>void;
  isActive?:boolean;
  unreadCount?:number;
  onChatDelete:(chatId:string)=>void;
}>=({chat,onCLick,isActive,unreadCount=0,onChatDelete})=> {
  const {user}=useAuth();
  const [openoptions,setopenoptions]=useState(false);
  
  
  return (
    <div
    role='button'
    onClick={()=>onCLick(chat)}
    onMouseLeave={()=>setopenoptions(false)}
    >
       <button onClick={(e)=>{
        e.stopPropagation();
        setopenoptions(!openoptions)
       }}>
      <MoreVertIcon/>
      <div style={{display:openoptions?"block":"hidden"}}>
        <p
          onClick={(e)=>{
            e.stopPropagation();
            const ok=confirm(
              "are you sure you want to delete"
            )
            if(ok){

            }
          }}
          role="button"
>
<DeleteIcon/>
  Delete Chat
        </p>

      </div>
       </button>
        <div><img src={getChatobjectMetadata(chat,user!).avatar} alt="" /></div>
        <div>{getChatobjectMetadata(chat,user).title}</div>
        <div>{getChatobjectMetadata(chat,user).lastMessage}</div>
        <div>
          <small>{moment(chat.updatedAt).add("TIME_ZONE","hours").fromNow(true)}</small>
          {
            unreadCount<=0?null:(
              <span>
                {unreadCount>9?"9+":unreadCount}
              </span>

            )
          }
        </div>
   
    </div>
  )
}

export default ChatItem