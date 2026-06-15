import { memo, useState } from 'react';
import { FaGithub, FaHeart } from "react-icons/fa";
import axios from "axios";

const TopProjectCard = ({project}) => {

  const studentId = Number(localStorage.getItem("studentId"))

  const [liked, setLiked] = useState(project.likes?.some((like) => like.likedStudentId === studentId));
  const [like, setLike] = useState(project.likeCount);

  const handleLike = async () => {
    try {
      const isGroup =project.type === "GROUP";
      const url = isGroup
        ? `http://localhost:8080/grouplikes/toggleLike/${studentId}/${project.groupProjectId}`
        : `http://localhost:8080/likes/toggleLike/${studentId}/${project.projectId}`;
      const res = await axios.post(url);
      setLiked(res.data.liked);
      setLike(res.data.likeCount);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 bg-blue-500 rounded-xl text-white">
      <h2 className="font-bold text-lg pb-3">{project.title}</h2>

      <div className="flex gap-4 items-start">
        <img
          src={project.type === "GROUP"
            ? ( project.teamLead?.avatarUrl || `/avatars/Avatar${(project.teamLead?.studentId % 40) + 1}.svg`
              ): ( project.student?.avatarUrl || `/avatars/Avatar${(project.student?.studentId % 40) + 1}.svg`)}
          alt=""
          className="w-20 h-20 rounded-full object-cover border-2 border-white/30 shrink-0"
        />
        <div className="flex-1">
          <p className="text-md font-semibold leading-none" >{project.ownerName}</p>
          <p className="text-sm text-white/70 mt-1">#{project.ownerId}</p>
          {project.type === "GROUP" && project.studentList?.length > 0 && (
            <div className="flex flex-wrap gap-2 m-2">{
              project.studentList?.filter((student) =>student.studentId !== project.ownerId).map((student) => 
              (<span key={student.studentId}className="text-xs bg-white/15 px-3 py-1 rounded-full text-white/90">
                  {student.student_name}
                </span>
              ))}
            </div>
            )}
          <p className="mt-3 text-md font-medium">{project.tech1} . {project.tech2}</p>     
        </div>
      </div>
      <p className="mt-4 leading-relaxed line-clamp-3">
          {project.description}
      </p>      

      <div className="flex gap-5 justify-end items-center text-xs">
        <button onClick={handleLike} className="flex items-center gap-1 active:scale-95">
          <FaHeart className={liked ? "text-red-500" : "text-gray-300"} size={20} />
          <span> {like}</span>
          Likes
        </button>

        <a className="hover:scale-110 transition" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
          <FaGithub size={30} />
        </a>
        <a href={project.liveUrl}>View</a>
      </div>
    </div>
  );
};

export default memo(TopProjectCard);