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
  


  const [userdata,setuserdata]=useState<UserInterface[]>([]);
  const [selectedUserId,SetselectedUserId]=useState<null|string>(null);
  const [isGroupChat,SetisGroupChat]=useState(false);
  const [GroupParticipants,setGroupParticipants]=useState<string[]>([]);
  // @ts-ignore
  const [creatingchat,setcreatingchat]=useState(false);
  const [groupname,setGroupname]=useState<string>(" ");
  const handleClose = () => {
    setuserdata([])
    SetselectedUserId("")
    setGroupParticipants([])
    setGroupname("");
    onClose();
  };


  
  
  const createNewChat=async()=>{

    if(!selectedUserId) return alert('please select a user');
    await requestHandler(
    async()=>await createOneOnOnecount(selectedUserId),
    setcreatingchat,
    (res)=>{
      const {data}=res;
      if(res.statusCode===200){
        alert("chat already exist")
        return;
      }
      onSuccess(data);
      handleClose();
    },
    alert
    )
  }
  const createGroupChat=async()=>{
    if(!GroupParticipants) return alert('please add user');
    await requestHandler(
      async()=>await createChatGroup({
        name:groupname,
        participants:GroupParticipants
      }),
      setcreatingchat,
      (res)=>{
        const {data}=res;
        console.log("hello moto");
        onSuccess(data);
        handleClose();
        },
      alert
    );
  };
  const getAllUsers = async () => {
   await requestHandler(
      async () => await searchAllUsers(),
      null,
      (res) => {
        const { data } = res;
        setuserdata(data||[]);
      },
      alert
      );
    };
    

    useEffect(() => {
      if (!open) return;
      getAllUsers();
    }, [open]);
   
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
