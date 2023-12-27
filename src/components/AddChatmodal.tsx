import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
// import Select, { GroupBase } from "react-select"
import React, { useEffect, useState } from "react";
import { ChatListIteminterface } from "../interfaces/chat.tsx";
import CancelIcon from "@mui/icons-material/Cancel";
import { UserInterface } from "../interfaces/user.tsx";
import "../styles/addchatmodal.css";
import { requestHandler } from "../utils/index.tsx";
import { createOneOnOnecount, searchAllUsers } from "../api/index.tsx";
import Select from "./Select.tsx";
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
  const [creatingchat,setcreatingchat]=useState(false);
  const handleClose = () => {
    setuserdata([])
    SetselectedUserId("")
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
  const getAllUsers = async () => {
    requestHandler(
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
    >
      <div className="chatmodal">
        <div className="topmodal">
          <p>Create chat</p>
          <CancelIcon onClick={() => onClose()} />
        </div>
        <div>
        <Switch {...label} /> Is it a Group chat ?
        </div>
        <div>
        <Select 
        placeholder={isGroupChat}
        options={userdata} 
        onChange={({_id})=>{isGroupChat?setGroupParticipants([...GroupParticipants,_id]):SetselectedUserId(_id)}}
        />
        </div>
        <div className="butgrp">
          <button onClick={handleClose} className="modbut">Close</button>
          <button onClick={createNewChat} className="modbut">Create</button>
        </div>
      </div>
    </Modal>
  );
};

export default AddChatmodal;


