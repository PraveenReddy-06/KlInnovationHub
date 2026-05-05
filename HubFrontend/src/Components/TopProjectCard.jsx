import { memo, useState } from 'react';
import { FaGithub, FaHeart } from "react-icons/fa";
import axios from "axios";

const TopProjectCard = ({project}) => {
  const studentId = 2400032662;

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

  return (
    <div className="flex flex-col w-full p-4 bg-blue-500 rounded-xl text-white">
      <h2 className="font-bold pb-3">{project.projectName}</h2>

      <div className="flex flex-row gap-5 items-center">
        <p>Profile</p>
        <div className="flex flex-col">
          <p>{project.student?.student_name} . {project.student?.studentId}</p>
          <p>{project.tech1} . {project.tech2}</p>
          <p className="pt-1.5">{project.description}</p>       
        </div>
      </div>


    <div className="flex gap-10 justify-end items-end">
      <button onClick={handleLike} className="flex items-center gap-1 active:scale-95">
        <FaHeart className={liked ? "text-red-500" : "text-gray-300"} size={25} />
        <span> {like}</span>
        Likes
      </button>

      <a className="hover:scale-110 transition" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
        <FaGithub size={30} />
      </a>
    </div>
    </div>
  );
};

export default memo(TopProjectCard);