import { useRef, useState } from "react";
import AddChatmodal from "../components/AddChatmodal";
import "../styles/chat.css";
import { ChatListIteminterface, ChatMessageInterface } from "../interfaces/chat";
import { LocalStorage, getChatobjectMetadata, requestHandler } from "../utils";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/ChatItem";
import { useSocket } from "../context/Socket.context";
import { getAllchatMessages, getAllchats } from "../api";




const CONNECTED_EVENT="connected";
const DISCONNECTED_EVENT="disconnect";
const JOIN_CHAT_EVENT="joinChat";
const NEW_CHAT_EVENT="newChat";
const TYPING_EVENT="typing";
const STOP_TYPING_EVENT="stopTyping";
const MESSAGE_RECEIVED_EVENT="messageReceived";
const LEAVE_CHAT_EVENT="leaveChat";
const UPDATE_GROUP_NAME_EVENT="updateGroupName";
const Chat=()=> {
const {user}=useAuth();
const {socket}=useSocket();


const currentChat=useRef<ChatListIteminterface|null>(null);
  const [openchatmodal,setopenchatmodal]=useState<boolean>(false);
  const [loadingChats,setLoadingChats]=useState<boolean>(false);
  const [chats,setChat]=useState<ChatListIteminterface[]>([]);
  const [searchQuery,setSearchQuery]=useState();
  const [unreadMessages,setUnreadMessages]=useState<ChatMessageInterface[]>([])
  const [message,setmessage]=useState("");
  const [loadingMessages,setLoadingMessages]=useState(false);
  const [messages,setmessages]=useState<ChatMessageInterface[]>([]);

  const getMessages=async()=>{
    if(!currentChat.current?._id) return alert("no chat selected")

    if(!socket) return alert("Socket not available");

    socket.emit(JOIN_CHAT_EVENT,currentChat.current?._id);

    setUnreadMessages(
      unreadMessages.filter((msg)=>msg.chat!==currentChat.current?._id)

    )
      requestHandler(
        async()=>await getAllchatMessages(currentChat.current?._id||""),
        setLoadingMessages,
        (res)=>{
          const {data}=res;
          setmessages(data||[])
        },alert


      )

  }
const getChats=async()=>{
  requestHandler(
    async()=>await getAllchats(),
    setLoadingChats,
    (res)=>{
      const {data}=res;
      setChat(data||[]);
      
    },alert
  )
}







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
            {loadingChats?(
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
              .map((chat)=>{
                  return(
                  <ChatItem 
                  chat={chat}
                  isActive={chat._id===currentChat.current?._id}
                    unreadCount={
                     unreadMessages.filter((n)=>n.chat===chat._id).length
                    }
                    onCLick={(chat)=>{
                      if(currentChat.current?._id
                        &&
                        currentChat.current._id===chat._id
                        )
                        return;
                        LocalStorage.set("currentChat",chat);
                        setmessage("")
                        getMessages();
                    }}
                    key={chat._id}
                    onChatDelete={(chatId)=>{
                      setChat((prev)=>prev.filter((chat)=>chat._id!==chatId))
                      if(currentChat.current?._id===chatId){
                        currentChat.current=null;
                        LocalStorage.remove("currentChat");
                      }
                    }}
                  />
                    )
                  })
                  )}
          {/* </div> */}
        </div>
                  </div>

        <div className="rightsection"></div>
      </div>
    </>
  );
}

export default Chat;
