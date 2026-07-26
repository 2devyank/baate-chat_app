import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './context/Socket.context'
import ToastProvider from './components/ToastProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <ToastProvider />
    <AuthProvider>
      <SocketProvider>
    <App />
      </SocketProvider> 
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
