import { memo, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import {useNavigate } from 'react-router-dom';
import {useRef, useEffect } from "react";

const Navbar = () => {
  const studentId = JSON.parse(localStorage.getItem("studentId") || "null")
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current &&!dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {document.removeEventListener("mousedown", handleClickOutside);};
  }, []);


  const navigate = useNavigate()
  const handleProfile =() => {
    navigate("/profile")
  }

  const handleLogout = () => {
  localStorage.removeItem("studentId");
  navigate("/");
  };

  const handleCollab = () => {
    navigate("/teamApplications")
  }

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center px-8 lg:px-12 h-18 bg-blue-600 border-b border-slate-200 shadow-sm">

      <a href="/LandingPage" className="flex items-center gap-2">
          <img src="/Logo.svg" alt="logo" className="h-14" />

          <div className="flex flex-col leading-none">
            <span className="font-bold text-slate-900 text-xl">
              KL Innovation Hub
            </span>
            <span className="text-[11px] tracking-widest uppercase text-black">
              Innovate • Build • Launch
            </span>
          </div>
      </a>
      <ul className="flex items-center text-xs uppercase tracking-[2px] gap-8">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/exploreProjects">Explore Projects</a></li>
        <li><a href="/leaderBoard">LeaderBoard</a></li>
        <li><a href="/submitProject">Submit Project</a></li>
        <li><a href="">Guide</a></li>
      </ul>
      {
        studentId ? (
        <div className="relative " ref={dropdownRef}>          
          <button  className="flex items-center gap-3 cursor-pointer"  onClick={() => setShowDropdown(!showDropdown)}>
            <FaUserCircle size={35} />
          </button>
          {showDropdown && (
              <div className="absolute right-0 mt-3 z-900 w-40 bg-white text-black rounded shadow-lg overflow-hidden">               
                <button  onClick={handleProfile}  className="w-full text-left px-4 py-2 hover:bg-gray-100" >
                  My Profile
                </button>
                <button  onClick={handleCollab}  className="w-full text-left px-4 py-2 hover:bg-gray-100" >
                  Collab Hub
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