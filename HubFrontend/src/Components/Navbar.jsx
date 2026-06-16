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
    <div className="sticky top-0 z-50 flex justify-between items-center px-8 lg:px-12 h-18 shadow-lg bg-primary">

      <a href="/LandingPage" className="flex items-center gap-2">
          <img src="/Logo.svg" alt="logo" className="h-14" />

          <div className="flex flex-col leading-none">
            <span className="font-bold text-vanilla-custard text-xl">
              KL InnovationHub
            </span>
            <span className="text-[11px] tracking-widest uppercase text-tan">
              Innovate • Build • Launch
            </span>
          </div>
      </a>
      <ul className="flex items-center text-xs uppercase tracking-[2px] gap-8 text-[#F8F0E5]">
        <li><a href="/dashboard" className="transition-colors duration-200 hover:text-[#C1E8FF]">Dashboard</a></li>
        <li><a href="/exploreProjects" className="transition-colors duration-200 hover:text-[#C1E8FF]">Explore Projects</a></li>
        <li><a href="/leaderBoard" className="transition-colors duration-200 hover:text-[#C1E8FF]">LeaderBoard</a></li>
        <li><a href="/submitProject" className="transition-colors duration-200 hover:text-[#C1E8FF]">Submit Project</a></li>
        <li><a href="" className="transition-colors duration-200 hover:text-[#C1E8FF]">Guide</a></li>
      </ul>
      {
        studentId ? (
        <div className="relative " ref={dropdownRef}>          
          <button  className="flex items-center gap-3 cursor-pointer"  onClick={() => setShowDropdown(!showDropdown)}>
            <FaUserCircle size={35}  className="text-[#FFF9EB] hover:text-[#C1E8FF] transition-colors"/>
          </button>
          {showDropdown && (
              <div className="absolute right-0 mt-3 z-900 w-40 rounded shadow-2xl overflow-hidden"   style={{backgroundColor: "#FFF9EB",color: "#082052",border: "1px solid #D2B48C",}}>               
                <button  onClick={handleProfile}  className="w-full text-left px-4 py-2 transition-colors" 
                         style={{}}onMouseEnter={(e) => e.target.style.backgroundColor = "#F8F0E5"}
                         onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>
                  My Profile
                </button>
                <button  onClick={handleCollab}  className="w-full text-left px-4 py-2 transition-colors" 
                         style={{}}onMouseEnter={(e) => e.target.style.backgroundColor = "#F8F0E5"}
                         onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>
                  Collab Hub
                </button>               
                <button  onClick={handleLogout} className="w-full text-left px-4 py-2 transition-colors" 
                         style={{}}onMouseEnter={(e) => e.target.style.backgroundColor = "#F8F0E5"}
                         onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>
                  Logout
                </button>
              </div>
            )
          }
        </div>
        ) : (
          <div className="flex px-5 items-center gap-1 text-[#FFF9EB]">
            <a href="/login" className="hover:text-[#C1E8FF]">Login/</a>
            <a href="/signup" className="hover:text-[#C1E8FF]">SignIn</a>
          </div>
        )
      }
    </div>
  );
};

export default memo(Navbar);