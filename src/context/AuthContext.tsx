import { createContext, useContext, useEffect, useState } from "react";
import { UserInterface } from "../interfaces/user";
import { LocalStorage, requestHandler } from "../utils";
import { loginUser, logoutUser, registerUser } from "../api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const AuthContext = createContext<{
  user: UserInterface | null;
  token: string | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

const useAuth = () => useContext(AuthContext);

const AuthProvider :React.FC<{children:React.ReactNode}>= ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const register = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    console.log("async")
    await requestHandler(
      async () => await registerUser(data),
      setIsLoading,
      () => {
        alert("Account created successfullt !");
        navigate("/login");
      },
      
      alert
      // api,
      //loading,
      //onSuccess,
      //onError
    );
    // navigate("/login")
  };

  const login = async (data: { username: string; password: string }) => {
    await requestHandler(
      //api
      async () => await loginUser(data),
      setIsLoading,
      (res) => {
        const { data } = res;
        setUser(data.user);
        setToken(data.accessToken);
        LocalStorage.set("user", data.user);
        LocalStorage.set("token", data.accessToken);
        navigate("/chat");
      },
      alert
    );
    // navigate("/chat")
  };

  const logout =async ()=>{
    await requestHandler(
        async()=>await logoutUser(),
        setIsLoading,
        ()=>{
            setUser(null);
            setToken(null);
            LocalStorage.clear();
            navigate("/login");
        },
        alert
    )
  }
  useEffect(()=>{
    setIsLoading(true);
    const _token=LocalStorage.get("token");
    const _user=LocalStorage.get("user");
    if(_token&&_user?._id){
        setUser(_user);
        setToken(_token);
    }
    setIsLoading(false);
  },[])
  return (
    <AuthContext.Provider
      value={{ logout,user, login, register, token }}
    >
        {isLoading?<Loader/>:children}
    </AuthContext.Provider>
  );
};

export { AuthContext, useAuth, AuthProvider };
