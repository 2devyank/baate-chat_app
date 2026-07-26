import { useEffect, useRef, useState } from "react";
import AddChatmodal from "../components/AddChatmodal";
import SendIcon from "@mui/icons-material/Send";
import AttachmentIcon from "@mui/icons-material/Attachment";
import "../styles/chat.css";
import {
  ChatListIteminterface,
  ChatMessageInterface,
} from "../interfaces/chat";
import { LocalStorage, getChatobjectMetadata, requestHandler } from "../utils";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/ChatItem";
import { useSocket } from "../context/Socket.context";
import { getAllchatMessages, getAllchats, sendMessage } from "../api";
import MessageItem from "../components/MessageItem";
import ChatAvatar from "../components/ChatAvatar";

const CONNECTED_EVENT = "connected";
const DISCONNECTED_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinChat";
const NEW_CHAT_EVENT = "newChat";
// const TYPING_EVENT = "typing";
// const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
const LEAVE_CHAT_EVENT = "leaveChat";
// const UPDATE_GROUP_NAME_EVENT = "updateGroupName";

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const Chat = () => {
  const { user ,rename_id,renameall} = useAuth();
  const { socket } = useSocket();
  const viewref = useRef<HTMLDivElement>(null);
  const currentChat = useRef<ChatListIteminterface | null>(null);
  const [openchatmodal, setopenchatmodal] = useState<boolean>(false);
  const [loadingChats, setLoadingChats] = useState<boolean>(false);
  const [chats, setChat] = useState<ChatListIteminterface[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>(
    []
  );

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [attachedFilePreviews, setAttachedFilePreviews] = useState<
    { file: File; url: string }[]
  >([]);
  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState<ChatMessageInterface[]>([]);
  // @ts-ignore
  const [Isconnected, setIsConnected] = useState(false);
  const getMessages = async () => {
    if (!currentChat.current?._id) return alert("no chat selected");

    if (!socket) return alert("Socket not available");

    socket.emit(JOIN_CHAT_EVENT, currentChat.current?._id);

    setUnreadMessages(
      unreadMessages.filter((msg) => msg.chat !== currentChat.current?._id)
    );
    requestHandler(
      async () => await getAllchatMessages(currentChat.current?._id || ""),
      setLoadingMessages,
      (res) => {
        const { data } = res;
        setmessages(data || []);
      },
      alert
    );
  };
  const getChats = async () => {
    requestHandler(
      async () => await getAllchats(),
      setLoadingChats,
      (res) => {
        const { data } = res;
        setChat(data || []);
      },
      alert
    );
  };
  console.log("yh chats", chats);
  const updateLastChatMessage = (
    chatToUpdateId: string,
    message: ChatMessageInterface
  ) => {
    const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!;
    chatToUpdate.lastMessage = message;
    chatToUpdate.updatedAt = message?.updatedAt;

    setChat([
      chatToUpdate,
      ...chats.filter((chat) => chat._id !== chatToUpdateId),
    ]);
  };
  const onMessageReceived = (message: ChatMessageInterface) => {
    if (message.chat !== currentChat.current?._id) {
      setUnreadMessages((prev) => [...prev, message]);
    } else {
      setmessages((msg) => [...msg, message]);
    }
    updateLastChatMessage(message.chat, message);
  };
  console.log("phela", messages);
  console.log("dusra", message);
  // const handleOnMessageChange = () => {};
  const onConnect = () => {
    setIsConnected(true);
  };
  const onDisconnect = () => {
    setIsConnected(false);
  };
  const onNewChats = (chat: ChatListIteminterface) => {
    setChat((prev) => [chat, ...prev]);
  };
  console.log("files", attachedFiles);
  const sendChatMessage = async () => {
    if (!currentChat.current?._id || !socket) return;
    await requestHandler(
      async () =>
        await sendMessage(
          currentChat.current?._id || "",
          message,
          attachedFiles
        ),
      null,
      (res) => {
        setmessage("");
        setAttachedFiles([]);
        setmessages((prev) => [...prev, res.data]);
        updateLastChatMessage(currentChat.current?._id || "", res.data);
      },
      alert
    );
  };
  const removeAttachedFile = (fileIndex: number) => {
    setAttachedFiles((prev) => prev.filter((_, index) => index !== fileIndex));
  };
  const onChatLeave = (chat: ChatListIteminterface) => {
    if (chat._id === currentChat.current?._id) {
      currentChat.current = null;
      LocalStorage.remove("currentchat");
    }
    setChat((prev) => prev.filter((c) => c._id !== chat._id));
  };
  useEffect(() => {
    getChats();

    const _currentChat = LocalStorage.get("currentChat");

    if (_currentChat) {
      currentChat.current = _currentChat;
      socket?.emit(JOIN_CHAT_EVENT, _currentChat.current?._id);
      getMessages();
    }
  }, []);
  useEffect(() => {
    if (!socket) return;

    socket.on(CONNECTED_EVENT, onConnect);
    socket.on(DISCONNECTED_EVENT, onDisconnect);
    socket.on(MESSAGE_RECEIVED_EVENT, onMessageReceived);
    socket.on(NEW_CHAT_EVENT, onNewChats);
    socket.on(LEAVE_CHAT_EVENT, onChatLeave);

    return () => {
      socket.off(CONNECTED_EVENT, onConnect);
      socket.off(DISCONNECTED_EVENT, onDisconnect);
      socket.off(MESSAGE_RECEIVED_EVENT, onMessageReceived);
      socket.off(NEW_CHAT_EVENT, onNewChats);
      socket.off(LEAVE_CHAT_EVENT, onChatLeave);
    };
  }, [socket, chats]);
  useEffect(() => {
    viewref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages,currentChat]);
  useEffect(() => {
    const previews = attachedFiles.map((file) => ({
      file,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }));

    setAttachedFilePreviews(previews);

    return () => {
      previews.forEach((preview) => {
        if (preview.url) URL.revokeObjectURL(preview.url);
      });
    };
  }, [attachedFiles]);
  const selectedChatMetadata = currentChat.current
    ? getChatobjectMetadata(currentChat.current, user)
    : null;
  return (
    <>
      <AddChatmodal
        open={openchatmodal}
        onClose={() => {
          setopenchatmodal(false);
        }}
        onSuccess={() => {
          getChats();
        }}
      />
      <div className="overall">
        <aside className="leftsection" aria-label="Chat sidebar">
          <div className="topleft">
            <input
              className="inputchat"
              type="text"
              placeholder="Search user or group"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="butaddchat"
              onClick={() => {
                setopenchatmodal(true);
              }}
            >
              <span aria-hidden="true">+</span> Add chat
            </button>
          </div>
          <div className="downleft">
            {loadingChats ? (
              <div className="chatliststatus">Loading chats...</div>
            ) : (
              [...chats]
                .filter((chat) =>
                  searchQuery
                    ? getChatobjectMetadata(chat, user)
                        .title?.toLocaleLowerCase()
                        ?.includes(searchQuery.toLocaleLowerCase())
                    : true
                )
                .map((chat) => {
                  return (
                    <ChatItem
                      chat={chat} 
                      isActive={chat._id === currentChat.current?._id}
                      unreadCount={
                        unreadMessages.filter((n) => n.chat === chat._id).length
                      }
                      onCLick={(chat) => {
                        if (
                          currentChat.current?._id &&
                          currentChat.current._id === chat._id
                        )
                          return;
                        LocalStorage.set("currentChat", chat);
                        currentChat.current = chat;
                        setmessage("");
                        getMessages();
                      }}
                      key={chat._id}
                      onChatDelete={(chatId) => {
                        setChat((prev) =>
                          prev.filter((chat) => chat._id !== chatId)
                        );
                        if (currentChat.current?._id === chatId) {
                          currentChat.current = null;
                          LocalStorage.remove("currentChat");
                        }
                      }}
                    />
                  );
                })
            )}
            {/* </div> */}
          </div>
        </aside>

        {currentChat.current && currentChat.current?._id ? (
          <main className="rightsection">
            <div className="sticktop">
              <ChatAvatar
                className="chatimg"
                src={selectedChatMetadata?.avatar}
                title={selectedChatMetadata?.title}
              />
              <div className="topuserinfo">
                <span>
                  {currentChat.current._id===rename_id?(renameall?renameall:selectedChatMetadata?.title):(selectedChatMetadata?.title)}
                </span>
                <small className="small">
                  {selectedChatMetadata?.description}
                </small>
              </div>
            </div>
            <div  className="messagesection">
              {loadingMessages ? (
                <span className="chatliststatus">Loading messages...</span>
              ) : (
                <>
                  {messages?.map((msg) => {
                    return (
                      <div ref={viewref} className="messagerow" key={msg._id}>
                      <MessageItem
                        key={msg._id}
                        isOwnMessage={msg.sender?._id === user?._id}
                        isGroupChatMessage={currentChat.current?.isGroupChat}
                        message={msg}
                        />
                        </div>
                    );
                  })}
                </>
              )}
            </div>
            <div className="messagecomposer">
              {attachedFiles.length > 0 ? (
                <div className="attachmentpreviewbar" aria-label="Selected attachments">
                  {attachedFilePreviews.map(({ file, url }, index) => (
                    <div className="attachmentpreview" key={`${file.name}-${index}`}>
                      {url ? (
                        <img src={url} alt={file.name} />
                      ) : (
                        <span className="filepreviewicon" aria-hidden="true">
                          {file.name.split(".").pop()?.slice(0, 3).toUpperCase() || "FILE"}
                        </span>
                      )}
                      <div className="attachmentpreviewmeta">
                        <span>{file.name}</span>
                        <small>{formatFileSize(file.size)}</small>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachedFile(index)}
                        aria-label={`Remove ${file.name}`}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            <div className="messageinput">
              <input
                hidden
                id="attachments"
                type="file"
                value=""
                multiple
                max={5}
                onChange={(e) => {
                  if (e.target.files) {
                    setAttachedFiles([...e.target.files]);
                  }
                }}
              />
              <label htmlFor="attachments" className="attachment">
                <AttachmentIcon />
              </label>
              <input
                placeholder="message"
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendChatMessage();
                  }
                }}
                className="messageenter"
                onChange={(e) => setmessage(e.target.value)}
                type="text"
              />
              <button
                disabled={!message && attachedFiles.length <= 0}
                onClick={sendChatMessage}
                className="sendmessage"
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
            </div>
          </main>
        ) : (
          <main className="emptychatpanel">
            <p>No Chat Selected</p>
          </main>
        )}
      </div>
    </>
  );
};

export default Chat;
