import { AxiosResponse } from "axios";
import { FreeAPISuccessResponseInterface } from "../interfaces/api";
import { ChatListIteminterface } from "../interfaces/chat";
import { UserInterface } from "../interfaces/user";
import { showToast } from "../components/ToastProvider";

export const isBrowser = typeof window !== "undefined";

export const requestHandler = async (
  api: () => Promise<AxiosResponse<FreeAPISuccessResponseInterface, any>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: FreeAPISuccessResponseInterface) => void,
  onError: (error: string) => void
) => {
  setLoading && setLoading(true);
  try {
    const response = await api();
    const { data } = response;
    if (data?.success) {
      onSuccess(data);
    } else {
      const message = data?.message || "Something went wrong";
      showToast(message, "error");
      onError && onError(message);
    }
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.data?.reason ||
      error?.message ||
      "Something went wrong";

    showToast(errorMessage, "error");

    const isAuthPage =
      isBrowser && ["/login", "/register"].includes(window.location.pathname);

    if (error?.response?.data?.statusCode === 401 && !isAuthPage) {
      localStorage.clear();
      if (isBrowser) window.location.href = "/login";
    }

    if (onError && (!isBrowser || onError !== window.alert)) {
      onError(errorMessage);
    }
  } finally {
    setLoading && setLoading(false);
  }
};

export class LocalStorage {
  static get(key: string) {
    if (!isBrowser) return;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (err) {
        return null;
      }
    }
    return null;
  }
  static set(key: string, value: any) {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }
  static remove(key: string) {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  }
  static clear() {
    if (!isBrowser) return;
    localStorage.clear();
  }
}
export const getChatobjectMetadata = (
  chat: ChatListIteminterface ,
  LoggedInUser: UserInterface|null
) => {
  const lastMessage = chat.lastMessage?.content
    ? chat.lastMessage?.content
    : chat.lastMessage
    ? `${chat.lastMessage?.attachments?.length}attachment${
        chat.lastMessage.attachments.length > 1 ? "s" : ""
      }`
    : "No messages yet";
    if(chat.isGroupChat){
      return{
        avatar:"",
        title:chat.name,
        description:`${chat.participants?.length} member in the group`,
        lastMessage:chat.lastMessage?
        chat.lastMessage?.sender?.username+": "+lastMessage 
        :lastMessage,
      };
    }else{

      const participant = chat.participants.find(
        (p) => p._id !== LoggedInUser?._id
        );
        return {
          avatar: participant?.avatar?.url || "",
          title: participant?.username,
          description: participant?.email,
          lastMessage,
        };
      }
      };
      
