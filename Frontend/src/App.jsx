import './App.css'
import CodingBattle from './component/coding_battle.jsx'
import LobbyPage from './component/lobby_page.jsx'
import LoginPage from './component/login_page.jsx'
import Final_leaderboard from "./component/final_leaderboard.jsx"
import WaitingRoom from './component/waiting_room.jsx'
import SignupPage from './component/Signup_page.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/lobby" element={<LobbyPage socket={socket} />} />
        <Route path="/waiting-room" element={<WaitingRoom socket={socket} />} />
        <Route path="/battle" element={<CodingBattle socket={socket} />} />
        <Route path="/leaderboard" element={<Final_leaderboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
