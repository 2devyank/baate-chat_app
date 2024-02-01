import { useEffect, useState } from "react";
import { requestHandler } from "../utils";
import { deleteGroup, fetchgroupdetails, removeParticipants, renamegroupchat, searchAllUsers } from "../api";
import { UserInterface } from "../interfaces/user";
import { ChatListIteminterface } from "../interfaces/chat";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Adduser from "./Adduser";
import { useAuth } from "../context/AuthContext";
const Groupcard: React.FC<{
  open: boolean;
  onClose: () => void;
  chatId: string;
  onGroupdelete:(chatId:string)=>void;
}> = ({ open, onClose, chatId,onGroupdelete }) => {
  // @ts-ignore
  const [userdata, setuserdata] = useState<UserInterface[]>([]);
  const [groupdata, setgroupdata] = useState<ChatListIteminterface[]>([]);
  const [groupparticipants,setgroupparticipants]=useState<UserInterface[]>([]);
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

   await requestHandler(
      async()=>await fetchgroupdetails(chatId),
      null,
      (res)=>{
        const {data}=res;
        console.log("ggdata"+data[0]?.participants)
        setgroupdata(data);
        setgroupname(data[0]?.name||"");
        setgroupparticipants(data[0]?.participants);
      },
      alert
    )

  }
  const deletegroupchat=async()=>{
   await requestHandler(
      async()=>await deleteGroup(chatId),
      null,
      ()=>{
       onGroupdelete(chatId);
       handleClose(); 
      },
      alert

    )
  }
  const removegroupparticipants=async(p_id:string)=>{
    const newarr=groupparticipants.filter((item)=>{
     return item._id!==p_id
    })
   setgroupparticipants(newarr)
   await requestHandler(
      async()=>await removeParticipants(chatId,p_id),
      null,
      ()=>{
        const updatedGroupDetails={
          ...groupdata,
          participants:(groupdata[0]?.participants && groupdata[0]?.participants.filter(
            (p)=>p._id!==p_id
          ))||[],
        }
       
        setgroupdata(updatedGroupDetails as ChatListIteminterface[] );
        alert("user removed");
      },
      alert
    )
  }
  console.log("gg"+groupparticipants);
  const renamegroup=async()=>{
   await requestHandler(
      async()=>renamegroupchat(chatId,groupname),
      null,
      (res)=>{
        const {data}=res;
        setgroupname(data[0].name);
       
      },
      alert
    )
  }

console.log("group info",groupdata)
console.log("group info",groupdata[0]?.name)
// useEffect(()=>{
  // renamegroup();
// },[groupname]);
  useEffect(() => {
    if (!open) return;

    getAllUsers();
    fetchGroupInformation();
  },[open]);
  const [openrename,setopenrename]=useState(false);
  const [openaddname,setopenaddname]=useState(false);
  console.log("hamara group ka data",groupdata )
  console.log("hamara group ka naam",groupname )
  console.log("hamara group ka users",groupparticipants )
  const {setrenameall,setrename_id}=useAuth();
  return (
    <>
    <Adduser
    chatId={chatId}
    open={openaddname}
    onClose={()=>setopenaddname(false)}
    onSuccess={()=>{
      fetchGroupInformation()
    }}
    />
    <div style={{top:"0px",right:"0px",zIndex:"1",position:"absolute",display:open?"flex":"none",flexDirection:"column",height:"100vh",width:"50%",background:"rgba(89, 90, 100, 0.458)",color:"white"}}>
      <div style={{height:"40%",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid black"}}>
     <span style={{fontSize:"34px",display:"flex",gap:"10px"}}>
      
      {openrename?(<input style={{padding:"10px 10px",fontSize:"14px",borderRadius:"8px",borderStyle:"none"}} value={groupname} onKeyDown={(e)=>{
        if(e.key==="Enter"){
          renamegroup();
          setrenameall(groupname);
          setrename_id(chatId);
          setopenrename(false);

        }
      }}  onChange={(e)=>setgroupname(e.target.value)}/>):(groupname)}
      </span>
      <span>
        <EditIcon style={{cursor:"pointer"}} onClick={()=>setopenrename(true)}/>
        </span>
      </div>
    <div style={{position:"absolute",top:"0px",right:"0px"}}>
    <CloseIcon onClick={handleClose}/>
    </div>
      <div>
        {groupparticipants?.map((item)=>{
          return (
            <div style={{display:"flex",justifyContent:"space-between",padding:"20px",borderBottom:"1px solid black"}}>
            <span>{item.username}</span>
            <button style={{padding:"2px 2px",borderRadius:"6px",cursor:"pointer",background:"lightgrey"}} onClick={()=>removegroupparticipants(item._id)}>remove</button>
            </div>
          )
        })}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
        <button onClick={()=>setopenaddname(true)} style={{cursor:"pointer",padding:"10px 10px",background:"rgb(29, 169, 200)"}}>Add Participant</button>
        <button onClick={deletegroupchat} style={{cursor:"pointer",padding:"10px 10px",background:"rgb(29, 169, 200)"}}>Delete Group</button>
      </div>
    </div>
        </>
  );
};

export default Groupcard;
