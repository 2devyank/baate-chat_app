import { Modal } from "@mui/material";
import Select from "./Select";
import { useEffect, useState } from "react";
import { requestHandler } from "../utils";
import { addNewparticipants, searchAllUsers } from "../api";
import { UserInterface } from "../interfaces/user";
import CancelIcon from "@mui/icons-material/Cancel";
import { ChatListIteminterface } from "../interfaces/chat";

const Adduser: React.FC<{
    open: boolean;
    onClose: () => void;
    onSuccess: (chat: ChatListIteminterface) => void;
    chatId:string
  }> = ({ chatId,open, onClose, onSuccess }) => {
    const [user,setusers]=useState<UserInterface[]>([]);
    const [participant,setparticipant]=useState<string>("");
    const [fake,setfake]=useState(false);
    const handleClose=()=>{
        onClose();
    }
    const getAllUsers = async () => {
        await requestHandler(
           async () => await searchAllUsers(),
           null,
           (res) => {
             const { data } = res;
             setusers(data || []);
           },
           alert
         );
       };
       const handleadduser=async()=>{
        await requestHandler(
          async()=>await addNewparticipants(chatId,participant),
          null,
          (res)=>{
            const {data}=res;
            onSuccess(data);
            handleClose();
          },
          alert
        )
       }
       useEffect(()=>{
        if(!open) return;
        getAllUsers();
       },[open]);
  return (

      <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
      <div className="chatmodal">
        <div className="topmodal">
          <p>Choose User to Add</p>
          <CancelIcon onClick={handleClose} />
        </div>
        <div>
        <Select 
        placeholder={fake}
        options={user} 
        onChange={({_id})=>{setparticipant(_id)}}
        />
        </div>
        
        <div className="butgrp">
          <button onClick={handleClose} className="modbut">Close</button>
          <button onClick={handleadduser} className="modbut">Add user</button>
        </div>
      </div>
    </Modal>
        ) 
    } 
    export default Adduser;