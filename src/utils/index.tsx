import { AxiosResponse } from "axios";
import { FreeAPISuccessResponseInterface } from "../interfaces/api";
import { ChatListIteminterface } from "../interfaces/chat";
import { UserInterface } from "../interfaces/user";

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
    console.log("aya va data", data);
    if (data?.success) {
      console.log("hi");
      onSuccess(data);
    }
  } catch (error: any) {
    if ([401, 403].includes(error?.response.data?.statusCode)) {
      localStorage.clear();
      if (isBrowser) window.location.href = "/login";
    }
    onError(error?.response?.data?.message || "something went wrong");
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
  chat: ChatListIteminterface,
  LoggedInUser: UserInterface|null
) => {
  const lastMessage = chat.lastMessage?.content
    ? chat.lastMessage?.content
    : chat.lastMessage
    ? `${chat.lastMessage?.attachments?.length}attachment${
        chat.lastMessage.attachments.length > 1 ? "s" : ""
      }`
    : "No messages yet";
  const participant = chat.participants.find(
    (p) => p._id !== LoggedInUser?._id
  );
  return {
    avatar: participant?.avatar.url,
    title: participant?.username,
    description: participant?.email,
    lastMessage,
  };
};
