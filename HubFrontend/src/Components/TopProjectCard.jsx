import { memo, useState } from 'react';
import { FaGithub, FaHeart } from "react-icons/fa";
import axiosInstance from "../Api/axiosInstance"
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const TopProjectCard = ({project}) => {

  const studentId = Number(localStorage.getItem("studentId"))

  const [liked, setLiked] = useState(project.likes?.some((like) => like.likedStudentId === studentId));
  const [like, setLike] = useState(project.likeCount);

  const handleLike = async () => {
    try {
      const isGroup =project.type === "GROUP";
      const url = isGroup
        ? `/grouplikes/toggleLike/${project.groupProjectId}`
        : `/likes/toggleLike/${project.projectId}`;
      const res = await axiosInstance.post(url);
      setLiked(res.data.liked);
      setLike(res.data.likeCount);
      if (window.gtag) {
        window.gtag("event", "project_like");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const navigate = useNavigate();

  const handleProfileClick = () => {
    const id =project.type === "GROUP"? project.teamLead?.studentId: project.student?.studentId;
    if (window.gtag) {
      window.gtag("event", "profile_view");
    }
    navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-col w-full p-3 sm:p-4 bg-white border border-slate-400 rounded-2xl shadow-sm transition-all duration-300 hover:bg-tan/50 hover:shadow-xl hover:border-amber-800">
      <h2 className="font-bold text-base sm:text-lg pb-3 text-bloodstone group-hover:text-accent transition-colors">{project.title}</h2>

      <div className="flex gap-3 sm:gap-4 items-start hover:bg-tan/40 rounded-lg p-2 transition-all duration-200 cursor-pointer"
            onClick={handleProfileClick}>
        <img
          src={project.type === "GROUP"
            ? ( project.teamLead?.avatarUrl || `/avatars/Avatar${(project.teamLead?.studentId % 40) + 1}.webp`
              ): ( project.student?.avatarUrl || `/avatars/Avatar${(project.student?.studentId % 40) + 1}.webp`)}
          
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border border-slate-200 shrink-0"
        />
        <div className="flex-1">
          <p className="text-sm sm:text-base font-semibold leading-none break-words" >{project.ownerName}</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">#{project.ownerId}</p>
          {project.type === "GROUP" && project.studentList?.length > 0 && (
            <div className="flex flex-wrap gap-2 m-2">{
              project.studentList?.filter((student) =>student.studentId !== project.ownerId).map((student) => 
              (<span key={student.studentId}
                      onClick={(e) => { e.stopPropagation(); navigate(`/profile/${student.studentId}`);}}
                     className="text-[10px] sm:text-xs bg-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                  {student.student_name}
                </span>
              ))}
            </div>
            )}
          <p className="mt-3 text-sm sm:text-base font-medium text-bloodstone">{project.tech1} . {project.tech2}</p>     
        </div>
      </div>
      <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3">
          {project.description}
      </p>      

      <div className="flex flex-wrap justify-between sm:justify-end gap-3 sm:gap-5 items-center text-xs text-slate-500 mt-4">
        <button onClick={handleLike} className="flex items-center gap-1 hover:text-red-500 transition">
          <FaHeart className={liked ? "text-red-500" : "text-slate-400"} size={18} />
          <span className="font-semibold text-slate-700"> {like}</span>
          Likes
        </button>

        <a className="hover:text-black transition" href={project.githubUrl} target="_blank" rel="noopener noreferrer"
          onClick={() => {
              if (window.gtag) {
                  window.gtag("event", "github_click");
              }
          }}        
        >
          <FaGithub className="text-2xl sm:text-3xl" />
        </a>
        <a href={project.liveUrl} className="font-semibold text-blue-600 hover:underline"
          onClick={() => {
              if (window.gtag) {
                  window.gtag("event", "live_demo_click");
              }
          }} >
          View
        </a>
      </div>
    </div>
  );
};

export default memo(TopProjectCard);