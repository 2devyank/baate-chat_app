
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

    const socketUri = import.meta.env.VITE_SOCKET_URI;
    if (!socketUri) {
      console.warn("VITE_SOCKET_URI is not defined");
      return;
    }

    const newSocket = socketio(socketUri, {
      withCredentials: true,
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
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