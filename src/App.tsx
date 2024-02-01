import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './pages/Register.tsx'
import Login from './pages/Login.tsx'
import Chat from './pages/Chat.tsx'

function App() {
 

  return (
   
    // <BrowserRouter>
     <div>
     <Routes>
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/chat" element={<Chat/>} />
     </Routes>
     </div>
    //  </BrowserRouter>
    
  )
}

export default App
