import {
  Modal,
  Switch,
} from "@mui/material";
// import Select, { GroupBase } from "react-select"
import React, { useEffect, useState } from "react";
import { ChatListIteminterface } from "../interfaces/chat";
import CancelIcon from "@mui/icons-material/Cancel";
import { UserInterface } from "../interfaces/user";
import "../styles/addchatmodal.css";
import { requestHandler } from "../utils/index";
import { createChatGroup, createOneOnOnecount, searchAllUsers } from "../api/index";
import Select from "./Select";
const label = { inputProps: { "aria-label": "Switch demo" } };
const AddChatmodal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSuccess: (chat: ChatListIteminterface) => void;
}> = ({ open, onClose, onSuccess }) => {
  


  const [userdata, setuserdata] = useState<UserInterface[]>([]);
  const [selectedUserId, SetselectedUserId] = useState<null | string>(null);
  const [isGroupChat, SetisGroupChat] = useState(false);
  const [GroupParticipants, setGroupParticipants] = useState<string[]>([]);
  // @ts-ignore
  const [creatingchat, setcreatingchat] = useState(false);
  const [groupname, setGroupname] = useState<string>(" ");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const handleClose = () => {
    setuserdata([]);
    SetselectedUserId("");
    setGroupParticipants([]);
    setGroupname("");
    setSearchTerm("");
    onClose();
  };

  const createNewChat = async () => {
    if (!selectedUserId) return alert("please select a user");
    await requestHandler(
      async () => await createOneOnOnecount(selectedUserId),
      setcreatingchat,
      (res) => {
        const { data } = res;
        if (res.statusCode === 200) {
          alert("chat already exist");
          return;
        }
        onSuccess(data);
        handleClose();
      },
      alert
    );
  };

  const createGroupChat = async () => {
    if (!GroupParticipants || GroupParticipants.length === 0)
      return alert("please add user");
    await requestHandler(
      async () =>
        await createChatGroup({
          name: groupname,
          participants: GroupParticipants,
        }),
      setcreatingchat,
      (res) => {
        const { data } = res;
        console.log("hello moto");
        onSuccess(data);
        handleClose();
      },
      alert
    );
  };

  const getAllUsers = async (searchQuery: string = "") => {
    await requestHandler(
      async () => await searchAllUsers({ search: searchQuery, page: 1, limit: 10 }),
      setSearchLoading,
      (res) => {
        const { data } = res;
        // Data contains { users, page, limit, totalPages, totalUsers }
        const userList = Array.isArray(data) ? data : data?.users || [];
        setuserdata(userList);
      },
      alert
    );
  };

  // Debounced search when user types
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      getAllUsers(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [open, searchTerm]);
   
    // Example options array
    
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{ className: "chatmodalbackdrop" }}
    >
      <div className="chatmodal">
        <div className="topmodal">
          <div>
            <p id="modal-modal-title">Create chat</p>
            <small>{isGroupChat ? "Create a group conversation" : "Start a direct conversation"}</small>
          </div>
          <button className="modalclosebutton" onClick={handleClose} type="button" aria-label="Close modal">
            <CancelIcon />
          </button>
        </div>
        <div className="modalmode">
        <Switch {...label} checked={isGroupChat} onChange={()=>SetisGroupChat(!isGroupChat)}/> Group chat
        </div>
        {isGroupChat===true &&
          <input className="groupname" type="text" value={groupname} placeholder="Group name" onChange={(e)=>setGroupname(e.target.value)} />
        }
        <div>
        <Select 
        placeholder={isGroupChat}
        options={userdata} 
        onChange={({_id})=>{isGroupChat?setGroupParticipants((prev)=>prev.includes(_id)?prev:[...prev,_id]):SetselectedUserId(_id)}}
        onRemove={(id)=>setGroupParticipants(GroupParticipants.filter((participantId)=>participantId!==id))}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isLoading={searchLoading}
        />
        </div>
        
        <div className="butgrp">
          <button onClick={handleClose} className="modbut modbutsecondary" type="button">Close</button>
          <button onClick={isGroupChat?createGroupChat:createNewChat} className="modbut" type="button">Create</button>
          
        </div>
      </div>
    </Modal>
  );
};

export default AddChatmodal;
