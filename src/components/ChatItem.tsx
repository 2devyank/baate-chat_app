import React, { useState } from 'react'
import { getChatobjectMetadata, requestHandler } from '../utils'
import { ChatListIteminterface } from '../interfaces/chat'
import { useAuth } from '../context/AuthContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import { deleteOneOnOneChat } from '../api';
import "../styles/chatItem.css"
const ChatItem: React.FC<{
  chat:ChatListIteminterface,
  onCLick:(chat:ChatListIteminterface)=>void;
  isActive?:boolean;
  unreadCount?:number;
  onChatDelete:(chatId:string)=>void;
}>=({chat,onCLick,isActive,unreadCount=0,onChatDelete})=> {
  const {user}=useAuth();
  const [openoptions,setopenoptions]=useState(false);
  
  const DeleteChat=async()=>{
    await requestHandler(
      async()=>await deleteOneOnOneChat(chat._id),
      null,
      ()=>{
        onChatDelete(chat._id);
      },
      alert
    )
  }
  if(!chat) return;
  return (
    <div
    className='role'
    role='button'
    onClick={()=>onCLick(chat)}
    onMouseLeave={()=>setopenoptions(false)}
    >
       <button onClick={(e)=>{
        e.stopPropagation();
        setopenoptions(!openoptions)
       }}>
      <MoreVertIcon/>
     {openoptions &&  <div >
        <p
          onClick={(e)=>{
            e.stopPropagation();
            const ok=confirm(
              "are you sure you want to delete"
            )
            if(ok){
              DeleteChat();
            }
          }}
          role="button"
>
<DeleteIcon/>
  Delete Chat
        </p>

      </div>
     }
       </button>
        <div><img src={getChatobjectMetadata(chat,user!).avatar} alt="" /></div>
        <div className='headone'>

        <div className='tilecard'>
        <span>{getChatobjectMetadata(chat,user).title}</span>
        <span>{getChatobjectMetadata(chat,user).lastMessage}</span>
        </div>
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
    </div>
  )
}

export default ChatItem