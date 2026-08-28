import { memo, useState } from 'react';
import { FaGithub, FaHeart } from "react-icons/fa";
import axiosInstance from "../Api/axiosInstance";
import CSECard from "../Images/CSECard.png";
import ECECard from "../Images/ECECard.png";
import CSITCard from "../Images/CSITCard.png";
import { useNavigate } from "react-router-dom";
import { Globe, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import ProjectDiscussion from "./ProjectDiscussion/ProjectDiscussion";

const Card = ({ project }) => {
  const studentId = Number(localStorage.getItem("studentId"));
  const isReviewer = !!localStorage.getItem("reviewerToken");
  const isStudent = !!localStorage.getItem("token");
  const [liked, setLiked] = useState(project.likes?.some((like) => Number(like.likedStudentId) === Number(studentId)) || false);
  const [like, setLike] = useState(project.likeCount || 0);
  const [discussionCount, setDiscussionCount] = useState(project.discussionCount || 0);
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const navigate = useNavigate();

  const requireLogin = () => {
    if (!localStorage.getItem("token") && !localStorage.getItem("reviewerToken")) { toast.error("Please login to continue"); navigate("/login"); return false; }
    return true;
  };
  const handleLike = async () => {
    if (isReviewer) { toast("Reviewers cannot like projects."); return; }
    if (!isStudent) { toast.error("Please login to continue"); navigate("/login"); return; }
    try {
      const isGroup = project.type === "GROUP";
      const url = isGroup ? `/grouplikes/toggleLike/${project.groupProjectId}` : `/likes/toggleLike/${project.projectId}`;
      const res = await axiosInstance.post(url);
      setLiked(res.data.liked); setLike(res.data.likeCount);
    } catch { toast.error("Something went wrong. Please try again."); }
  };
  const handleProfileClick = () => navigate(`/profile/${project.type === "GROUP" ? project.teamLead?.studentId : project.student?.studentId}`);
  const handleExternalClick = (e) => { if (!requireLogin()) e.preventDefault(); };
  const bgMap = { cse: CSECard, ece: ECECard, csit: CSITCard };
  const bg = bgMap[project.branch?.toLowerCase()] || CSITCard;
  const changeDiscussionCount = (delta = 1) => setDiscussionCount((value) => Math.max(0, value + delta));

  return (
    <>
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-tan/40 bg-cover bg-center p-3 text-white sm:p-4" style={{ backgroundImage: `url(${bg})` }}>
        <div className="absolute inset-0 rounded-xl bg-primary/55"></div>
        <div className="relative z-10">
          <h2 className="truncate text-base font-bold text-vanilla-custard sm:text-md">{project.title}</h2>
          <div className="flex cursor-pointer items-start gap-2 rounded-lg p-2 transition hover:bg-light-blue/10 sm:gap-3" onClick={handleProfileClick}>
            <img src={project.type === "GROUP" ? (project.teamLead?.avatarUrl || `/avatars/Avatar${(project.teamLead?.studentId % 40) + 1}.webp`) : (project.student?.avatarUrl || `/avatars/Avatar${(project.student?.studentId % 40) + 1}.webp`)} className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-white/30 object-cover sm:h-14 sm:w-14" />
            <div className="flex-1"><p className="break-words text-sm text-white sm:text-base">{project.ownerName} . {project.ownerId}</p>{project.type === "GROUP" && project.studentList?.length > 0 && <div className="flex flex-wrap gap-1">{project.studentList.filter((student) => student.studentId !== project.ownerId).map((student) => <span key={student.studentId} onClick={(e) => { e.stopPropagation(); navigate(`/profile/${student.studentId}`); }} className="rounded bg-tan/25 px-2 py-1 text-[10px] text-vanilla-custard sm:text-xs">{student.student_name}</span>)}</div>}<p className="truncate text-xs sm:text-sm">{project.tech1} . {project.tech2} . {project.tech3}</p></div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:justify-end sm:gap-6">
            <button onClick={handleLike} className={`flex items-center gap-1 ${isReviewer ? "cursor-default opacity-80" : "active:scale-95"}`}>Likes <FaHeart className={liked ? "text-red-500" : "text-gray-300"} /> <span>{like}</span></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setDiscussionOpen(true); }} className="flex items-center gap-1 text-vanilla-custard transition hover:text-white active:scale-95" aria-label="Open project discussion"><MessageCircle size={19} /><span>{discussionCount}</span></button>
            <a className="transition hover:scale-110" href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={handleExternalClick}><FaGithub size={22} /></a>
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-2xl bg-sky-500 px-2 py-1 text-xs text-vanilla-custard transition hover:bg-sky-700 sm:px-3 sm:text-sm" onClick={handleExternalClick}>Try It <Globe size={16} /></a>}
          </div>
        </div>
      </div>
      <ProjectDiscussion project={project} isOpen={discussionOpen} onClose={() => setDiscussionOpen(false)} onDiscussionCreated={changeDiscussionCount} />
    </>
  );
};

export default memo(Card);
