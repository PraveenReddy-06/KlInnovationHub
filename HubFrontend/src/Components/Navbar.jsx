import { memo, useState } from 'react';
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import axiosInstance from "../Api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";


const Navbar = () => {
  const studentId = JSON.parse(localStorage.getItem("studentId") || "null")
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications,setShowNotifications] = useState(false);
  const [notifications,setNotifications] = useState([]);
  const [notificationTab, setNotificationTab] = useState("forYou");
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [activities,setActivities] = useState([]);
  const isLoggedIn = !!localStorage.getItem("token");
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
    if (!studentId) return;
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
    if (!studentId) return;
    
    if (showNotifications) {
      setShowNotifications(false);
      return;
    }
    try{
      setShowDropdown(false);
      setNotificationsLoading(true);
      setShowNotifications(true);
      await axiosInstance.put("/notification/readAll");
    const [notificationRes, activityRes] =await 
    Promise.all ([axiosInstance.get("/notification")
                  ,axiosInstance.get("/activity/recent"), 
    ]);
      setNotifications(notificationRes.data);
      setActivities(activityRes.data);
      setUnreadCount(0);
    } catch(err) {
      toast.error("Something went wrong. Please try again.");
    }finally {
      setNotificationsLoading(false);
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

    case "COLLABORATION_CREATED":
      return `🤝 ${a.studentName} posted a team recruitment for "${a.referenceName}".`

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
    <div className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-12 h-16 lg:h-18 shadow-lg bg-primary">
      <button  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}  className="lg:hidden text-white text-2xl">
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <a href="/LandingPage" className="flex items-center gap-2 shrink-0">
          <img src="/Logo.svg" alt="logo" className="h-10 sm:h-12 lg:h-14" />

          <div className="flex flex-col leading-none">
            <span className="font-bold text-vanilla-custard text-sm sm:text-lg lg:text-xl">
              KL InnovationHub
            </span>
            <span className="hidden sm:block text-[10px] lg:text-[11px] tracking-widest uppercase text-tan">
              Innovate • Build • Launch
            </span>
          </div>
      </a>

      <ul className="hidden lg:flex items-center text-xs uppercase tracking-[2px] gap-8 text-cream">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => `relative transition-colors duration-200 hover:text-light-blue after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-gray-800 after:transition-all after:duration-300 ${isActive ? "text-light-blue after:w-full" : "after:w-0"}`}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/exploreProjects" className={({ isActive }) => `relative transition-colors duration-200 hover:text-light-blue after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-gray-800 after:transition-all after:duration-300 ${isActive ? "text-light-blue after:w-full" : "after:w-0"}`}>
            Explore Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/leaderBoard" className={({ isActive }) => `relative transition-colors duration-200 hover:text-light-blue after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-gray-800 after:transition-all after:duration-300 ${isActive ? "text-light-blue after:w-full" : "after:w-0"}`}>
            LeaderBoard
          </NavLink>
        </li>
        <li>
          <NavLink to={isLoggedIn ? "/submitProject" : "/login"} className={({ isActive }) => `relative transition-colors duration-200 hover:text-light-blue after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-gray-800 after:transition-all after:duration-300 ${isActive ? "text-light-blue after:w-full" : "after:w-0"}`}>
            Submit Project
          </NavLink>
        </li>
        <li>
          <NavLink to={isLoggedIn ? "/guide" : "/login"} className={({ isActive }) => `relative transition-colors duration-200 hover:text-light-blue after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:bg-gray-800 after:transition-all after:duration-300 ${isActive ? "text-light-blue after:w-full" : "after:w-0"}`}>
            Guide
          </NavLink>
        </li>
      </ul>
      {
        studentId ? (
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 justify-center" ref={dropdownRef}>
          <div className="relative">
            <button onClick={openNotifications} className="relative">
              <FaBell size={24} className="sm:text-[22px] lg:text-[24px] text-vanilla-custard hover:text-light-blue"/>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="fixed left-1/2 top-20 -translate-x-1/2 w-[95vw] max-w-137.5 sm:absolute sm:right-0 sm:left-auto sm:top-14 sm:translate-x-0 max-h-[70vh] overflow-hidden bg-primary border border-sky-800 rounded-2xl shadow-2xl z-9999">
                <div className="p-4 border-b border-sky-800">
                  <h2 className="text-white font-bold">Notifications</h2>
                </div>

                <div className="flex border-b border-sky-800">
                  <button  onClick={() => setNotificationTab("forYou")}  className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${notificationTab === "forYou" ? "text-cyan-300" : "text-slate-400 hover:text-white"}`}>
                    For You
                    {notificationTab === "forYou" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-300" />}
                  </button>
                  <button onClick={() => setNotificationTab("campus")} className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${notificationTab === "campus" ? "text-cyan-300" : "text-slate-400 hover:text-white"}`}>
                    Campus Buzz
                    {notificationTab === "campus" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-300" />}
                  </button>
                </div>

                <div className="p-4 max-h-[55vh] overflow-y-auto no-scrollbar">
                  {notificationsLoading ? (
                    <div className="flex flex-col items-center justify-center py-14">
                      <div className="w-8 h-8 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin" />
                      <p className="text-slate-400 text-sm mt-4">Loading notifications...</p>
                    </div>
                  ) : notificationTab === "forYou" ? (
                    notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-14">
                        <p className="text-slate-400 text-sm">No notifications</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications.slice(0, 10).map((n) => (
                          <div key={n.id} className="bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-xl transition-colors">
                            <p className="text-white text-sm">{getNotificationText(n)}</p>
                          </div>
                        ))}
                      </div>
                    )
                  ) : activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14">
                      <p className="text-slate-400 text-sm">No campus activity</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activities.slice(0, 10).map((a, index) => (
                        <div key={index} className="bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-xl transition-colors">
                          <p className="text-white text-sm">{getActivityText(a)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div> 
          <div className="relative">
          <button  className="flex items-center gap-3 cursor-pointer"  onClick={() => {setShowNotifications(false);setShowDropdown(prev => !prev);}}>
            <FaUserCircle size={35}  className="sm:text-[32px] lg:text-[35px] text-vanilla-custard hover:text-light-blue transition-colors"/>
          </button>
          {showDropdown && (
              <div className="absolute right-0 mt-3 z-1000 w-36 sm:w-40 rounded shadow-2xl overflow-hidden"   style={{backgroundColor: "#FFF9EB",color: "#082052",border: "1px solid #D2B48C",}}>               
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
          <div className="flex items-center gap-1 sm:gap-2 text-sm lg:text-base text-vanilla-custard">
            <a href="/login" className="hover:text-light-blue">Login</a>
            <a href="/signup" className="hover:text-light-blue">/ SignUp</a>
          </div>
        )
      }
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-primary lg:hidden shadow-xl border-t border-white/10">
          <div className="flex flex-col py-4">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 text-white hover:bg-white/10">
              Dashboard
            </Link>
            <Link to="/exploreProjects" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 text-white hover:bg-white/10">
              Explore Projects
            </Link>
            <Link to="/leaderBoard" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 text-white hover:bg-white/10">
              Leaderboard
            </Link>
            <Link to="/submitProject" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 text-white hover:bg-white/10">
              Submit Project
            </Link>
            <Link to="/guide" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 text-white hover:bg-white/10">
              Guide
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Navbar);