import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './context/Socket.context'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
    <App />
      </SocketProvider> 
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
