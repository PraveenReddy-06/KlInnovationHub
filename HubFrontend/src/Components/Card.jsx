import { memo, useState } from 'react';
import { FaGithub, FaHeart } from "react-icons/fa";
import axios from "axios";
import CSECard from "../Images/CSECard.png";
import ECECard from "../Images/ECECard.png";
import CSITCard from "../Images/CSITCard.png";

const Card = ({ project }) => {

  const studentId = Number(localStorage.getItem("studentId"))
  const [liked, setLiked] = useState(project.likes?.some((like) =>Number(like.likedStudentId) === Number(studentId)) || false);
  const [like, setLike] = useState(project.likeCount || 0);
  const handleLike = async () => {
    try {
      const isGroup = project.type === "GROUP";
      const url = isGroup
        ? `http://localhost:8080/grouplikes/toggleLike/${studentId}/${project.groupProjectId}`
        : `http://localhost:8080/likes/toggleLike/${studentId}/${project.projectId}`;
      const res = await axios.post(url);
      setLiked(res.data.liked);
      setLike(res.data.likeCount);
    } catch (err) { console.error(err);}
  };

  const bgMap = { cse: CSECard, ece: ECECard, csit: CSITCard};
  const bg = bgMap[project.branch?.toLowerCase()] || CSITCard;
  console.log("CARD", project);

  return (
    <div className="relative flex flex-col w-full h-full p-4 rounded-2xl overflow-hidden bg-cover bg-center border border-gray-400 text-white" style={{ backgroundImage: `url(${bg})` }}>
      <div className="absolute inset-0 bg-black/40 rounded-xl"></div>

      <div className="relative z-10">
        <h2 className="font-bold pb-1 truncate text-xl">{project.title}</h2>

        <div className="flex gap-3">
          <p>Profile</p>
          <div>
            <p>{project.ownerName} . {project.ownerId}</p>
            {project.type === "GROUP" && project.studentList?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">{
                project.studentList?.filter((student) =>student.studentId !== project.ownerId).map((student) => 
                (<span key={student.studentId}className="text-xs bg-white/20 px-2 py-1 rounded">
                    {student.student_name}
                  </span>
                ))}
              </div>
            )}
            <p className="truncate">{project.tech1} {project.tech2} {project.tech3}</p>
          </div>
        </div>

        <div className="flex gap-7 justify-end items-center text-xs">
          <button onClick={handleLike} className="flex items-center gap-1 active:scale-95">
            Likes<FaHeart className={liked ? "text-red-500" : "text-gray-300"} />
            <span>{like}</span>
          </button>

          <a className="hover:scale-110 transition" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <div className="flex-row items-center justify-center">
              <FaGithub size={22} />
            </div>
          </a>

          <a href={project.liveUrl} className="rounded-2xl text-black bg-emerald-200  px-1.5">.Live</a>
        </div>
      </div>
    </div>
  );
};

export default memo(Card);