import './App.css'
// @ts-ignore
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Chat from './pages/Chat'

function App() {
 

  return (
   
    // <BrowserRouter>
     <div>
     <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/chat" element={<Chat/>} />
     </Routes>
     </div>
    //  </BrowserRouter>
    
  )
}

export default App
