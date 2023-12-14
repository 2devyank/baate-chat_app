import axios from "axios";
import { LocalStorage } from "../utils";


const apiClient=axios.create({
    baseURL:import.meta.env.VITE_SERVER_URI,
    withCredentials:true,
    timeout:120000,
})

apiClient.interceptors.request.use(
    function(config){
        const token=LocalStorage.get("token");
        config.headers.Authorization=`Bearer ${token}`;
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)

const loginUser=(data:{username:string;password:string;})=>{
    return apiClient.post("/login",data);
}
const registerUser=(data:{
    email:String;
    password:String;
    username:String;
})=>{
    return apiClient.post("/register",data);
    
}
const logoutUser=()=>{
    return apiClient.post("/logout");
}

export{
    loginUser,
    logoutUser,
    registerUser
}