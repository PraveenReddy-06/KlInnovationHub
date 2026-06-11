import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUpLogin/SignUp";
import Login from "./Pages/SignUpLogin/Login";
import Dashboard from "./Pages/Main/Dashboard";
import Navbar from "./Components/Navbar";
import LandingPage from "./Pages/Main/LandingPage";
import Card from "./Components/Card";
import TopProjectCard from "./Components/TopProjectCard";
import SubmitProject from "./Pages/NavBarPages/SubmitProject";
import Leaderboard from "./Pages/NavBarPages/Leaderboard";
import ExploreProjects from "./Pages/NavBarPages/ExploreProjects";
import Profile from "./Pages/Main/Profile";
import FormATeam from "./Pages/Main/FormATeam";
import TeamApplications from "./Pages/Main/TeamApplications";

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
        <Route path="/topProjectCard" element={< TopProjectCard/>}/>
        <Route path="/submitProject" element={< SubmitProject/>} />
        <Route path="/leaderBoard" element={< Leaderboard/>}/>
        <Route path="/exploreProjects" element={<ExploreProjects/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/formATeam" element={<FormATeam/>}/>
        <Route path="/teamApplications" element={<TeamApplications/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
