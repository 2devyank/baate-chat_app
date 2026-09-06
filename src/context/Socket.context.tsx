
import { createContext, useContext, useEffect, useState } from "react";
import socketio from "socket.io-client";
import { useAuth } from "./AuthContext";

const Socketcontext = createContext<{ socket: ReturnType<typeof socketio> | null }>({
  socket: null,
});

const useSocket = () => useContext(Socketcontext);

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<ReturnType<typeof socketio> | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    // Only connect if the user is authenticated with a valid token
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const rawSocketUri = import.meta.env.VITE_SOCKET_URI || import.meta.env.VITE_SERVER_URI;
    if (!rawSocketUri) {
      console.warn("VITE_SOCKET_URI is not defined");
      return;
    }

    // Strip trailing /chatapp or /chatapp/ or trailing slashes to prevent Socket.io treating /chatapp as an invalid namespace
    const socketUri = rawSocketUri.replace(/\/chatapp\/?$/i, "").replace(/\/+$/, "");

    const newSocket = socketio(socketUri, {
      withCredentials: true,
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected successfully with ID:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  return (
    <Socketcontext.Provider value={{ socket }}>
      {children}
    </Socketcontext.Provider>
  );
};

export { SocketProvider, useSocket };