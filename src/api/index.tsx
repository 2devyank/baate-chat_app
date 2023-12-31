import axios from "axios";
import { LocalStorage } from "../utils";


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
const searchAllUsers = () => {
  return apiClient.get("/allusers");
};

const getAllchatMessages = (chatId: string) => {
  return apiClient.get(`messages/${chatId}`);
};
const sendMessage = (chatId: string, content: string, attachments: File[]) => {
  const formData=new FormData();
  if(content){
    console.log("content ayta vha",content)
    formData.append("content",content);
  }
  console.log("formdata",formData);
    return apiClient.post(`/messages/${chatId}`,{content});
};

const getAllchats=()=>{
    return apiClient.get("/chats")
}

const createOneOnOnecount=(receiverId:string)=>{
    return apiClient.post(`/c/${receiverId}`)
}
const deleteOneOnOneChat=(chatId:string)=>{
    return apiClient.delete(`/remove/${chatId}`)
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
  deleteOneOnOneChat
};
