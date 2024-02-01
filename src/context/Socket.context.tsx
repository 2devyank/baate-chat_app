
import { createContext, useContext, useEffect, useState } from "react";
import socketio from "socket.io-client"
import { LocalStorage } from "../utils";
const getSocket=()=>{
    const token=LocalStorage.get("token");

    return socketio(
        import.meta.env.VITE_SOCKET_URI,{
            withCredentials:true,
            auth:{token},
        }
    )
}
const Socketcontext=createContext<{socket:ReturnType<typeof socketio>| null}>({socket:null,});

const useSocket=()=>useContext(Socketcontext);
const SocketProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [socket,setSocket]=useState<ReturnType<typeof socketio>|null>(null);

    useEffect(()=>{
        setSocket(getSocket());
    },[]);
    return (
        <Socketcontext.Provider value={{socket}}>
            {children}
        </Socketcontext.Provider>
    )
}

export {SocketProvider,useSocket};