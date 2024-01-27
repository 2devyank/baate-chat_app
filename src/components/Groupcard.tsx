import { useEffect, useState } from "react";
import { requestHandler } from "../utils";
import { fetchgroupdetails, searchAllUsers } from "../api";
import { UserInterface } from "../interfaces/user";
import { ChatListIteminterface } from "../interfaces/chat";

const Groupcard: React.FC<{
  open: boolean;
  onClose: () => void;
  chatId: string;
  // onGroupDelete:(chatId:string)=>void;
}> = ({ open, onClose, chatId }) => {
  
  const [userdata, setuserdata] = useState<UserInterface[]>([]);
  const [groupdata, setgroupdata] = useState<ChatListIteminterface|null>(null);
  const [groupname,setgroupname]=useState<string>("");
  const handleClose = () => {
    onClose();
  };
  const getAllUsers = async () => {
   await requestHandler(
      async () => await searchAllUsers(),
      null,
      (res) => {
        const { data } = res;
        setuserdata(data || []);
      },
      alert
    );
  };
  const fetchGroupInformation=async ()=>{

    requestHandler(
      async()=>await fetchgroupdetails(chatId),
      null,
      (res)=>{
        const {data}=res;
        setgroupdata(data);
        setgroupname(data?.name||"");
      },
      alert
    )

  }

  useEffect(() => {
    if (!open) return;

    getAllUsers();
    fetchGroupInformation();
  },[open]);
  return (
    <div style={{display:open?"block":"none"}}>
      <div></div>
      <div></div>
      <div>
        <button>Add Participant</button>
        <button>Delete Group</button>
      </div>
    </div>
  );
};

export default Groupcard;
