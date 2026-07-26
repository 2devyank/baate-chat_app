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
import ChatAvatar from "./ChatAvatar";
const ChatItem: React.FC<{
  chat: ChatListIteminterface;
  onCLick: (chat: ChatListIteminterface) => void;
  isActive?: boolean|undefined;
  unreadCount?: number|undefined;
  onChatDelete: (chatId: string) => void;
  // @ts-ignore
}> = ({ chat, onCLick, isActive, unreadCount = 0, onChatDelete }) => {
  const { user,rename_id,renameall } = useAuth();
  const [openoptions, setopenoptions] = useState(false);
  const [opendots, setopendots] = useState(false);
  const [opengroupinfo, setopengroupinfo] = useState(false);
  console.log("section", chat);
  const metadata = getChatobjectMetadata(chat, user);
  const title =
    chat._id === rename_id ? renameall || metadata.title : metadata.title;
 
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
  if (!chat){
    return null;
  }

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
      className={`role${isActive ? " roleactive" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => onCLick(chat)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCLick(chat);
        }
      }}
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
        aria-label="Open chat actions"
        >
          <MoreVertIcon />
        </button>
      )}
      {openoptions && (
        chat.isGroupChat?(
          <div className="chatitemmenu">
            <button
              className="pbut"
              onClick={(e) => {
                e.stopPropagation();
                setopengroupinfo(true);
              }}
              type="button"
            > 
              <InfoIcon />
              About Group
            </button>
          </div>
        ):(
          <div className="chatitemmenu">
          <button
            className="pbut"
            onClick={(e) => {
              e.stopPropagation();
              const ok = confirm("are you sure you want to delete");
              if (ok) {
                DeleteChat();
              }
            }}
            type="button"
          >
            <DeleteIcon />
            Delete Chat
          </button>
          </div>
          )
          )}
      <ChatAvatar
        className="chatItemimg"
        src={metadata.avatar}
        title={title}
      />
      <div className="headone">
        <div className="tilecard">
          <div className="chatitemtitleline">
            <span className="chatitemtitle">{title}</span>
            {chat.isGroupChat ? <span className="groupbadge">Group</span> : null}
          </div>
          <small className="smalllasttext">
            {metadata.lastMessage}
          </small>
        </div>
        <div className="chatitemmeta">
          <small className="smalltime">
            {moment(chat.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}
          </small>
          {unreadCount <= 0 ? null : (
            <span className="unreadbadge">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
        </div>
      </div>
    </div>
            </>
  );
};

export default ChatItem;
