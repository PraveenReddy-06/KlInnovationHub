import { memo, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import {useNavigate } from 'react-router-dom';

const Navbar = () => {
  const studentId = JSON.parse(localStorage.getItem("studentId") || "null")

  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate()
  const handleProfile =() => {
    navigate("/profile")
  }

  const handleLogout = () => {
  localStorage.removeItem("studentId");
  navigate("/");
  };

  return (
    <div className="flex justify-between items-center py-4 px-10 bg-blue-600 text-amber-50">

      <a href="/LandingPage">Logo</a>
      <ul className="flex items-center gap-8">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/exploreProjects">Explore Projects</a></li>
        <li><a href="/leaderBoard">LeaderBoard</a></li>
        <li><a href="/formATeam">Form A Team</a></li>
        <li><a href="/submitProject">Submit Project</a></li>
        <li><a href="">Guide</a></li>
      </ul>
      {
        studentId ? (
        <div className="relative">          
          <button  className="flex items-center gap-3 cursor-pointer"  onClick={() => setShowDropdown(!showDropdown)}>
            <FaUserCircle size={35} />
          </button>
          {showDropdown && (
              <div className="absolute right-0 mt-3 w-40 bg-white text-black rounded shadow-lg overflow-hidden">               
                <button  onClick={handleProfile}  className="w-full text-left px-4 py-2 hover:bg-gray-100" >
                  Profile
                </button>
                <button  onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )
          }
        </div>
        ) : (
          <div className="flex px-5 items-center">
            <a href="/login">Login/</a>
            <a href="/signup">SignIn</a>
          </div>
        )
      }
    </div>
  );
};

export default memo(Navbar);