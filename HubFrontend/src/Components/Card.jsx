import { memo, useState } from 'react';
import { FaGithub, FaHeart } from "react-icons/fa";
import axios from "axios";
import CSECard from "../Images/CSECard.png";
import ECECard from "../Images/ECECard.png";
import CSITCard from "../Images/CSITCard.png";



const Card = ({ project }) => {

  const studentId = JSON.parse(localStorage.getItem("studentId"))

  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(project.likeCount);

  const handleLike = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/likes/toggleLike/${studentId}/${project.projectId}`);
      setLiked(res.data.liked);
      setLike(res.data.likeCount);

    } catch (err) {
      console.error(err);
    }
  };

  const bgMap = { cse: CSECard, ece: ECECard, csit: CSITCard};

  const bg = bgMap[project.student?.branch?.toLowerCase()] || CSITCard;

  return (
    <div className="relative flex flex-col w-full p-3 rounded-xl bg-cover bg-center text-white" style={{ backgroundImage: `url(${bg})` }}>
      <div className="absolute inset-0 bg-black/40 rounded-xl"></div>

      <div className="relative z-10">
        <h2 className="font-bold pb-1">{project.projectName}</h2>

        <div className="flex gap-3">
          <p>Profile</p>
          <div>
            <p>{project.student?.student_name} . {project.student?.studentId}</p>
            <p>{project.tech1} {project.tech2}</p>
          </div>
        </div>

        <div className="flex gap-7 justify-end items-end ">
          <button onClick={handleLike} className="flex items-center gap-1 active:scale-95">
            <FaHeart className={liked ? "text-red-500" : "text-gray-300"} />
            <span>{like}</span>
          </button>

          <a className="hover:scale-110 transition" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <FaGithub size={22} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default memo(Card);