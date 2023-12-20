import { useState } from "react";
import AddChatmodal from "../components/AddChatmodal";
import "../styles/chat.css";
import { ChatListIteminterface } from "../interfaces/chat";
import { getChatobjectMetadata } from "../utils";
import { useAuth } from "../context/AuthContext";
const Chat=()=> {
const {user}=useAuth();
  const [openchatmodal,setopenchatmodal]=useState<boolean>(false);
  const [loadingChats,setLoadingChats]=useState<boolean>(false);
  const [chats,setChat]=useState<ChatListIteminterface[]>([]);
  const [searchQuery,setSearchQuery]=useState();
  return (
    <>
    <AddChatmodal
    open={openchatmodal}
    onClose={()=>{
      setopenchatmodal(false);
    }}
    onSuccess={()=>{

    }}
    />
      <div className="overall">
        <div className="leftsection">
          <div className="topleft">
            <input className="inputchat" type="text" placeholder="Search user or group" />
            <button className="butaddchat" onClick={()=>{
              setopenchatmodal(true)
            }}>+ Add chat</button>
          </div>
          <div>

            {/* {loadingChats?(
              <div>
                hello
              </div>
            ):(
              [...chats]
              .filter((chat)=>{
                searchQuery?
                getChatobjectMetadata(chat,user!)
                .title?.toLocaleLowerCase()
                ?.includes(searchQuery)
                :true
              })
              // .map((chat)=>{
                //   return(
                  
                  //   )
                  // })
                  )} */}
          {/* </div> */}
        </div>
                  </div>

        <div className="rightsection"></div>
      </div>
    </>
  );
}

export default Chat;
