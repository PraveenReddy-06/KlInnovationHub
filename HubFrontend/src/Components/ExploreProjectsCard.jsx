import { memo } from "react";
import { Heart, Users, User, MessageCircle } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const ExploreProjectCard = ({project,navigate,handleLike,handleLiveUrlClick,handleGithubClick,setSelectedDiscussionProject,}) => {
  const isGroup = project.type === "GROUP";
  const title = isGroup ? project.project_name : project.projectName;
  const ownerName = isGroup ? project.teamLead?.student_name : project.student?.student_name;
  const ownerId = isGroup ? project.teamLead?.studentId : project.student?.studentId;
  const branch = isGroup ? project.teamLead?.branch : project.student?.branch;
  const year = isGroup ? project.teamLead?.year : project.student?.year;
  const likes = project.likeCount || 0;

  return (
    <div className="bg-cream hover:bg-vanilla-custard rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-amber-800">
      <div className="p-4">
        <div  className="flex gap-4 items-center mb-3 cursor-pointer bg-blend-luminosity hover:bg-amber-100 rounded-lg transition"
          onClick={() =>navigate(`/profile/${isGroup ? project.teamLead?.studentId : project.student?.studentId}`)}>
          <img  src={  isGroup? project.teamLead?.avatarUrl ||`/avatars/Avatar${(project.teamLead?.studentId % 40) + 1}.webp`
                    : project.student?.avatarUrl ||`/avatars/Avatar${(project.student?.studentId % 40) + 1}.webp`}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shrink-0"alt=""/>
          <div className="min-w-0">
            <h3 className="font-bold text-lg sm:text-xl leading-tight text-gray-900 truncate">
              {title}
            </h3>
            <p className="font-medium text-gray-800 truncate">{ownerName}</p>
          </div>
        </div>

        {isGroup && (
          <div className="flex flex-wrap gap-2 mt-2 mb-3">
            {project.studentList?.filter((student) => student.studentId !== ownerId).map((student) => (
                <span key={student.studentId} className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                  {student.student_name}
                </span>
              ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{branch}</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{year}</span>
          <span className={`text-xs px-2 py-1 rounded text-white ${  isGroup ? "bg-purple-500" : "bg-blue-500"}`}>
            {isGroup ? "Group" : "Individual"}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[project.tech1, project.tech2, project.tech3]
            .filter(Boolean).map((tech, index) => (
              <span key={`${tech}-${index}`} title={tech}  className="min-w-0 truncate text-center text-xs bg-gray-100 px-2 py-1 rounded text-blue-700">
                {tech}
              </span>
            ))}
        </div>

        <p className="text-sm leading-relaxed text-gray-600 mt-3 line-clamp-3">
          {project.description}
        </p>

        <div className="flex justify-between items-center mt-5">
          {isGroup ? (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users size={16} />
              Team
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User size={16} />
              Solo
            </div>
          )}

          <button  onClick={() => setSelectedDiscussionProject(project)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition cursor-pointer"
          >
            <MessageCircle size={20} />
            {project.discussionCount || 0}
          </button>

          <button onClick={() => handleLike(project)} className="flex items-center gap-1 text-sm">
            <Heart  size={22}  fill={project.isLiked ? "red" : "transparent"}
              className={`transition ${project.isLiked ? "text-red-500" : "text-gray-400"}`}
            />
            {likes} Likes
          </button>
        </div>

        {/* Live + GitHub */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {project.liveUrl && (
            <a href={project.liveUrl}   target="_blank"  rel="noopener noreferrer"  onClick={handleLiveUrlClick}
              className="flex-1 text-center bg-accent hover:bg-blue-700 text-white px-5 py-2 rounded text-sm cursor-pointer"
            >
              View Project
            </a>
          )}

          {project.githubUrl && (
            <a  href={project.githubUrl}  target="_blank"  rel="noreferrer"  onClick={handleGithubClick}
              className="w-full sm:w-14 border px-3 py-2 rounded flex items-center justify-center hover:bg-gray-100 cursor-pointer"
            >
              <FaGithub size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ExploreProjectCard);