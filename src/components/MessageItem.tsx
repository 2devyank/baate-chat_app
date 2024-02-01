import React, { useState } from 'react'
import { ChatMessageInterface } from '../interfaces/chat'
import "../styles/messagetext.css"
// @ts-ignore
const MessageItem:React.FC<{
    isOwnMessage?:boolean;
    isGroupChatMessage?:boolean;
    message:ChatMessageInterface;
    // @ts-ignore
}>=({isOwnMessage,isGroupChatMessage,message})=> {
  // @ts-ignore
 const [resizedImage,setResizedImage]=useState<string|null>(null);
 // @ts-ignore
 const [openvisible,setopenvisible]=useState(true);
 
  return (
    <>
    {/* {resizedImage?(
      <div className='resize'>
        <button className='crossresize' onClick={()=>setResizedImage(null)}>
<CloseIcon/>
        </button>
        <img style={{position:"absolute",width:"500px",height:"300px"}} src={resizedImage} alt="" />
        </div>
      ):null} */}
    <div className={isOwnMessage?"Own":"NotOwn"}>
{message?.attachments?.length>0?(
  <div>
    {
      message.attachments?.map((file)=>{
        return(
          <div className='images'
          onMouseEnter={()=>setopenvisible(false)}
          onMouseLeave={()=>setopenvisible(true)}
          >
            {/* <button
            className='centersearch'
            onClick={()=>setResizedImage(file.url)}
           style={{display:openvisible?"none":"block"}}
            >
<PageviewIcon fontSize="large"/>
            </button> */}
          <img style={{width:"300px",height:"200px"}} src={file.url} alt="" />
          </div>
          )
        })
      }
  </div>
):null}
    <div style={{fontSize:"14px",color:"black"}}>~{message.sender.username}</div>
    <div >
      {message.content}</div>
    </div>
</>
  )
}

export default MessageItem