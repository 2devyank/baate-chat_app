import { Autocomplete, Box, Button, Modal, Switch, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { ChatListIteminterface } from "../interfaces/chat";
import CancelIcon from '@mui/icons-material/Cancel';
import { UserInterface } from "../interfaces/user";
import "../styles/addchatmodal.css"

const label = { inputProps: { 'aria-label': 'Switch demo' } };
const AddChatmodal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSuccess: (chat: ChatListIteminterface) => void;
}> = ({ open, onClose, onSuccess }) => {
  // const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    onClose();
  };
  useEffect(() => {
    if (!open) return;
  }, [open]);

  const top100Films:UserInterface[] = [
  ];  
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
          <CancelIcon onClick={()=>onClose()}/>
        </div>
        <Switch {...label} />
        <div>
        <Autocomplete
        
      disablePortal
   
      options={top100Films}
     
      renderInput={(params) => <TextField  className="auto" {...params} label="User" />}
    />
        </div>
        <div className="butgrp">
          <button className="modbut">Close</button>
          <button className="modbut">Create</button>
        </div>
          </div>
      </Modal>
  );
};

export default AddChatmodal;
