import { memo, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import {useNavigate } from 'react-router-dom';
import {useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import axiosInstance from "../Api/axiosInstance";
import toast from "react-hot-toast";

const Navbar = () => {
  const studentId = JSON.parse(localStorage.getItem("studentId") || "null")
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showNotifications,setShowNotifications] = useState(false);
  const [notifications,setNotifications] = useState([]);
  const [activities,setActivities] = useState([]);
  const [unreadCount,setUnreadCount] = useState(0);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current &&!dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {document.removeEventListener("mousedown", handleClickOutside);};
  }, []);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const res = await axiosInstance.get( "/notification/unreadCount");
        setUnreadCount(res.data);
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
      }
    };
    loadUnreadCount();
  }, []);

  const openNotifications = async () => {
    try{
      setShowDropdown(false);
      await axiosInstance.put("/notification/readAll");
      setShowNotifications(prev => !prev);
      const notificationRes =await axiosInstance.get("/notification");
      const activityRes =await axiosInstance.get("/activity/recent");
      setNotifications(notificationRes.data);
      setActivities(activityRes.data);
      setUnreadCount(0);
    } catch(err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const getNotificationText = (n) => {
  switch (n.notificationType) {
    case "FOLLOWED_USER":
      return `🤝 ${n.actorName} started following you`;

    case "STARTED_FOLLOWING":
      return `🎉 You're now following ${n.referenceName}`;

    case "TEAM_APPLICATION":
      return `👥 ${n.actorName} applied to ${n.referenceName}`;

    case "PROJECT_LIKED":
      return `❤️ ${n.actorName} liked ${n.referenceName}`;

    case "GROUP_PROJECT_LIKED":
      return `🔥 ${n.actorName} appreciated ${n.referenceName}`;

    default:
      return `🔔 ${n.notificationType}`;
  }
};

const getActivityText = (a) => {
  switch (a.activityType) {
    case "PROJECT_CREATED":
      return `🚀 ${a.studentName} launched ${a.referenceName}`;

    case "GROUP_PROJECT_CREATED":
      return `👥 ${a.studentName} unveiled ${a.referenceName}`;

    case "PROJECT_LIKED":
      return `❤️ ${a.studentName} appreciated ${a.referenceName}`;

    case "GROUP_PROJECT_LIKED":
      return `🔥 ${a.studentName} appreciated ${a.referenceName}`;

    default:
      return `📢 ${a.activityType}`;
  }
};

  const navigate = useNavigate()
  const handleProfile =() => {
    navigate("/profile")
  }

  const handleLogout = () => {
  localStorage.removeItem("studentId");
  localStorage.removeItem("student");
  localStorage.removeItem("token");
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
        <div className="flex items-center gap-6 justify-center" ref={dropdownRef}>   
          <div className="relative">
            <button onClick={openNotifications} className="relative">
              <FaBell size={24} className="text-[#FFF9EB] hover:text-[#C1E8FF]" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-14 w-138 max-h-[70vh] overflow-y-auto no-scrollbar bg-primary border border-sky-800 rounded-2xl shadow-2xl z-[9999]">
                <div className="p-4 border-b border-sky-800">
                  <h2 className="text-white font-bold">Notifications</h2>
                </div>

                <div className="p-4">
                  <h3 className="text-cyan-300 font-semibold mb-3">FOR YOU</h3>
                  {notifications.length === 0 ? (
                    <p className="text-slate-400 text-sm">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="bg-white/5 p-3 rounded-xl mb-2">
                        <p className="text-white text-sm">
                          {getNotificationText(n)}
                        </p>
                      </div>
                    ))
                  )}

                  <h3 className="text-cyan-300 font-semibold mt-6 mb-3">CAMPUS BUZZ</h3>
                  {activities.map((a, index) => (
                    <div key={index} className="bg-white/5 p-3 rounded-xl mb-2">
                      <p className="text-white text-sm">
                        {getActivityText(n)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div> 
          <div className="relative">
          <button  className="flex items-center gap-3 cursor-pointer"  onClick={() => {setShowNotifications(false);setShowDropdown(prev => !prev);}}>
            <FaUserCircle size={35}  className="text-[#FFF9EB] hover:text-[#C1E8FF] transition-colors"/>
          </button>
          {showDropdown && (
              <div className="absolute right-0 mt-3 z-1000 w-40 rounded shadow-2xl overflow-hidden"   style={{backgroundColor: "#FFF9EB",color: "#082052",border: "1px solid #D2B48C",}}>               
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