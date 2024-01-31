import React, { useState } from "react";
import { getChatobjectMetadata, requestHandler } from "../utils";
import { ChatListIteminterface } from "../interfaces/chat";
import { useAuth } from "../context/AuthContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from '@mui/icons-material/Info';
import moment from "moment";
import { deleteOneOnOneChat } from "../api";
import "../styles/chatItem.css";
import Groupcard from "./Groupcard";
const ChatItem: React.FC<{
  chat: ChatListIteminterface;
  onCLick: (chat: ChatListIteminterface) => void;
  isActive?: boolean;
  unreadCount?: number;
  onChatDelete: (chatId: string) => void;
}> = ({ chat, onCLick, isActive, unreadCount = 0, onChatDelete }) => {
  const { user } = useAuth();
  const [openoptions, setopenoptions] = useState(false);
  const [opendots, setopendots] = useState(false);
  const [opengroupinfo, setopengroupinfo] = useState(false);
  console.log("section", chat);
  const DeleteChat = async () => {
    await requestHandler(
      async () => await deleteOneOnOneChat(chat._id),
      null,
      () => {
        onChatDelete(chat._id);
      },
      alert
    );
  };
  if (!chat) return;
  return (
    <>
    <Groupcard
    open={opengroupinfo}
    chatId={chat._id}
    onClose={()=>{
      setopengroupinfo(false);
    }}
    onGroupdelete={onChatDelete}
    />
    <div
      className="role"
      role="button"
      onClick={() => onCLick(chat)}
      onMouseLeave={() => {
        setopenoptions(false);
        setopendots(false);
        // setopengroupinfo(false);
      }}
      onMouseEnter={() => setopendots(true)}
      >
      {opendots && (
        <button
        className="dotbutton"
        onClick={(e) => {
          e.stopPropagation();
          setopenoptions(!openoptions);
        }}
        >
          <MoreVertIcon />
        </button>
      )}
      {openoptions && (
        chat.isGroupChat?(
          <div>
            <p className="pbut"> 
            <InfoIcon onClick={()=>setopengroupinfo(true)}/>
              About Group
            </p>
          </div>
        ):(
          <div>
          <p
          className="pbut"
          onClick={(e) => {
            e.stopPropagation();
            const ok = confirm("are you sure you want to delete");
            if (ok) {
              DeleteChat();
            }
          }}
          role="button"
          >
          <DeleteIcon />
          Delete Chat
          </p>
          </div>
          )
          )}
      <div>
        <img className="chatItemimg" src={getChatobjectMetadata(chat, user!).avatar} alt="" />
      </div>
      <div className="headone">
        <div className="tilecard">
          <span>{getChatobjectMetadata(chat, user).title}</span>
          <small className="smalllasttext">
            {getChatobjectMetadata(chat, user).lastMessage}
          </small>
        </div>
        <div>
          <small className="smalltime">
            {moment(chat.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}
          </small>
          {unreadCount <= 0 ? null : (
            <span>{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
        </div>
      </div>
    </div>
            </>
  );
};

export default ChatItem;
