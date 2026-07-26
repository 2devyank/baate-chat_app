import { useEffect, useState } from "react";
import { requestHandler } from "../utils";
import { deleteGroup, fetchgroupdetails, removeParticipants, renamegroupchat, searchAllUsers } from "../api";
import { UserInterface } from "../interfaces/user";
import { ChatListIteminterface } from "../interfaces/chat";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Adduser from "./Adduser";
import { useAuth } from "../context/AuthContext";
import ChatAvatar from "./ChatAvatar";
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
    existingParticipantIds={groupparticipants.map((participant)=>participant._id)}
    />
    <aside className={`groupdrawer${open ? " groupdraweropen" : ""}`} aria-label="Group information">
      <div className="groupdrawertopbar">
        <span>Group Info</span>
        <button className="groupiconbutton" onClick={handleClose} type="button" aria-label="Close group details">
          <CloseIcon />
        </button>
      </div>
      <div className="groupdrawerhero">
        <ChatAvatar className="groupdraweravatar" title={groupname || "Group"} />
        <div className="groupdraweridentity">
          <div className="groupdrawertitlerow">
            {openrename?(
              <input className="grouprenameinput" value={groupname} onKeyDown={(e)=>{
                if(e.key==="Enter"){
                  renamegroup();
                  setrenameall(groupname);
                  setrename_id(chatId);
                  setopenrename(false);
                }
              }}  onChange={(e)=>setgroupname(e.target.value)}/>
            ):(<h2 className="groupdrawertitle">{groupname}</h2>)}
            <button className="groupiconbutton" onClick={()=>setopenrename(true)} type="button" aria-label="Rename group">
              <EditIcon />
            </button>
          </div>
          <span className="groupstatusbadge">{groupparticipants?.length || 0} members</span>
        </div>
      </div>
      <div className="groupsectionheader">
        <span>Members</span>
        <small>{groupparticipants?.length || 0} total</small>
      </div>
      <div className="groupparticipants">
        {groupparticipants?.map((item)=>{
          return (
            <div className="groupparticipant" key={item._id}>
            <div className="groupparticipantidentity">
              <ChatAvatar className="groupparticipantavatar" src={item.avatar?.url} title={item.username} />
              <span>{item.username}</span>
            </div>
            <button className="groupremovebutton" onClick={()=>removegroupparticipants(item._id)} type="button">Remove</button>
            </div>
          )
        })}
      </div>
      <div className="groupactions">
        <button onClick={()=>setopenaddname(true)} type="button">Add Participant</button>
        <button onClick={deletegroupchat} type="button">Delete Group</button>
      </div>
    </aside>
        </>
  );
};

export default Groupcard;
