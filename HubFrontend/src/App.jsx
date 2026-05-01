import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUpLogin/SignUp";
import Login from "./Pages/SignUpLogin/Login";
import Dashboard from "./Pages/Main/Dashboard";
import Navbar from "./Components/Navbar";
import LandingPage from "./Pages/Main/LandingPage";
import Card from "./Components/Card";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/navbar" element={<Navbar/>}/>
        <Route path="/card" element={< Card/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
