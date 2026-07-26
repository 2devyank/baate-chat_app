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
    chatId:string;
    existingParticipantIds?: string[];
  }> = ({ chatId,open, onClose, onSuccess, existingParticipantIds = [] }) => {
    const [user,setusers]=useState<UserInterface[]>([]);
    const [participant,setparticipant]=useState<string>("");
    // @ts-ignore
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
             setusers(
              (data || []).filter(
                (item: UserInterface) => !existingParticipantIds.includes(item._id)
              )
             );
           },
           alert
         );
       };
       const handleadduser=async()=>{
        if (!participant) return alert("please select a user");
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
       },[open, existingParticipantIds]);
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
            <p id="modal-modal-title">Choose User to Add</p>
            <small>Add another participant to this group</small>
          </div>
          <button className="modalclosebutton" onClick={handleClose} type="button" aria-label="Close modal">
            <CancelIcon />
          </button>
        </div>
        <div>
        <Select 
        placeholder={fake}
        options={user} 
        onChange={({_id})=>{setparticipant(_id)}}
        />
        {user.length === 0 ? (
          <p className="modalhelpertext">All available users are already in this group.</p>
        ) : null}
        </div>
        
        <div className="butgrp">
          <button onClick={handleClose} className="modbut modbutsecondary" type="button">Close</button>
          <button onClick={handleadduser} className="modbut" type="button" disabled={!participant}>Add user</button>
        </div>
      </div>
    </Modal>
        ) 
    } 
    export default Adduser;
