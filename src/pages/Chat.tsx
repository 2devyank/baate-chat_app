import { useState } from "react";
import AddChatmodal from "../components/AddChatmodal";
import "../styles/chat.css";
function Chat() {

  const [openchatmodal,setopenchatmodal]=useState<boolean>(false);
 
  
  return (
    <>
    <AddChatmodal
    open={openchatmodal}
    onClose={()=>{
      setopenchatmodal(false);
    }}
    onSuccess={()=>{

    }}
    />
      <div className="overall">
        <div className="leftsection">
          <div className="topleft">
            <input className="inputchat" type="text" placeholder="Search user or group" />
            <button className="butaddchat" onClick={()=>{
              setopenchatmodal(true)
            }}>+ Add chat</button>
          </div>



          <div className="usertab"></div>
        </div>

        <div className="rightsection"></div>
      </div>
    </>
  );
}

export default Chat;
