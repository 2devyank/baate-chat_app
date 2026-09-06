import axios from "axios";
import { LocalStorage } from "../utils";
import { AttachmentPayload } from "../interfaces/chat";


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

apiClient.interceptors.request.use(
  function (config) {
    const token = LocalStorage.get("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const loginUser = (data: { username: string; password: string }) => {
  return apiClient.post("/login", data);
};
const registerUser = (data: {
  email: String;
  password: String;
  username: String;
}) => {
  return apiClient.post("/register", data);
};
const logoutUser = () => {
  return apiClient.post("/logout");
};
const searchAllUsers = (params?: { search?: string; page?: number; limit?: number }) => {
  return apiClient.get("/allusers", {
    params: {
      search: params?.search || "",
      page: params?.page || 1,
      limit: params?.limit || 10,
    },
  });
};

const getAllchatMessages = (chatId: string) => {
  return apiClient.get(`messages/${chatId}`);
};
const sendMessage = (chatId: string, content: string, attachments: AttachmentPayload[]) => {
    return apiClient.post(`/messages/${chatId}`, {
      content: content || "",
      attachments: attachments || [],
    });
};

const getAllchats=()=>{
    return apiClient.get("/chats")
}

const createOneOnOnecount=(receiverId:string)=>{
    return apiClient.post(`/c/${receiverId}`)
}
const createChatGroup=(data: { name: string; participants: string[] })=>{
  return apiClient.post('/group',data)
}
const deleteOneOnOneChat=(chatId:string)=>{
    return apiClient.delete(`/remove/${chatId}`)
}

const fetchgroupdetails=(chatId:string)=>{
  return apiClient.get(`/group/${chatId}`)
}
const deleteGroup=(chatId:string)=>{
  return apiClient.delete(`/group/${chatId}`)
}
const renamegroupchat=(chatId:string,name:string)=>{
  return apiClient.patch(`/group/${chatId}`,{name})
}
const addNewparticipants=(chatId:string,participantId:string)=>{
  return apiClient.post(`/group/${chatId}/${participantId}`);
}
const removeParticipants=(chatId:string,participantId:string)=>{
  return apiClient.delete(`/group/${chatId}/${participantId}`);
}
const leaveGroup=(chatId:string)=>{
  return apiClient.delete(`/leave/group/${chatId}`)
}
export {
  loginUser,
  logoutUser,
  registerUser,
  searchAllUsers,
  getAllchatMessages,
  sendMessage,
  getAllchats,
  createOneOnOnecount,
  deleteOneOnOneChat,
  createChatGroup,
  fetchgroupdetails,
  deleteGroup,
  renamegroupchat,
  addNewparticipants,
  removeParticipants,
  leaveGroup
};
