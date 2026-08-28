import { memo, useState } from 'react';
import { FaGithub, FaHeart } from "react-icons/fa";
import axiosInstance from "../Api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import ProjectDiscussion from "./ProjectDiscussion/ProjectDiscussion";

const TopProjectCard = ({ project }) => {
  const studentId = Number(localStorage.getItem("studentId"));
  const isReviewer = !!localStorage.getItem("reviewerToken");
  const isStudent = !!localStorage.getItem("token");
  const [liked, setLiked] = useState(project.likes?.some((like) => Number(like.likedStudentId) === studentId));
  const [like, setLike] = useState(project.likeCount || 0);
  const [discussionCount, setDiscussionCount] = useState(project.discussionCount || 0);
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const navigate = useNavigate();
  const requireLogin = () => { if (!localStorage.getItem("token") && !localStorage.getItem("reviewerToken")) { toast.error("Please login to continue"); navigate("/login"); return false; } return true; };
  const handleLike = async () => {
    if (isReviewer) { toast("Reviewers cannot like projects."); return; }
    if (!isStudent) { toast.error("Please login to continue"); navigate("/login"); return; }
    try { const isGroup = project.type === "GROUP"; const url = isGroup ? `/grouplikes/toggleLike/${project.groupProjectId}` : `/likes/toggleLike/${project.projectId}`; const res = await axiosInstance.post(url); setLiked(res.data.liked); setLike(res.data.likeCount); } catch { toast.error("Something went wrong. Please try again."); }
  };
  const handleProfileClick = () => navigate(`/profile/${project.type === "GROUP" ? project.teamLead?.studentId : project.student?.studentId}`);
  const handleExternalClick = (e) => { if (!requireLogin()) e.preventDefault(); };
  const changeDiscussionCount = (delta = 1) => setDiscussionCount((value) => Math.max(0, value + delta));

  return (
    <>
      <div className="flex w-full flex-col rounded-2xl border border-slate-400 bg-white p-3 shadow-sm transition-all duration-300 hover:bg-cream hover:shadow-xl hover:border-amber-800 sm:p-4">
        <h2 className="pb-3 text-base font-bold text-bloodstone sm:text-lg">{project.title}</h2>
        <div className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-all duration-200 hover:bg-tan/40 sm:gap-4" onClick={handleProfileClick}>
          <img src={project.type === "GROUP" ? (project.teamLead?.avatarUrl || `/avatars/Avatar${(project.teamLead?.studentId % 40) + 1}.webp`) : (project.student?.avatarUrl || `/avatars/Avatar${(project.student?.studentId % 40) + 1}.webp`)} className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover sm:h-20 sm:w-20" />
          <div className="flex-1"><p className="break-words text-sm font-semibold leading-none sm:text-base">{project.ownerName}</p><p className="mt-1 text-xs text-slate-500 sm:text-sm">#{project.ownerId}</p>{project.type === "GROUP" && project.studentList?.length > 0 && <div className="m-2 flex flex-wrap gap-2">{project.studentList.filter((student) => student.studentId !== project.ownerId).map((student) => <span key={student.studentId} onClick={(e) => { e.stopPropagation(); navigate(`/profile/${student.studentId}`); }} className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] text-slate-700 sm:text-xs">{student.student_name}</span>)}</div>}<p className="mt-3 text-sm font-medium text-bloodstone sm:text-base">{project.tech1} . {project.tech2}</p></div>
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:text-base">{project.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 sm:justify-end sm:gap-5">
          <button onClick={handleLike} className={`flex items-center gap-1 transition ${isReviewer ? "cursor-default opacity-80" : "hover:text-red-500"}`}><FaHeart className={liked ? "text-red-500" : "text-slate-400"} size={18} /><span className="font-semibold text-slate-700">{like}</span> Likes</button>
          <button type="button" onClick={() => setDiscussionOpen(true)} className="flex items-center gap-1 text-slate-600 hover:text-blue-600" aria-label="Open project discussion"><MessageCircle size={18} /><span className="font-semibold">{discussionCount}</span></button>
          <a className="transition hover:text-black" href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={handleExternalClick}><FaGithub className="text-2xl sm:text-3xl" /></a>
          {project.liveUrl && <a href={project.liveUrl} className="font-semibold text-blue-600 hover:underline" onClick={handleExternalClick}>View</a>}
        </div>
      </div>
      <ProjectDiscussion project={project} isOpen={discussionOpen} onClose={() => setDiscussionOpen(false)} onDiscussionCreated={changeDiscussionCount} />
    </>
  );
};

export default memo(TopProjectCard);
