import { memo, useState } from 'react';
import { FaGithub, FaHeart } from "react-icons/fa";
import axiosInstance from "../Api/axiosInstance"
import CSECard from "../Images/CSECard.png";
import ECECard from "../Images/ECECard.png";
import CSITCard from "../Images/CSITCard.png";
import { useNavigate } from "react-router-dom";

const Card = ({ project }) => {

  const studentId = Number(localStorage.getItem("studentId"))
  const [liked, setLiked] = useState(project.likes?.some((like) =>Number(like.likedStudentId) === Number(studentId)) || false);
  const [like, setLike] = useState(project.likeCount || 0);
  const navigate = useNavigate();
  const handleLike = async () => {
    try {
      const isGroup = project.type === "GROUP";
      const url = isGroup
        ? `/grouplikes/toggleLike/${studentId}/${project.groupProjectId}`
        : `/likes/toggleLike/${studentId}/${project.projectId}`;
      const res = await axiosInstance.post(url);
      setLiked(res.data.liked);
      setLike(res.data.likeCount);
    } catch (err) { console.error(err);}
  };
  const handleProfileClick = () => {
    const id = project.type === "GROUP"? project.teamLead?.studentId: project.student?.studentId;
    navigate(`/profile/${id}`);
  };

  const bgMap = { cse: CSECard, ece: ECECard, csit: CSITCard};
  const bg = bgMap[project.branch?.toLowerCase()] || CSITCard;

  return (
    <div className="relative flex flex-col w-full h-full p-4 rounded-2xl overflow-hidden bg-cover bg-center border border-tan/40 text-white" style={{ backgroundImage: `url(${bg})` }}>
      <div className="absolute inset-0 bg-primary/55 rounded-xl"></div>

      <div className="relative z-10">
        <h2 className="font-bold truncate text-md text-vanilla-custard">{project.title}</h2>
        <div className="flex gap-3 items-start cursor-pointer  hover:bg-light-blue/10 rounded-lg p-2 transition"onClick={handleProfileClick}>
          <img
            src={project.type === "GROUP"? (project.teamLead?.avatarUrl ||`/avatars/Avatar${(project.teamLead?.studentId % 40) + 1}.svg`
            ) : (project.student?.avatarUrl ||`/avatars/Avatar${(project.student?.studentId % 40) + 1}.svg`)}
            
            className="w-14 h-14 rounded-full object-cover border-2 border-white/30"
          />
          <div className="flex-1">
            <p className="text-white">{project.ownerName} . {project.ownerId}</p>
            {project.type === "GROUP" && project.studentList?.length > 0 && (
              <div className="flex flex-wrap gap-1">{
                project.studentList?.filter((student) =>student.studentId !== project.ownerId).map((student) => 
                (<span key={student.studentId}
                      onClick={(e) => { e.stopPropagation(); navigate(`/profile/${student.studentId}`);}}
                      className="text-xs bg-tan/25 text-vanilla-custard px-2 py-1 rounded">
                    {student.student_name}
                  </span>))}
              </div>
            )}
            <p className="truncate text-sm">{project.tech1} . {project.tech2} . {project.tech3}</p>
          </div>
        </div>

        <div className="flex gap-7 justify-end items-center text-xs">
          <button onClick={handleLike} className="flex items-center gap-1 active:scale-95">
            Likes<FaHeart className={liked ? "text-red-500" : "text-gray-300"} />
            <span>{like}</span>
          </button>

          <a className="hover:scale-110 transition" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <div className="text-vanilla-custard hover:text-light-blue transition">
              <FaGithub size={22} />
            </div>
          </a>

          <a href={project.liveUrl} className="rounded-2xl px-3 py-1 text-vanilla-custard bg-accent hover:bg-sky transition">View</a>
        </div>
      </div>
    </div>
  );
};

export default memo(Card);